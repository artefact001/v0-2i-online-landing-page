"use client"

import Link from "next/link"
import Image from "next/image"

export function Hero() {
  return (
    <section className="min-h-screen relative flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-chef.jpg"
          alt="Chef professionnel africain"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080F1E] via-[rgba(8,15,30,0.85)] to-[rgba(8,15,30,0.4)]" />
      </div>
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: 'linear-gradient(rgba(201,162,39,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        }}
      />

      {/* Orbs */}
      <div className="absolute w-[500px] h-[500px] bg-[rgba(27,58,107,0.5)] rounded-full blur-[80px] pointer-events-none animate-drift -top-[100px] -right-[100px]" />
      <div className="absolute w-[300px] h-[300px] bg-[rgba(201,162,39,0.08)] rounded-full blur-[80px] pointer-events-none animate-drift bottom-[100px] left-[10%]" style={{ animationDelay: '-4s' }} />
      <div className="absolute w-[200px] h-[200px] bg-[rgba(201,162,39,0.06)] rounded-full blur-[80px] pointer-events-none animate-drift top-[30%] right-[20%]" style={{ animationDelay: '-8s' }} />

      {/* Rotating Ring */}
      <div className="absolute -right-[120px] top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[rgba(201,162,39,0.08)] animate-slow-rotate hidden lg:block">
        <div className="absolute inset-[30px] rounded-full border border-[rgba(201,162,39,0.06)]" />
        <div className="absolute inset-[80px] rounded-full border border-dashed border-[rgba(201,162,39,0.04)]" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-[#C9A227] -top-[3px] left-1/2 -translate-x-1/2 shadow-[0_0_10px_#C9A227]" />
      </div>

      {/* Content */}
      <div className="relative z-[2] px-6 md:px-[60px] max-w-[760px]">
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-8 opacity-0 translate-y-5 animate-fade-up delay-300">
          <div className="w-10 h-[1px] bg-[#C9A227]" />
          <span className="text-[10px] font-semibold tracking-[4px] uppercase text-[#C9A227]">
            Plateforme de formation professionnelle
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-[clamp(48px,7vw,88px)] font-bold leading-[0.95] text-white mb-5 opacity-0 translate-y-[30px] animate-fade-up delay-500">
          Forme ici.<br />
          <span className="text-[#C9A227]">Reconnu</span><br />
          <span className="font-light italic">partout.</span>
        </h1>

        {/* Subtitle */}
        <p className="font-serif text-[clamp(18px,2.5vw,26px)] font-light italic text-[rgba(255,255,255,0.6)] mb-8 opacity-0 translate-y-5 animate-fade-up delay-700">
          Hotellerie - Restauration - Arts Culinaires
        </p>

        {/* Description */}
        <p className="text-base font-light text-[#d0daf0] leading-relaxed max-w-[520px] mb-10 opacity-0 translate-y-5 animate-fade-up delay-900">
          Formations certifiantes accessibles 100% depuis votre mobile. Concues pour l&apos;Afrique, reconnues sur tout le continent et dans la diaspora.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-5 flex-wrap opacity-0 translate-y-5 animate-fade-up delay-1100">
          <Link
            href="#inscription"
            className="inline-flex items-center gap-2.5 bg-[#C9A227] text-[#0D2545] text-xs font-bold tracking-[2px] uppercase px-9 py-[18px] rounded no-underline transition-all duration-300 relative overflow-hidden hover:bg-[#E8C050] hover:scale-105"
          >
            <span className="relative z-[1]">Commencer maintenant</span>
            <svg className="w-4 h-4 relative z-[1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="#formations"
            className="inline-flex items-center gap-2.5 text-[rgba(255,255,255,0.65)] text-xs font-medium tracking-[2px] uppercase no-underline transition-colors duration-300 hover:text-[#C9A227] group"
          >
            <div className="w-12 h-12 rounded-full border border-[rgba(255,255,255,0.2)] flex items-center justify-center text-sm transition-all duration-300 group-hover:border-[#C9A227] group-hover:bg-[rgba(201,162,39,0.1)]">
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
            Voir les formations
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex items-center gap-8 opacity-0 translate-y-5 animate-fade-up delay-1300">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1B3A6B] to-[#0D2545] border-2 border-[#080F1E] flex items-center justify-center text-xs text-[#C9A227]">
                  {["A", "I", "F", "M"][i-1]}
                </div>
              ))}
            </div>
            <span className="text-xs text-[rgba(255,255,255,0.4)]">+500 apprenants</span>
          </div>
          <div className="h-6 w-px bg-[rgba(255,255,255,0.1)]" />
          <div className="flex items-center gap-2">
            <div className="text-[#C9A227] text-sm">
              {"★★★★★"}
            </div>
            <span className="text-xs text-[rgba(255,255,255,0.4)]">4.9/5 avis</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute bottom-[60px] right-[60px] hidden lg:flex gap-12 opacity-0 animate-fade-up delay-1300">
        {[
          { num: "40+", label: "Formations" },
          { num: "2 000+", label: "Apprenants vises" },
          { num: "15+", label: "Pays couverts" },
        ].map((stat) => (
          <div key={stat.label} className="text-right">
            <div className="font-serif text-[42px] font-bold text-[#C9A227] leading-none">{stat.num}</div>
            <div className="text-[10px] font-medium tracking-[2px] uppercase text-[rgba(255,255,255,0.3)] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-up delay-1300">
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-[#C9A227] animate-scroll-pulse" />
        <span className="text-[8px] tracking-[3px] uppercase text-[rgba(255,255,255,0.25)]">Defiler</span>
      </div>
    </section>
  )
}
