"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

interface Course {
  badge: string
  badgeStyle?: string
  name: string
  mode: string
  desc: string
  duration: string
  price?: string
  popular?: boolean
  bgClass: string
}

const courses: Course[] = [
  {
    badge: "Populaire",
    name: "CAP Cuisinier",
    mode: "Formation en hybride",
    desc: "Faites de votre passion un metier d'excellence en maitrisant l'art de la haute gastronomie. Ce CAP vous offre un apprentissage complet.",
    duration: "3 ans",
    popular: true,
    bgClass: "bg-gradient-to-br from-[#1a3a5c] to-[#0d2545]",
  },
  {
    badge: "CAP",
    name: "CAP Serveur",
    mode: "Formation en hybride",
    desc: "Maitrisez l'art du service, la mise en place et le protocole de restauration professionnelle.",
    duration: "3 ans",
    bgClass: "bg-gradient-to-br from-[#2d1a0e] to-[#1a0d05]",
  },
  {
    badge: "Artisanat",
    name: "CAP Patissier",
    mode: "Formation en hybride",
    desc: "Recettes traditionnelles revisitees, techniques de viennoiserie, gestion d'une patisserie.",
    duration: "3 ans",
    bgClass: "bg-gradient-to-br from-[#0d3320] to-[#061a0f]",
  },
  {
    badge: "Certifiant",
    name: "Hygiene & Securite HACCP",
    mode: "Formation en ligne",
    desc: "Certification en hygiene alimentaire — obligatoire pour tout professionnel.",
    duration: "2 mois",
    price: "80 000 F",
    bgClass: "bg-gradient-to-br from-[#2d2a0d] to-[#1a1805]",
  },
  {
    badge: "Certificat de Specialite",
    name: "Formations Courtes Durees",
    mode: "Formation en ligne ou en hybride",
    desc: "CS Cuisine, CS Patisserie, CS Serveur — des parcours intensifs et cibles pour acquerir rapidement les competences cles.",
    duration: "6 a 8 mois",
    bgClass: "bg-gradient-to-br from-[#1a0d2d] to-[#0d0518]",
  },
  {
    badge: "Business",
    name: "Gestion d'un Restaurant",
    mode: "Formation en ligne",
    desc: "Finances, RH, approvisionnement, marketing — tout pour gerer et developper votre restaurant.",
    duration: "2 mois",
    price: "80 000 F",
    bgClass: "bg-gradient-to-br from-[#1a2d3a] to-[#0d1a24]",
  },
]

function CourseCard({ course, index }: { course: Course; index: number }) {
  return (
    <div
      className={`reveal bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-2 hover:border-[rgba(201,162,39,0.3)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.3),0_0_0_1px_rgba(201,162,39,0.1)]`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Banner */}
      <div className={`h-[120px] flex items-center justify-center text-5xl relative overflow-hidden ${course.bgClass}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(8,15,30,0.8)]" />
      </div>

      {/* Body */}
      <div className="p-6">
        <span className={`inline-block bg-[rgba(201,162,39,0.15)] border border-[rgba(201,162,39,0.25)] text-[#E8C050] text-[9px] font-semibold tracking-[2px] uppercase rounded px-2.5 py-1 mb-3 ${course.popular ? 'flex items-center gap-1' : ''}`}>
          {course.popular && "⭐"} {course.badge}
        </span>
        
        <h3 className="font-serif text-xl font-semibold text-white leading-tight mb-2">{course.name}</h3>
        
        <div className="inline-flex items-center gap-1.5 bg-[rgba(201,162,39,0.12)] border border-[rgba(201,162,39,0.35)] rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-[1.5px] text-[#E8C050] mb-2.5">
          <span>💻</span> {course.mode}
        </div>
        
        <p className="text-xs text-[#d0daf0] leading-relaxed mb-5">{course.desc}</p>
        
        {/* Meta */}
        <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.06)]">
          <span className="text-[11px] text-[rgba(255,255,255,0.35)] tracking-[1px]">⏱ {course.duration}</span>
          {course.price && (
            <span className="font-serif text-[22px] font-bold text-[#C9A227]">{course.price}</span>
          )}
        </div>

        {/* CTA */}
        <Link
          href="#inscription"
          className="flex items-center justify-center gap-2.5 mt-4 px-5 py-3.5 bg-[#C9A227] text-[#0D2545] text-[11px] font-bold tracking-[2px] uppercase rounded no-underline transition-all duration-250 hover:bg-[#E8C050] hover:-translate-y-0.5"
        >
          <span>✍️</span>
          <span>Je m&apos;inscris</span>
        </Link>
      </div>
    </div>
  )
}

export function CoursesSection() {
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
    <section id="formations" ref={sectionRef} className="py-[120px] px-6 md:px-[60px] bg-[rgba(13,37,69,0.2)]">
      <div className="text-center mb-[60px]">
        <p className="reveal text-[10px] font-semibold tracking-[5px] uppercase text-[#C9A227] mb-3">
          Catalogue
        </p>
        <h2 className="reveal font-serif text-[clamp(36px,4vw,56px)] font-semibold inline-block">
          Nos <em className="italic text-[#C9A227] font-light">formations</em>
        </h2>
        <p className="reveal text-[15px] text-[#d0daf0] max-w-[600px] mx-auto mt-4">
          Accedez a des formations d&apos;excellence creees par des experts du metier. Apprenez a votre rythme, validez vos acquis et obtenez un diplome ou certificat reconnu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <CourseCard key={course.name} course={course} index={index} />
        ))}
      </div>
    </section>
  )
}
