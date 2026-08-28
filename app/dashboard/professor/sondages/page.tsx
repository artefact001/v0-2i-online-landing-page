'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api/client'
import { useAuth } from '@/lib/auth-context'
import { sondageService, type Sondage, type SondageQuestion } from '@/lib/sondage-service'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormationPills } from '@/components/professor/section-header'
import { alertSuccess, alertError } from '@/lib/alerts'
import { Plus, X, ClipboardList, BarChart3 } from 'lucide-react'

interface Formation {
  id: string
  titre: string
}

interface Resultats {
  sondage: Sondage
  reponses: { id: string; user: { prenom: string; nom: string }; reponses: { question_id: string; valeur: string | number }[] }[]
}

function emptyQuestion(): SondageQuestion {
  return { id: crypto.randomUUID(), texte: '', type: 'note' }
}

export default function ProfessorSondagesPage() {
  const { user } = useAuth()
  const [formations, setFormations] = useState<Formation[]>([])
  const [selectedFormation, setSelectedFormation] = useState('')
  const [sondages, setSondages] = useState<Sondage[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [titre, setTitre] = useState('')
  const [questions, setQuestions] = useState<SondageQuestion[]>([emptyQuestion()])
  const [resultats, setResultats] = useState<Resultats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    apiClient<Formation[]>(`/formations?user_id=${user.id}`).then((res) => {
      const list = res.data || []
      setFormations(list)
      if (list.length > 0) setSelectedFormation(list[0].id)
      else setLoading(false)
    })
  }, [user])

  useEffect(() => {
    if (!selectedFormation) return
    setLoading(true)
    sondageService.getForFormation(selectedFormation).then((s) => {
      setSondages(s)
      setLoading(false)
    })
  }, [selectedFormation])

  function resetForm() {
    setTitre('')
    setQuestions([emptyQuestion()])
    setIsCreating(false)
  }

  async function handleCreate() {
    if (!titre.trim() || questions.some((q) => !q.texte.trim())) {
      alertError('Le titre et toutes les questions doivent être remplis.')
      return
    }
    try {
      await sondageService.create(selectedFormation, titre.trim(), questions)
      const updated = await sondageService.getForFormation(selectedFormation)
      setSondages(updated)
      resetForm()
      alertSuccess('Sondage créé avec succès.')
    } catch (err: any) {
      alertError(err?.message || 'Erreur lors de la création')
    }
  }

  async function handleViewResultats(sondageId: string) {
    const data = await sondageService.getResultats(sondageId)
    setResultats(data as Resultats)
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Sondages" subtitle="Recueille l'avis de tes étudiants sur tes formations" />

        <div className="p-4 md:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <FormationPills formations={formations.map((f) => ({ id: f.id, name: f.titre }))} selected={selectedFormation} onSelect={setSelectedFormation} />
            <Button onClick={() => (isCreating ? resetForm() : setIsCreating(true))} className="bg-[#C9A227] hover:bg-[#B8860B] text-white shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              {isCreating ? 'Annuler' : 'Nouveau sondage'}
            </Button>
          </div>

          {isCreating && (
            <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
              <CardContent className="pt-6 space-y-4">
                <Input
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  placeholder="Titre du sondage (ex: Satisfaction fin de formation)"
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                />

                <div className="space-y-3">
                  {questions.map((q, i) => (
                    <div key={q.id} className="flex items-start gap-2">
                      <Input
                        value={q.texte}
                        onChange={(e) => setQuestions((prev) => prev.map((qq, ii) => (ii === i ? { ...qq, texte: e.target.value } : qq)))}
                        placeholder={`Question ${i + 1}`}
                        className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white flex-1"
                      />
                      <Select value={q.type} onValueChange={(v) => setQuestions((prev) => prev.map((qq, ii) => (ii === i ? { ...qq, type: v as any } : qq)))}>
                        <SelectTrigger className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)]">
                          <SelectItem value="note" className="text-white">Note /5</SelectItem>
                          <SelectItem value="texte" className="text-white">Texte libre</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button type="button" size="icon" variant="ghost" onClick={() => setQuestions((prev) => prev.filter((_, ii) => ii !== i))} className="text-red-400 shrink-0">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => setQuestions((prev) => [...prev, emptyQuestion()])} className="border-[#C9A227]/40 text-[#C9A227]">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Ajouter une question
                  </Button>
                </div>

                <Button onClick={handleCreate} className="bg-[#C9A227] hover:bg-[#B8860B] w-full">Créer le sondage</Button>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : (
            <div className="space-y-3">
              {sondages.map((s) => (
                <Card key={s.id} className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
                  <CardContent className="pt-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">{s.titre}</h3>
                      <p className="text-[rgba(255,255,255,0.5)] text-xs mt-1">{s.questions.length} question(s)</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleViewResultats(s.id)} className="border-[#C9A227]/40 text-[#C9A227]">
                      <BarChart3 className="w-3.5 h-3.5 mr-1.5" /> Résultats
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {sondages.length === 0 && !isCreating && (
                <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
                  <CardContent className="pt-12 text-center">
                    <ClipboardList className="w-12 h-12 text-[rgba(255,255,255,0.2)] mx-auto mb-4" />
                    <p className="text-[rgba(255,255,255,0.6)]">Aucun sondage créé pour cette formation</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {resultats && (
            <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Résultats — {resultats.sondage.titre}</h3>
                  <Button size="sm" variant="ghost" onClick={() => setResultats(null)} className="text-[rgba(255,255,255,0.5)]">Fermer</Button>
                </div>
                <p className="text-[rgba(255,255,255,0.5)] text-sm mb-4">{resultats.reponses.length} réponse(s)</p>
                <div className="space-y-4">
                  {resultats.sondage.questions.map((q) => {
                    const valeurs: (string | number)[] = resultats.reponses
                      .map((r) => r.reponses.find((rr) => rr.question_id === q.id)?.valeur)
                      .filter((v): v is string | number => v !== undefined)
                    const moyenne = q.type === 'note' && valeurs.length > 0
                      ? (valeurs.reduce((s: number, v) => s + Number(v), 0) / valeurs.length).toFixed(1)
                      : null
                    return (
                      <div key={q.id} className="border-t border-[rgba(255,255,255,0.1)] pt-3">
                        <p className="text-white text-sm font-medium mb-2">{q.texte}</p>
                        {moyenne !== null ? (
                          <p className="text-[#C9A227] text-lg font-bold">{moyenne} / 5</p>
                        ) : (
                          <div className="space-y-1">
                            {valeurs.map((v, i) => (
                              <p key={i} className="text-[rgba(255,255,255,0.6)] text-sm bg-[rgba(255,255,255,0.03)] rounded px-2 py-1">{v}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
