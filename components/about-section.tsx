"use client"

import { useEffect, useRef } from "react"

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => {
                el.classList.add('visible')
              }, i * 100)
            })
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const features = [
    { title: "Mobile", desc: "100% optimise smartphone, hors-ligne possible" },
    { title: "Fr/Wo", desc: "Cours en Francais et Wolof" },
    { title: "Wave", desc: "Paiement Mobile Money integre" },
    { title: "Diplome/\nCertif", desc: "Reconnu par l'Etat" },
  ]

  return (
    <section id="about" ref={sectionRef} className="py-[120px] px-6 md:px-[60px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Left Content */}
        <div>
          <p className="reveal text-[10px] font-semibold tracking-[5px] uppercase text-[#C9A227] mb-3">
            Notre mission
          </p>
          <h2 className="reveal font-serif text-[clamp(36px,4vw,56px)] font-semibold leading-[1.1] text-white mb-5">
            Democratiser la formation{" "}
            <em className="italic text-[#C9A227] font-light">professionnelle</em>{" "}
            pour l&apos;Afrique
          </h2>
          <p className="reveal text-[15px] font-light text-[#d0daf0] leading-relaxed max-w-[540px] mb-[60px]">
            Incub Institut forme depuis des annees les meilleurs professionnels de l&apos;hotellerie et de la restauration au Senegal. 2I Online porte cette expertise sur le digital pour rendre la formation professionnelle accessible partout en Afrique — et donner a chaque jeune et a chaque femme les cles pour reussir dans les metiers de l&apos;<strong>HORETO</strong>.
          </p>

          {/* Features Grid */}
          <div className="reveal grid grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-7 border border-[rgba(255,255,255,0.06)] rounded-xl transition-all duration-300 hover:border-[rgba(201,162,39,0.3)] hover:bg-[rgba(201,162,39,0.04)]"
              >
                <div className="font-serif text-[40px] font-bold text-[#C9A227] leading-none mb-1 whitespace-pre-line">
                  {feature.title === "Diplome/\nCertif" ? (
                    <span className="text-[22px] leading-[1.2]">{feature.title}</span>
                  ) : (
                    feature.title
                  )}
                </div>
                <div className="text-xs font-normal text-[rgba(255,255,255,0.4)] leading-snug">
                  {feature.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Visual */}
        <div className="reveal p-10">
          <div className="bg-[rgba(27,58,107,0.3)] border border-[rgba(201,162,39,0.15)] rounded-[20px] p-12 relative backdrop-blur-[10px]">
            {/* Top line */}
            <div className="absolute -top-[1px] left-[30px] right-[30px] h-0.5 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent" />
            
            {/* Big Number */}
            <div className="absolute top-4 right-6 font-serif text-[60px] font-bold text-[#C9A227]">2I</div>
            
            {/* Content */}
            <div className="text-4xl mb-5">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="text-[#C9A227]">
                <circle cx="30" cy="30" r="28" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M20 30L27 37L40 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="font-serif text-[28px] font-semibold text-white mb-3">
              Incub Institut<br />— une reference
            </div>
            <p className="text-sm text-[#d0daf0] leading-relaxed">
              Base a Bargny, Senegal. Fonde et dirige par Ibrahima Ba, expert reconnu de la formation professionnelle en hotellerie-restauration.
            </p>
            
            {/* Tags */}
            <div className="mt-5 flex flex-wrap gap-2">
              {["Senegal", "Afrique Francophone", "CAP HCR"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 bg-[rgba(201,162,39,0.12)] border border-[rgba(201,162,39,0.25)] rounded-full px-3.5 py-1.5 text-[11px] font-medium text-[#E8C050]"
                >
                  {tag === "Senegal" && "🇸🇳"} 
                  {tag === "Afrique Francophone" && "🌍"}
                  {tag === "CAP HCR" && "🍽️"}
                  {" "}{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
