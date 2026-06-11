"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { formations } from "@/lib/formations-data"

function CourseCard({ course, index }: { course: (typeof formations)[number]; index: number }) {
  return (
    <div
      className="group bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:border-[rgba(201,162,39,0.4)] hover:shadow-[0_30px_80px_rgba(0,0,0,0.4),0_0_0_1px_rgba(201,162,39,0.15)] h-full flex flex-col"
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {/* Image Banner */}
      <div className="h-[180px] relative overflow-hidden">
        <Image
          src={course.image}
          alt={course.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080F1E] via-[rgba(8,15,30,0.3)] to-transparent" />

        {/* Badge overlay */}
        <div className="absolute top-4 left-4">
          <span
            className={`inline-flex items-center gap-1.5 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm border border-[rgba(201,162,39,0.4)] text-[#E8C050] text-[9px] font-bold tracking-[2px] uppercase rounded-full px-3 py-1.5 ${course.popular ? "bg-[#C9A227] text-[#0D2545] border-[#C9A227]" : ""}`}
          >
            {course.popular && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            )}
            {course.badge}
          </span>
        </div>

        {/* Duration overlay */}
        <div className="absolute bottom-4 right-4">
          <span className="inline-flex items-center gap-1 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm text-white text-[10px] font-medium rounded-full px-3 py-1.5">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {course.duration}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif text-xl font-semibold text-white leading-tight mb-2 group-hover:text-[#C9A227] transition-colors">
          {course.name}
        </h3>

        <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[1px] text-[#C9A227] mb-3">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {course.mode}
        </div>

        <p className="text-sm text-[#d0daf0] leading-relaxed mb-5 line-clamp-3">{course.shortDesc}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.06)] mt-auto">
          {course.price ? (
            <div>
              <span className="text-[10px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider">A partir de</span>
              <div className="font-serif text-xl font-bold text-[#C9A227]">{course.price}</div>
            </div>
          ) : (
            <div>
              <span className="text-[10px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider">Diplome</span>
              <div className="text-sm font-medium text-white">Reconnu Etat</div>
            </div>
          )}

          <Link
            href={`/formations/${course.slug}`}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[rgba(201,162,39,0.15)] border border-[rgba(201,162,39,0.3)] text-[#E8C050] text-[10px] font-bold tracking-[1.5px] uppercase rounded-lg transition-all duration-300 hover:bg-[#C9A227] hover:text-[#0D2545] hover:border-[#C9A227]"
          >
            Details
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

const PER_PAGE = 6

export function CoursesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)
  const pageCount = Math.ceil(formations.length / PER_PAGE)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => {
                el.classList.add("visible")
              }, i * 80)
            })
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const start = page * PER_PAGE
  const visible = formations.slice(start, start + PER_PAGE)

  return (
    <section id="formations" ref={sectionRef} className="py-[120px] px-6 md:px-[60px] bg-[rgba(13,37,69,0.15)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="reveal text-[10px] font-semibold tracking-[5px] uppercase text-[#C9A227] mb-4">
            Catalogue de formations
          </p>
          <h2 className="reveal font-serif text-[clamp(36px,4vw,56px)] font-semibold text-white mb-4">
            Nos <em className="italic text-[#C9A227] font-light">formations</em> d&apos;excellence
          </h2>
          <p className="reveal text-base text-[#d0daf0] max-w-[600px] mx-auto leading-relaxed">
            Des parcours complets concus par des experts du metier. Apprenez a votre rythme, validez vos acquis et
            obtenez un diplome reconnu.
          </p>
        </div>

        {/* Slider track */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((course, index) => (
              <CourseCard key={course.slug} course={course} index={index} />
            ))}
          </div>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-center gap-6 mt-12">
          <button
            type="button"
            aria-label="Page precedente"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-11 h-11 flex items-center justify-center rounded-full border border-[rgba(201,162,39,0.3)] text-[#E8C050] transition-all duration-300 hover:bg-[#C9A227] hover:text-[#0D2545] hover:border-[#C9A227] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#E8C050]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Aller a la page ${i + 1}`}
                aria-current={i === page}
                onClick={() => setPage(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === page ? "w-8 bg-[#C9A227]" : "w-2.5 bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(201,162,39,0.5)]"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Page suivante"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={page === pageCount - 1}
            className="w-11 h-11 flex items-center justify-center rounded-full border border-[rgba(201,162,39,0.3)] text-[#E8C050] transition-all duration-300 hover:bg-[#C9A227] hover:text-[#0D2545] hover:border-[#C9A227] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#E8C050]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <p className="text-center text-xs text-[rgba(255,255,255,0.4)] mt-6">
          {formations.length} formations disponibles
        </p>
      </div>
    </section>
  )
}
