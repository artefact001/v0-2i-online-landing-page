"use client"

import { useEffect, useRef } from "react"

const steps = [
  {
    icon: "📱",
    title: "Choisissez votre formation",
    desc: "Parcourez le catalogue depuis votre telephone. Chaque cours detaille le programme, la duree, le certificat obtenu et le tarif. Choisissez selon votre objectif professionnel.",
  },
  {
    icon: "💳",
    title: "Payez en Mobile Money",
    desc: "Reglez simplement par Wave, Orange Money ou Free Money. Pas de carte bancaire necessaire. L'acces a votre cours est active instantanement apres paiement.",
    payments: ["WAVE", "Orange Money", "Free Money"],
  },
  {
    icon: "🎓",
    title: "Apprenez a votre rythme",
    desc: "Videos HD, fiches PDF telechargeables, quiz et exercices pratiques. Progressez a votre rythme, depuis n'importe ou — meme sans connexion pour les modules telecharges.",
  },
  {
    icon: "🏅",
    title: "Obtenez votre certificat",
    desc: "Apres validation des evaluations, recevez votre certificat numerique Incub Institut — verifiable en ligne, partageable sur LinkedIn, reconnu par les employeurs et partenaires.",
  },
]

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => {
                el.classList.add('visible')
              }, i * 150)
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
    <section id="comment" ref={sectionRef} className="py-[120px] px-6 md:px-[60px]">
      <div className="text-center mb-[60px]">
        <p className="reveal text-[10px] font-semibold tracking-[5px] uppercase text-[#C9A227] mb-3">
          Processus
        </p>
        <h2 className="reveal font-serif text-[clamp(36px,4vw,56px)] font-semibold inline-block">
          Comment ca <em className="italic text-[#C9A227] font-light">marche</em>
        </h2>
      </div>

      <div className="max-w-[800px] mx-auto">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className={`reveal grid grid-cols-[80px_1fr] gap-8 items-start py-10 ${
              index < steps.length - 1 ? "border-b border-[rgba(255,255,255,0.05)]" : ""
            }`}
          >
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border border-[rgba(201,162,39,0.3)] flex items-center justify-center font-serif text-2xl font-bold text-[#C9A227] transition-all duration-300 hover:bg-[rgba(201,162,39,0.12)] hover:border-[#C9A227]">
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className="w-[1px] flex-1 min-h-[40px] bg-gradient-to-b from-[rgba(201,162,39,0.3)] to-transparent mt-2" />
              )}
            </div>
            <div>
              <div className="text-[28px] mb-2">{step.icon}</div>
              <h3 className="font-serif text-[26px] font-semibold text-white mb-2.5">{step.title}</h3>
              <p className="text-sm text-[#d0daf0] leading-relaxed">{step.desc}</p>
              
              {step.payments && (
                <div className="flex items-center gap-4 mt-4">
                  {step.payments.map((payment) => (
                    <span
                      key={payment}
                      className={`text-xs font-bold tracking-[1px] ${
                        payment === "WAVE"
                          ? "text-[#00B5E2]"
                          : payment === "Orange Money"
                          ? "text-[#FF6600]"
                          : "text-[#DC143C]"
                      }`}
                    >
                      {payment}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
