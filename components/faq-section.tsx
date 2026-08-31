"use client"

import { useState, useEffect, useRef } from "react"

const faqItems = [
  {
    question: "Comment se déroule le parcours de formation ?",
    answer: "En 4 étapes simples : 1) Choisissez votre formation dans le catalogue depuis votre téléphone (programme, durée, certificat et tarif détaillés). 2) Payez en Mobile Money via Wave, Orange Money ou Free Money — l'accès est activé instantanément. 3) Apprenez à votre rythme avec des vidéos HD, des fiches PDF téléchargeables, des quiz et des exercices pratiques, depuis n'importe où. 4) Obtenez votre certificat numérique Incub Institut, vérifiable en ligne et reconnu par les employeurs.",
  },
  {
    question: "Les diplômes 2I Online sont-ils reconnus par l'État ?",
    answer: "Oui. Incub Institut est un centre de formation agréé. Les certifications CAP HCR (Cuisinier, Pâtissier, Serveur) sont des diplômes nationaux reconnus par l'État sénégalais et par les partenaires employeurs de la filière hôtellerie-restauration en Afrique de l'Ouest.",
  },
  {
    question: "Comment se déroulent les évaluations et examens ?",
    answer: "Les cours se suivent en ligne à votre rythme (vidéos, fiches PDF, quiz). Les évaluations pratiques et examens certificatifs se déroulent en présentiel à Bargny ou dans un centre partenaire proche de chez vous. Vous serez informé des dates avec suffisamment d'avance pour vous organiser.",
  },
  {
    question: "Puis-je payer en plusieurs fois ?",
    answer: "Oui, le paiement fractionné est possible. Nous proposons des modalités flexibles adaptées aux réalités africaines — en plusieurs tranches mensuelles via Mobile Money (Wave, Orange Money) ou virement bancaire. Contactez-nous sur WhatsApp pour convenir d'un calendrier de paiement personnalisé.",
  },
  {
    question: "Est-ce accessible depuis n'importe quel pays d'Afrique ?",
    answer: "Absolument. La plateforme 2I Online est accessible depuis n'importe quel appareil connecté — smartphone, tablette ou ordinateur — sur tout le continent africain. Certains modules peuvent même être téléchargés pour être consultés hors connexion.",
  },
  {
    question: "Quand demarre la prochaine session de formation ?",
    answer: "Les inscriptions sont ouvertes en continu pour les formations en ligne. Les prochaines sessions avec évaluation présentielle sont prévues pour juin 2026. Les places étant limitées, nous vous recommandons de vous préinscrire dès maintenant.",
  },
  {
    question: "Y a-t-il un accompagnement humain ou apprend-on seul ?",
    answer: "Vous n'êtes jamais seul. Chaque parcours est suivi par un formateur référent joignable via la plateforme et WhatsApp. Des sessions de questions-réponses en direct sont également organisées régulièrement.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
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
    <section id="faq" ref={sectionRef} className="py-[120px] px-6 md:px-[60px]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 items-start">
          {/* Left side - Header */}
          <div className="lg:sticky lg:top-32">
            <p className="reveal text-[10px] font-semibold tracking-[5px] uppercase text-[#C9A227] mb-4">
              Questions fréquentes
            </p>
            <h2 className="reveal font-serif text-[clamp(32px,4vw,48px)] font-semibold text-white leading-tight mb-6">
              Tout ce que vous <em className="italic text-[#C9A227] font-light">voulez savoir</em>
            </h2>
            <p className="reveal text-base text-[#d0daf0] leading-relaxed mb-8">
              Vous avez une question ? Elle est probablement déjà là. Sinon, contactez-nous sur WhatsApp.
            </p>
          </div>

          {/* Right side - FAQ Items */}
          <div className="flex flex-col gap-3">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className={`reveal border rounded-xl overflow-hidden transition-all duration-400 ${
                  openIndex === index
                    ? "border-[rgba(201,162,39,0.4)] bg-[rgba(201,162,39,0.03)] shadow-[0_4px_20px_rgba(201,162,39,0.05)]"
                    : "border-[rgba(255,255,255,0.07)] hover:border-[rgba(201,162,39,0.25)] bg-[rgba(255,255,255,0.01)]"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-start justify-between gap-4 p-6 bg-transparent border-none cursor-pointer text-left"
                >
                  <span className={`font-medium leading-relaxed transition-colors duration-300 ${
                    openIndex === index ? "text-[#C9A227]" : "text-white"
                  }`}>
                    {item.question}
                  </span>
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      openIndex === index 
                        ? "bg-[#C9A227] text-[#0D2545]" 
                        : "bg-[rgba(255,255,255,0.05)] text-[#C9A227]"
                    }`}
                  >
                    <svg 
                      className={`w-4 h-4 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-400 ease-in-out ${
                    openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-sm text-[#d0daf0] leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}