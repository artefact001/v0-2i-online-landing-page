'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { partnerService, type FinancedStudent } from '@/lib/partner-service'
import { apiClient } from '@/lib/api/client'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, Users } from 'lucide-react'

interface Formation {
  id: string
  titre: string
}

export default function PartnerFormationDetailPage() {
  const params = useParams()
  const formationId = params.id as string
  const [formation, setFormation] = useState<Formation | null>(null)
  const [students, setStudents] = useState<FinancedStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [formationRes, studentsData] = await Promise.all([
          apiClient<Formation>(`/formations/${formationId}`),
          partnerService.getFormationStudents(formationId),
        ])
        setFormation(formationRes.data ?? null)
        setStudents(studentsData)
      } catch (err: any) {
        setError(err?.message || 'Vous ne financez pas cette formation.')
      }
      setLoading(false)
    }
    load()
  }, [formationId])

  const averageProgress =
    students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.progression, 0) / students.length) : 0

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader
          title={formation?.titre || 'Formation financée'}
          subtitle="Progression des étudiants de cette formation"
        />

        <div className="p-4 md:p-8 space-y-6">
          <Link
            href="/dashboard/partner/formations"
            className="inline-flex items-center gap-1.5 text-sm text-[rgba(255,255,255,0.5)] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour aux formations financées
          </Link>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : error ? (
            <Card className="bg-[#0d0d1a] border-red-500/20">
              <CardContent className="py-12 text-center">
                <p className="text-red-400">{error}</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="p-5">
                    <Users className="w-6 h-6 text-[#C9A227] mb-3" />
                    <p className="text-2xl font-bold text-white">{students.length}</p>
                    <p className="text-[rgba(255,255,255,0.5)] text-xs">Étudiants actifs</p>
                  </CardContent>
                </Card>
                <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="p-5">
                    <p className="text-2xl font-bold text-[#C9A227] mb-3">{averageProgress}%</p>
                    <p className="text-[rgba(255,255,255,0.5)] text-xs">Progression moyenne</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-[rgba(255,255,255,0.05)]">
                          <th className="p-4 text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase">Étudiant</th>
                          <th className="p-4 text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase">Progression</th>
                          <th className="p-4 text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase">Moyenne examens finaux</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((s) => (
                          <tr key={s.userId} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)]">
                            <td className="p-4">
                              <p className="text-white font-medium">{s.prenom} {s.nom}</p>
                              <p className="text-[rgba(255,255,255,0.4)] text-xs">{s.email}</p>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-28 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                                  <div className="h-full bg-[#C9A227] rounded-full" style={{ width: `${s.progression}%` }} />
                                </div>
                                <span className="text-[#C9A227] text-xs">{s.progression}%</span>
                              </div>
                            </td>
                            <td className="p-4 text-[rgba(255,255,255,0.7)] text-sm">
                              {s.moyenneExamens !== null ? `${s.moyenneExamens}/20` : '—'}
                            </td>
                          </tr>
                        ))}
                        {students.length === 0 && (
                          <tr>
                            <td colSpan={3} className="p-8 text-center text-[rgba(255,255,255,0.4)]">
                              Aucun étudiant inscrit à cette formation pour le moment.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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
