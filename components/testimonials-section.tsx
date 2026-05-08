"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"

const testimonials = [
  {
    stars: 5,
    text: "La formation en gestion de restaurant m'a donne tous les outils pour ouvrir mon maquis. Le contenu est vraiment adapte a notre realite ici a Abidjan. Les formateurs comprennent nos defis.",
    image: "/images/testimonial-1.jpg",
    name: "Aminata Kone",
    role: "Restauratrice",
    location: "Abidjan, Cote d'Ivoire",
  },
  {
    stars: 5,
    text: "J'ai obtenu ma certification HACCP en 2 semaines depuis Dakar. Le processus est simple, les videos claires. Mon employeur au Maroc a reconnu le certificat sans probleme.",
    image: "/images/testimonial-2.jpg",
    name: "Ibrahima Diallo",
    role: "Chef de partie",
    location: "Casablanca, Maroc",
  },
  {
    stars: 5,
    text: "Le module patisserie africaine m'a permis de lancer ma boutique en ligne. Les recettes sont precises, le formateur repond aux questions. Je recommande a toutes mes soeurs entrepreneuses.",
    image: "/images/testimonial-3.jpg",
    name: "Fatou Sarr",
    role: "Patissiere entrepreneur",
    location: "Thies, Senegal",
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
    <section id="temoignages" ref={sectionRef} className="py-[120px] px-6 md:px-[60px] bg-[rgba(27,58,107,0.1)] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.05)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <p className="reveal text-[10px] font-semibold tracking-[5px] uppercase text-[#C9A227] mb-4">
            Temoignages
          </p>
          <h2 className="reveal font-serif text-[clamp(36px,4vw,56px)] font-semibold text-white mb-4">
            Ce qu&apos;ils <em className="italic text-[#C9A227] font-light">disent</em> de nous
          </h2>
          <p className="reveal text-base text-[#d0daf0] max-w-[500px] mx-auto">
            Des centaines de professionnels africains ont deja transforme leur carriere grace a 2I Online.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="reveal group bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 transition-all duration-500 hover:border-[rgba(201,162,39,0.3)] hover:bg-[rgba(201,162,39,0.02)] hover:-translate-y-2"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Quote icon */}
              <div className="mb-6">
                <svg className="w-10 h-10 text-[#C9A227] opacity-30" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6c0-2.2 1.8-4 4-4V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-8c0-2.2 1.8-4 4-4V8z"/>
                </svg>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.stars }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-[#C9A227]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Text */}
              <p className="font-serif text-lg italic font-light text-[rgba(255,255,255,0.8)] leading-relaxed mb-8">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-[rgba(255,255,255,0.06)]">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[rgba(201,162,39,0.3)]">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{testimonial.name}</div>
                  <div className="text-xs text-[#C9A227] font-medium">{testimonial.role}</div>
                  <div className="text-[11px] text-[rgba(255,255,255,0.4)] mt-0.5 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="reveal mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[rgba(201,162,39,0.1)] border border-[rgba(201,162,39,0.2)] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-2xl font-serif font-bold text-[#C9A227]">98%</div>
              <div className="text-[11px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider">Satisfaction</div>
            </div>
          </div>
          
          <div className="hidden sm:block h-10 w-px bg-[rgba(255,255,255,0.1)]" />
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[rgba(201,162,39,0.1)] border border-[rgba(201,162,39,0.2)] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-2xl font-serif font-bold text-[#C9A227]">500+</div>
              <div className="text-[11px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider">Diplomes</div>
            </div>
          </div>
          
          <div className="hidden sm:block h-10 w-px bg-[rgba(255,255,255,0.1)]" />
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[rgba(201,162,39,0.1)] border border-[rgba(201,162,39,0.2)] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-2xl font-serif font-bold text-[#C9A227]">15+</div>
              <div className="text-[11px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider">Pays</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
