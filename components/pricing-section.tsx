"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"

const pricingPlans = [
  {
    name: "Solo",
    price: "25 000",
    period: "FCFA",
    subtitle: "par formation",
    features: [
      { text: "Acces a la formation choisie", included: true },
      { text: "Videos HD + fiches PDF", included: true },
      { text: "Quiz et evaluations", included: true },
      { text: "Certificat numerique", included: true },
      { text: "Acces a vie au module", included: true },
      { text: "Support prioritaire", included: false },
    ],
    cta: "Choisir une formation",
    featured: false,
  },
  {
    name: "Abonnement",
    price: "20 000",
    period: "FCFA",
    subtitle: "par mois",
    features: [
      { text: "Acces illimite au catalogue", included: true },
      { text: "Nouvelles formations incluses", included: true },
      { text: "Tous les certificats inclus", included: true },
      { text: "Support prioritaire 24/7", included: true },
      { text: "Telechargement hors-ligne", included: true },
      { text: "Communaute privee", included: true },
    ],
    cta: "S'abonner maintenant",
    featured: true,
    badge: "Le plus populaire",
  },
  {
    name: "Entreprise",
    price: "Sur devis",
    period: "",
    subtitle: "a partir de 10 collaborateurs",
    features: [
      { text: "Formation de vos equipes", included: true },
      { text: "Tableau de bord RH", included: true },
      { text: "Formations sur mesure", included: true },
      { text: "Formateur dedie", included: true },
      { text: "Facturation entreprise", included: true },
      { text: "SLA garanti", included: true },
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
    <section id="tarifs" ref={sectionRef} className="py-[120px] px-6 md:px-[60px] bg-[rgba(13,37,69,0.1)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="reveal text-[10px] font-semibold tracking-[5px] uppercase text-[#C9A227] mb-4">
            Tarification transparente
          </p>
          <h2 className="reveal font-serif text-[clamp(36px,4vw,56px)] font-semibold text-white mb-4">
            Des formules <em className="italic text-[#C9A227] font-light">pour tous</em>
          </h2>
          <p className="reveal text-base text-[#d0daf0] max-w-[500px] mx-auto">
            Paiement en Mobile Money. Acces immediat. Sans engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`reveal rounded-2xl p-8 lg:p-10 border relative overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
                plan.featured
                  ? "bg-gradient-to-b from-[rgba(27,58,107,0.6)] to-[rgba(13,37,69,0.8)] border-[rgba(201,162,39,0.5)] shadow-[0_0_80px_rgba(201,162,39,0.1)] scale-105 z-10"
                  : "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)] hover:border-[rgba(201,162,39,0.3)]"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {plan.featured && (
                <>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent" />
                  <span className="inline-flex items-center gap-1.5 bg-[#C9A227] text-[#0D2545] text-[9px] font-bold tracking-[2px] uppercase rounded-full px-4 py-1.5 mb-6">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {plan.badge}
                  </span>
                </>
              )}
              
              <div className="text-xs font-bold tracking-[3px] uppercase text-[rgba(255,255,255,0.5)] mb-4">
                {plan.name}
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  {plan.price !== "Sur devis" && (
                    <span className="text-lg font-medium text-[#C9A227]">F</span>
                  )}
                  <span className="font-serif text-[48px] font-bold text-white leading-none">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-[rgba(255,255,255,0.4)] ml-1">{plan.period}</span>
                  )}
                </div>
                <div className="text-sm text-[#d0daf0] mt-1">{plan.subtitle}</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature.text}
                    className={`flex items-start gap-3 text-sm ${
                      feature.included ? "text-[#d0daf0]" : "text-[rgba(255,255,255,0.25)]"
                    }`}
                  >
                    {feature.included ? (
                      <svg className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-[rgba(255,255,255,0.15)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    {feature.text}
                  </li>
                ))}
              </ul>
              
              <Link
                href="#inscription"
                className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl text-sm font-bold tracking-[1.5px] uppercase transition-all duration-300 ${
                  plan.featured
                    ? "bg-[#C9A227] text-[#0D2545] hover:bg-[#E8C050] hover:scale-105"
                    : "border border-[rgba(255,255,255,0.15)] text-[rgba(255,255,255,0.7)] hover:border-[#C9A227] hover:text-[#C9A227] hover:bg-[rgba(201,162,39,0.05)]"
                }`}
              >
                {plan.cta}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div className="reveal mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-full px-6 py-3">
            <svg className="w-5 h-5 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm text-[#d0daf0]">
              Garantie satisfait ou rembourse 14 jours
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
