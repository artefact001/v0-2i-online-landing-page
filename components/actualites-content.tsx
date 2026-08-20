"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { apiClient } from "@/lib/api/client"

/**
 * Schéma Laravel réel :
 * - actus (table 'actuses'): titre, description, contenu_html, image, type
 *   ('actualite'|'evenement'|'communique'|'blog'), date_publication,
 *   date_expiration, statut ('brouillon'|'publie'|'archive')
 * - opportunites: titre, type ('stage'|'emploi'|'formation'|'bourse'|
 *   'partenariat'), description, documents (URL PDF), date_debut, date_fin,
 *   ville, pays, entreprise, lien_inscription, statut
 *   ('ouvert'|'ferme'|'en cours')
 * Aucun des deux n'a de champ "slug" — routage par id.
 */

interface Actu {
  id: string
  titre: string
  description?: string
  contenu_html: string
  image?: string
  type: 'actualite' | 'evenement' | 'communique' | 'blog'
  date_publication: string
  statut: 'brouillon' | 'publie' | 'archive'
}

interface Opportunite {
  id: string
  titre: string
  type: 'stage' | 'emploi' | 'formation' | 'bourse' | 'partenariat'
  description: string
  documents?: string
  date_debut: string
  date_fin: string
  ville: string
  pays: string
  entreprise?: string
  lien_inscription?: string
  statut: 'ouvert' | 'ferme' | 'en cours'
}

const actuTypeLabel: Record<Actu['type'], string> = {
  actualite: 'Actualité',
  evenement: 'Événement',
  communique: 'Communiqué',
  blog: 'Blog',
}

const actuTypeColor: Record<Actu['type'], string> = {
  actualite: 'bg-[#C9A227]/20 text-[#C9A227]',
  evenement: 'bg-blue-500/20 text-blue-400',
  communique: 'bg-emerald-500/20 text-emerald-400',
  blog: 'bg-rose-500/20 text-rose-400',
}

const oppoTypeLabel: Record<Opportunite['type'], string> = {
  stage: 'Stage',
  emploi: 'Emploi',
  formation: 'Formation',
  bourse: 'Bourse',
  partenariat: 'Partenariat',
}

const oppoTypeColor: Record<Opportunite['type'], string> = {
  stage: 'bg-blue-500/20 text-blue-400',
  emploi: 'bg-[#C9A227]/20 text-[#C9A227]',
  formation: 'bg-purple-500/20 text-purple-400',
  bourse: 'bg-emerald-500/20 text-emerald-400',
  partenariat: 'bg-rose-500/20 text-rose-400',
}

