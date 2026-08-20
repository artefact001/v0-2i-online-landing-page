"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { useAuth } from '@/lib/auth-context'
import { apiClient } from '@/lib/api/client'
import { progressService } from '@/lib/progress-service'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Enrollment {
  id: string
  formation_id: string
  formations?: { titre: string }
}

export default function StudentCoursesPage() {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [progressByFormation, setProgressByFormation] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!user) return
      try {
        const res = await apiClient<Enrollment[]>(`/inscriptions?user_id=${user.id}&status=active`)
        const list = res.data || []
        setEnrollments(list)

        const entries = await Promise.all(
          list.map(async (e) => {
            const p = await progressService.getFormationProgress(user.id, e.formation_id)
            return [e.formation_id, p?.completion_percentage ?? 0] as const
          }),
        )
        setProgressByFormation(Object.fromEntries(entries))
      } catch (err) {
        console.error('[student/courses] Erreur de chargement:', err)
      }
      setLoading(false)
    }
    load()
  }, [user])

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="ml-64">
        <DashboardHeader title="Mes Cours" subtitle="Accède à tes formations" />

        <div className="p-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : enrollments.length === 0 ? (
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="py-12 text-center">
                <p className="text-[rgba(255,255,255,0.5)] mb-4">Aucune formation active pour le moment.</p>
                <Link href="/#formations">
                  <Button className="bg-[#C9A227] hover:bg-[#B8860B]">Voir les formations</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {enrollments.map((e) => {
                const progress = progressByFormation[e.formation_id] ?? 0
                return (
                  <Card key={e.id} className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                    <CardContent className="p-6">
                      <h3 className="text-white font-serif text-lg mb-3">{e.formations?.titre || 'Formation'}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-1.5 flex-1 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                          <div className="h-full bg-[#C9A227] rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-[#C9A227] text-xs">{progress}%</span>
                      </div>
                      <Link href={`/cours/${e.formation_id}`}>
                        <Button className="w-full bg-[#C9A227] hover:bg-[#B8860B]">
                          {progress > 0 ? 'Continuer' : 'Commencer'}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
