import { apiClient } from '@/lib/api/client'

/**
 * Gère l'abonnement aux notifications push (Web Push API standard) —
 * connecté au vrai backend (PushSubscriptionController), qui utilise le
 * package laravel-notification-channels/webpush déjà installé côté
 * Laravel.
 *
 * Nécessite NEXT_PUBLIC_VAPID_PUBLIC_KEY dans les variables
 * d'environnement Vercel — la clé publique générée côté serveur via
 * `php artisan webpush:vapid` (voir VAPID_PUBLIC_KEY dans le .env
 * Laravel, à copier ici).
 */

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export const pushNotificationService = {
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window
  },

  async getPermissionState(): Promise<NotificationPermission | 'unsupported'> {
    if (!this.isSupported()) return 'unsupported'
    return Notification.permission
  },

  async isSubscribed(): Promise<boolean> {
    if (!this.isSupported()) return false
    try {
      const registration = await navigator.serviceWorker.getRegistration('/sw.js')
      if (!registration) return false
      const subscription = await registration.pushManager.getSubscription()
      return !!subscription
    } catch {
      return false
    }
  },

  /**
   * Demande la permission, enregistre le service worker, s'abonne au
   * push, et envoie l'abonnement au backend Laravel.
   */
  async subscribe(): Promise<{ success: boolean; message: string }> {
    if (!this.isSupported()) {
      return { success: false, message: 'Les notifications ne sont pas supportées par ce navigateur.' }
    }

    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!vapidPublicKey) {
      return { success: false, message: 'Notifications non configurées (clé VAPID manquante).' }
    }

    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        return { success: false, message: 'Permission refusée pour les notifications.' }
      }

      const registration = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      })

      const json = subscription.toJSON()
      await apiClient('/push-subscribe', {
        method: 'POST',
        body: JSON.stringify({
          endpoint: json.endpoint,
          keys: { p256dh: json.keys?.p256dh, auth: json.keys?.auth },
        }),
      })

      return { success: true, message: 'Notifications activées avec succès.' }
    } catch (error) {
      console.error('[pushNotificationService.subscribe]', error)
      return { success: false, message: "Impossible d'activer les notifications." }
    }
  },

  async unsubscribe(): Promise<{ success: boolean; message: string }> {
    if (!this.isSupported()) return { success: false, message: 'Non supporté.' }

    try {
      const registration = await navigator.serviceWorker.getRegistration('/sw.js')
      const subscription = await registration?.pushManager.getSubscription()

      if (subscription) {
        const endpoint = subscription.endpoint
        await subscription.unsubscribe()
        await apiClient('/push-subscribe', {
          method: 'DELETE',
          body: JSON.stringify({ endpoint }),
        })
      }

      return { success: true, message: 'Notifications désactivées.' }
    } catch (error) {
      console.error('[pushNotificationService.unsubscribe]', error)
      return { success: false, message: 'Erreur lors de la désactivation.' }
    }
  },
}
