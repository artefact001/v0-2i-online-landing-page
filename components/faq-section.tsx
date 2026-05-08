"use client"

import { useState, useEffect, useRef } from "react"

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
    answer: "Absolument. La plateforme 2I Online est accessible depuis n'importe quel appareil connecte — smartphone, tablette ou ordinateur — sur tout le continent africain. Certains modules peuvent meme etre telecharges pour etre consultes hors connexion. Nous accueillons des apprenants du Senegal, de Guinee, du Mali, de Cote d'Ivoire et bien d'autres pays.",
  },
  {
    question: "Quand demarre la prochaine session de formation ?",
    answer: "Les inscriptions sont ouvertes en continu pour les formations en ligne. Les prochaines sessions avec evaluation presentielle sont prevues pour juin 2026. Les places etant limitees, nous vous recommandons de vous preinscrire des maintenant via le formulaire en bas de page ou par WhatsApp.",
  },
  {
    question: "Y a-t-il un accompagnement humain ou apprend-on seul ?",
    answer: "Vous n'etes jamais seul. Chaque parcours est suivi par un formateur referent joignable via la plateforme et WhatsApp. Des sessions de questions-reponses en direct sont egalement organisees regulierement. L'equipe pedagogique d'Incub Institut reste disponible tout au long de votre formation.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
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
      <div className="text-center mb-[60px]">
        <p className="reveal text-[10px] font-semibold tracking-[5px] uppercase text-[#C9A227] mb-3">
          Questions frequentes
        </p>
        <h2 className="reveal font-serif text-[clamp(36px,4vw,56px)] font-semibold inline-block">
          Tout ce que vous <em className="italic text-[#C9A227] font-light">voulez savoir</em>
        </h2>
        <p className="reveal text-[15px] text-[#d0daf0] mt-4 max-w-[500px] mx-auto">
          Vous avez une question ? Elle est probablement deja la. Sinon, contactez-nous sur WhatsApp — reponse sous 1h.
        </p>
      </div>

      <div className="max-w-[800px] mx-auto flex flex-col gap-3">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className={`reveal border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden transition-all duration-300 ${
              openIndex === index
                ? "border-[rgba(201,162,39,0.4)] bg-[rgba(201,162,39,0.03)]"
                : "hover:border-[rgba(201,162,39,0.25)]"
            }`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between gap-5 px-7 py-5 bg-[rgba(255,255,255,0.02)] border-none cursor-pointer text-left text-white font-sans text-[15px] font-medium leading-normal transition-colors duration-300 hover:bg-[rgba(255,255,255,0.04)]"
            >
              {item.question}
              <span
                className={`text-[11px] text-[#C9A227] transition-transform duration-350 shrink-0 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-400 ${
                openIndex === index ? "max-h-[300px]" : "max-h-0"
              }`}
            >
              <p className="px-7 pb-5 text-sm font-light text-[#d0daf0] leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
