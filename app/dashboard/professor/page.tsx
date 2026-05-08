"use client"

import { useState } from 'react'
import Image from 'next/image'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { useAuth } from '@/lib/auth-context'
import { 
  PROFESSORS, 
  FORMATIONS, 
  STUDENTS, 
  LIVE_SESSIONS,
  getStudentsByProfessor 
} from '@/lib/platform-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function ProfessorDashboard() {
  const { user } = useAuth()
  
  // Find the professor data
  const professor = PROFESSORS.find(p => p.id === user?.id) || PROFESSORS[0]
  const myFormations = FORMATIONS.filter(f => professor.formations.includes(f.id))
  const myStudents = getStudentsByProfessor(professor.id)
  const myLiveSessions = LIVE_SESSIONS.filter(s => s.professorId === professor.id)
  
  const activeStudents = myStudents.filter(s => s.status === 'active').length
  const avgProgress = myStudents.length > 0 
    ? Math.round(myStudents.reduce((acc, s) => acc + s.progress, 0) / myStudents.length)
    : 0

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      
      <main className="ml-64">
        <DashboardHeader 
          title={`Bonjour, ${professor.name}`}
          subtitle="Bienvenue dans votre espace professeur"
        />

        <div className="p-8 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{myStudents.length}</p>
                    <p className="text-[rgba(255,255,255,0.5)] text-sm">Mes élèves</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{activeStudents}</p>
                    <p className="text-[rgba(255,255,255,0.5)] text-sm">Élèves actifs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#C9A227]/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{avgProgress}%</p>
                    <p className="text-[rgba(255,255,255,0.5)] text-sm">Progression moy.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{professor.coursesCount}</p>
                    <p className="text-[rgba(255,255,255,0.5)] text-sm">Mes cours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* My Formations */}
            <Card className="lg:col-span-2 bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white font-serif">Mes Formations</CardTitle>
                <Button variant="ghost" size="sm" className="text-[#C9A227]">
                  Gérer les cours
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {myFormations.map((formation) => {
                  const formationStudents = myStudents.filter(s => s.formation === formation.id)
                  return (
                    <div 
                      key={formation.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] transition-colors cursor-pointer"
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={formation.image} alt={formation.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1">{formation.name}</h3>
                        <p className="text-[rgba(255,255,255,0.5)] text-sm mb-2">{formation.coursesCount} cours disponibles</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-[rgba(255,255,255,0.6)]">
                            <span className="text-white font-medium">{formationStudents.length}</span> élèves
                          </span>
                          <span className="text-[#C9A227]">{formation.duration}</span>
                        </div>
                      </div>
                      <Button size="sm" className="bg-[#C9A227]/20 text-[#C9A227] hover:bg-[#C9A227]/30">
                        Gérer
                      </Button>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-6">
              {/* Live Session Card */}
              <Card className="bg-gradient-to-br from-[#C9A227]/20 to-[#0d0d1a] border-[#C9A227]/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-[#C9A227] text-sm font-medium">Session Live</span>
                  </div>
                  <h3 className="text-white font-serif text-xl font-bold mb-2">Lancer un cours en direct</h3>
                  <p className="text-[rgba(255,255,255,0.6)] text-sm mb-4">
                    Démarrez une session live pour vos élèves
                  </p>
                  <Button className="w-full bg-[#C9A227] hover:bg-[#B8860B]">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Démarrer le live
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Sessions */}
              <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                <CardHeader>
                  <CardTitle className="text-white font-serif text-lg">Prochaines sessions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {myLiveSessions.filter(s => s.status === 'scheduled').map((session) => {
                    const formation = FORMATIONS.find(f => f.id === session.formationId)
                    return (
                      <div key={session.id} className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
                        <p className="text-white font-medium text-sm">{session.title}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[rgba(255,255,255,0.5)] text-xs">{formation?.name}</span>
                          <span className="text-[#C9A227] text-xs">
                            {new Date(session.startTime).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                  {myLiveSessions.filter(s => s.status === 'scheduled').length === 0 && (
                    <p className="text-[rgba(255,255,255,0.4)] text-center text-sm py-2">Aucune session programmée</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Students List */}
          <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white font-serif">Mes Élèves</CardTitle>
              <Button variant="ghost" size="sm" className="text-[#C9A227]">
                Voir tous
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myStudents.slice(0, 6).map((student) => {
                  const formation = FORMATIONS.find(f => f.id === student.formation)
                  return (
                    <div key={student.id} className="flex items-center gap-3 p-4 rounded-lg bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image src={student.avatar} alt={student.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{student.name}</h4>
                        <p className="text-[rgba(255,255,255,0.5)] text-xs truncate">{formation?.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={student.progress} className="h-1 flex-1" />
                          <span className="text-[#C9A227] text-xs">{student.progress}%</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
