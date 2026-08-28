'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { candidatureService, type Candidature } from '@/lib/candidature-service'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { alertSuccess, alertError } from '@/lib/alerts'
import { ChevronLeft, Briefcase } from 'lucide-react'

const statutOptions: Candidature['statut'][] = ['envoyee', 'vue', 'acceptee', 'refusee']

const statutLabel: Record<Candidature['statut'], string> = {
  envoyee: 'Envoyée',
  vue: 'Vue',
  acceptee: 'Acceptée',
  refusee: 'Refusée',
}

const statutStyle: Record<Candidature['statut'], string> = {
  envoyee: 'bg-blue-500/20 text-blue-400',
  vue: 'bg-amber-500/20 text-amber-400',
  acceptee: 'bg-green-500/20 text-green-400',
  refusee: 'bg-red-500/20 text-red-400',
}

export default function AdminCandidaturesPage() {
  const params = useParams()
  const opportuniteId = params.id as string
  const [candidatures, setCandidatures] = useState<Candidature[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const data = await candidatureService.getCandidaturesFor(opportuniteId)
    setCandidatures(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [opportuniteId])

  async function handleUpdateStatut(id: string, statut: Candidature['statut']) {
    try {
      await candidatureService.updateStatut(id, statut)
      await load()
      alertSuccess('Statut mis à jour avec succès.')
    } catch (err: any) {
      alertError(err?.message || 'Erreur')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Candidatures reçues" subtitle="Gérer les candidatures pour cette opportunité" />

        <div className="p-4 md:p-8 space-y-4">
          <Link
            href="/dashboard/admin/opportunites"
            className="inline-flex items-center gap-1.5 text-sm text-[rgba(255,255,255,0.5)] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour aux opportunités
          </Link>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : candidatures.length === 0 ? (
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="py-12 text-center">
                <Briefcase className="w-10 h-10 text-[rgba(255,255,255,0.2)] mx-auto mb-3" />
                <p className="text-[rgba(255,255,255,0.5)]">Aucune candidature reçue pour le moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {candidatures.map((c) => (
                <Card key={c.id} className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="text-white font-medium">{c.user?.prenom} {c.user?.nom}</p>
                        <p className="text-[rgba(255,255,255,0.4)] text-xs">{c.user?.email}</p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full shrink-0 ${statutStyle[c.statut]}`}>
                        {statutLabel[c.statut]}
                      </span>
                    </div>
                    {c.message && <p className="text-[rgba(255,255,255,0.6)] text-sm mb-3">{c.message}</p>}
                    <div className="flex gap-2 flex-wrap">
                      {statutOptions.filter((s) => s !== c.statut).map((s) => (
                        <Button
                          key={s}
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatut(c.id, s)}
                          className="border-[rgba(255,255,255,0.15)] text-white hover:bg-[rgba(255,255,255,0.05)] text-xs"
                        >
                          Marquer {statutLabel[s].toLowerCase()}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
