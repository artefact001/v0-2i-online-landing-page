"use client"

import { useEffect, useState } from 'react'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { useAuth } from '@/lib/auth-context'
import { apiClient } from '@/lib/api/client'
import { progressService, type FormationProgress } from '@/lib/progress-service'
import { Card, CardContent } from '@/components/ui/card'

interface Enrollment {
  id: string
  formation_id: string
  formations?: { name: string }
}

export default function StudentProgressPage() {
  const { user } = useAuth()
  const [rows, setRows] = useState<{ name: string; progress: FormationProgress | null }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!user) return
      try {
        const res = await apiClient<Enrollment[]>(`/inscriptions?user_id=${user.id}&status=active`)
        const list = res.data || []

        const data = await Promise.all(
          list.map(async (e) => ({
            name: e.formations?.name || 'Formation',
            progress: await progressService.getFormationProgress(user.id, e.formation_id),
          })),
        )
        setRows(data)
      } catch (err) {
        console.error('[student/progress] Erreur de chargement:', err)
      }
      setLoading(false)
    }
    load()
  }, [user])

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Ma Progression" subtitle="Suis ton avancement en détail" />

        <div className="p-4 md:p-8 space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : rows.length === 0 ? (
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="py-12 text-center">
                <p className="text-[rgba(255,255,255,0.5)]">Aucune formation active pour le moment.</p>
              </CardContent>
            </Card>
          ) : (
            rows.map((row, i) => (
              <Card key={i} className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-serif text-lg">{row.name}</h3>
                    <span className="text-[#C9A227] font-semibold">
                      {row.progress?.completion_percentage ?? 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-[#C9A227] rounded-full"
                      style={{ width: `${row.progress?.completion_percentage ?? 0}%` }}
                    />
                  </div>
                  <p className="text-[rgba(255,255,255,0.5)] text-sm">
                    {row.progress?.completed_lessons ?? 0} / {row.progress?.total_lessons ?? 0} leçons terminées
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
