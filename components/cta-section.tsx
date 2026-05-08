"use client"

import { useState } from "react"
import Image from "next/image"

export function CTASection() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  return (
    <section id="inscription" className="py-[120px] px-6 md:px-[60px] relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/cta-kitchen.jpg"
          alt="Cuisine professionnelle"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080F1E] via-[rgba(8,15,30,0.9)] to-[rgba(8,15,30,0.85)]" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A227] to-transparent opacity-30" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A227] to-transparent opacity-30" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[rgba(201,162,39,0.15)] border border-[rgba(201,162,39,0.3)] rounded-full px-5 py-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse" />
          <span className="text-[11px] font-semibold tracking-[2px] uppercase text-[#E8C050]">
            Inscriptions ouvertes
          </span>
        </div>

        <h2 className="font-serif text-[clamp(36px,5vw,64px)] font-semibold leading-[1.1] text-white mb-6">
          Pret a transformer<br />
          <em className="text-[#C9A227] italic font-light">votre avenir</em> ?
        </h2>
        
        <p className="text-lg font-light text-[#d0daf0] leading-relaxed mb-10 max-w-[600px] mx-auto">
          Rejoignez des centaines d&apos;apprenants africains qui ont deja commence leur parcours vers l&apos;excellence professionnelle avec 2I Online.
        </p>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="max-w-[520px] mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  className="w-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] rounded-xl px-6 py-4 font-sans text-base text-white outline-none transition-all duration-300 focus:border-[#C9A227] focus:bg-[rgba(255,255,255,0.1)] placeholder:text-[rgba(255,255,255,0.3)]"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#C9A227] text-[#0D2545] border-none rounded-xl px-8 py-4 font-sans text-sm font-bold tracking-[1.5px] uppercase cursor-pointer whitespace-nowrap transition-all duration-300 hover:bg-[#E8C050] hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Envoi...
                  </>
                ) : (
                  <>
                    Je m&apos;inscris
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] rounded-xl px-8 py-6 max-w-[520px] mx-auto mb-8">
            <div className="flex items-center justify-center gap-3">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-400 font-medium">Merci! Nous vous contacterons bientot.</span>
            </div>
          </div>
        )}

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-[12px] text-[rgba(255,255,255,0.4)]">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Inscription securisee
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Acces immediat
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Paiement Mobile Money
          </div>
        </div>

        {/* Payment methods */}
        <div className="mt-10 pt-10 border-t border-[rgba(255,255,255,0.06)]">
          <p className="text-[11px] text-[rgba(255,255,255,0.3)] uppercase tracking-[2px] mb-4">
            Moyens de paiement acceptes
          </p>
          <div className="flex items-center justify-center gap-6">
            {["Wave", "Orange Money", "Free Money"].map((method) => (
              <div
                key={method}
                className="px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-[rgba(255,255,255,0.6)]"
              >
                {method}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
