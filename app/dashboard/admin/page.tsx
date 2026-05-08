"use client"

import { useState } from 'react'
import Image from 'next/image'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { 
  FORMATIONS, 
  PROFESSORS, 
  STUDENTS, 
  PLATFORM_STATS,
  LIVE_SESSIONS 
} from '@/lib/platform-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week')

  const stats = [
    {
      label: 'Total Élèves',
      value: PLATFORM_STATS.totalStudents,
      change: '+12%',
      positive: true,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Professeurs',
      value: PLATFORM_STATS.totalProfessors,
      change: '+2',
      positive: true,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'En ligne',
      value: PLATFORM_STATS.activeNow,
      change: 'Maintenant',
      positive: true,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Revenus (FCFA)',
      value: PLATFORM_STATS.revenue.toLocaleString(),
      change: '+18%',
      positive: true,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-[#C9A227] to-[#B8860B]',
    },
  ]

  const liveSessions = LIVE_SESSIONS.filter(s => s.status === 'live' || s.status === 'scheduled')
  const recentStudents = STUDENTS.slice(0, 5)

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      
      <main className="ml-64">
        <DashboardHeader 
          title="Tableau de bord" 
          subtitle="Vue d'ensemble de la plateforme"
        />

        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[rgba(255,255,255,0.5)] text-sm mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                      <span className={`text-xs mt-2 inline-block ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                        {stat.change}
                      </span>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formations Overview */}
            <Card className="lg:col-span-2 bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white font-serif">Formations</CardTitle>
                <Button variant="ghost" size="sm" className="text-[#C9A227]">
                  Voir tout
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {FORMATIONS.map((formation) => (
                    <div 
                      key={formation.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image 
                          src={formation.image} 
                          alt={formation.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold truncate">{formation.name}</h3>
                        <p className="text-[rgba(255,255,255,0.5)] text-sm">{formation.studentsCount} élèves inscrits</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#C9A227] font-bold">{formation.price.toLocaleString()} FCFA</p>
                        <p className="text-[rgba(255,255,255,0.4)] text-xs">{formation.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Live Sessions */}
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white font-serif flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Sessions Live
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {liveSessions.length > 0 ? (
                    liveSessions.map((session) => {
                      const professor = PROFESSORS.find(p => p.id === session.professorId)
                      const formation = FORMATIONS.find(f => f.id === session.formationId)
                      return (
                        <div 
                          key={session.id}
                          className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {session.status === 'live' && (
                              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                EN DIRECT
                              </span>
                            )}
                            {session.status === 'scheduled' && (
                              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                                Programmé
                              </span>
                            )}
                          </div>
                          <h4 className="text-white font-medium mb-1">{session.title}</h4>
                          <p className="text-[rgba(255,255,255,0.5)] text-sm mb-2">{professor?.name}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[rgba(255,255,255,0.4)]">{formation?.name}</span>
                            <span className="text-[#C9A227]">{session.participantsCount}/{session.maxParticipants}</span>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-[rgba(255,255,255,0.5)] text-center py-4">Aucune session en cours</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Students & Professors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Students */}
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white font-serif">Élèves récents</CardTitle>
                <Button variant="ghost" size="sm" className="text-[#C9A227]">
                  Voir tout
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentStudents.map((student) => {
                    const formation = FORMATIONS.find(f => f.id === student.formation)
                    return (
                      <div 
                        key={student.id}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                      >
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                          <Image 
                            src={student.avatar} 
                            alt={student.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate">{student.name}</h4>
                          <p className="text-[rgba(255,255,255,0.5)] text-sm truncate">{formation?.name}</p>
                        </div>
                        <div className="w-24">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-[rgba(255,255,255,0.4)]">Progression</span>
                            <span className="text-[#C9A227]">{student.progress}%</span>
                          </div>
                          <Progress value={student.progress} className="h-1.5" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Professors */}
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white font-serif">Équipe pédagogique</CardTitle>
                <Button variant="ghost" size="sm" className="text-[#C9A227]">
                  Gérer
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {PROFESSORS.map((professor) => (
                    <div 
                      key={professor.id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                    >
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image 
                          src={professor.avatar} 
                          alt={professor.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{professor.name}</h4>
                        <p className="text-[rgba(255,255,255,0.5)] text-sm truncate">{professor.speciality}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-[#C9A227]">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-semibold">{professor.rating}</span>
                        </div>
                        <p className="text-[rgba(255,255,255,0.4)] text-xs">{professor.studentsCount} élèves</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
            <CardHeader>
              <CardTitle className="text-white font-serif">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto py-6 flex flex-col gap-2 border-[rgba(255,255,255,0.1)] text-white hover:bg-[#C9A227]/10 hover:border-[#C9A227]/50"
                >
                  <svg className="w-6 h-6 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Ajouter un élève
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-6 flex flex-col gap-2 border-[rgba(255,255,255,0.1)] text-white hover:bg-[#C9A227]/10 hover:border-[#C9A227]/50"
                >
                  <svg className="w-6 h-6 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Nouveau professeur
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-6 flex flex-col gap-2 border-[rgba(255,255,255,0.1)] text-white hover:bg-[#C9A227]/10 hover:border-[#C9A227]/50"
                >
                  <svg className="w-6 h-6 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Lancer un live
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-6 flex flex-col gap-2 border-[rgba(255,255,255,0.1)] text-white hover:bg-[#C9A227]/10 hover:border-[#C9A227]/50"
                >
                  <svg className="w-6 h-6 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Voir rapports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
