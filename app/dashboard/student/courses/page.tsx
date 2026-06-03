"use client"

import Link from 'next/link'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { useAuth } from '@/lib/auth-context'
import { STUDENTS, FORMATIONS } from '@/lib/platform-data'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface CourseItem {
  id: number
  title: string
  module: string
  duration: string
  status: 'completed' | 'in-progress' | 'locked'
  progress: number
}

const COURSES: CourseItem[] = [
  { id: 1, title: 'Les bases de la cuisine française', module: 'Module 1 - Fondamentaux', duration: '45 min', status: 'completed', progress: 100 },
  { id: 2, title: 'Techniques de découpe', module: 'Module 1 - Fondamentaux', duration: '1h 20min', status: 'completed', progress: 100 },
  { id: 3, title: 'Les sauces mères', module: 'Module 2 - Les sauces', duration: '55 min', status: 'in-progress', progress: 60 },
  { id: 4, title: 'Émulsions et liaisons', module: 'Module 2 - Les sauces', duration: '40 min', status: 'in-progress', progress: 20 },
  { id: 5, title: 'Cuisson des viandes', module: 'Module 3 - Les cuissons', duration: '1h 10min', status: 'locked', progress: 0 },
  { id: 6, title: 'Cuisson des poissons', module: 'Module 3 - Les cuissons', duration: '50 min', status: 'locked', progress: 0 },
]

export default function StudentCoursesPage() {
  const { user } = useAuth()
  const student = STUDENTS.find((s) => s.id === user?.id) || STUDENTS[0]
  const myFormation = FORMATIONS.find((f) => f.id === student.formation)

  const completed = COURSES.filter((c) => c.status === 'completed').length

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="ml-64">
        <DashboardHeader title="Mes Cours" subtitle={myFormation?.name} />

        <div className="p-8 space-y-8">
          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="p-6">
                <p className="text-[rgba(255,255,255,0.5)] text-sm">Cours terminés</p>
                <p className="text-3xl font-bold text-white mt-1">{completed}/{COURSES.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="p-6">
                <p className="text-[rgba(255,255,255,0.5)] text-sm">Progression globale</p>
                <p className="text-3xl font-bold text-[#C9A227] mt-1">{student.progress}%</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="p-6">
                <p className="text-[rgba(255,255,255,0.5)] text-sm">Durée totale</p>
                <p className="text-3xl font-bold text-white mt-1">{myFormation?.duration}</p>
              </CardContent>
            </Card>
          </div>

          {/* Course list grouped */}
          <div className="space-y-4">
            {COURSES.map((course) => (
              <Card key={course.id} className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                <CardContent className="p-5 flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      course.status === 'completed'
                        ? 'bg-green-500/20'
                        : course.status === 'in-progress'
                          ? 'bg-[#C9A227]/20'
                          : 'bg-[rgba(255,255,255,0.05)]'
                    }`}
                  >
                    {course.status === 'completed' ? (
                      <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : course.status === 'locked' ? (
                      <svg className="w-6 h-6 text-[rgba(255,255,255,0.3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[rgba(255,255,255,0.4)] text-xs">{course.module}</p>
                    <h4 className="text-white font-medium truncate">{course.title}</h4>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[rgba(255,255,255,0.4)] text-sm">{course.duration}</span>
                      {course.status === 'in-progress' && (
                        <div className="flex items-center gap-2">
                          <Progress value={course.progress} className="h-1 w-24" />
                          <span className="text-[#C9A227] text-xs">{course.progress}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {course.status === 'locked' ? (
                    <Button size="sm" variant="ghost" disabled className="text-[rgba(255,255,255,0.3)]">
                      Verrouillé
                    </Button>
                  ) : (
                    <Link href={`/cours/${student.formation}`}>
                      <Button size="sm" className="bg-[#C9A227] hover:bg-[#B8860B]">
                        {course.status === 'completed' ? 'Revoir' : 'Continuer'}
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
