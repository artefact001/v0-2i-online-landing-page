"use client"

import { useEffect, useRef } from "react"

const steps = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: "Choisissez votre formation",
    desc: "Parcourez le catalogue depuis votre telephone. Chaque cours detaille le programme, la duree, le certificat obtenu et le tarif.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    title: "Payez en Mobile Money",
    desc: "Reglez simplement par Wave, Orange Money ou Free Money. L'acces est active instantanement apres paiement.",
    payments: [
      { name: "Wave", color: "#00B5E2" },
      { name: "Orange Money", color: "#FF6600" },
      { name: "Free Money", color: "#DC143C" },
    ],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Apprenez a votre rythme",
    desc: "Videos HD, fiches PDF telechargeables, quiz et exercices pratiques. Progressez depuis n'importe ou.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: "Obtenez votre certificat",
    desc: "Recevez votre certificat numerique Incub Institut — verifiable en ligne, reconnu par les employeurs.",
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
    <section id="comment" ref={sectionRef} className="py-[120px] px-6 md:px-[60px] relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(27,58,107,0.3)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <p className="reveal text-[10px] font-semibold tracking-[5px] uppercase text-[#C9A227] mb-4">
            Processus simple
          </p>
          <h2 className="reveal font-serif text-[clamp(36px,4vw,56px)] font-semibold text-white mb-4">
            Comment ca <em className="italic text-[#C9A227] font-light">marche</em>
          </h2>
          <p className="reveal text-base text-[#d0daf0] max-w-[500px] mx-auto">
            Un parcours simplifie pour vous permettre de commencer votre formation en quelques minutes.
          </p>
        </div>

        {/* Desktop: Horizontal Timeline */}
        <div className="hidden lg:grid grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="reveal relative"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute top-10 left-[calc(50%+40px)] right-0 h-px bg-gradient-to-r from-[rgba(201,162,39,0.4)] to-[rgba(201,162,39,0.1)]" />
              )}
              
              <div className="text-center">
                {/* Number circle */}
                <div className="relative inline-flex mb-6">
                  <div className="w-20 h-20 rounded-full bg-[rgba(201,162,39,0.08)] border border-[rgba(201,162,39,0.25)] flex items-center justify-center text-[#C9A227] transition-all duration-300 hover:bg-[rgba(201,162,39,0.15)] hover:border-[#C9A227] hover:scale-110">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#C9A227] text-[#0D2545] text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                
                <h3 className="font-serif text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-[#d0daf0] leading-relaxed">{step.desc}</p>
                
                {step.payments && (
                  <div className="flex items-center justify-center gap-3 mt-4">
                    {step.payments.map((payment) => (
                      <span
                        key={payment.name}
                        className="text-[10px] font-bold tracking-[1px] px-2 py-1 rounded"
                        style={{ color: payment.color, backgroundColor: `${payment.color}15` }}
                      >
                        {payment.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="lg:hidden">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`reveal grid grid-cols-[60px_1fr] gap-6 items-start ${
                index < steps.length - 1 ? "pb-10 mb-10 border-b border-[rgba(255,255,255,0.05)]" : ""
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-[rgba(201,162,39,0.08)] border border-[rgba(201,162,39,0.25)] flex items-center justify-center text-[#C9A227]">
                    {step.icon}
                  </div>
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C9A227] text-[#0D2545] text-[10px] font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-[#d0daf0] leading-relaxed">{step.desc}</p>
                
                {step.payments && (
                  <div className="flex items-center gap-3 mt-4 flex-wrap">
                    {step.payments.map((payment) => (
                      <span
                        key={payment.name}
                        className="text-[10px] font-bold tracking-[1px] px-2 py-1 rounded"
                        style={{ color: payment.color, backgroundColor: `${payment.color}15` }}
                      >
                        {payment.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
