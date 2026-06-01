"use client"

import { useState } from "react"
import Image from "next/image"
import {
  actualites,
  opportunites,
  formatNewsDate,
  type ActualiteCategory,
  type OpportuniteCategory,
} from "@/lib/news-data"

const actuCategories: (ActualiteCategory | "Tout")[] = [
  "Tout",
  "Actualité",
  "Événement",
  "Partenariat",
  "Réussite",
]

const oppoCategories: (OpportuniteCategory | "Tout")[] = ["Tout", "Emploi", "Stage", "Bourse", "Concours"]

const categoryColors: Record<string, string> = {
  Actualité: "bg-[#C9A227]/20 text-[#C9A227]",
  Événement: "bg-blue-500/20 text-blue-400",
  Partenariat: "bg-emerald-500/20 text-emerald-400",
  Réussite: "bg-rose-500/20 text-rose-400",
  Emploi: "bg-[#C9A227]/20 text-[#C9A227]",
  Stage: "bg-blue-500/20 text-blue-400",
  Bourse: "bg-emerald-500/20 text-emerald-400",
  Concours: "bg-rose-500/20 text-rose-400",
}

export function ActualitesContent() {
  const [tab, setTab] = useState<"actualites" | "opportunites">("actualites")
  const [actuFilter, setActuFilter] = useState<ActualiteCategory | "Tout">("Tout")
  const [oppoFilter, setOppoFilter] = useState<OpportuniteCategory | "Tout">("Tout")

  const filteredActus = actuFilter === "Tout" ? actualites : actualites.filter((a) => a.category === actuFilter)
  const featured = filteredActus.find((a) => a.featured) ?? filteredActus[0]
  const rest = filteredActus.filter((a) => a.id !== featured?.id)

  const filteredOppos =
    oppoFilter === "Tout" ? opportunites : opportunites.filter((o) => o.category === oppoFilter)

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 pb-24">
      {/* Tab switcher */}
      <div className="flex items-center justify-center gap-2 mb-12">
        <div className="inline-flex p-1 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]">
          <button
            onClick={() => setTab("actualites")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all ${
              tab === "actualites"
                ? "bg-[#C9A227] text-[#0D2545]"
                : "text-[rgba(255,255,255,0.6)] hover:text-white"
            }`}
          >
            Actualités
          </button>
          <button
            onClick={() => setTab("opportunites")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all ${
              tab === "opportunites"
                ? "bg-[#C9A227] text-[#0D2545]"
                : "text-[rgba(255,255,255,0.6)] hover:text-white"
            }`}
          >
            Opportunités
          </button>
        </div>
      </div>

      {tab === "actualites" ? (
        <div>
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {actuCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActuFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all ${
                  actuFilter === cat
                    ? "bg-[#C9A227] text-[#0D2545]"
                    : "bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.6)] hover:text-white border border-[rgba(255,255,255,0.08)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured article */}
          {featured && (
            <article className="grid md:grid-cols-2 gap-8 mb-14 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden">
              <div className="relative h-64 md:h-full min-h-[280px]">
                <Image
                  src={featured.image || "/placeholder.svg"}
                  alt={featured.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[featured.category]}`}
                  >
                    {featured.category}
                  </span>
                  <span className="text-[rgba(255,255,255,0.4)] text-xs">{formatNewsDate(featured.date)}</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4 text-balance">
                  {featured.title}
                </h2>
                <p className="text-[rgba(255,255,255,0.6)] leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center gap-2 text-[#C9A227] text-sm font-medium">
                  <span>Lire l&apos;article</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </article>
          )}

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((a) => (
              <article
                key={a.id}
                className="group bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden hover:border-[rgba(201,162,39,0.4)] transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={a.image || "/placeholder.svg"}
                    alt={a.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[a.category]}`}>
                      {a.category}
                    </span>
                    <span className="text-[rgba(255,255,255,0.4)] text-xs">{a.readingTime}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white mb-2 text-balance group-hover:text-[#C9A227] transition-colors">
                    {a.title}
                  </h3>
                  <p className="text-[rgba(255,255,255,0.55)] text-sm leading-relaxed mb-4 line-clamp-3">
                    {a.excerpt}
                  </p>
                  <span className="text-[rgba(255,255,255,0.4)] text-xs">{formatNewsDate(a.date)}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {oppoCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setOppoFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all ${
                  oppoFilter === cat
                    ? "bg-[#C9A227] text-[#0D2545]"
                    : "bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.6)] hover:text-white border border-[rgba(255,255,255,0.08)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Opportunity list */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredOppos.map((o) => (
              <article
                key={o.id}
                className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 hover:border-[rgba(201,162,39,0.4)] transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[o.category]}`}>
                      {o.category}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-white mt-3">{o.title}</h3>
                    <p className="text-[#C9A227] text-sm mt-1">{o.organization}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[rgba(255,255,255,0.5)] text-sm mb-4">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {o.location}
                </div>

                <p className="text-[rgba(255,255,255,0.6)] text-sm leading-relaxed mb-4">{o.description}</p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {o.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.6)] text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.08)]">
                  <span className="text-[rgba(255,255,255,0.45)] text-xs">
                    Date limite : <span className="text-white">{formatNewsDate(o.deadline)}</span>
                  </span>
                  <button className="px-4 py-2 rounded-lg bg-[#C9A227] text-[#0D2545] text-xs font-bold tracking-wide hover:bg-[#E8C050] transition-colors">
                    Postuler
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
