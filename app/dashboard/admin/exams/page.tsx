"use client"

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api/client'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { FileCheck, Award, Clock } from 'lucide-react'

interface Examen {
  id: string
  type: 'quiz' | 'examen'
  titre: string
  description?: string
  duree_minutes: number
  bareme_pts: number
  formation?: { titre: string }
}

const typeLabel: Record<Examen['type'], string> = {
  quiz: 'Quiz',
  examen: 'Examen',
}

const typeStyle: Record<Examen['type'], string> = {
  quiz: 'bg-blue-500/20 text-blue-400',
  examen: 'bg-[#C9A227]/20 text-[#C9A227]',
}

export default function AdminExamsPage() {
  const [examens, setExamens] = useState<Examen[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient<Examen[]>('/examens')
        setExamens(res.data || [])
      } catch (err) {
        console.error('[admin/exams] Erreur de chargement:', err)
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Examens" subtitle="Supervisez tous les examens et quiz de la plateforme" />

        <div className="p-4 md:p-8 space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : examens.length === 0 ? (
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="py-12 text-center">
                <FileCheck className="w-10 h-10 text-[rgba(255,255,255,0.2)] mx-auto mb-3" />
                <p className="text-[rgba(255,255,255,0.5)]">Aucun examen sur la plateforme pour le moment.</p>
              </CardContent>
            </Card>
          ) : (
            examens.map((ex) => (
              <Card key={ex.id} className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                <CardContent className="py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-white font-medium truncate">{ex.titre}</h3>
                    <p className="text-[rgba(255,255,255,0.4)] text-xs flex items-center gap-3 mt-1">
                      {ex.formation && <span>{ex.formation.titre}</span>}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {ex.duree_minutes} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        {ex.bareme_pts} points
                      </span>
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${typeStyle[ex.type]}`}>
                    {typeLabel[ex.type]}
                  </span>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
