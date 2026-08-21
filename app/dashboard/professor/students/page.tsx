"use client"

import { useEffect, useState } from 'react'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { useAuth } from '@/lib/auth-context'
import { apiClient } from '@/lib/api/client'
import { progressService } from '@/lib/progress-service'
import { Card, CardContent } from '@/components/ui/card'
import { Users } from 'lucide-react'

interface StudentRow {
  id: string
  name: string
  formationName: string
  progress: number
}

export default function ProfessorStudentsPage() {
  const { user } = useAuth()
  const [students, setStudents] = useState<StudentRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!user) return
      try {
        // ATTENTION: pas d'équivalent Laravel de "professor_formations". On
        // suppose que /v1/formations accepte un filtre ?formateur_id=...
        const formationsRes = await apiClient<any[]>(`/formations?user_id=${user.id}`)
        const formations = formationsRes.data || []

        const rows: StudentRow[] = []
        for (const formation of formations) {
          const inscriptionsRes = await apiClient<any[]>(
            `/inscriptions?formation_id=${formation.id}&status=active`,
          )
          const enrollments = inscriptionsRes.data || []

          for (const enrollment of enrollments) {
            const studentId = enrollment.user_id
            const studentName =
              enrollment.student?.first_name || enrollment.student?.name || `Élève #${studentId}`
            const progress = await progressService.getFormationProgress(studentId, formation.id)
            rows.push({
              id: `${formation.id}-${studentId}`,
              name: studentName,
              formationName: formation.name,
              progress: progress?.completion_percentage ?? 0,
            })
          }
        }
        setStudents(rows)
      } catch (err) {
        console.error('[professor/students] Erreur de chargement:', err)
      }
      setLoading(false)
    }
    load()
  }, [user])

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Mes Élèves" subtitle="Suivez la progression de vos étudiants" />

        <div className="p-4 md:p-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : students.length === 0 ? (
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="py-12 text-center">
                <p className="text-[rgba(255,255,255,0.5)]">Aucun élève inscrit à tes formations pour le moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {students.map((s) => (
                <Card key={s.id} className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#C9A227]/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-[#C9A227]" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{s.name}</p>
                        <p className="text-[rgba(255,255,255,0.4)] text-xs">{s.formationName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-32 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                        <div className="h-full bg-[#C9A227] rounded-full" style={{ width: `${s.progress}%` }} />
                      </div>
                      <span className="text-[#C9A227] text-xs w-10 text-right">{s.progress}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
