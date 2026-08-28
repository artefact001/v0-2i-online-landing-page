'use client'

import { useEffect, useState } from 'react'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { candidatureService, type Candidature } from '@/lib/candidature-service'
import { Card, CardContent } from '@/components/ui/card'
import { Briefcase } from 'lucide-react'

const statutLabel: Record<Candidature['statut'], string> = {
  envoyee: 'Envoyée',
  vue: 'Vue par le recruteur',
  acceptee: 'Acceptée',
  refusee: 'Refusée',
}

const statutStyle: Record<Candidature['statut'], string> = {
  envoyee: 'bg-blue-500/20 text-blue-400',
  vue: 'bg-amber-500/20 text-amber-400',
  acceptee: 'bg-green-500/20 text-green-400',
  refusee: 'bg-red-500/20 text-red-400',
}

export default function StudentCandidaturesPage() {
  const [candidatures, setCandidatures] = useState<Candidature[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    candidatureService.getMesCandidatures().then((c) => {
      setCandidatures(c)
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Mes candidatures" subtitle="Suivi de tes candidatures aux opportunités" />

        <div className="p-4 md:p-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : candidatures.length === 0 ? (
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="py-12 text-center">
                <Briefcase className="w-10 h-10 text-[rgba(255,255,255,0.2)] mx-auto mb-3" />
                <p className="text-[rgba(255,255,255,0.5)]">Tu n&apos;as encore postulé à aucune opportunité.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {candidatures.map((c) => (
                <Card key={c.id} className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-white font-medium">{c.opportunite?.titre}</p>
                      <p className="text-[rgba(255,255,255,0.4)] text-xs mt-1">
                        Envoyée le {new Date(c.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full shrink-0 ${statutStyle[c.statut]}`}>
                      {statutLabel[c.statut]}
                    </span>
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
