'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { partnerService, type FinancedFormation } from '@/lib/partner-service'
import { Card, CardContent } from '@/components/ui/card'
import { GraduationCap, Users, Calendar, ChevronRight } from 'lucide-react'

export default function PartnerFormationsPage() {
  const [formations, setFormations] = useState<FinancedFormation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await partnerService.getFinancedFormations()
      setFormations(data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Formations financées" subtitle="Toutes les formations que vous soutenez" />

        <div className="p-4 md:p-8 space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : formations.length === 0 ? (
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="py-12 text-center">
                <GraduationCap className="w-10 h-10 text-[rgba(255,255,255,0.2)] mx-auto mb-3" />
                <p className="text-[rgba(255,255,255,0.5)]">Aucune formation financée pour le moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formations.map((f) => (
                <Link key={f.id} href={`/dashboard/partner/formations/${f.id}`}>
                  <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)] hover:border-[#C9A227]/30 transition-colors h-full">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-white font-semibold">{f.titre}</h3>
                        <ChevronRight className="w-4 h-4 text-[rgba(255,255,255,0.3)] shrink-0 mt-1" />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[rgba(255,255,255,0.5)] mb-4">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {f.inscriptions_count ?? 0} inscrit{(f.inscriptions_count ?? 0) !== 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(f.pivot.date_financement).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="pt-3 border-t border-[rgba(255,255,255,0.06)]">
                        <span className="text-[9px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider">
                          Montant financé
                        </span>
                        <p className="text-xl font-bold text-[#C9A227]">
                          {Number(f.pivot.montant_finance).toLocaleString()} FCFA
                        </p>
                      </div>
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
