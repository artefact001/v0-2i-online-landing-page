"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/api/client'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { GraduationCap, Users, ClipboardList, CreditCard } from 'lucide-react'

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    formations: 0,
    professors: 0,
    students: 0,
    inscriptions: 0,
    revenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [formationsRes, formateursRes, etudiantsRes, inscriptionsRes, paiementsRes] = await Promise.all([
          apiClient<any[]>('/formations'),
          apiClient<any[]>('/formateurs'),
          apiClient<any[]>('/etudiants'),
          apiClient<any[]>('/inscriptions'),
          apiClient<any[]>('/paiements'),
        ])

        const paiements = paiementsRes.data || []
        const revenue = paiements
          .filter((p: any) => p.status === 'completed')
          .reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0)

        setCounts({
          formations: (formationsRes.data || []).length,
          professors: (formateursRes.data || []).length,
          students: (etudiantsRes.data || []).length,
          inscriptions: (inscriptionsRes.data || []).length,
          revenue,
        })
      } catch (err) {
        console.error('[admin/dashboard] Erreur de chargement:', err)
      }
      setLoading(false)
    }
    load()
  }, [])

  const stats = [
    { label: 'Formations', value: counts.formations, icon: GraduationCap, href: '/dashboard/admin/formations' },
    { label: 'Professeurs', value: counts.professors, icon: Users, href: '/dashboard/admin/users' },
    { label: 'Élèves', value: counts.students, icon: Users, href: '/dashboard/admin/users' },
    { label: 'Inscriptions', value: counts.inscriptions, icon: ClipboardList, href: '/dashboard/admin/users' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="ml-64">
        <DashboardHeader title="Tableau de bord" subtitle="Vue d'ensemble de la plateforme" />

        <div className="p-8 space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : (
            <>
              <Card className="bg-gradient-to-r from-[#0d0d1a] to-[#C9A227]/10 border-[#C9A227]/30">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#C9A227]/20 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-[#C9A227]" />
                  </div>
                  <div>
                    <p className="text-[rgba(255,255,255,0.5)] text-xs uppercase tracking-wider mb-1">
                      Revenu total (paiements complétés)
                    </p>
                    <p className="text-3xl font-bold text-white">{counts.revenue.toLocaleString()} FCFA</p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <Link key={stat.label} href={stat.href}>
                    <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)] hover:border-[#C9A227]/30 transition-colors">
                      <CardContent className="p-5">
                        <stat.icon className="w-6 h-6 text-[#C9A227] mb-3" />
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-[rgba(255,255,255,0.5)] text-xs">{stat.label}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
