"use client"

import { useEffect, useState } from "react"
import { Bell, BellOff, BellRing } from "lucide-react"
import { Button } from "@/components/ui/button"
import { pushNotificationService } from "@/lib/push-notification-service"
import { alertSuccess, alertError } from "@/lib/alerts"

/**
 * Bouton d'activation/désactivation des notifications push — utilisé
 * dans DashboardHeader, donc partagé par les 3 types d'utilisateurs
 * (admin, professeur, étudiant) sans duplication.
 */
export function NotificationBell() {
  const [supported, setSupported] = useState(true)
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!pushNotificationService.isSupported()) {
      setSupported(false)
      return
    }
    pushNotificationService.isSubscribed().then(setSubscribed)
  }, [])

  async function handleToggle() {
    setLoading(true)
    if (subscribed) {
      const res = await pushNotificationService.unsubscribe()
      if (res.success) {
        setSubscribed(false)
        alertSuccess(res.message)
      } else {
        alertError(res.message)
      }
    } else {
      const res = await pushNotificationService.subscribe()
      if (res.success) {
        setSubscribed(true)
        alertSuccess(res.message)
      } else {
        alertError(res.message)
      }
    }
    setLoading(false)
  }

  if (!supported) return null

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={loading}
      title={subscribed ? "Désactiver les notifications" : "Activer les notifications"}
      className="text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
    >
      {subscribed ? <BellRing className="w-5 h-5 text-[#C9A227]" /> : <Bell className="w-5 h-5" />}
    </Button>
  )
}
