"use client"

import { useState, useEffect } from "react"
import { notFound, useParams } from "next/navigation"
import Link from "next/link"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/lib/auth-context"
import { candidatureService } from "@/lib/candidature-service"
import { alertSuccess, alertError } from "@/lib/alerts"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

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

const typeLabel: Record<Opportunite['type'], string> = {
  stage: 'Stage',
  emploi: 'Emploi',
  formation: 'Formation',
  bourse: 'Bourse',
  partenariat: 'Partenariat',
}

const typeColor: Record<Opportunite['type'], string> = {
  stage: 'bg-blue-500/20 text-blue-400',
  emploi: 'bg-[#C9A227]/20 text-[#C9A227]',
  formation: 'bg-purple-500/20 text-purple-400',
  bourse: 'bg-emerald-500/20 text-emerald-400',
  partenariat: 'bg-rose-500/20 text-rose-400',
}

export default function OpportuniteDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const [opportunite, setOpportunite] = useState<Opportunite | null>(null)
  const [loading, setLoading] = useState(true)
  const [dejaPostule, setDejaPostule] = useState(false)
  const [postulating, setPostulating] = useState(false)

  useEffect(() => {
    if (user?.role !== 'student') return
    candidatureService.getMesCandidatures().then((list) => {
      setDejaPostule(list.some((c) => c.opportunite_id === params.id))
    })
  }, [user, params.id])

  async function handlePostuler() {
    setPostulating(true)
    try {
      await candidatureService.postuler(params.id as string)
      setDejaPostule(true)
      alertSuccess('Candidature envoyée avec succès !')
    } catch (err: any) {
      alertError(err?.message || "Erreur lors de l'envoi de la candidature")
    }
    setPostulating(false)
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient<Opportunite>(`/opportunites/${params.id}`)
        setOpportunite(res.data ?? null)
      } catch (error) {
        console.error('Error loading opportunity:', error)
      }
      setLoading(false)
    }
    load()
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080F1E] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C9A227]" />
      </main>
    )
  }

  if (!opportunite) {
    notFound()
  }

  const whatsappMessage = encodeURIComponent(
    `Bonjour 2i Online, je souhaite postuler à l'offre "${opportunite.titre}"${opportunite.entreprise ? ` (${opportunite.entreprise})` : ''}.`,
  )

  return (
    <main className="min-h-screen bg-[#080F1E] text-white">
      <Navbar />

      <section className="relative pt-32 pb-24 px-6 md:px-10">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-[rgba(255,255,255,0.5)] hover:text-[#C9A227] text-sm mb-8 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux opportunités
          </Link>

          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-5 ${typeColor[opportunite.type]}`}>
            {typeLabel[opportunite.type]}
          </span>

          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-3 text-balance">{opportunite.titre}</h1>
          {opportunite.entreprise && <p className="text-[#C9A227] text-lg mb-1">{opportunite.entreprise}</p>}

          <div className="flex items-center gap-2 text-[rgba(255,255,255,0.5)] text-sm mb-8">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {opportunite.ville}, {opportunite.pays}
          </div>

          <div className="space-y-5 mb-10">
            <p className="text-[rgba(255,255,255,0.75)] leading-relaxed text-base">{opportunite.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
              <p className="text-[rgba(255,255,255,0.45)] text-xs mb-1">Début</p>
              <p className="text-white font-semibold">
                {new Date(opportunite.date_debut).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
              <p className="text-[rgba(255,255,255,0.45)] text-xs mb-1">Date limite</p>
              <p className="text-white font-semibold">
                {new Date(opportunite.date_fin).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          {opportunite.documents && (
            <a
              href={opportunite.documents}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center mb-4 text-[#C9A227] hover:underline text-sm"
            >
              Voir le document PDF
            </a>
          )}

          {user?.role === 'student' && (
            <button
              onClick={handlePostuler}
              disabled={dejaPostule || postulating}
              className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl bg-[#C9A227] text-[#0D2545] font-bold tracking-wide hover:bg-[#E8C050] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
            >
              {dejaPostule ? 'Candidature déjà envoyée' : postulating ? 'Envoi en cours...' : 'Postuler via 2I Online'}
            </button>
          )}

          {opportunite.lien_inscription ? (
            <a
              href={opportunite.lien_inscription}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl bg-[#C9A227] text-[#0D2545] font-bold tracking-wide hover:bg-[#E8C050] transition-colors"
            >
              Postuler
            </a>
          ) : (
            <a
              href={`https://wa.me/221774662921?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl bg-[#C9A227] text-[#0D2545] font-bold tracking-wide hover:bg-[#E8C050] transition-colors"
            >
              Postuler via WhatsApp
            </a>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
