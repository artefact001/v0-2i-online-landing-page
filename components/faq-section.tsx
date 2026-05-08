"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

const faqItems = [
  {
    question: "Les diplomes 2I Online sont-ils reconnus par l'Etat ?",
    answer: "Oui. Incub Institut est un centre de formation agree. Les certifications CAP HCR (Cuisinier, Patissier, Serveur) sont des diplomes nationaux reconnus par l'Etat senegalais et par les partenaires employeurs de la filiere hotellerie-restauration en Afrique de l'Ouest.",
  },
  {
    question: "Comment se deroulent les evaluations et examens ?",
    answer: "Les cours se suivent en ligne a votre rythme (videos, fiches PDF, quiz). Les evaluations pratiques et examens certificatifs se deroulent en presentiel a Bargny ou dans un centre partenaire proche de chez vous. Vous serez informe des dates avec suffisamment d'avance pour vous organiser.",
  },
  {
    question: "Puis-je payer en plusieurs fois ?",
    answer: "Oui, le paiement fractionne est possible. Nous proposons des modalites flexibles adaptees aux realites africaines — en plusieurs tranches mensuelles via Mobile Money (Wave, Orange Money) ou virement bancaire. Contactez-nous sur WhatsApp pour convenir d'un calendrier de paiement personnalise.",
  },
  {
    question: "Est-ce accessible depuis n'importe quel pays d'Afrique ?",
    answer: "Absolument. La plateforme 2I Online est accessible depuis n'importe quel appareil connecte — smartphone, tablette ou ordinateur — sur tout le continent africain. Certains modules peuvent meme etre telecharges pour etre consultes hors connexion.",
  },
  {
    question: "Quand demarre la prochaine session de formation ?",
    answer: "Les inscriptions sont ouvertes en continu pour les formations en ligne. Les prochaines sessions avec evaluation presentielle sont prevues pour juin 2026. Les places etant limitees, nous vous recommandons de vous preinscrire des maintenant.",
  },
  {
    question: "Y a-t-il un accompagnement humain ou apprend-on seul ?",
    answer: "Vous n'etes jamais seul. Chaque parcours est suivi par un formateur referent joignable via la plateforme et WhatsApp. Des sessions de questions-reponses en direct sont egalement organisees regulierement.",
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
              Questions frequentes
            </p>
            <h2 className="reveal font-serif text-[clamp(32px,4vw,48px)] font-semibold text-white leading-tight mb-6">
              Tout ce que vous <em className="italic text-[#C9A227] font-light">voulez savoir</em>
            </h2>
            <p className="reveal text-base text-[#d0daf0] leading-relaxed mb-8">
              Vous avez une question ? Elle est probablement deja la. Sinon, contactez-nous sur WhatsApp.
            </p>
            
            <div className="reveal bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[rgba(37,211,102,0.1)] border border-[rgba(37,211,102,0.3)] flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Besoin d&apos;aide ?</div>
                  <div className="text-xs text-[rgba(255,255,255,0.5)]">Reponse sous 1 heure</div>
                </div>
              </div>
              <Link
                href="https://wa.me/221771234567"
                target="_blank"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white text-sm font-semibold rounded-lg transition-all hover:bg-[#20bd5a] hover:scale-[1.02]"
              >
                Contactez-nous sur WhatsApp
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
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
                  className={`overflow-hidden transition-all duration-400 ${
                    openIndex === index ? "max-h-[400px]" : "max-h-0"
                  }`}
                >
                  <p className="px-6 pb-6 text-sm text-[#d0daf0] leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
