"use client"

import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { useAuth } from '@/lib/auth-context'
import { STUDENTS, FORMATIONS } from '@/lib/platform-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const MODULES = [
  { name: 'Module 1 - Fondamentaux', total: 6, completed: 6 },
  { name: 'Module 2 - Les sauces', total: 5, completed: 3 },
  { name: 'Module 3 - Les cuissons', total: 6, completed: 1 },
  { name: 'Module 4 - Pâtisserie de base', total: 4, completed: 0 },
  { name: 'Module 5 - Dressage & service', total: 3, completed: 0 },
]

const ACTIVITY = [
  { day: 'Lun', hours: 1.5 },
  { day: 'Mar', hours: 2.2 },
  { day: 'Mer', hours: 0.8 },
  { day: 'Jeu', hours: 3.1 },
  { day: 'Ven', hours: 1.0 },
  { day: 'Sam', hours: 2.6 },
  { day: 'Dim', hours: 0.4 },
]

export default function StudentProgressPage() {
  const { user } = useAuth()
  const student = STUDENTS.find((s) => s.id === user?.id) || STUDENTS[0]
  const myFormation = FORMATIONS.find((f) => f.id === student.formation)
  const maxHours = Math.max(...ACTIVITY.map((a) => a.hours))

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="ml-64">
        <DashboardHeader title="Ma Progression" subtitle={myFormation?.name} />

        <div className="p-8 space-y-8">
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Progression', value: `${student.progress}%`, color: 'text-[#C9A227]' },
              { label: 'Cours terminés', value: `${student.completedCourses}/${student.totalCourses}`, color: 'text-white' },
              { label: 'Heures cumulées', value: '47h', color: 'text-white' },
              { label: 'Série en cours', value: '5 jours', color: 'text-green-400' },
            ].map((s) => (
              <Card key={s.label} className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                <CardContent className="p-6">
                  <p className="text-[rgba(255,255,255,0.5)] text-sm">{s.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Progress by module */}
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardHeader>
                <CardTitle className="text-white font-serif">Progression par module</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {MODULES.map((m) => {
                  const pct = Math.round((m.completed / m.total) * 100)
                  return (
                    <div key={m.name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm font-medium">{m.name}</span>
                        <span className="text-[rgba(255,255,255,0.5)] text-xs">{m.completed}/{m.total}</span>
                      </div>
                      <Progress value={pct} className="h-2" />
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Weekly activity */}
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardHeader>
                <CardTitle className="text-white font-serif">Activité de la semaine</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between gap-3 h-48">
                  {ACTIVITY.map((a) => (
                    <div key={a.day} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex-1 flex items-end">
                        <div
                          className="w-full bg-[#C9A227] rounded-t-md transition-all"
                          style={{ height: `${(a.hours / maxHours) * 100}%` }}
                          title={`${a.hours}h`}
                        />
                      </div>
                      <span className="text-[rgba(255,255,255,0.5)] text-xs">{a.day}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
