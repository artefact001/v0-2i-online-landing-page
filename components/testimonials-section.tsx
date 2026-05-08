"use client"

import { useEffect, useRef } from "react"

const testimonials = [
  {
    stars: 5,
    text: "La formation en gestion de restaurant m'a donne tous les outils pour ouvrir mon maquis. Le contenu est vraiment adapte a notre realite ici a Abidjan.",
    avatar: "👩🏾",
    name: "Aminata Kone",
    role: "Restauratrice — Abidjan, Cote d'Ivoire",
  },
  {
    stars: 5,
    text: "J'ai obtenu ma certification HACCP en 2 semaines depuis Dakar. Le processus est simple, les videos claires. Mon employeur au Maroc a reconnu le certificat sans probleme.",
    avatar: "👨🏾",
    name: "Ibrahima Diallo",
    role: "Chef de partie — Casablanca, Maroc",
  },
  {
    stars: 5,
    text: "Le module patisserie africaine m'a permis de lancer ma boutique en ligne. Les recettes sont precises, le formateur repond aux questions. Je recommande a toutes mes soeurs entrepreneuses.",
    avatar: "👩🏿",
    name: "Fatou Sarr",
    role: "Patissiere entrepreneur — Thies, Senegal",
  },
]

export function TestimonialsSection() {
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
    <section id="temoignages" ref={sectionRef} className="py-[120px] px-6 md:px-[60px] bg-[rgba(27,58,107,0.1)]">
      <div className="text-center mb-[60px]">
        <p className="reveal text-[10px] font-semibold tracking-[5px] uppercase text-[#C9A227] mb-3">
          Temoignages
        </p>
        <h2 className="reveal font-serif text-[clamp(36px,4vw,56px)] font-semibold inline-block">
          Ce qu&apos;ils <em className="italic text-[#C9A227] font-light">disent</em>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.name}
            className="reveal bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 transition-all duration-300 hover:border-[rgba(201,162,39,0.2)]"
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="text-[#C9A227] text-sm mb-4 tracking-[2px]">
              {"★".repeat(testimonial.stars)}
            </div>
            <p className="font-serif text-lg italic font-light text-[rgba(255,255,255,0.75)] leading-relaxed mb-6">
              &ldquo;{testimonial.text}&rdquo;
            </p>
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-lg border border-[rgba(201,162,39,0.2)]">
                {testimonial.avatar}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-white">{testimonial.name}</div>
                <div className="text-[11px] text-[#d0daf0] mt-0.5">{testimonial.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
