"use client"

import Image from 'next/image'
import Link from 'next/link'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { useAuth } from '@/lib/auth-context'
import { 
  STUDENTS, 
  FORMATIONS, 
  PROFESSORS,
  LIVE_SESSIONS 
} from '@/lib/platform-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function StudentDashboard() {
  const { user } = useAuth()
  
  // Find the student data
  const student = STUDENTS.find(s => s.id === user?.id) || STUDENTS[0]
  const myFormation = FORMATIONS.find(f => f.id === student.formation)
  const myProfessors = PROFESSORS.filter(p => p.formations.includes(student.formation))
  const upcomingSessions = LIVE_SESSIONS.filter(s => s.formationId === student.formation && (s.status === 'live' || s.status === 'scheduled'))

  // Mock recent courses
  const recentCourses = [
    { id: 1, title: 'Les bases de la cuisine française', completed: true, duration: '45 min' },
    { id: 2, title: 'Techniques de découpe', completed: true, duration: '1h 20min' },
    { id: 3, title: 'Les sauces mères', completed: false, duration: '55 min', progress: 60 },
    { id: 4, title: 'Cuisson des viandes', completed: false, duration: '1h 10min', progress: 0 },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      
      <main className="ml-64">
        <DashboardHeader 
          title={`Bonjour, ${student.name}`}
          subtitle="Continuez votre apprentissage"
        />

        <div className="p-8 space-y-8">
          {/* Progress Overview */}
          <Card className="bg-gradient-to-r from-[#0d0d1a] to-[#C9A227]/10 border-[#C9A227]/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                    <circle 
                      cx="50" cy="50" r="45" fill="none" stroke="#C9A227" strokeWidth="8"
                      strokeDasharray={`${student.progress * 2.83} 283`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{student.progress}%</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-white font-serif text-xl font-bold">{myFormation?.name}</h2>
                    <span className="px-3 py-1 bg-[#C9A227]/20 text-[#C9A227] text-xs rounded-full">
                      En cours
                    </span>
                  </div>
                  <p className="text-[rgba(255,255,255,0.6)] mb-4">
                    {student.completedCourses} cours terminés sur {student.totalCourses}
                  </p>
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-white font-bold text-lg">{myFormation?.duration}</p>
                      <p className="text-[rgba(255,255,255,0.4)] text-xs">Durée totale</p>
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">{student.totalCourses - student.completedCourses}</p>
                      <p className="text-[rgba(255,255,255,0.4)] text-xs">Cours restants</p>
                    </div>
                    <div>
                      <p className="text-[#C9A227] font-bold text-lg">
                        {Math.round((student.totalCourses - student.completedCourses) * 0.5)}h
                      </p>
                      <p className="text-[rgba(255,255,255,0.4)] text-xs">Temps restant</p>
                    </div>
                  </div>
                </div>

                <Button className="bg-[#C9A227] hover:bg-[#B8860B]">
                  Continuer le cours
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Courses */}
            <Card className="lg:col-span-2 bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white font-serif">Mes Cours</CardTitle>
                <Link href="/dashboard/student/courses">
                  <Button variant="ghost" size="sm" className="text-[#C9A227]">
                    Voir tous
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentCourses.map((course) => (
                  <div 
                    key={course.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] transition-colors cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${course.completed ? 'bg-green-500/20' : 'bg-[#C9A227]/20'}`}>
                      {course.completed ? (
                        <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{course.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[rgba(255,255,255,0.4)] text-sm">{course.duration}</span>
                        {!course.completed && course.progress !== undefined && course.progress > 0 && (
                          <div className="flex items-center gap-2">
                            <Progress value={course.progress} className="h-1 w-20" />
                            <span className="text-[#C9A227] text-xs">{course.progress}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={course.completed ? 'text-green-400' : 'text-[#C9A227]'}
                    >
                      {course.completed ? 'Revoir' : 'Continuer'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Live Sessions */}
              {upcomingSessions.length > 0 && (
                <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardHeader>
                    <CardTitle className="text-white font-serif flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      Sessions Live
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {upcomingSessions.map((session) => {
                      const professor = PROFESSORS.find(p => p.id === session.professorId)
                      return (
                        <div key={session.id} className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
                          {session.status === 'live' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full mb-2">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                              EN DIRECT
                            </span>
                          )}
                          <h4 className="text-white font-medium text-sm">{session.title}</h4>
                          <p className="text-[rgba(255,255,255,0.5)] text-xs mt-1">{professor?.name}</p>
                          <Button size="sm" className="w-full mt-3 bg-[#C9A227] hover:bg-[#B8860B]">
                            {session.status === 'live' ? 'Rejoindre' : 'S\'inscrire'}
                          </Button>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )}

              {/* My Professors */}
              <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                <CardHeader>
                  <CardTitle className="text-white font-serif">Mes Professeurs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {myProfessors.map((professor) => (
                    <div key={professor.id} className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image src={professor.avatar} alt={professor.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{professor.name}</h4>
                        <p className="text-[rgba(255,255,255,0.4)] text-xs">{professor.speciality}</p>
                      </div>
                      <div className="flex items-center gap-1 text-[#C9A227]">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium">{professor.rating}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                <CardHeader>
                  <CardTitle className="text-white font-serif">Badges obtenus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col items-center p-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
                      <div className="w-10 h-10 rounded-full bg-[#C9A227]/20 flex items-center justify-center mb-2">
                        <svg className="w-5 h-5 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <span className="text-[rgba(255,255,255,0.6)] text-xs text-center">Démarrage</span>
                    </div>
                    <div className="flex flex-col items-center p-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-[rgba(255,255,255,0.6)] text-xs text-center">Régulier</span>
                    </div>
                    <div className="flex flex-col items-center p-3 rounded-lg bg-[rgba(255,255,255,0.02)] opacity-40">
                      <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center mb-2">
                        <svg className="w-5 h-5 text-[rgba(255,255,255,0.3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <span className="text-[rgba(255,255,255,0.3)] text-xs text-center">Expert</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
