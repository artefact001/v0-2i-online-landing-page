"use client"

import { notFound, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { apiClient } from "@/lib/api/client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

/**
 * Schéma Laravel réel. Le dossier s'appelle toujours [slug] pour éviter
 * un renommage de répertoire, mais la valeur transmise dans l'URL est
 * en réalité l'ID réel de la formation (voir CoursesSection, qui lie
 * désormais vers /formations/{formation.id}) — plus une donnée fictive
 * déconnectée du backend.
 */
interface Module {
  id: string
  titre: string
  ordre: number
}

interface Formation {
  id: string
  titre: string
  description?: string
  image?: string
  niveau?: string
  duree?: string
  prix: number
  statut: "en ligne" | "presentiel" | "hybride"
  modules?: Module[]
}

const statutLabel: Record<Formation["statut"], string> = {
  "en ligne": "En ligne",
  presentiel: "Présentiel",
  hybride: "Hybride",
}

export default function FormationDetailPage() {
  const params = useParams()
  const formationId = params.slug as string
  const [formation, setFormation] = useState<Formation | null>(null)
  const [related, setRelated] = useState<Formation[]>([])
  const [loading, setLoading] = useState(true)
  const [notFoundState, setNotFoundState] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [formationRes, allRes] = await Promise.all([
          apiClient<Formation>(`/formations/${formationId}`),
          apiClient<Formation[]>("/formations"),
        ])

        if (!formationRes.data) {
          setNotFoundState(true)
          setLoading(false)
          return
        }

        setFormation(formationRes.data)
        setRelated((allRes.data || []).filter((f) => f.id !== formationId).slice(0, 3))
      } catch (error) {
        console.error("[formations/detail] Erreur de chargement:", error)
        setNotFoundState(true)
      }
      setLoading(false)
    }
    load()
  }, [formationId])

  if (notFoundState) {
    notFound()
  }

  if (loading || !formation) {
    return (
      <main className="min-h-screen bg-[#080F1E] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C9A227]" />
      </main>
    )
  }

  const modules = (formation.modules || []).slice().sort((a, b) => a.ordre - b.ordre)

  return (
    <main className="min-h-screen bg-[#080F1E]">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 md:px-[60px]">
        <div className="max-w-5xl mx-auto">
          {formation.image && (
            <div className="h-[260px] md:h-[340px] relative overflow-hidden rounded-2xl mb-10">
              <Image src={formation.image} alt={formation.titre} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080F1E] via-[rgba(8,15,30,0.4)] to-transparent" />
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              {formation.niveau && (
                <span className="text-[10px] font-semibold tracking-[2px] uppercase text-[#C9A227] mb-2 block">
                  {formation.niveau}
                </span>
              )}
              <h1 className="font-serif text-3xl md:text-5xl font-semibold text-white leading-tight mb-3">
                {formation.titre}
              </h1>
              <p className="text-[#d0daf0] max-w-2xl leading-relaxed">{formation.description}</p>
            </div>

            <div>
              <div className="text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider mb-1">
                Frais d&apos;inscription
              </div>
              <div className="font-serif text-xl font-bold text-[#C9A227]">
                {Number(formation.prix).toLocaleString()} F
              </div>
            </div>

            <Link
              href={`/inscription?formation_id=${formation.id}`}
              className="inline-flex items-center gap-2 bg-[#C9A227] text-[#0D2545] text-xs font-bold tracking-[1.5px] uppercase px-7 py-4 rounded-lg transition-all duration-300 hover:bg-[#E8C050] hover:scale-105"
            >
              S&apos;inscrire a cette formation
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 md:px-[60px] pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main column */}
          <div className="lg:col-span-2 flex flex-col gap-12">
            {/* Programme — vrais modules de la formation */}
            <div>
              <h2 className="font-serif text-2xl font-semibold text-white mb-6">Programme</h2>
              {modules.length === 0 ? (
                <p className="text-[#d0daf0] text-sm">Le programme détaillé de cette formation sera bientôt disponible.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {modules.map((mod, i) => (
                    <div
                      key={mod.id}
                      className="flex items-center gap-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl px-5 py-4"
                    >
                      <span className="flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-[rgba(201,162,39,0.15)] text-[#E8C050] text-sm font-bold">
                        {i + 1}
                      </span>
                      <span className="text-[#d0daf0]">{mod.titre}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6">
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
              <h3 className="text-xs font-bold tracking-[2px] uppercase text-[#C9A227] mb-4">Informations</h3>
              <dl className="flex flex-col gap-4 text-sm">
                <div>
                  <dt className="text-[rgba(255,255,255,0.4)] mb-1">Modalité</dt>
                  <dd className="text-white">{statutLabel[formation.statut] ?? formation.statut}</dd>
                </div>
                {formation.duree && (
                  <div>
                    <dt className="text-[rgba(255,255,255,0.4)] mb-1">Durée</dt>
                    <dd className="text-white">{formation.duree}</dd>
                  </div>
                )}
                {formation.niveau && (
                  <div>
                    <dt className="text-[rgba(255,255,255,0.4)] mb-1">Niveau</dt>
                    <dd className="text-white">{formation.niveau}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-[rgba(255,255,255,0.4)] mb-1">Certification</dt>
                  <dd className="text-white">Certificat numérique 2I Online, vérifiable en ligne</dd>
                </div>
              </dl>
              <Link
                href={`/inscription?formation_id=${formation.id}`}
                className="flex items-center justify-center gap-2 w-full mt-6 bg-[#C9A227] text-[#0D2545] text-xs font-bold tracking-[1.5px] uppercase px-5 py-3.5 rounded-lg transition-all duration-300 hover:bg-[#E8C050]"
              >
                S&apos;inscrire
              </Link>
            </div>
          </aside>
        </div>

        {/* Related formations */}
        {related.length > 0 && (
          <div className="max-w-5xl mx-auto mt-20">
            <h2 className="font-serif text-2xl font-semibold text-white mb-8">Autres formations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((f) => (
                <Link
                  key={f.id}
                  href={`/formations/${f.id}`}
                  className="group bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-[rgba(201,162,39,0.4)]"
                >
                  <div className="h-[140px] relative overflow-hidden bg-[#0d0d1a]">
                    {f.image && (
                      <Image src={f.image} alt={f.titre} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080F1E] to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-semibold text-white group-hover:text-[#C9A227] transition-colors mb-1">
                      {f.titre}
                    </h3>
                    <p className="text-xs text-[rgba(255,255,255,0.4)]">{f.duree}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
