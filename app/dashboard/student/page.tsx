"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { useAuth } from '@/lib/auth-context'
import { apiClient } from '@/lib/api/client'
import { progressService } from '@/lib/progress-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Newspaper, Briefcase, ChevronRight, Award } from 'lucide-react'

interface Enrollment {
  id: string
  formation_id: string
  statut: string
  formation?: { id: string; titre: string }
}

interface LiveSession {
  id: string
  title: string
  formation_id: string
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
}

interface Actu {
  id: string
  titre: string
}

interface Opportunite {
  id: string
  titre: string
  type: string
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [progressByFormation, setProgressByFormation] = useState<Record<string, number>>({})
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([])
  const [recentActus, setRecentActus] = useState<Actu[]>([])
  const [recentOpportunites, setRecentOpportunites] = useState<Opportunite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!user) return
      setLoading(true)
      try {
        // Le vrai champ de statut est "statut" (pas "status"), valeur
        // "actif" (pas "active") — GET /inscriptions ignore silencieusement
        // les paramètres inconnus, donc filtrage réel côté client.
        const res = await apiClient<Enrollment[]>(`/inscriptions?user_id=${user.id}`)
        const list = (res.data || []).filter((e) => e.statut === 'actif')
        setEnrollments(list)

        const progressEntries = await Promise.all(
          list.map(async (e) => {
            const p = await progressService.getFormationProgress(user.id, e.formation_id)
            return [e.formation_id, p?.completion_percentage ?? 0] as const
          }),
        )
        setProgressByFormation(Object.fromEntries(progressEntries))

        if (list.length > 0) {
          const liveResults = await Promise.all(
            list.map((e) => apiClient<LiveSession[]>(`/directs?formation_id=${e.formation_id}`).catch(() => null)),
          )
          const upcoming = liveResults
            .flatMap((r) => r?.data || [])
            .filter((s) => s.status === 'live' || s.status === 'scheduled')
          setLiveSessions(upcoming)
        }

        const [actusRes, oppoRes] = await Promise.all([
          apiClient<Actu[]>('/actus').catch(() => ({ data: [] })),
          apiClient<Opportunite[]>('/opportunites').catch(() => ({ data: [] })),
        ])
        setRecentActus(((actusRes.data || []) as any[]).filter((a) => a.statut === 'publie').slice(0, 3))
        setRecentOpportunites(((oppoRes.data || []) as any[]).filter((o) => o.statut === 'ouvert').slice(0, 3))
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

      <main className="lg:ml-64">
        <DashboardHeader title={`Bonjour, ${displayName}`} subtitle="Continuez votre apprentissage" />

        <div className="p-4 md:p-8 space-y-8">
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
                      const formationName = enrollment.formation?.titre || 'Formation'

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
                          <Link href={`/cours/${enrollment.formation_id}`}>
                            <Button size="sm" className="bg-[#C9A227] hover:bg-[#B8860B]">
                              {progress > 0 ? 'Continuer' : 'Commencer'}
                            </Button>
                          </Link>
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
                          <Link
                            key={session.id}
                            href={`/cours/${session.formation_id}/direct/${session.id}`}
                            className="block p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] hover:border-[#C9A227]/30 transition-colors"
                          >
                            {session.status === 'live' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full mb-2">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                EN DIRECT
                              </span>
                            )}
                            <h4 className="text-white font-medium text-sm">{session.title}</h4>
                          </Link>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                    <CardContent className="pt-6">
                      <Link href="/dashboard/student/certificates">
                        <Button
                          variant="outline"
                          className="w-full border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.05)]"
                        >
                          <Award className="w-4 h-4 mr-2" />
                          Voir mes certificats
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Actualités récentes */}
                <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        <Newspaper className="w-4 h-4 text-[#C9A227]" />
                        Actualités
                      </h3>
                      <Link href="/actualites" className="text-xs text-[#C9A227] hover:underline flex items-center gap-0.5">
                        Voir tout <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {recentActus.map((a) => (
                        <Link
                          key={a.id}
                          href={`/actualites/${a.id}`}
                          className="block text-sm text-[rgba(255,255,255,0.8)] hover:text-[#C9A227] truncate transition-colors"
                        >
                          {a.titre}
                        </Link>
                      ))}
                      {recentActus.length === 0 && (
                        <p className="text-[rgba(255,255,255,0.4)] text-sm">Aucune actualité pour le moment.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Opportunités */}
                <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-[#C9A227]" />
                        Opportunités
                      </h3>
                      <Link href="/actualites" className="text-xs text-[#C9A227] hover:underline flex items-center gap-0.5">
                        Voir tout <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {recentOpportunites.map((o) => (
                        <Link
                          key={o.id}
                          href={`/opportunites/${o.id}`}
                          className="block text-sm text-[rgba(255,255,255,0.8)] hover:text-[#C9A227] truncate transition-colors"
                        >
                          {o.titre}
                        </Link>
                      ))}
                      {recentOpportunites.length === 0 && (
                        <p className="text-[rgba(255,255,255,0.4)] text-sm">Aucune opportunité ouverte pour le moment.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
