'use client'

import { useEffect, useState } from 'react'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { mentoratService, type MentorDisponible, type Mentorat } from '@/lib/mentorat-service'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { alertSuccess, alertError } from '@/lib/alerts'
import { Users, GraduationCap, Briefcase } from 'lucide-react'

export default function StudentMentoratPage() {
  const [mentors, setMentors] = useState<MentorDisponible[]>([])
  const [mesMentorats, setMesMentorats] = useState<Mentorat[]>([])
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    const [m, mm] = await Promise.all([mentoratService.getMentorsDisponibles(), mentoratService.getMesMentorats()])
    setMentors(m)
    setMesMentorats(mm)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDemander() {
    if (!selectedMentor) return
    try {
      await mentoratService.demander(selectedMentor, message || undefined)
      alertSuccess('Demande de mentorat envoyée avec succès.')
      setSelectedMentor(null)
      setMessage('')
      await load()
    } catch (err: any) {
      alertError(err?.message || 'Erreur lors de la demande')
    }
  }

  const mentorIdsDemandes = new Set(mesMentorats.map((m) => m.mentor_id))

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Mentorat" subtitle="Trouve un mentor pour t'accompagner dans ton parcours" />

        <div className="p-4 md:p-8 space-y-6">
          {mesMentorats.length > 0 && (
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="p-5">
                <h3 className="text-white font-semibold mb-4">Mes demandes de mentorat</h3>
                <div className="space-y-2">
                  {mesMentorats.map((m) => (
                    <div key={m.id} className="flex items-center justify-between bg-[rgba(255,255,255,0.03)] rounded-lg px-3 py-2.5">
                      <span className="text-white text-sm">{m.mentor?.prenom} {m.mentor?.nom}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          m.statut === 'actif' ? 'bg-green-500/20 text-green-400'
                          : m.statut === 'en_attente' ? 'bg-amber-500/20 text-amber-400'
                          : m.statut === 'refuse' ? 'bg-red-500/20 text-red-400'
                          : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {m.statut === 'en_attente' ? 'En attente' : m.statut === 'actif' ? 'Actif' : m.statut === 'refuse' ? 'Refusé' : 'Terminé'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
            <CardContent className="p-5">
              <h3 className="text-white font-semibold mb-4">Mentors disponibles</h3>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#C9A227]" />
                </div>
              ) : mentors.length === 0 ? (
                <p className="text-[rgba(255,255,255,0.4)] text-sm">Aucun mentor disponible pour le moment.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mentors.map((m) => {
                    const dejaDemandee = mentorIdsDemandes.has(m.userId)
                    return (
                      <div key={m.userId} className="bg-[rgba(255,255,255,0.03)] rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                          {m.type === 'alumni' ? (
                            <GraduationCap className="w-4 h-4 text-[#C9A227]" />
                          ) : (
                            <Briefcase className="w-4 h-4 text-[#C9A227]" />
                          )}
                          <span className="text-white text-sm font-medium">{m.prenom} {m.nom}</span>
                        </div>
                        <p className="text-[rgba(255,255,255,0.4)] text-xs mb-3">
                          {m.type === 'alumni' ? m.posteActuel || 'Alumni' : m.specialite}
                        </p>
                        {selectedMentor === m.userId ? (
                          <div className="space-y-2">
                            <Textarea
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Explique pourquoi tu souhaites être mentoré(e)..."
                              rows={2}
                              className="bg-[#0a0a1a] border-[rgba(255,255,255,0.1)] text-white text-sm"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleDemander} className="bg-[#C9A227] hover:bg-[#B8860B]">Envoyer</Button>
                              <Button size="sm" variant="outline" onClick={() => setSelectedMentor(null)} className="border-[rgba(255,255,255,0.2)] text-white">Annuler</Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            disabled={dejaDemandee}
                            onClick={() => setSelectedMentor(m.userId)}
                            className="bg-[#C9A227] hover:bg-[#B8860B] disabled:opacity-40"
                          >
                            {dejaDemandee ? 'Déjà demandé' : 'Demander un mentorat'}
                          </Button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
