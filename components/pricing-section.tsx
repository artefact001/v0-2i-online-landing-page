"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"

const pricingCategories = [
  {
    title: "PROGRAMMES CAP",
    description: "Formations diplômantes complètes",
    plans: [
      {
        name: "CAP Cuisine",
        inscription: "60 000",
        monthly: "30 000",
        features: [
          { text: "Inscription unique", included: true },
          { text: "Mensualités régulières", included: true },
          { text: "24 modules complets", included: true },
          { text: "Videos HD + fiches PDF", included: true },
          { text: "Quiz et evaluations", included: true },
          { text: "Certificat numerique", included: true },
        ],
        icon: "👨‍🍳",
      },
      {
        name: "CAP Pâtisserie",
        inscription: "60 000",
        monthly: "30 000",
        features: [
          { text: "Inscription unique", included: true },
          { text: "Mensualités régulières", included: true },
          { text: "21 modules complets", included: true },
          { text: "Videos HD + fiches PDF", included: true },
          { text: "Quiz et evaluations", included: true },
          { text: "Certificat numerique", included: true },
        ],
        icon: "🧁",
      },
      {
        name: "CAP Service en Salle",
        inscription: "60 000",
        monthly: "30 000",
        features: [
          { text: "Inscription unique", included: true },
          { text: "Mensualités régulières", included: true },
          { text: "18 modules complets", included: true },
          { text: "Videos HD + fiches PDF", included: true },
          { text: "Quiz et evaluations", included: true },
          { text: "Certificat numerique", included: true },
        ],
        icon: "🍽️",
      },
    ],
  },
  {
    title: "FORMATIONS SPÉCIALISÉES",
    description: "Certifications professionnelles courtes",
    plans: [
      {
        name: "Hygiène & HACCP",
        price: "100 000",
        monthly: null,
        features: [
          { text: "Certification HACCP", included: true },
          { text: "Normes de sécurité alimentaire", included: true },
          { text: "12 modules intensifs", included: true },
          { text: "Quiz pratiques", included: true },
          { text: "Certificat numerique", included: true },
          { text: "Durée: 4 semaines", included: true },
        ],
        icon: "🛡️",
        featured: false,
      },
      {
        name: "Gestion de Restaurant",
        price: "100 000",
        monthly: null,
        features: [
          { text: "Management avancé", included: true },
          { text: "Gestion financière", included: true },
          { text: "Stratégie commerciale", included: true },
          { text: "Gestion d'équipe", included: true },
          { text: "Certificat numerique", included: true },
          { text: "Durée: 5 semaines", included: true },
        ],
        icon: "🏢",
        featured: false,
      },
      {
        name: "Certificat Spécialité",
        inscription: "60 000",
        monthly: "30 000",
        features: [
          { text: "Spécialisation avancée", included: true },
          { text: "Modules à la carte", included: true },
          { text: "Flexibilité horaire", included: true },
          { text: "Videos HD + fiches PDF", included: true },
          { text: "Quiz et evaluations", included: true },
          { text: "Certificat numerique", included: true },
        ],
        icon: "📜",
        featured: false,
      },
    ],
  },
  {
    title: "PROGRAMMES PREMIUM",
    description: "Formations avancées et VAE",
    plans: [
      {
        name: "Incubation Entrepreneuriale",
        price: "100 000",
        monthly: null,
        features: [
          { text: "Créer votre projet", included: true },
          { text: "Business plan complet", included: true },
          { text: "Financement et investisseurs", included: true },
          { text: "Marketing digital", included: true },
          { text: "Support entrepreneurial", included: true },
          { text: "Réseau d'affaires", included: true },
        ],
        icon: "🚀",
        featured: true,
      },
      {
        name: "VAE - Validation Acquis",
        price: "150 000",
        monthly: null,
        features: [
          { text: "Reconnaissance diplôme", included: true },
          { text: "Portfolio et evaluation", included: true },
          { text: "Mentoring personnalisé", included: true },
          { text: "Documentation complète", included: true },
          { text: "Support administratif", included: true },
          { text: "Inscription officielle", included: true },
        ],
        icon: "🎓",
        featured: true,
      },
    ],
  },
  {
    title: "PROGRAMMES ACCESSIBLES",
    description: "Formations courtes et ateliers",
    plans: [
      {
        name: "Travail à Domicile",
        price: "60 000",
        monthly: null,
        features: [
          { text: "Formation 100% en ligne", included: true },
          { text: "Flexible et autonome", included: true },
          { text: "Contenu téléchargeable", included: true },
          { text: "Forum d'entraide", included: true },
          { text: "Certificat de completion", included: true },
          { text: "Accès illimité", included: true },
        ],
        icon: "🏠",
      },
      {
        name: "Atelier Pratique (Séance)",
        price: "10 000",
        monthly: null,
        features: [
          { text: "Atelier unique de 2h", included: true },
          { text: "Pratique intensive", included: true },
          { text: "Petit groupe (max 15)", included: true },
          { text: "Matériel fourni", included: true },
          { text: "Attestation de presence", included: true },
          { text: "Accès à la communauté", included: true },
        ],
        icon: "🎪",
      },
    ],
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
        <div className="text-center mb-20">
          <p className="reveal text-[10px] font-semibold tracking-[5px] uppercase text-[#C9A227] mb-4">
            Tarification transparente
          </p>
          <h2 className="reveal font-serif text-[clamp(36px,4vw,56px)] font-semibold text-white mb-4">
            Nos <em className="italic text-[#C9A227] font-light">formations</em> et tarifs
          </h2>
          <p className="reveal text-base text-[#d0daf0] max-w-[600px] mx-auto">
            Paiement flexible en Mobile Money (Wave, Orange Money, Free Money). Accès immédiat après paiement.
          </p>
        </div>

        {/* Pricing Categories */}
        {pricingCategories.map((category, catIndex) => (
          <div key={category.title} className="mb-20">
            <div className="reveal text-center mb-12">
              <h3 className="font-serif text-[32px] font-semibold text-white mb-2">
                {category.title}
              </h3>
              <p className="text-[#d0daf0]">{category.description}</p>
            </div>

            <div className={`grid gap-6 lg:gap-8 ${
              category.plans.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
              category.plans.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
              'grid-cols-1 md:grid-cols-2'
            }`}>
              {category.plans.map((plan, index) => (
                <div
                  key={plan.name}
                  className={`reveal rounded-2xl p-8 lg:p-10 border relative overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
                    plan.featured
                      ? "bg-gradient-to-b from-[rgba(27,58,107,0.6)] to-[rgba(13,37,69,0.8)] border-[rgba(201,162,39,0.5)] shadow-[0_0_80px_rgba(201,162,39,0.1)] md:scale-105 z-10"
                      : "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)] hover:border-[rgba(201,162,39,0.3)]"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {plan.featured && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent" />
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{plan.icon}</span>
                    {plan.featured && (
                      <span className="inline-flex items-center gap-1.5 bg-[#C9A227] text-[#0D2545] text-[9px] font-bold tracking-[2px] uppercase rounded-full px-3 py-1">
                        Premium
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-bold tracking-[3px] uppercase text-[rgba(255,255,255,0.5)] mb-4">
                    {plan.name}
                  </div>

                  <div className="mb-8">
                    {plan.inscription && plan.monthly ? (
                      <>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-sm text-[rgba(255,255,255,0.6)]">Inscription:</span>
                          <span className="font-serif text-2xl font-bold text-white">{plan.inscription}</span>
                          <span className="text-xs text-[rgba(255,255,255,0.4)]">F</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm text-[rgba(255,255,255,0.6)]">Mensualité:</span>
                          <span className="font-serif text-2xl font-bold text-[#C9A227]">{plan.monthly}</span>
                          <span className="text-xs text-[rgba(255,255,255,0.4)]">F/mois</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-4xl font-bold text-white">{(plan as any).price}</span>
                        <span className="text-sm text-[rgba(255,255,255,0.4)]">F</span>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
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
                    href="/inscription"
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold tracking-[1.5px] uppercase transition-all duration-300 ${
                      plan.featured
                        ? "bg-[#C9A227] text-[#0D2545] hover:bg-[#E8C050] hover:scale-105"
                        : "border border-[rgba(255,255,255,0.15)] text-[rgba(255,255,255,0.7)] hover:border-[#C9A227] hover:text-[#C9A227] hover:bg-[rgba(201,162,39,0.05)]"
                    }`}
                  >
                    S&apos;inscrire
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Payment Methods */}
        <div className="reveal mt-16 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 text-center">
          <h3 className="text-white font-semibold mb-6">Moyens de Paiement Acceptés</h3>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl">📱</div>
              <span className="text-sm text-[#d0daf0]">Wave</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl">📱</div>
              <span className="text-sm text-[#d0daf0]">Orange Money</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl">📱</div>
              <span className="text-sm text-[#d0daf0]">Free Money</span>
            </div>
          </div>
        </div>

        {/* Guarantee */}
        <div className="reveal mt-12 text-center">
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
