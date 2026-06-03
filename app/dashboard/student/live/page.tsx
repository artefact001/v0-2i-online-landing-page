"use client"

import Link from 'next/link'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { useAuth } from '@/lib/auth-context'
import { STUDENTS, LIVE_SESSIONS, PROFESSORS, FORMATIONS } from '@/lib/platform-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function StudentLivePage() {
  const { user } = useAuth()
  const student = STUDENTS.find((s) => s.id === user?.id) || STUDENTS[0]

  const mySessions = LIVE_SESSIONS.filter((s) => s.formationId === student.formation)
  const liveNow = mySessions.filter((s) => s.status === 'live')
  const upcoming = mySessions.filter((s) => s.status === 'scheduled')

  // Fallback: show all sessions if student's formation has none
  const allUpcoming = upcoming.length > 0 ? upcoming : LIVE_SESSIONS.filter((s) => s.status === 'scheduled')

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="ml-64">
        <DashboardHeader title="Cours Live" subtitle="Vos sessions en direct et à venir" />

        <div className="p-8 space-y-8">
          {/* Live now */}
          {liveNow.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-white font-serif text-lg font-semibold flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                En direct maintenant
              </h2>
              {liveNow.map((session) => {
                const prof = PROFESSORS.find((p) => p.id === session.professorId)
                return (
                  <Card key={session.id} className="bg-gradient-to-r from-[#0d0d1a] to-red-500/10 border-red-500/30">
                    <CardContent className="p-6 flex items-center gap-6">
                      <div className="flex-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full mb-2">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                          EN DIRECT
                        </span>
                        <h3 className="text-white font-serif text-xl font-bold">{session.title}</h3>
                        <p className="text-[rgba(255,255,255,0.6)] mt-1">{prof?.name}</p>
                        <p className="text-[rgba(255,255,255,0.4)] text-sm mt-1">
                          {session.participantsCount} participants connectés
                        </p>
                      </div>
                      <Link href="/cours-live">
                        <Button className="bg-red-500 hover:bg-red-600">
                          Rejoindre maintenant
                          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Upcoming */}
          <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
            <CardHeader>
              <CardTitle className="text-white font-serif">Sessions à venir</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {allUpcoming.length === 0 ? (
                <p className="text-[rgba(255,255,255,0.5)] text-sm py-4 text-center">
                  Aucune session programmée pour le moment.
                </p>
              ) : (
                allUpcoming.map((session) => {
                  const prof = PROFESSORS.find((p) => p.id === session.professorId)
                  const formation = FORMATIONS.find((f) => f.id === session.formationId)
                  return (
                    <div
                      key={session.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]"
                    >
                      <div className="w-12 h-12 rounded-lg bg-[#C9A227]/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{session.title}</h4>
                        <p className="text-[rgba(255,255,255,0.5)] text-sm">{prof?.name} · {formation?.name}</p>
                        <p className="text-[#C9A227] text-xs mt-1 capitalize">{formatDate(session.startTime)}</p>
                      </div>
                      <Button size="sm" variant="outline" className="border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.8)] hover:bg-[rgba(255,255,255,0.05)]">
                        Me rappeler
                      </Button>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
