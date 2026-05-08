"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"

const pricingPlans = [
  {
    name: "Solo",
    price: "25 000",
    period: "FCFA par mois",
    pricePrefix: "A partir de",
    features: [
      "Acces a la formation choisie",
      "Videos HD + fiches PDF",
      "Quiz et evaluations",
      "Certificat numerique",
      "Acces a vie au module",
    ],
    cta: "Choisir une formation",
    featured: false,
  },
  {
    name: "Abonnement",
    price: "20 000",
    period: "FCFA / mois",
    features: [
      "Acces illimite a tout le catalogue",
      "Nouvelles formations incluses",
      "Tous les certificats inclus",
      "Support prioritaire",
      "Telechargement hors-ligne",
    ],
    cta: "S'abonner maintenant",
    featured: true,
    badge: "Recommande",
  },
  {
    name: "Entreprise",
    price: "Sur devis",
    period: "A partir de 10 collaborateurs",
    features: [
      "Formation de vos equipes",
      "Tableau de bord RH",
      "Formations sur mesure",
      "Formateur dedie",
      "Facturation entreprise",
    ],
    cta: "Nous contacter",
    featured: false,
  },
]

export function PricingSection() {
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
    <section id="tarifs" ref={sectionRef} className="py-[120px] px-6 md:px-[60px]">
      <div className="text-center mb-[60px]">
        <p className="reveal text-[10px] font-semibold tracking-[5px] uppercase text-[#C9A227] mb-3">
          Tarification
        </p>
        <h2 className="reveal font-serif text-[clamp(36px,4vw,56px)] font-semibold inline-block">
          Des formules <em className="italic text-[#C9A227] font-light">pour tous</em>
        </h2>
        <p className="reveal text-[15px] text-[#d0daf0] mt-4">
          Paiement en Mobile Money. Acces immediat. Sans engagement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
        {pricingPlans.map((plan, index) => (
          <div
            key={plan.name}
            className={`reveal rounded-[20px] p-10 border relative overflow-hidden transition-transform duration-300 hover:-translate-y-1 ${
              plan.featured
                ? "bg-[rgba(27,58,107,0.5)] border-[rgba(201,162,39,0.4)] shadow-[0_0_60px_rgba(201,162,39,0.06)]"
                : "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)]"
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            {plan.featured && (
              <>
                <div className="absolute top-0 left-[30px] right-[30px] h-0.5 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent" />
                <span className="inline-block bg-[#C9A227] text-[#0D2545] text-[9px] font-bold tracking-[2px] uppercase rounded px-3 py-1.5 mb-6">
                  {plan.badge}
                </span>
              </>
            )}
            
            <div className="text-xs font-semibold tracking-[3px] uppercase text-[#d0daf0] mb-3">
              {plan.name}
            </div>
            
            {plan.pricePrefix && (
              <div className="text-[10px] text-[#d0daf0] mb-1">{plan.pricePrefix}</div>
            )}
            
            <div className="font-serif text-[52px] font-bold text-white leading-none mb-1">
              {plan.price !== "Sur devis" && (
                <span className="text-[22px] align-super text-[#C9A227]">F</span>
              )}
              {plan.price}
            </div>
            
            <div className="text-xs text-[#d0daf0] mb-8">{plan.period}</div>
            
            <ul className="list-none mb-9">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-[13px] text-[#d0daf0] leading-relaxed py-2 border-b border-[rgba(255,255,255,0.04)]"
                >
                  <span className="text-[#C9A227] shrink-0 mt-0.5">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            
            <Link
              href="#inscription"
              className={`block w-full text-center py-3.5 rounded-lg text-[11px] font-bold tracking-[2px] uppercase no-underline transition-all duration-300 ${
                plan.featured
                  ? "bg-[#C9A227] text-[#0D2545] hover:bg-[#E8C050]"
                  : "border border-[rgba(255,255,255,0.15)] text-[rgba(255,255,255,0.6)] hover:border-[#C9A227] hover:text-[#C9A227]"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
