"use client"

import { useState } from "react"
import Link from "next/link"

export function CTASection() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Email submitted:", email)
  }

  return (
    <section id="inscription" className="py-[120px] px-6 md:px-[60px] text-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(27,58,107,0.6)_0%,transparent_70%)]" />
      
      <div className="relative z-[1] max-w-[700px] mx-auto">
        <h2 className="font-serif text-[clamp(42px,5vw,72px)] font-semibold leading-[1.1] text-white mb-6">
          Pret a transformer <em className="text-[#C9A227] italic">votre avenir</em> ?
        </h2>
        <p className="text-base font-light text-[#d0daf0] leading-relaxed mb-12">
          Rejoignez des milliers d&apos;apprenants africains qui ont deja commence leur parcours vers l&apos;excellence professionnelle avec 2I Online.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-[500px] mx-auto mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse email"
            className="flex-1 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] rounded-md px-5 py-4 font-sans text-sm text-white outline-none transition-colors duration-300 focus:border-[#C9A227] placeholder:text-[rgba(255,255,255,0.25)]"
            required
          />
          <button
            type="submit"
            className="bg-[#C9A227] text-[#0D2545] border-none rounded-md px-7 py-4 font-sans text-[11px] font-bold tracking-[2px] uppercase cursor-pointer whitespace-nowrap transition-colors duration-300 hover:bg-[#E8C050]"
          >
            Je m&apos;inscris
          </button>
        </form>

        <p className="text-[11px] text-[rgba(255,255,255,0.2)] tracking-[1px]">
          Acces immediat apres inscription • Paiement via Mobile Money
        </p>
      </div>
    </section>
  )
}