function stripHtml(html: string, maxLength = 150): string {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function ActualitesContent() {
  const [tab, setTab] = useState<"actualites" | "opportunites">("actualites")
  const [actuFilter, setActuFilter] = useState<Actu['type'] | "Tout">("Tout")
  const [oppoFilter, setOppoFilter] = useState<Opportunite['type'] | "Tout">("Tout")

  const [actus, setActus] = useState<Actu[]>([])
  const [opportunites, setOpportunites] = useState<Opportunite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [actusRes, oppoRes] = await Promise.all([
          apiClient<Actu[]>('/actus'),
          apiClient<Opportunite[]>('/opportunites'),
        ])
        // Ne montre que le contenu publié / ouvert côté public.
        setActus((actusRes.data || []).filter((a) => a.statut === 'publie'))
        setOpportunites((oppoRes.data || []).filter((o) => o.statut === 'ouvert'))
      } catch (error) {
        console.error('[actualites] Erreur de chargement:', error)
      }
      setLoading(false)
    }
    load()
  }, [])

  const filteredActus =
    actuFilter === "Tout" ? actus : actus.filter((a) => a.type === actuFilter)
  const featured = filteredActus[0]
  const rest = filteredActus.slice(1)

  const filteredOppos =
    oppoFilter === "Tout" ? opportunites : opportunites.filter((o) => o.type === oppoFilter)

  if (loading) {
    return (
      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-7xl mx-auto flex justify-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C9A227]" />
        </div>
      </section>
    )
  }

  return (
    <section className="px-6 md:px-10 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          <button
            onClick={() => setTab("actualites")}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
              tab === "actualites" ? "bg-[#C9A227] text-[#0D2545]" : "bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.1)]"
            }`}
          >
            Actualités
          </button>
          <button
            onClick={() => setTab("opportunites")}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
              tab === "opportunites" ? "bg-[#C9A227] text-[#0D2545]" : "bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.1)]"
            }`}
          >
            Opportunités
          </button>
        </div>

        {tab === "actualites" ? (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {(["Tout", "actualite", "evenement", "communique", "blog"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActuFilter(t)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    actuFilter === t ? "bg-[#C9A227] text-[#0D2545]" : "bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.1)]"
                  }`}
                >
                  {t === "Tout" ? "Tout" : actuTypeLabel[t]}
                </button>
              ))}
            </div>

            {filteredActus.length === 0 ? (
              <p className="text-center text-[rgba(255,255,255,0.5)] py-16">Aucune actualité pour le moment.</p>
            ) : (
              <>
                {/* Featured article */}
                {featured && (
                  <Link
                    href={`/actualites/${featured.id}`}
                    className="group grid md:grid-cols-2 gap-8 mb-14 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden hover:border-[rgba(201,162,39,0.4)] transition-all"
                  >
                    <div className="relative h-64 md:h-full min-h-[280px]">
                      <Image
                        src={featured.image || "/placeholder.svg"}
                        alt={featured.titre}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${actuTypeColor[featured.type]}`}>
                          {actuTypeLabel[featured.type]}
                        </span>
                        <span className="text-[rgba(255,255,255,0.4)] text-xs">{formatDate(featured.date_publication)}</span>
                      </div>
                      <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4 text-balance group-hover:text-[#C9A227] transition-colors">
                        {featured.titre}
                      </h2>
                      <p className="text-[rgba(255,255,255,0.6)] leading-relaxed mb-6">
                        {featured.description || stripHtml(featured.contenu_html)}
                      </p>
                      <div className="flex items-center gap-2 text-[#C9A227] text-sm font-medium">
                        <span>Lire l&apos;article</span>
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((a) => (
                    <Link
                      href={`/actualites/${a.id}`}
                      key={a.id}
                      className="group bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden hover:border-[rgba(201,162,39,0.4)] transition-all"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={a.image || "/placeholder.svg"}
                          alt={a.titre}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${actuTypeColor[a.type]}`}>
                            {actuTypeLabel[a.type]}
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-white mb-2 text-balance group-hover:text-[#C9A227] transition-colors">
                          {a.titre}
                        </h3>
                        <p className="text-[rgba(255,255,255,0.55)] text-sm leading-relaxed mb-4 line-clamp-3">
                          {a.description || stripHtml(a.contenu_html)}
                        </p>
                        <span className="text-[rgba(255,255,255,0.4)] text-xs">{formatDate(a.date_publication)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {(["Tout", "stage", "emploi", "formation", "bourse", "partenariat"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setOppoFilter(t)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    oppoFilter === t ? "bg-[#C9A227] text-[#0D2545]" : "bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.1)]"
                  }`}
                >
                  {t === "Tout" ? "Tout" : oppoTypeLabel[t]}
                </button>
              ))}
            </div>

            {filteredOppos.length === 0 ? (
              <p className="text-center text-[rgba(255,255,255,0.5)] py-16">Aucune opportunité pour le moment.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredOppos.map((o) => (
                  <Link
                    href={`/opportunites/${o.id}`}
                    key={o.id}
                    className="group block bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 hover:border-[rgba(201,162,39,0.4)] transition-all"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${oppoTypeColor[o.type]}`}>
                          {oppoTypeLabel[o.type]}
                        </span>
                        <h3 className="font-serif text-xl font-bold text-white mt-3 group-hover:text-[#C9A227] transition-colors">
                          {o.titre}
                        </h3>
                        {o.entreprise && <p className="text-[#C9A227] text-sm mt-1">{o.entreprise}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[rgba(255,255,255,0.5)] text-sm mb-4">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {o.ville}, {o.pays}
                    </div>

                    <p className="text-[rgba(255,255,255,0.6)] text-sm leading-relaxed mb-4 line-clamp-3">{o.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.08)]">
                      <span className="text-[rgba(255,255,255,0.45)] text-xs">
                        Date limite : <span className="text-white">{formatDate(o.date_fin)}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-[#C9A227] text-xs font-bold tracking-wide">
                        Voir les détails
                        <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
