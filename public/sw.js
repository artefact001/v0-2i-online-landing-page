// Service worker pour les notifications push (Web Push API standard)
// et l'installabilité PWA (icône "Ajouter à l'écran d'accueil").
// Doit rester à la racine publique (/sw.js) pour couvrir tout le site.

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('push', (event) => {
  if (!event.data) return

  let payload
  try {
    payload = event.data.json()
  } catch {
    payload = { title: '2I Online', body: event.data.text() }
  }

  const title = payload.title || '2I Online'
  const options = {
    body: payload.body || '',
    icon: payload.icon || '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data || {},
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const url = event.notification.data?.url || '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url)
      }
    }),
  )
})
