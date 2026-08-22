"use client"

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api/client'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Radio, User } from 'lucide-react'

interface LiveSession {
  id: string
  title: string
  scheduled_at: string
  duration_minutes: number
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
  formation?: { titre: string }
  user?: { prenom: string; nom: string }
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

export default function AdminLiveSessionsPage() {
  const [sessions, setSessions] = useState<LiveSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient<LiveSession[]>('/directs')
        const list = res.data || []
        list.sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
        setSessions(list)
      } catch (err) {
        console.error('[admin/live-sessions] Erreur de chargement:', err)
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Sessions Live" subtitle="Supervisez toutes les sessions en direct de la plateforme" />

        <div className="p-4 md:p-8 space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : sessions.length === 0 ? (
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="py-12 text-center">
                <Radio className="w-10 h-10 text-[rgba(255,255,255,0.2)] mx-auto mb-3" />
                <p className="text-[rgba(255,255,255,0.5)]">Aucune session live sur la plateforme pour le moment.</p>
              </CardContent>
            </Card>
          ) : (
            sessions.map((s) => (
              <Card key={s.id} className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                <CardContent className="py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-white font-medium truncate">{s.title}</h3>
                    <p className="text-[rgba(255,255,255,0.4)] text-xs flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(s.scheduled_at).toLocaleString('fr-FR')}
                      </span>
                      {s.formation && <span>{s.formation.titre}</span>}
                      {s.user && (
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {s.user.prenom} {s.user.nom}
                        </span>
                      )}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${statutStyle[s.status]}`}>
                    {statutLabel[s.status]}
                  </span>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
