"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

const partners = [
  {
    name: "Ministère de la Formation Professionnelle",
    domain: "Formation Professionnelle",
    image: "/images/FB_IMG_1776855096946.jpg",
  },
  {
    name: "Force N",
    domain: "Formation Professionnelle",
    image: "/images/1000769413.jpg",
  },
  {
    name: "Ambassade de France",
    domain: "Coopération Internationale",
    image: "/images/1000797646.jpg",
  },
  {
    name: "DER/FJ",
    domain: "Entrepreneuriat des Femmes et des Jeunes",
    image: "/images/1000797760.jpg",
  },
  {
    name: "MEFPT",
    domain: "Emploi et Formation Professionnelle",
    image: "/images/FB_IMG_1776855096946.jpg",
  },
  {
    name: "KaNora Services",
    domain: "Inclusion Sociale",
    image: "/images/IMG-20250425-WA0017.jpg",
  },
  {
    name: "Mairie de Bargny",
    domain: "Collectivité Territoriale",
    image: "/images/logo-mairie-bargny.jpg",
  },
  {
    name: "ADEPME",
    domain: "Développement des PME",
    image: "/images/1000917129.jpg",
  },
]

export function PartnersSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("opacity-100", "translate-y-0")
              }, index * 120)
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

  return (
    <section
      id="partenaires"
      ref={sectionRef}
      className="relative py-24 px-6 md:px-10 overflow-hidden bg-[#080F1E]"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,162,39,0.12),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-20">
          <p className="reveal opacity-0 translate-y-6 transition-all duration-700 text-xs tracking-[5px] uppercase text-[#C9A227] font-semibold">
            Ils nous font confiance
          </p>

          <h2 className="reveal opacity-0 translate-y-6 transition-all duration-700 mt-4 font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-white">
            Nos{" "}
            <span className="text-[#C9A227] italic font-light">
              Partenaires
            </span>
          </h2>

          <p className="reveal opacity-0 translate-y-6 transition-all duration-700 mt-6 text-[#D5DCEC] max-w-2xl mx-auto leading-8">
            Nous collaborons avec des institutions publiques, entreprises,
            organisations et partenaires engagés pour offrir une formation
            professionnelle de qualité et favoriser l'insertion des jeunes.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <div
              key={partner.name}
              className="reveal opacity-0 translate-y-6 transition-all duration-700"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="group h-full rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-[#C9A227] hover:bg-white/10 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_15px_45px_rgba(201,162,39,.25)] p-8">

                {/* Logo */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-28 h-28 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden p-4">
                    <Image
                      src={partner.image}
                      alt={partner.name}
                      fill
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-center text-white font-semibold text-lg leading-7">
                  {partner.name}
                </h3>

                {/* Domain */}
                <p className="mt-3 text-center text-[#C9A227] text-sm leading-6">
                  {partner.domain}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        <div className="reveal opacity-0 translate-y-6 transition-all duration-700 mt-20 text-center">
          <p className="text-[#9AA5BF] text-lg">
            Ensemble, nous développons des compétences et créons des
            opportunités pour la jeunesse africaine.
          </p>
        </div>
      </div>
    </section>
  )
}