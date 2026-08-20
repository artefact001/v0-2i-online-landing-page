"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { useAuth } from '@/lib/auth-context'
import { apiClient } from '@/lib/api/client'
import { progressService } from '@/lib/progress-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Enrollment {
  id: string
  formation_id: string
  status: string
  formations?: { id: string; name: string; slug: string }
}

interface LiveSession {
  id: string
  title: string
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [progressByFormation, setProgressByFormation] = useState<Record<string, number>>({})
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!user) return
      setLoading(true)
      try {
        // Route Laravel réelle: /v1/inscriptions?student_id=...&status=active
        const res = await apiClient<Enrollment[]>(`/inscriptions?student_id=${user.id}&status=active`)
        const list = res.data || []
        setEnrollments(list)

        // Progression réelle par formation (déjà connectée à /v1/progressions)
        const progressEntries = await Promise.all(
          list.map(async (e) => {
            const p = await progressService.getFormationProgress(user.id, e.formation_id)
            return [e.formation_id, p?.completion_percentage ?? 0] as const
          }),
        )
        setProgressByFormation(Object.fromEntries(progressEntries))

        // Sessions live à venir, toutes formations inscrites confondues
        if (list.length > 0) {
          const liveResults = await Promise.all(
            list.map((e) => apiClient<LiveSession[]>(`/directs?formation_id=${e.formation_id}`).catch(() => null)),
          )
          const upcoming = liveResults
            .flatMap((r) => r?.data || [])
            .filter((s) => s.status === 'live' || s.status === 'scheduled')
          setLiveSessions(upcoming)
        }
      } catch (error) {
        console.error('[dashboard/student] Erreur de chargement:', error)
      }
      setLoading(false)
    }
    load()
  }, [user])

  const displayName = user?.first_name || user?.name || 'Étudiant'
  const overallProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((sum, e) => sum + (progressByFormation[e.formation_id] ?? 0), 0) / enrollments.length,
        )
      : 0

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />

      <main className="ml-64">
        <DashboardHeader title={`Bonjour, ${displayName}`} subtitle="Continuez votre apprentissage" />

        <div className="p-8 space-y-8">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : enrollments.length === 0 ? (
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="p-10 text-center">
                <h3 className="text-white font-serif text-xl mb-2">Aucune formation active</h3>
                <p className="text-[rgba(255,255,255,0.5)] text-sm mb-6">
                  Tu n&apos;as pas encore d&apos;inscription active. Découvre nos formations pour commencer.
                </p>
                <Link href="/#formations">
                  <Button className="bg-[#C9A227] hover:bg-[#B8860B]">Voir les formations</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Progress Overview */}
              <Card className="bg-gradient-to-r from-[#0d0d1a] to-[#C9A227]/10 border-[#C9A227]/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                        <circle
                          cx="50" cy="50" r="45" fill="none" stroke="#C9A227" strokeWidth="8"
                          strokeDasharray={`${overallProgress * 2.83} 283`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{overallProgress}%</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-serif text-xl mb-1">Progression globale</h3>
                      <p className="text-[rgba(255,255,255,0.5)] text-sm">
                        {enrollments.length} formation{enrollments.length > 1 ? 's' : ''} active
                        {enrollments.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* My Formations */}
                <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)] lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-white font-serif">Mes formations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {enrollments.map((enrollment) => {
                      const progress = progressByFormation[enrollment.formation_id] ?? 0
                      const formationName = enrollment.formations?.name || 'Formation'
                      const formationSlug = enrollment.formations?.slug

                      return (
                        <div
                          key={enrollment.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]"
                        >
                          <div className="flex-1">
                            <h4 className="text-white font-medium mb-2">{formationName}</h4>
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-40 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#C9A227] rounded-full"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-[#C9A227] text-xs">{progress}%</span>
                            </div>
                          </div>
                          {formationSlug && (
                            <Link href={`/cours/${formationSlug}`}>
                              <Button size="sm" className="bg-[#C9A227] hover:bg-[#B8860B]">
                                {progress > 0 ? 'Continuer' : 'Commencer'}
                              </Button>
                            </Link>
                          )}
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Live Sessions */}
                  {liveSessions.length > 0 && (
                    <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                      <CardHeader>
                        <CardTitle className="text-white font-serif flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          Sessions Live
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {liveSessions.map((session) => (
                          <div
                            key={session.id}
                            className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]"
                          >
                            {session.status === 'live' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full mb-2">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                EN DIRECT
                              </span>
                            )}
                            <h4 className="text-white font-medium text-sm">{session.title}</h4>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                    <CardHeader>
                      <CardTitle className="text-white font-serif">Certificats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Link href="/dashboard/student/certificates">
                        <Button
                          variant="outline"
                          className="w-full border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.05)]"
                        >
                          Voir mes certificats
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
