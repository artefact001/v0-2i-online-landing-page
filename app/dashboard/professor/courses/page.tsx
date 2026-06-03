"use client"

import Link from 'next/link'
import Image from 'next/image'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { useAuth } from '@/lib/auth-context'
import { PROFESSORS, FORMATIONS, getStudentsByProfessor } from '@/lib/platform-data'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ProfessorCoursesPage() {
  const { user } = useAuth()
  const professor = PROFESSORS.find((p) => p.id === user?.id) || PROFESSORS[0]
  const myFormations = FORMATIONS.filter((f) => professor.formations.includes(f.id))
  const myStudents = getStudentsByProfessor(professor.id)

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="ml-64">
        <DashboardHeader title="Mes Cours" subtitle="Gérez vos formations, modules et leçons" />

        <div className="p-8 space-y-8">
          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/dashboard/professor/modules">
              <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)] hover:border-[#C9A227]/40 transition-colors cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#C9A227]/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Gérer les modules</h3>
                    <p className="text-[rgba(255,255,255,0.5)] text-sm">Organisez le contenu de vos formations</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/dashboard/professor/lessons">
              <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)] hover:border-[#C9A227]/40 transition-colors cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Gérer les leçons</h3>
                    <p className="text-[rgba(255,255,255,0.5)] text-sm">Ajoutez vidéos et exercices</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* My formations */}
          <div>
            <h2 className="text-white font-serif text-lg font-semibold mb-4">Mes formations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myFormations.map((formation) => {
                const studentsCount = myStudents.filter((s) => s.formation === formation.id).length
                return (
                  <Card key={formation.id} className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)] overflow-hidden">
                    <div className="relative h-40">
                      <Image src={formation.image || "/placeholder.svg"} alt={formation.name} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a] to-transparent" />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-white font-serif text-xl font-bold">{formation.name}</h3>
                      <p className="text-[rgba(255,255,255,0.5)] text-sm mt-1 line-clamp-2">{formation.description}</p>
                      <div className="flex items-center gap-6 mt-4">
                        <div>
                          <p className="text-white font-bold text-lg">{formation.coursesCount}</p>
                          <p className="text-[rgba(255,255,255,0.4)] text-xs">Cours</p>
                        </div>
                        <div>
                          <p className="text-white font-bold text-lg">{studentsCount}</p>
                          <p className="text-[rgba(255,255,255,0.4)] text-xs">Élèves</p>
                        </div>
                        <div>
                          <p className="text-white font-bold text-lg">{formation.duration}</p>
                          <p className="text-[rgba(255,255,255,0.4)] text-xs">Durée</p>
                        </div>
                      </div>
                      <Link href="/dashboard/professor/modules">
                        <Button className="w-full mt-5 bg-[#C9A227] hover:bg-[#B8860B]">
                          Gérer le contenu
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
