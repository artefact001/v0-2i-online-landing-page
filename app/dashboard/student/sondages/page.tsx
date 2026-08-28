'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api/client'
import { useAuth } from '@/lib/auth-context'
import { sondageService, type Sondage } from '@/lib/sondage-service'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { alertSuccess, alertError } from '@/lib/alerts'
import { ClipboardList, Star } from 'lucide-react'

interface Inscription {
  formation_id: string
  formation?: { titre: string }
}

export default function StudentSondagesPage() {
  const { user } = useAuth()
  const [sondages, setSondages] = useState<(Sondage & { formationTitre?: string })[]>([])
  const [reponses, setReponses] = useState<Record<string, Record<string, string | number>>>({})
  const [envoyes, setEnvoyes] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!user) return
      const res = await apiClient<Inscription[]>(`/inscriptions?user_id=${user.id}`)
      const inscriptions = (res.data || []).filter((i: any) => i.statut === 'actif')

      const allSondages = await Promise.all(
        inscriptions.map(async (i) => {
          const list = await sondageService.getForFormation(i.formation_id)
          return list.map((s) => ({ ...s, formationTitre: i.formation?.titre }))
        }),
      )
      setSondages(allSondages.flat())
      setLoading(false)
    }
    load()
  }, [user])

  function updateReponse(sondageId: string, questionId: string, valeur: string | number) {
    setReponses((prev) => ({ ...prev, [sondageId]: { ...prev[sondageId], [questionId]: valeur } }))
  }

  async function handleSubmit(sondage: Sondage) {
    const answers = reponses[sondage.id] || {}
    if (Object.keys(answers).length < sondage.questions.length) {
      alertError('Merci de répondre à toutes les questions.')
      return
    }
    try {
      await sondageService.repondre(
        sondage.id,
        Object.entries(answers).map(([question_id, valeur]) => ({ question_id, valeur })),
      )
      setEnvoyes((prev) => new Set(prev).add(sondage.id))
      alertSuccess('Merci pour ta réponse !')
    } catch (err: any) {
      alertError(err?.message || "Erreur lors de l'envoi")
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Sondages" subtitle="Donne ton avis sur tes formations" />

        <div className="p-4 md:p-8 space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : sondages.length === 0 ? (
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="py-12 text-center">
                <ClipboardList className="w-10 h-10 text-[rgba(255,255,255,0.2)] mx-auto mb-3" />
                <p className="text-[rgba(255,255,255,0.5)]">Aucun sondage disponible pour le moment.</p>
              </CardContent>
            </Card>
          ) : (
            sondages.map((s) => (
              <Card key={s.id} className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                <CardContent className="p-5">
                  <h3 className="text-white font-semibold">{s.titre}</h3>
                  <p className="text-[rgba(255,255,255,0.4)] text-xs mb-4">{s.formationTitre}</p>

                  {envoyes.has(s.id) ? (
                    <p className="text-green-400 text-sm">✓ Réponse envoyée, merci !</p>
                  ) : (
                    <div className="space-y-4">
                      {s.questions.map((q) => (
                        <div key={q.id}>
                          <p className="text-white text-sm mb-2">{q.texte}</p>
                          {q.type === 'note' ? (
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <button
                                  key={n}
                                  onClick={() => updateReponse(s.id, q.id, n)}
                                  className="p-1"
                                >
                                  <Star
                                    className={`w-6 h-6 ${
                                      (reponses[s.id]?.[q.id] as number) >= n ? 'text-[#C9A227] fill-[#C9A227]' : 'text-[rgba(255,255,255,0.2)]'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          ) : (
                            <Textarea
                              onChange={(e) => updateReponse(s.id, q.id, e.target.value)}
                              placeholder="Ta réponse..."
                              className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                              rows={2}
                            />
                          )}
                        </div>
                      ))}
                      <Button onClick={() => handleSubmit(s)} className="bg-[#C9A227] hover:bg-[#B8860B]">Envoyer</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
