"use client"

import Image from "next/image"
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
    { 
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "100% Mobile", 
      desc: "Apprenez depuis votre smartphone, meme hors-ligne" 
    },
    { 
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
      title: "Francais & Wolof", 
      desc: "Cours disponibles en plusieurs langues" 
    },
    { 
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: "Mobile Money", 
      desc: "Paiement Wave, Orange Money, Free Money" 
    },
    { 
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      title: "Diplome Reconnu", 
      desc: "Certification validee par l'Etat" 
    },
  ]

  return (
    <section id="about" ref={sectionRef} className="py-[120px] px-6 md:px-[60px] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <p className="reveal text-[10px] font-semibold tracking-[5px] uppercase text-[#C9A227] mb-4">
              Notre mission
            </p>
            <h2 className="reveal font-serif text-[clamp(32px,4vw,52px)] font-semibold leading-[1.1] text-white mb-6">
              Democratiser la formation{" "}
              <em className="italic text-[#C9A227] font-light">professionnelle</em>{" "}
              pour l&apos;Afrique
            </h2>
            <p className="reveal text-base font-light text-[#d0daf0] leading-relaxed mb-8">
              <strong className="text-white font-medium">Incub Institut</strong> forme depuis des annees les meilleurs professionnels de l&apos;hotellerie et de la restauration au Senegal. <strong className="text-[#C9A227]">2I Online</strong> porte cette expertise sur le digital pour rendre la formation professionnelle accessible partout en Afrique.
            </p>
            <p className="reveal text-base font-light text-[#d0daf0] leading-relaxed mb-10">
              Notre objectif: donner a chaque jeune et a chaque femme les cles pour reussir dans les metiers de l&apos;<strong className="text-white">hotellerie, de la restauration et du tourisme</strong>.
            </p>

            {/* Features Grid */}
            <div className="reveal grid grid-cols-2 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group p-6 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl transition-all duration-300 hover:border-[rgba(201,162,39,0.3)] hover:bg-[rgba(201,162,39,0.04)]"
                >
                  <div className="text-[#C9A227] mb-3 transition-transform duration-300 group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <div className="font-semibold text-white text-sm mb-1">
                    {feature.title}
                  </div>
                  <div className="text-xs text-[rgba(255,255,255,0.5)] leading-snug">
                    {feature.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <div className="reveal relative">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden">
              <Image
                src="/images/about-learning.jpg"
                alt="Etudiants en formation"
                width={600}
                height={500}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080F1E] via-transparent to-transparent" />
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-8 -left-8 bg-[rgba(8,15,30,0.95)] backdrop-blur-xl border border-[rgba(201,162,39,0.2)] rounded-2xl p-6 max-w-[280px] shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C9A227] to-[#E8C050] flex items-center justify-center">
                  <span className="font-serif text-xl font-bold text-[#0D2545]">2I</span>
                </div>
                <div>
                  <div className="font-serif text-lg font-semibold text-white">Incub Institut</div>
                  <div className="text-xs text-[#C9A227]">Bargny, Senegal</div>
                </div>
              </div>
              <p className="text-sm text-[#d0daf0] leading-relaxed mb-4">
                Fonde et dirige par <strong className="text-white">Ibrahima Ba</strong>, expert reconnu de la formation professionnelle en hotellerie-restauration.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Senegal", "Afrique", "CAP HCR"].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-[rgba(201,162,39,0.1)] border border-[rgba(201,162,39,0.2)] rounded-full px-3 py-1 text-[10px] font-medium text-[#E8C050]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats Card */}
            <div className="absolute -top-4 -right-4 bg-[#C9A227] rounded-xl p-5 text-center">
              <div className="font-serif text-3xl font-bold text-[#0D2545]">10+</div>
              <div className="text-[10px] font-semibold text-[#0D2545] uppercase tracking-wider">Annees d&apos;experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
