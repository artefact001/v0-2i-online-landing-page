"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/api/client'
import { useAuth } from '@/lib/auth-context'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Radio } from 'lucide-react'

interface LiveSession {
  id: string
  formation_id: string
  title: string
  scheduled_at: string
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
  formation?: { titre: string }
}

interface Inscription {
  formation_id: string
}

const statutLabel: Record<LiveSession['status'], string> = {
  scheduled: 'Programmée',
  live: 'En direct',
  completed: 'Terminée',
  cancelled: 'Annulée',
}

const statutStyle: Record<LiveSession['status'], string> = {
  scheduled: 'bg-blue-500/20 text-blue-400',
  live: 'bg-red-500/20 text-red-400 animate-pulse',
  completed: 'bg-gray-500/20 text-gray-400',
  cancelled: 'bg-amber-500/20 text-amber-400',
}

export default function StudentLivePage() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<LiveSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!user) return
      try {
        // On ne montre que les sessions des formations où l'étudiant est
        // inscrit — on récupère d'abord ses inscriptions, puis les
        // sessions live de chaque formation.
        const inscriptionsRes = await apiClient<Inscription[]>(`/inscriptions?user_id=${user.id}`)
        const formationIds = (inscriptionsRes.data || []).map((i) => i.formation_id)

        if (formationIds.length === 0) {
          setLoading(false)
          return
        }

        const results = await Promise.all(
          formationIds.map((id) => apiClient<LiveSession[]>(`/directs?formation_id=${id}`)),
        )
        const all = results.flatMap((r) => r.data || [])
        all.sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
        setSessions(all)
      } catch (err) {
        console.error('[student/live] Erreur de chargement:', err)
      }
      setLoading(false)
    }
    load()
  }, [user])

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Cours Live" subtitle="Tes sessions en direct et à venir" />

        <div className="p-4 md:p-8 space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : sessions.length === 0 ? (
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="py-12 text-center">
                <Radio className="w-10 h-10 text-[rgba(255,255,255,0.2)] mx-auto mb-3" />
                <p className="text-[rgba(255,255,255,0.5)]">
                  Aucune session live programmée pour tes formations pour le moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            sessions.map((s) => (
              <Link key={s.id} href={`/cours/${s.formation_id}/direct/${s.id}`}>
                <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)] hover:border-[rgba(201,162,39,0.3)] transition-colors">
                  <CardContent className="py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-white font-medium truncate">{s.title}</h3>
                      <p className="text-[rgba(255,255,255,0.4)] text-xs flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(s.scheduled_at).toLocaleString('fr-FR')}
                        </span>
                        {s.formation && <span>{s.formation.titre}</span>}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${statutStyle[s.status]}`}>
                      {statutLabel[s.status]}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
