"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

const partners = [
  {
    name: "Ministere de la Formation Professionnelle",
    domain: "Formation Professionnelle",
    image: "/images/FB_IMG_1776855096946.jpg",
  },
  {
    name: "Radisson Blu Dakar",
    domain: "Hotellerie internationale",
    image: "/images/1000769413.jpg",
  },
  {
    name: "Chez Loutcha",
    domain: "Restauration traditionnelle",
    image: "/images/1000797646.jpg",
  },
  {
    name: "Pullman Dakar",
    domain: "Hotellerie d'affaires",
    image: "/images/1000797760.jpg",
  },
  {
    name: "Le Lagon 1",
    domain: "Restauration gastronomique",
    image: "/images/FB_IMG_1776855096946.jpg",
  },
  {
    name: "King Fahd Palace",
    domain: "Hotellerie & evenementiel",
    image: "/images/FB_IMG_1778935589425.jpg",
  },
  {
    name: "Farid Restaurant",
    domain: "Arts culinaires",
    image: "/images/logo mairie bargny.jpg",
  },
  {
    name: "Azalai Hotel",
    domain: "Hotellerie regionale",
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

  return (
    <section id="partenaires" ref={sectionRef} className="py-[120px] px-6 md:px-[60px] relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(27,58,107,0.3)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <p className="reveal text-[10px] font-semibold tracking-[5px] uppercase text-[#C9A227] mb-4">
            Ils nous font confiance
          </p>
          <h2 className="reveal font-serif text-[clamp(36px,4vw,56px)] font-semibold text-white mb-4">
            Nos <em className="italic text-[#C9A227] font-light">partenaires</em>
          </h2>
          <p className="reveal text-base text-[#d0daf0] max-w-[500px] mx-auto">
            Un reseau d&apos;etablissements et de professionnels engages a nos cotes pour former les talents de demain.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <div
              key={partner.name}
              className="reveal group"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-square rounded-xl overflow-hidden border border-[rgba(201,162,39,0.15)] transition-all duration-300 group-hover:border-[#C9A227] group-hover:scale-[1.03]">
                <Image
                  src={partner.image}
                  alt={partner.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080F1E]/60 via-transparent to-transparent" />
              </div>

              <div className="text-center mt-4">
                <h3 className="font-serif text-base font-semibold text-white">
                  {partner.name}
                </h3>
                <p className="text-[10px] font-medium tracking-[1.5px] uppercase text-[#C9A227] mt-1">
                  {partner.domain}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}