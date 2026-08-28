'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { useAuth } from '@/lib/auth-context'
import { partnerService, type PartnerStats, type FinancedFormation } from '@/lib/partner-service'
import { Card, CardContent } from '@/components/ui/card'
import { GraduationCap, Users, TrendingUp, Award, ChevronRight, HandCoins } from 'lucide-react'

export default function PartnerDashboard() {
  const { user } = useAuth()
  const displayName = user?.first_name || user?.name || 'Partenaire'
  const [stats, setStats] = useState<PartnerStats | null>(null)
  const [formations, setFormations] = useState<FinancedFormation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [statsData, formationsData] = await Promise.all([
        partnerService.getStats(),
        partnerService.getFinancedFormations(),
      ])
      setStats(statsData)
      setFormations(formationsData)
      setLoading(false)
    }
    load()
  }, [])

  const statCards = stats
    ? [
        { label: 'Formations financées', value: stats.totalFormationsFinancees, icon: GraduationCap },
        { label: 'Étudiants actifs', value: stats.totalEtudiants, icon: Users },
        { label: 'Taux de réussite', value: `${stats.tauxReussite}%`, icon: TrendingUp },
        { label: 'Certificats délivrés', value: stats.certificatsDelivres, icon: Award },
      ]
    : []

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title={`Bonjour, ${displayName}`} subtitle="Suivez l'impact de votre financement" />

        <div className="p-4 md:p-8 space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : !stats || stats.totalFormationsFinancees === 0 ? (
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="p-10 text-center">
                <HandCoins className="w-12 h-12 text-[rgba(255,255,255,0.2)] mx-auto mb-4" />
                <h3 className="text-white font-serif text-xl mb-2">Aucun financement pour le moment</h3>
                <p className="text-[rgba(255,255,255,0.5)] text-sm">
                  Contacte l&apos;équipe 2I Online pour associer ton organisation à une formation.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Montant total investi — le chiffre le plus important pour un partenaire */}
              <Card className="bg-gradient-to-r from-[#0d0d1a] to-[#C9A227]/10 border-[#C9A227]/30">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#C9A227]/20 flex items-center justify-center shrink-0">
                    <HandCoins className="w-6 h-6 text-[#C9A227]" />
                  </div>
                  <div>
                    <p className="text-[rgba(255,255,255,0.5)] text-xs uppercase tracking-wider mb-1">
                      Montant total investi
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {(stats.totalInvesti ?? 0).toLocaleString()} FCFA
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Compteurs clés */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                  <Card key={stat.label} className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                    <CardContent className="p-5">
                      <stat.icon className="w-6 h-6 text-[#C9A227] mb-3" />
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-[rgba(255,255,255,0.5)] text-xs">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Formations financées */}
              <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#C9A227]" />
                      Vos formations financées
                    </h3>
                    <Link href="/dashboard/partner/formations" className="text-xs text-[#C9A227] hover:underline flex items-center gap-0.5">
                      Voir tout <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {formations.slice(0, 5).map((f) => (
                      <Link
                        key={f.id}
                        href={`/dashboard/partner/formations/${f.id}`}
                        className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] hover:border-[#C9A227]/30 transition-colors"
                      >
                        <div>
                          <p className="text-white font-medium">{f.titre}</p>
                          <p className="text-[rgba(255,255,255,0.4)] text-xs">
                            {f.inscriptions_count ?? 0} inscrit{(f.inscriptions_count ?? 0) !== 1 ? 's' : ''} · financé le{' '}
                            {new Date(f.pivot.date_financement).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <span className="text-[#C9A227] font-semibold text-sm shrink-0">
                          {Number(f.pivot.montant_finance).toLocaleString()} FCFA
                        </span>
                      </Link>
                    ))}
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
