"use client"

import { useEffect, useState } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const DISMISS_KEY = "2i-pwa-install-dismissed"

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [platform, setPlatform] = useState<"standard" | "ios">("standard")

  useEffect(() => {
    // Enregistre le service worker sur tout le site (pas seulement à l'abonnement push),
    // condition nécessaire pour que le navigateur propose l'installation.
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {})
    }

    const alreadyDismissed = localStorage.getItem(DISMISS_KEY)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true

    if (isStandalone || alreadyDismissed) return

    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent)

    if (isIos) {
      setPlatform("ios")
      setShowBanner(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowBanner(true)
    }

    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setShowBanner(false)
  }

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1")
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1100] w-[calc(100%-2rem)] max-w-md">
      <div className="bg-[#0D2545] border border-[rgba(201,162,39,0.25)] rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-[rgba(201,162,39,0.15)] flex items-center justify-center shrink-0">
          <span className="font-serif text-lg font-bold text-[#C9A227]">2I</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-white">Installer 2I Online</div>
          <div className="text-[11px] text-[#d0daf0] mt-0.5">
            {platform === "ios"
              ? "Appuyez sur Partager, puis \"Sur l'écran d'accueil\""
              : "Accédez à vos cours directement depuis votre téléphone"}
          </div>
        </div>

        {platform === "standard" && (
          <button
            onClick={handleInstall}
            className="shrink-0 bg-[#C9A227] hover:bg-[#B8860B] text-[#0D2545] text-[12px] font-bold px-4 py-2 rounded-lg transition-colors"
          >
            Installer
          </button>
        )}

        <button
          onClick={handleDismiss}
          aria-label="Fermer"
          className="shrink-0 text-[rgba(255,255,255,0.4)] hover:text-white transition-colors text-lg leading-none px-1"
        >
          ×
        </button>
      </div>
    </div>
  )
}
