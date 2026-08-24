'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { useAuth } from '@/lib/auth-context'
import { apiClient } from '@/lib/api/client'
import { Card, CardContent } from '@/components/ui/card'
import {
  GraduationCap,
  Layers,
  Users,
  BookOpen,
  FileCheck,
  Radio,
  ChevronRight,
  Calendar,
} from 'lucide-react'

interface Formation {
  id: string
  titre: string
}

interface LiveSession {
  id: string
  title: string
  scheduled_at: string
  formation_id: string
  formation?: { titre: string }
}

export default function ProfessorDashboard() {
  const { user } = useAuth()
  const displayName = user?.first_name || user?.name || 'Professeur'
  const [counts, setCounts] = useState({ formations: 0, modules: 0, lessons: 0, exams: 0, students: 0 })
  const [formations, setFormations] = useState<Formation[]>([])
  const [upcomingSessions, setUpcomingSessions] = useState<LiveSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!user) return
      try {
        const formationsRes = await apiClient<Formation[]>(`/formations?user_id=${user.id}`)
        const myFormations = formationsRes.data || []
        setFormations(myFormations)

        const [modulesResults, examensRes, directsRes] = await Promise.all([
          Promise.all(myFormations.map((f) => apiClient<any[]>(`/modules?formation_id=${f.id}`).catch(() => null))),
          apiClient<any[]>('/examens').catch(() => ({ data: [] })),
          apiClient<LiveSession[]>('/directs').catch(() => ({ data: [] })),
        ])

        const modules = modulesResults.flatMap((r) => r?.data || [])
        const leconsResults = await Promise.all(
          modules.map((m: any) => apiClient<any[]>(`/lecons?module_id=${m.id}`).catch(() => null)),
        )
        const lessonCount = leconsResults.reduce((sum, r) => sum + (r?.data?.length || 0), 0)

        // Le vrai champ de statut est "statut" (pas "status"), valeur
        // "actif" (pas "active") — comptage correct des élèves actifs.
        const inscriptionsResults = await Promise.all(
          myFormations.map((f) => apiClient<any[]>(`/inscriptions?formation_id=${f.id}`).catch(() => null)),
        )
        const studentCount = inscriptionsResults.reduce(
          (sum, r) => sum + (r?.data || []).filter((i: any) => i.statut === 'actif').length,
          0,
        )

        const myFormationIds = new Set(myFormations.map((f) => f.id))
        const myExams = (examensRes.data || []).filter((e: any) => myFormationIds.has(e.formation_id))
        const mySessions = (directsRes.data || [])
          .filter((s: any) => myFormationIds.has(s.formation_id) && new Date(s.scheduled_at) > new Date())
          .sort((a: any, b: any) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
          .slice(0, 3)

        setUpcomingSessions(mySessions)
        setCounts({
          formations: myFormations.length,
          modules: modules.length,
          lessons: lessonCount,
          exams: myExams.length,
          students: studentCount,
        })
      } catch (err) {
        console.error('[professor/dashboard] Erreur de chargement:', err)
      }
      setLoading(false)
    }
    load()
  }, [user])

  const stats = [
    { label: 'Mes formations', value: counts.formations, icon: GraduationCap, href: '/dashboard/professor/courses' },
    { label: 'Élèves actifs', value: counts.students, icon: Users, href: '/dashboard/professor/students' },
    { label: 'Modules', value: counts.modules, icon: Layers, href: '/dashboard/professor/modules' },
    { label: 'Leçons', value: counts.lessons, icon: BookOpen, href: '/dashboard/professor/lessons' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title={`Bonjour, ${displayName}`} subtitle="Vue d'ensemble de vos formations" />

        <div className="p-4 md:p-8 space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <Link key={stat.label} href={stat.href}>
                    <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)] hover:border-[#C9A227]/30 transition-colors h-full">
                      <CardContent className="p-5">
                        <stat.icon className="w-6 h-6 text-[#C9A227] mb-3" />
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-[rgba(255,255,255,0.5)] text-xs">{stat.label}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Accès rapides */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Exercices', icon: FileCheck, href: '/dashboard/professor/exercises' },
                  { label: 'Examens', icon: FileCheck, href: '/dashboard/professor/exams' },
                  { label: 'Sessions Live', icon: Radio, href: '/dashboard/professor/live-sessions' },
                  { label: 'Mes élèves', icon: Users, href: '/dashboard/professor/students' },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-2 bg-[#0d0d1a] border border-[rgba(255,255,255,0.05)] hover:border-[#C9A227]/30 rounded-xl px-4 py-3 text-sm text-[rgba(255,255,255,0.7)] hover:text-white transition-colors"
                  >
                    <link.icon className="w-4 h-4 text-[#C9A227] shrink-0" />
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mes formations */}
                <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-[#C9A227]" />
                        Mes formations
                      </h3>
                      <Link href="/dashboard/professor/courses" className="text-xs text-[#C9A227] hover:underline flex items-center gap-0.5">
                        Voir tout <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="space-y-2">
                      {formations.slice(0, 5).map((f) => (
                        <Link
                          key={f.id}
                          href="/dashboard/professor/modules"
                          className="block text-sm text-[rgba(255,255,255,0.8)] hover:text-[#C9A227] truncate transition-colors"
                        >
                          {f.titre}
                        </Link>
                      ))}
                      {formations.length === 0 && (
                        <p className="text-[rgba(255,255,255,0.4)] text-sm">
                          Aucune formation ne t&apos;est encore assignée.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Prochaines sessions live */}
                <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        <Radio className="w-4 h-4 text-[#C9A227]" />
                        Prochaines sessions live
                      </h3>
                      <Link href="/dashboard/professor/live-sessions" className="text-xs text-[#C9A227] hover:underline flex items-center gap-0.5">
                        Voir tout <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {upcomingSessions.map((s) => (
                        <div key={s.id} className="flex items-center justify-between text-sm">
                          <span className="text-[rgba(255,255,255,0.8)] truncate">{s.title}</span>
                          <span className="text-[rgba(255,255,255,0.4)] text-xs flex items-center gap-1 shrink-0 ml-2">
                            <Calendar className="w-3 h-3" />
                            {new Date(s.scheduled_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      ))}
                      {upcomingSessions.length === 0 && (
                        <p className="text-[rgba(255,255,255,0.4)] text-sm">Aucune session live programmée.</p>
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
