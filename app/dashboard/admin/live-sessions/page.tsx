"use client"

import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { LIVE_SESSIONS, PROFESSORS, FORMATIONS } from '@/lib/platform-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  live: { label: 'En direct', className: 'bg-red-500/20 text-red-400' },
  scheduled: { label: 'Programmé', className: 'bg-[#C9A227]/20 text-[#C9A227]' },
  completed: { label: 'Terminé', className: 'bg-green-500/20 text-green-400' },
  cancelled: { label: 'Annulé', className: 'bg-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.5)]' },
}

export default function AdminLiveSessionsPage() {
  const liveCount = LIVE_SESSIONS.filter((s) => s.status === 'live').length
  const scheduledCount = LIVE_SESSIONS.filter((s) => s.status === 'scheduled').length
  const totalParticipants = LIVE_SESSIONS.reduce((acc, s) => acc + s.participantsCount, 0)

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="ml-64">
        <DashboardHeader title="Sessions Live" subtitle="Supervisez toutes les sessions en direct de la plateforme" />

        <div className="p-8 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'En direct', value: liveCount, color: 'text-red-400' },
              { label: 'Programmées', value: scheduledCount, color: 'text-[#C9A227]' },
              { label: 'Total sessions', value: LIVE_SESSIONS.length, color: 'text-white' },
              { label: 'Participants', value: totalParticipants, color: 'text-white' },
            ].map((s) => (
              <Card key={s.label} className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                <CardContent className="p-6">
                  <p className="text-[rgba(255,255,255,0.5)] text-sm">{s.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sessions table */}
          <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white font-serif">Toutes les sessions</CardTitle>
              <Button size="sm" className="bg-[#C9A227] hover:bg-[#B8860B]">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Planifier
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[rgba(255,255,255,0.05)]">
                      <th className="pb-3 text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase">Session</th>
                      <th className="pb-3 text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase">Professeur</th>
                      <th className="pb-3 text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase">Formation</th>
                      <th className="pb-3 text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase">Date</th>
                      <th className="pb-3 text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase">Participants</th>
                      <th className="pb-3 text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LIVE_SESSIONS.map((session) => {
                      const prof = PROFESSORS.find((p) => p.id === session.professorId)
                      const formation = FORMATIONS.find((f) => f.id === session.formationId)
                      const status = STATUS_STYLES[session.status]
                      return (
                        <tr key={session.id} className="border-b border-[rgba(255,255,255,0.03)]">
                          <td className="py-4 text-white font-medium">{session.title}</td>
                          <td className="py-4 text-[rgba(255,255,255,0.7)] text-sm">{prof?.name}</td>
                          <td className="py-4 text-[rgba(255,255,255,0.7)] text-sm">{formation?.name}</td>
                          <td className="py-4 text-[rgba(255,255,255,0.7)] text-sm">{formatDate(session.startTime)}</td>
                          <td className="py-4 text-[rgba(255,255,255,0.7)] text-sm">
                            {session.participantsCount}/{session.maxParticipants}
                          </td>
                          <td className="py-4">
                            <span className={`text-xs px-2 py-1 rounded-full ${status.className}`}>{status.label}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
