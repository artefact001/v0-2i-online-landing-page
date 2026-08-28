'use client'

import { useEffect, useState } from 'react'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { gamificationService, type Badge as BadgeType, type LeaderboardEntry } from '@/lib/gamification-service'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Award, Trophy, Star } from 'lucide-react'

export default function StudentBadgesPage() {
  const { user } = useAuth()
  const [mesBadges, setMesBadges] = useState<{ points: number; badges: BadgeType[] } | null>(null)
  const [classement, setClassement] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([gamificationService.getMesBadges(), gamificationService.getClassement()]).then(([b, c]) => {
      setMesBadges(b)
      setClassement(c)
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Mes badges" subtitle="Suis ta progression et grimpe dans le classement" />

        <div className="p-4 md:p-8 space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : (
            <>
              <Card className="bg-gradient-to-r from-[#0d0d1a] to-[#C9A227]/10 border-[#C9A227]/30">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#C9A227]/20 flex items-center justify-center">
                    <Star className="w-6 h-6 text-[#C9A227]" />
                  </div>
                  <div>
                    <p className="text-[rgba(255,255,255,0.5)] text-xs uppercase tracking-wider mb-1">Points totaux</p>
                    <p className="text-3xl font-bold text-white">{mesBadges?.points ?? 0}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="p-5">
                    <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                      <Award className="w-4 h-4 text-[#C9A227]" />
                      Mes badges ({mesBadges?.badges.length ?? 0})
                    </h3>
                    {mesBadges?.badges.length === 0 ? (
                      <p className="text-[rgba(255,255,255,0.4)] text-sm">Aucun badge pour le moment — continue à apprendre !</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {mesBadges?.badges.map((b) => (
                          <div key={b.id} className="bg-[rgba(255,255,255,0.03)] rounded-lg p-3 text-center">
                            <Award className="w-6 h-6 text-[#C9A227] mx-auto mb-2" />
                            <p className="text-white text-sm font-medium">{b.titre}</p>
                            <p className="text-[rgba(255,255,255,0.4)] text-xs mt-1">{b.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="p-5">
                    <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                      <Trophy className="w-4 h-4 text-[#C9A227]" />
                      Classement
                    </h3>
                    <div className="space-y-2">
                      {classement.map((entry, i) => (
                        <div
                          key={entry.id}
                          className={`flex items-center justify-between p-2.5 rounded-lg ${
                            String(entry.id) === String(user?.id) ? 'bg-[#C9A227]/10 border border-[#C9A227]/30' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[rgba(255,255,255,0.4)] text-sm w-5">{i + 1}</span>
                            <span className="text-white text-sm">{entry.prenom} {entry.nom}</span>
                          </div>
                          <span className="text-[#C9A227] font-semibold text-sm">{entry.points} pts</span>
                        </div>
                      ))}
                      {classement.length === 0 && (
                        <p className="text-[rgba(255,255,255,0.4)] text-sm">Aucun classement pour le moment.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
