'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api/client'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ValidatedInput } from '@/components/ui/validated-input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Edit, Trash2, Plus, X, FileCheck, Award } from 'lucide-react'
import { alertSuccess, alertError, confirmDelete } from '@/lib/alerts'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { StatCard, FormationPills } from '@/components/professor/section-header'
import { combine, required, minLength } from '@/lib/validators'

/**
 * Schéma Laravel réel :
 * - examens: id, type ('quiz'|'examen'), titre, description,
 *   duree_minutes, bareme_pts, formation_id (rattaché à la FORMATION,
 *   pas à une leçon comme les exercices)
 * - Création avec questions/choix imbriqués, même principe que les
 *   exercices (ExamenService::create())
 */

interface Choix {
  id?: string
  contenu: string
  est_correct: boolean
  ordre: number
}

interface QuestionForm {
  id?: string
  contenu: string
  type: 'qcm' | 'ouvert'
  points: number
  ordre: number
  choix: Choix[]
}

interface Examen {
  id: string
  type: 'quiz' | 'examen'
  titre: string
  description?: string
  duree_minutes: number
  bareme_pts: number
  formation_id: string
}

interface Formation {
  id: string
  titre: string
}

function emptyQuestion(ordre: number): QuestionForm {
  return {
    contenu: '',
    type: 'qcm',
    points: 1,
    ordre,
    choix: [
      { contenu: '', est_correct: true, ordre: 0 },
      { contenu: '', est_correct: false, ordre: 1 },
    ],
  }
}

