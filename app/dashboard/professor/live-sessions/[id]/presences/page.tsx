'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { apiClient } from '@/lib/api/client'
import { presenceService, type Presence } from '@/lib/presence-service'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { alertSuccess, alertError } from '@/lib/alerts'
import { ChevronLeft, FileCheck, Users } from 'lucide-react'

interface LiveSession {
  id: string
  title: string
  formation_id: string
}

interface Inscription {
  user_id: string
  user?: { id: string; prenom: string; nom: string }
}

export default function ProfessorPresencesPage() {
  const params = useParams()
  const liveSessionId = params.id as string
  const [session, setSession] = useState<LiveSession | null>(null)
  const [etudiants, setEtudiants] = useState<{ id: string; prenom: string; nom: string }[]>([])
  const [presences, setPresences] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const sessionRes = await apiClient<LiveSession>(`/directs/${liveSessionId}`)
        const sessionData = sessionRes.data
        setSession(sessionData ?? null)

        if (sessionData) {
          const [inscriptionsRes, presencesExistantes] = await Promise.all([
            apiClient<Inscription[]>(`/inscriptions?formation_id=${sessionData.formation_id}`),
            presenceService.getForSession(liveSessionId),
          ])

          const actifs = (inscriptionsRes.data || []).filter((i: any) => i.statut === 'actif' && i.user)
          setEtudiants(actifs.map((i) => ({ id: i.user!.id, prenom: i.user!.prenom, nom: i.user!.nom })))

          const initial: Record<string, boolean> = {}
          presencesExistantes.forEach((p) => {
            initial[p.user_id] = p.present
          })
          setPresences(initial)
        }
      } catch (err) {
        console.error('[presences] Erreur de chargement:', err)
      }
      setLoading(false)
    }
    load()
  }, [liveSessionId])

  async function handleSave() {
    setSaving(true)
    try {
      await presenceService.marquer(
        liveSessionId,
        etudiants.map((e) => ({ user_id: e.id, present: !!presences[e.id] })),
      )
      alertSuccess('Présences enregistrées avec succès.')
    } catch (err: any) {
      alertError(err?.message || 'Erreur lors de l\'enregistrement')
    }
    setSaving(false)
  }

  async function handleGenererAttestations() {
    setGenerating(true)
    try {
      await presenceService.genererAttestations(liveSessionId)
      alertSuccess('Attestations générées et envoyées avec succès.')
    } catch (err: any) {
      alertError(err?.message || 'Erreur lors de la génération')
    }
    setGenerating(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title={session?.title || 'Présences'} subtitle="Marque les présences et génère les attestations" />

        <div className="p-4 md:p-8 space-y-4">
          <Link
            href="/dashboard/professor/live-sessions"
            className="inline-flex items-center gap-1.5 text-sm text-[rgba(255,255,255,0.5)] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour aux sessions live
          </Link>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : etudiants.length === 0 ? (
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="py-12 text-center">
                <Users className="w-10 h-10 text-[rgba(255,255,255,0.2)] mx-auto mb-3" />
                <p className="text-[rgba(255,255,255,0.5)]">Aucun étudiant inscrit à cette formation.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                <CardContent className="p-0">
                  {etudiants.map((e) => (
                    <label
                      key={e.id}
                      className="flex items-center gap-3 p-4 border-b border-[rgba(255,255,255,0.05)] last:border-0 cursor-pointer hover:bg-[rgba(255,255,255,0.02)]"
                    >
                      <Checkbox
                        checked={!!presences[e.id]}
                        onCheckedChange={(checked) => setPresences((prev) => ({ ...prev, [e.id]: !!checked }))}
                      />
                      <span className="text-white text-sm">{e.prenom} {e.nom}</span>
                    </label>
                  ))}
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button onClick={handleSave} disabled={saving} className="bg-[#C9A227] hover:bg-[#B8860B]">
                  {saving ? 'Enregistrement...' : 'Enregistrer les présences'}
                </Button>
                <Button onClick={handleGenererAttestations} disabled={generating} variant="outline" className="border-[rgba(255,255,255,0.2)] text-white">
                  <FileCheck className="w-4 h-4 mr-2" />
                  {generating ? 'Génération...' : 'Générer les attestations'}
                </Button>
              </div>
              <p className="text-[rgba(255,255,255,0.4)] text-xs">
                Enregistre d&apos;abord les présences, puis génère les attestations pour tous les étudiants marqués présents.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
