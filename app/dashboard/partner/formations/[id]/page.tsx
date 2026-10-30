'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { partnerService, formatDateFr, formatFcfa, type FinancedStudent, type FinancedFormation } from '@/lib/partner-service'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, Users, HandCoins, Calendar, BookOpen } from 'lucide-react'

export default function PartnerFormationDetailPage() {
  const params = useParams()
  const formationId = params.id as string
  const [formation, setFormation] = useState<FinancedFormation | null>(null)
  const [students, setStudents] = useState<FinancedStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [studentsError, setStudentsError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    setStudentsError('')

    // Deux appels indépendants : si la liste des apprenants échoue, la fiche
    // de la formation s'affiche quand même (et inversement).
    const [formationRes, studentsRes] = await Promise.allSettled([
      partnerService.getFormationDetail(formationId),
      partnerService.getFormationStudents(formationId),
    ])

    if (formationRes.status === 'fulfilled') {
      setFormation(formationRes.value)
    } else {
      setError(formationRes.reason?.message || 'Impossible de charger cette formation.')
    }

    if (studentsRes.status === 'fulfilled') {
      setStudents(studentsRes.value)
    } else {
      setStudentsError(studentsRes.reason?.message || 'Impossible de charger les étudiants.')
    }

    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <p className="text-red-400 mb-4">{error}</p>
                <button onClick={load} className="text-sm text-[#C9A227] hover:underline">Réessayer</button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Fiche de la formation financée */}
              {formation && (
                <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)] overflow-hidden">
                  <CardContent className="p-0 md:flex">
                    {formation.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={formation.image} alt={formation.titre} className="w-full md:w-64 h-44 md:h-auto object-cover" />
                    )}
                    <div className="p-5 space-y-4 flex-1">
                      {formation.description && (
                        <p className="text-[rgba(255,255,255,0.7)] text-sm leading-relaxed line-clamp-4">{formation.description}</p>
                      )}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <p className="text-[9px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider flex items-center gap-1">
                            <HandCoins className="w-3 h-3 text-[#C9A227]" /> Montant financé
                          </p>
                          <p className="text-lg font-bold text-[#C9A227]">{formatFcfa(formation.pivot?.montant_finance)}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#C9A227]" /> Financé le
                          </p>
                          <p className="text-white text-sm font-medium">{formatDateFr(formation.pivot?.date_financement)}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-[#C9A227]" /> Modules
                          </p>
                          <p className="text-white text-sm font-medium">{formation.modules_count ?? '—'}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider">Niveau / durée</p>
                          <p className="text-white text-sm font-medium">
                            {[formation.niveau, formation.duree].filter(Boolean).join(' · ') || '—'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {studentsError && (
                <Card className="bg-[#0d0d1a] border-red-500/20">
                  <CardContent className="py-4 text-center">
                    <p className="text-red-400 text-sm">{studentsError}</p>
                  </CardContent>
                </Card>
              )}

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
