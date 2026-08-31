"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/api/client'
import { analyticsService, type AnalyticsData, type FormationAnalytics } from '@/lib/analytics-service'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import {
  GraduationCap,
  Users,
  ClipboardList,
  CreditCard,
  TrendingUp,
  Award,
  Newspaper,
  Briefcase,
  ChevronRight,
  Radio,
  FileCheck,
} from 'lucide-react'

interface Actu {
  id: string
  titre: string
  type: string
  date_publication: string
}

interface Opportunite {
  id: string
  titre: string
  type: string
  date_fin: string
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [topFormations, setTopFormations] = useState<FormationAnalytics[]>([])
  const [recentActus, setRecentActus] = useState<Actu[]>([])
  const [recentOpportunites, setRecentOpportunites] = useState<Opportunite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [adminAnalytics, formationsAnalytics, actusRes, oppoRes] = await Promise.all([
          analyticsService.getAdminAnalytics(),
          analyticsService.getAllFormationsAnalytics(),
          apiClient<Actu[]>('/actus'),
          apiClient<Opportunite[]>('/opportunites'),
        ])

        setAnalytics(adminAnalytics)
        setTopFormations(
          [...formationsAnalytics].sort((a, b) => b.enrolledStudents - a.enrolledStudents).slice(0, 4),
        )
        setRecentActus((actusRes.data || []).slice(0, 4))
        setRecentOpportunites((oppoRes.data || []).filter((o: any) => o.statut === 'ouvert').slice(0, 4))
      } catch (err) {
        console.error('[admin/dashboard] Erreur de chargement:', err)
      }
      setLoading(false)
    }
    load()
  }, [])

  const stats = analytics
    ? [
        { label: 'Étudiants', value: analytics.totalStudents, icon: GraduationCap, href: '/dashboard/admin/users' },
        { label: 'Inscriptions', value: analytics.totalEnrollments, icon: ClipboardList, href: '/dashboard/admin/users' },
        { label: 'Comptes actifs', value: analytics.activeUsers, icon: Users, href: '/dashboard/admin/users' },
        { label: 'Taux de réussite', value: `${analytics.completionRate}%`, icon: Award, href: '/dashboard/admin/analytics' },
      ]
    : []

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Tableau de bord" subtitle="Vue d'ensemble de la plateforme" />

        <div className="p-4 md:p-8 space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : (
            <>
              {/* Revenu — le chiffre le plus important pour un admin */}
              <Card className="bg-gradient-to-r from-[#0d0d1a] to-[#C9A227]/10 border-[#C9A227]/30">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#C9A227]/20 flex items-center justify-center shrink-0">
                    <CreditCard className="w-6 h-6 text-[#C9A227]" />
                  </div>
                  <div>
                    <p className="text-[rgba(255,255,255,0.5)] text-xs uppercase tracking-wider mb-1">
                      Revenu total (paiements confirmés)
                    </p>
                    <p className="text-3xl font-bold text-white">{(analytics?.totalRevenue ?? 0).toLocaleString()} FCFA</p>
                  </div>
                </CardContent>
              </Card>

              {/* Compteurs clés */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                  { label: 'Sessions Live', icon: Radio, href: '/dashboard/admin/live-sessions' },
                  { label: 'Examens finaux', icon: FileCheck, href: '/dashboard/admin/exams' },
                  { label: 'Actualités', icon: Newspaper, href: '/dashboard/admin/actus' },
                  { label: 'Opportunités', icon: Briefcase, href: '/dashboard/admin/opportunites' },
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
                {/* Formations les plus populaires */}
                <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#C9A227]" />
                        Formations populaires
                      </h3>
                      <Link href="/dashboard/admin/formations" className="text-xs text-[#C9A227] hover:underline flex items-center gap-0.5">
                        Voir tout <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {topFormations.map((f) => (
                        <div key={f.formationId} className="flex items-center justify-between text-sm">
                          <span className="text-[rgba(255,255,255,0.8)] truncate">{f.name}</span>
                          <span className="text-[#C9A227] font-medium shrink-0 ml-2">{f.enrolledStudents} inscrits</span>
                        </div>
                      ))}
                      {topFormations.length === 0 && (
                        <p className="text-[rgba(255,255,255,0.4)] text-sm">Aucune formation pour le moment.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Actualités récentes */}
                <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        <Newspaper className="w-4 h-4 text-[#C9A227]" />
                        Actualités récentes
                      </h3>
                      <Link href="/dashboard/admin/actus" className="text-xs text-[#C9A227] hover:underline flex items-center gap-0.5">
                        Voir tout <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {recentActus.map((a) => (
                        <Link
                          key={a.id}
                          href="/dashboard/admin/actus"
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
              </div>

              {/* Opportunités ouvertes */}
              <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#C9A227]" />
                      Opportunités ouvertes
                    </h3>
                    <Link href="/dashboard/admin/opportunites" className="text-xs text-[#C9A227] hover:underline flex items-center gap-0.5">
                      Voir tout <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recentOpportunites.map((o) => (
                      <Link
                        key={o.id}
                        href="/dashboard/admin/opportunites"
                        className="flex items-center justify-between text-sm bg-[rgba(255,255,255,0.03)] rounded-lg px-3 py-2.5 hover:bg-[rgba(255,255,255,0.06)] transition-colors"
                      >
                        <span className="text-[rgba(255,255,255,0.8)] truncate">{o.titre}</span>
                        <span className="text-[rgba(255,255,255,0.4)] text-xs shrink-0 ml-2">
                          {new Date(o.date_fin).toLocaleDateString('fr-FR')}
                        </span>
                      </Link>
                    ))}
                    {recentOpportunites.length === 0 && (
                      <p className="text-[rgba(255,255,255,0.4)] text-sm">Aucune opportunité ouverte.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
