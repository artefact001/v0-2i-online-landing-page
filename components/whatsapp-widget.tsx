"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const waOptions = [
  {
    icon: "🎯",
    bg: "bg-[rgba(201,162,39,0.15)]",
    title: "Conseiller en orientation",
    sub: "Choix de formation",
    href: "https://wa.me/221XXXXXXXXX?text=Bonjour, je souhaite des conseils pour choisir ma formation.",
  },
  {
    icon: "🔧",
    bg: "bg-[rgba(27,58,107,0.5)]",
    title: "Support technique",
    sub: "Acces plateforme",
    href: "https://wa.me/221XXXXXXXXX?text=Bonjour, j'ai besoin d'aide technique.",
  },
  {
    icon: "📚",
    bg: "bg-[rgba(34,197,94,0.15)]",
    title: "Support pedagogique",
    sub: "Questions de cours",
    href: "https://wa.me/221XXXXXXXXX?text=Bonjour, j'ai une question sur ma formation.",
  },
  {
    icon: "💳",
    bg: "bg-[rgba(139,92,246,0.15)]",
    title: "Inscriptions & tarifs",
    sub: "Paiement & devis",
    href: "https://wa.me/221XXXXXXXXX?text=Bonjour, je souhaite m'inscrire a une formation.",
  },
]

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [showBubble, setShowBubble] = useState(false)
  const [bubbleDismissed, setBubbleDismissed] = useState(false)

  useEffect(() => {
    // Show bubble after 3 seconds
    const timer = setTimeout(() => {
      if (!bubbleDismissed) {
        setShowBubble(true)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [bubbleDismissed])

  const handleButtonClick = () => {
    setIsOpen(!isOpen)
    setShowBubble(false)
  }

  const dismissBubble = () => {
    setShowBubble(false)
    setBubbleDismissed(true)
  }

  return (
    <div className="fixed bottom-8 right-8 z-[1000] flex flex-col items-end gap-3">
      {/* Welcome Bubble */}
      <div
        className={`flex items-center gap-3 transition-all duration-300 ${
          showBubble && !isOpen
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 translate-x-5 pointer-events-none"
        }`}
      >
        <div className="bg-[#0D2545] border border-[rgba(201,162,39,0.3)] rounded-xl px-[18px] py-3.5 max-w-[240px] relative">
          <button
            onClick={dismissBubble}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[rgba(255,255,255,0.1)] border-none text-white text-[11px] cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-[rgba(255,255,255,0.25)]"
          >
            ×
          </button>
          <div className="text-[13px] font-semibold text-white mb-1">Besoin d&apos;aide ?</div>
          <div className="text-[11px] text-[#d0daf0] leading-normal">
            Contactez-nous sur WhatsApp — reponse sous 1h !
          </div>
          {/* Arrow */}
          <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 border-[6px] border-transparent border-l-[rgba(201,162,39,0.3)]" />
        </div>
      </div>

      {/* Menu */}
      <div
        className={`bg-[#0D2545] border border-[rgba(201,162,39,0.2)] rounded-2xl p-5 w-[280px] origin-bottom-right transition-all duration-300 ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-2.5 scale-95 pointer-events-none"
        }`}
      >
        <div className="text-[11px] font-bold tracking-[3px] uppercase text-[#C9A227] mb-4 pb-3 border-b border-[rgba(255,255,255,0.06)]">
          Contactez-nous
        </div>
        
        {waOptions.map((option) => (
          <Link
            key={option.title}
            href={option.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-[10px] no-underline transition-colors duration-200 mb-1.5 hover:bg-[rgba(255,255,255,0.05)]"
            onClick={() => setIsOpen(false)}
          >
            <div className={`w-[38px] h-[38px] rounded-[10px] ${option.bg} flex items-center justify-center text-lg shrink-0`}>
              {option.icon}
            </div>
            <div>
              <div className="text-[13px] font-semibold text-white">{option.title}</div>
              <div className="text-[11px] text-[#d0daf0] mt-0.5">{option.sub}</div>
            </div>
          </Link>
        ))}
        
        <div className="mt-3.5 pt-3 border-t border-[rgba(255,255,255,0.06)] text-[10px] text-[rgba(255,255,255,0.2)] text-center tracking-[1px]">
          Reponse garantie sous 1h
        </div>
      </div>

      {/* Main Button */}
      <button
        onClick={handleButtonClick}
        className="w-[60px] h-[60px] rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_8px_32px_rgba(37,211,102,0.4)] cursor-pointer no-underline transition-all duration-300 animate-wa-pulse border-none hover:scale-110 hover:shadow-[0_12px_40px_rgba(37,211,102,0.6)] shrink-0 relative"
        aria-label="Ouvrir WhatsApp"
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        
        {/* Badge */}
        <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-[#C9A227] text-[#0D2545] text-[10px] font-bold flex items-center justify-center">
          1
        </span>
      </button>
    </div>
  )
}