export default function ExamsPage() {
  const { user } = useAuth()

  const [formations, setFormations] = useState<Formation[]>([])
  const [selectedFormation, setSelectedFormation] = useState('')
  const [examens, setExamens] = useState<Examen[]>([])

  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<'quiz' | 'examen'>('examen')
  const [dureeMinutes, setDureeMinutes] = useState(60)
  const [baremePts, setBaremePts] = useState(20)
  const [questions, setQuestions] = useState<QuestionForm[]>([emptyQuestion(0)])

  useEffect(() => {
    loadFormations()
  }, [])

  useEffect(() => {
    if (selectedFormation) loadExamens()
  }, [selectedFormation])

  const loadFormations = async () => {
    try {
      if (!user) return
      const res = await apiClient<Formation[]>(`/formations?user_id=${user.id}`)
      const list = res.data || []
      setFormations(list)
      if (list.length > 0) setSelectedFormation(list[0].id)
    } catch (error) {
      console.error('Error loading formations:', error)
    }
  }

  const loadExamens = async () => {
    try {
      const res = await apiClient<Examen[]>('/examens')
      setExamens((res.data || []).filter((e) => e.formation_id === selectedFormation))
    } catch (error) {
      console.error('Error loading examens:', error)
    }
  }

  const resetForm = () => {
    setTitre('')
    setDescription('')
    setType('examen')
    setDureeMinutes(60)
    setBaremePts(20)
    setQuestions([emptyQuestion(0)])
    setEditingId(null)
    setIsCreating(false)
    setFormError('')
  }

  const handleEdit = (ex: Examen) => {
    setTitre(ex.titre)
    setDescription(ex.description || '')
    setType(ex.type)
    setDureeMinutes(ex.duree_minutes)
    setBaremePts(ex.bareme_pts)
    setEditingId(ex.id)
    setIsCreating(true)
    // NOTE: UpdateExamenRequest ne semble pas recharger les questions
    // existantes ici — à compléter si l'édition de questions déjà
    // créées s'avère nécessaire en pratique.
    setQuestions([emptyQuestion(0)])
  }

  const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion(prev.length)])
  const removeQuestion = (index: number) => setQuestions((prev) => prev.filter((_, i) => i !== index))
  const updateQuestion = (index: number, patch: Partial<QuestionForm>) =>
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...patch } : q)))

  const addChoix = (qIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex ? { ...q, choix: [...q.choix, { contenu: '', est_correct: false, ordre: q.choix.length }] } : q,
      ),
    )
  }

  const updateChoix = (qIndex: number, cIndex: number, patch: Partial<Choix>) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              choix: q.choix.map((c, ci) => {
                if (ci !== cIndex) return patch.est_correct ? { ...c, est_correct: false } : c
                return { ...c, ...patch }
              }),
            }
          : q,
      ),
    )
  }

  const removeChoix = (qIndex: number, cIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, choix: q.choix.filter((_, ci) => ci !== cIndex) } : q)),
    )
  }

  const validate = () => {
    if (!selectedFormation) return 'Veuillez sélectionner une formation.'
    if (!titre.trim()) return "Le titre de l'examen est obligatoire."
    for (const [i, q] of questions.entries()) {
      if (!q.contenu.trim()) return `La question ${i + 1} ne peut pas être vide.`
      if (q.type === 'qcm') {
        if (q.choix.length < 2) return `La question ${i + 1} doit avoir au moins 2 choix.`
        if (!q.choix.some((c) => c.est_correct)) return `La question ${i + 1} doit avoir une bonne réponse.`
        if (q.choix.some((c) => !c.contenu.trim())) return `Tous les choix de la question ${i + 1} doivent être remplis.`
      }
    }
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) {
      setFormError(err)
      return
    }
    setFormError('')
    setSaving(true)

    try {
      const payload = {
        type,
        titre: titre.trim(),
        description: description.trim() || undefined,
        duree_minutes: dureeMinutes,
        bareme_pts: baremePts,
        formation_id: selectedFormation,
        questions: questions.map((q, i) => ({
          contenu: q.contenu.trim(),
          type: q.type,
          points: q.points,
          ordre: i,
          ...(q.type === 'qcm'
            ? { choix: q.choix.map((c, ci) => ({ contenu: c.contenu.trim(), est_correct: c.est_correct, ordre: ci })) }
            : {}),
        })),
      }

      if (editingId) {
        await apiClient(`/examens/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) })
      } else {
        await apiClient('/examens', { method: 'POST', body: JSON.stringify(payload) })
      }

      await loadExamens()
      resetForm()
      alertSuccess(editingId ? "Examen modifié avec succès." : 'Examen créé avec succès.')
    } catch (error: any) {
      console.error('[v0] Error saving examen:', error)
      const msg = "Une erreur est survenue lors de l'enregistrement."
      setFormError(msg)
      alertError(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, titre?: string) => {
    const confirmed = await confirmDelete(titre)
    if (!confirmed) return
    try {
      await apiClient(`/examens/${id}`, { method: 'DELETE' })
      loadExamens()
      alertSuccess('Examen supprimé avec succès.')
    } catch (error: any) {
      console.error('Error deleting examen:', error)
      alertError(error?.message || 'Erreur lors de la suppression')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Gestion des examens finaux" subtitle="Créez des examens finaux ou quiz pour vos formations" />

        <div className="p-4 md:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <FormationPills formations={formations.map((f) => ({ id: f.id, name: f.titre }))} selected={selectedFormation} onSelect={setSelectedFormation} />
            <Button onClick={() => (isCreating ? resetForm() : setIsCreating(true))} className="bg-[#C9A227] hover:bg-[#B8860B] text-white shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              {isCreating ? 'Annuler' : 'Nouvel examen final'}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard label="Examens" value={examens.length} icon={<FileCheck className="h-5 w-5" />} />
            <StatCard label="Barème moyen" value={examens.length ? Math.round(examens.reduce((s, e) => s + e.bareme_pts, 0) / examens.length) : 0} icon={<Award className="h-5 w-5" />} />
          </div>

          {isCreating && (
            <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
              <CardHeader>
                <CardTitle className="text-white">{editingId ? "Modifier l'examen final" : 'Créer un examen final'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {formError && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{formError}</div>
                  )}

                  <ValidatedInput
                    label="Titre"
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                    validator={combine(required("Le titre est obligatoire"), minLength(3))}
                    className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                  />

                  <div className="space-y-2">
                    <Label className="text-[rgba(255,255,255,0.8)]">Description</Label>
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white" rows={2} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[rgba(255,255,255,0.8)]">Type</Label>
                      <Select value={type} onValueChange={(v) => setType(v as any)}>
                        <SelectTrigger className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)]">
                          <SelectItem value="quiz" className="text-white">Quiz</SelectItem>
                          <SelectItem value="examen" className="text-white">Examen final</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[rgba(255,255,255,0.8)]">Durée (min)</Label>
                      <Input type="number" value={dureeMinutes} onChange={(e) => setDureeMinutes(parseInt(e.target.value) || 60)} className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[rgba(255,255,255,0.8)]">Barème (points)</Label>
                      <Input type="number" value={baremePts} onChange={(e) => setBaremePts(parseInt(e.target.value) || 20)} className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-[rgba(255,255,255,0.8)]">Questions</Label>
                      <Button type="button" onClick={addQuestion} size="sm" variant="outline" className="border-[#C9A227]/40 text-[#C9A227]">
                        <Plus className="h-4 w-4 mr-1" /> Ajouter une question
                      </Button>
                    </div>

                    {questions.map((q, qIndex) => (
                      <div key={qIndex} className="rounded-lg border border-[rgba(255,255,255,0.1)] p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <Textarea
                            value={q.contenu}
                            onChange={(e) => updateQuestion(qIndex, { contenu: e.target.value })}
                            placeholder={`Question ${qIndex + 1}`}
                            className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white flex-1"
                            rows={2}
                          />
                          <Button type="button" onClick={() => removeQuestion(qIndex)} size="sm" variant="outline" className="border-red-500/20 text-red-400">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex gap-3">
                          <Select value={q.type} onValueChange={(v) => updateQuestion(qIndex, { type: v as any })}>
                            <SelectTrigger className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)]">
                              <SelectItem value="qcm" className="text-white">QCM</SelectItem>
                              <SelectItem value="ouvert" className="text-white">Ouvert</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            type="number"
                            value={q.points}
                            onChange={(e) => updateQuestion(qIndex, { points: parseInt(e.target.value) || 1 })}
                            placeholder="Points"
                            className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white w-28"
                          />
                        </div>

                        {q.type === 'qcm' && (
                          <div className="space-y-2 pl-4 border-l-2 border-[rgba(201,162,39,0.3)]">
                            {q.choix.map((c, cIndex) => (
                              <div key={cIndex} className="flex items-center gap-2">
                                <input type="radio" checked={c.est_correct} onChange={() => updateChoix(qIndex, cIndex, { est_correct: true })} />
                                <Input
                                  value={c.contenu}
                                  onChange={(e) => updateChoix(qIndex, cIndex, { contenu: e.target.value })}
                                  placeholder={`Choix ${cIndex + 1}`}
                                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white flex-1"
                                />
                                <Button type="button" onClick={() => removeChoix(qIndex, cIndex)} size="sm" variant="ghost" className="text-red-400">
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            ))}
                            <Button type="button" onClick={() => addChoix(qIndex)} size="sm" variant="ghost" className="text-[#C9A227]">
                              <Plus className="h-3.5 w-3.5 mr-1" /> Ajouter un choix
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={saving} className="flex-1 bg-[#C9A227] hover:bg-[#B8860B] text-white">
                      {saving ? 'Enregistrement...' : editingId ? 'Modifier' : 'Créer'}
                    </Button>
                    <Button type="button" onClick={resetForm} variant="outline" className="flex-1 border-[rgba(255,255,255,0.2)] text-white">
                      Annuler
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {examens.map((ex) => (
              <Card key={ex.id} className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
                <CardContent className="pt-6 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{ex.titre}</h3>
                    {ex.description && <p className="text-[rgba(255,255,255,0.6)] text-sm mb-2">{ex.description}</p>}
                    <div className="flex items-center gap-4 text-xs text-[rgba(255,255,255,0.5)]">
                      <span>{ex.type}</span>
                      <span>{ex.bareme_pts} points</span>
                      <span>{ex.duree_minutes} min</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(ex)} variant="outline" size="sm" className="border-[rgba(255,255,255,0.2)] text-white">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDelete(ex.id, ex.titre)} variant="outline" size="sm" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {examens.length === 0 && !isCreating && (
              <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
                <CardContent className="pt-12 text-center">
                  <FileCheck className="w-12 h-12 text-[rgba(255,255,255,0.2)] mx-auto mb-4" />
                  <p className="text-[rgba(255,255,255,0.6)]">Aucun examen final créé pour cette formation</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
