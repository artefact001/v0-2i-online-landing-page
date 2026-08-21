"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { useAuth } from '@/lib/auth-context'
import { apiClient } from '@/lib/api/client'
import { Card, CardContent } from '@/components/ui/card'
import { GraduationCap, Layers, Users } from 'lucide-react'

export default function ProfessorDashboard() {
  const { user } = useAuth()
  const displayName = user?.first_name || user?.name || 'Professeur'
  const [counts, setCounts] = useState({ formations: 0, modules: 0, students: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!user) return
      try {
        // ATTENTION: pas d'équivalent Laravel de "professor_formations". On
        // suppose que /v1/formations accepte un filtre ?formateur_id=...
        const formationsRes = await apiClient<any[]>(`/formations?user_id=${user.id}`)
        const formations = formationsRes.data || []

        const modulesResults = await Promise.all(
          formations.map((f) => apiClient<any[]>(`/modules?formation_id=${f.id}`).catch(() => null)),
        )
        const moduleCount = modulesResults.reduce((sum, r) => sum + (r?.data?.length || 0), 0)

        const inscriptionsResults = await Promise.all(
          formations.map((f) =>
            apiClient<any[]>(`/inscriptions?formation_id=${f.id}&status=active`).catch(() => null),
          ),
        )
        const studentCount = inscriptionsResults.reduce((sum, r) => sum + (r?.data?.length || 0), 0)

        setCounts({ formations: formations.length, modules: moduleCount, students: studentCount })
      } catch (err) {
        console.error('[professor/dashboard] Erreur de chargement:', err)
      }
      setLoading(false)
    }
    load()
  }, [user])

  const stats = [
    { label: 'Mes formations', value: counts.formations, icon: GraduationCap, href: '/dashboard/professor/courses' },
    { label: 'Mes modules', value: counts.modules, icon: Layers, href: '/dashboard/professor/modules' },
    { label: 'Élèves actifs', value: counts.students, icon: Users, href: '/dashboard/professor/students' },
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat) => (
                <Link key={stat.label} href={stat.href}>
                  <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)] hover:border-[#C9A227]/30 transition-colors">
                    <CardContent className="p-6">
                      <stat.icon className="w-7 h-7 text-[#C9A227] mb-3" />
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                      <p className="text-[rgba(255,255,255,0.5)] text-sm">{stat.label}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
