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
import { Edit, Trash2, Plus, ListChecks, X, GraduationCap, Award } from 'lucide-react'
import { SectionHeader, StatCard, FormationPills } from '@/components/professor/section-header'
import { ContentSidebar } from '@/components/professor/content-sidebar'
import { combine, required, minLength } from '@/lib/validators'

/**
 * Schéma Laravel réel :
 * - exercices: id, lecon_id, titre, description, type ('qcm'|'ouvert'|'mixte'),
 *   duree (minutes), note_max
 * - questions: id, exercice_id, contenu, type ('qcm'|'ouvert'), points, ordre
 * - choix: id, question_id, contenu, est_correct, ordre
 * Créer un exercice avec ses questions nécessite plusieurs appels
 * successifs (pas de blob JSON unique côté backend).
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

interface Exercise {
  id: string
  lecon_id: string
  titre: string
  description?: string
  type: 'qcm' | 'ouvert' | 'mixte'
  duree: number | null
  note_max: number
}

interface Formation {
  id: string
  titre: string
}

interface Module {
  id: string
  titre: string
  formation_id: string
}

interface Lesson {
  id: string
  titre: string
  module_id: string
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

export default function ExercisesPage() {
  const { user } = useAuth()

  const [formations, setFormations] = useState<Formation[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedFormation, setSelectedFormation] = useState('')
  const [selectedModule, setSelectedModule] = useState('')
  const [selectedLesson, setSelectedLesson] = useState('')

  const [exercises, setExercises] = useState<Exercise[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<'qcm' | 'ouvert' | 'mixte'>('qcm')
  const [duree, setDuree] = useState<number | ''>('')
  const [noteMax, setNoteMax] = useState(20)
  const [questions, setQuestions] = useState<QuestionForm[]>([emptyQuestion(0)])

  useEffect(() => {
    loadFormations()
  }, [])

  useEffect(() => {
    if (selectedFormation) loadModules()
  }, [selectedFormation])

  useEffect(() => {
    if (selectedModule) loadLessons()
  }, [selectedModule])

  useEffect(() => {
    if (selectedLesson) loadExercises()
  }, [selectedLesson])

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

  const loadModules = async () => {
    try {
      const res = await apiClient<Module[]>(`/modules?formation_id=${selectedFormation}`)
      const data = res.data || []
      setModules(data)
      setSelectedModule(data.length > 0 ? data[0].id : '')
    } catch (error) {
      console.error('Error loading modules:', error)
    }
  }

  const loadLessons = async () => {
    try {
      const res = await apiClient<Lesson[]>(`/lecons?module_id=${selectedModule}`)
      const data = res.data || []
      setLessons(data)
      setSelectedLesson(data.length > 0 ? data[0].id : '')
    } catch (error) {
      console.error('Error loading lessons:', error)
    }
  }

  const loadExercises = async () => {
    try {
      const res = await apiClient<Exercise[]>(`/exercices?lecon_id=${selectedLesson}`)
      setExercises(res.data || [])
    } catch (error) {
      console.error('Error loading exercises:', error)
    }
  }

  const resetForm = () => {
    setTitre('')
    setDescription('')
    setType('qcm')
    setDuree('')
    setNoteMax(20)
    setQuestions([emptyQuestion(0)])
    setEditingId(null)
    setIsCreating(false)
    setFormError('')
  }

  const handleEdit = async (ex: Exercise) => {
    setTitre(ex.titre)
    setDescription(ex.description || '')
    setType(ex.type)
    setDuree(ex.duree ?? '')
    setNoteMax(ex.note_max)
    setEditingId(ex.id)
    setIsCreating(true)

    try {
      // GET /exercices/{id} charge déjà ->load('questions.choix') côté
      // Laravel — un seul appel suffit, pas besoin de requêtes séparées.
      const res = await apiClient<any>(`/exercices/${ex.id}`)
      const qList = (res.data?.questions || []).sort((a: any, b: any) => a.ordre - b.ordre)
      const withChoix = qList.map((q: any) => ({
        ...q,
        choix: q.type === 'qcm' ? [...(q.choix || [])].sort((a: any, b: any) => a.ordre - b.ordre) : [],
      }))
      setQuestions(withChoix.length > 0 ? withChoix : [emptyQuestion(0)])
    } catch (error) {
      console.error('Error loading questions for edit:', error)
    }
  }

  const addQuestion = () => {
    setQuestions((prev) => [...prev, emptyQuestion(prev.length)])
  }

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, patch: Partial<QuestionForm>) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...patch } : q)))
  }

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
                if (ci !== cIndex) {
                  // Un seul bon choix par question QCM
                  return patch.est_correct ? { ...c, est_correct: false } : c
                }
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
    if (!selectedLesson) return 'Veuillez sélectionner une leçon.'
    if (!titre.trim()) return "Le titre de l'exercice est obligatoire."
    if (questions.length === 0) return 'Ajoutez au moins une question.'
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
      // Le vrai backend (StoreExerciceRequest/UpdateExerciceRequest) attend
      // UN SEUL appel imbriqué : l'exercice + son tableau "questions", et
      // chaque question QCM avec son propre tableau "choix" — pas des
      // appels séparés POST /questions puis POST /choix.
      const payload = {
        titre: titre.trim(),
        description: description.trim() || undefined,
        type,
        duree: duree === '' ? null : Number(duree),
        note_max: noteMax,
        lecon_id: selectedLesson,
        questions: questions.map((q, i) => ({
          ...(q.id ? { id: q.id } : {}),
          contenu: q.contenu.trim(),
          type: q.type,
          points: q.points,
          ordre: i,
          ...(q.type === 'qcm'
            ? {
                choix: q.choix.map((c, ci) => ({
                  ...(c.id ? { id: c.id } : {}),
                  contenu: c.contenu.trim(),
                  est_correct: c.est_correct,
                  ordre: ci,
                })),
              }
            : {}),
        })),
      }

      if (editingId) {
        await apiClient(`/exercices/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) })
      } else {
        await apiClient('/exercices', { method: 'POST', body: JSON.stringify(payload) })
      }

      await loadExercises()
      resetForm()
    } catch (error) {
      console.error('[v0] Error saving exercise:', error)
      setFormError("Une erreur est survenue lors de l'enregistrement.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet exercice ?')) return
    try {
      await apiClient(`/exercices/${id}`, { method: 'DELETE' })
      loadExercises()
    } catch (error) {
      console.error('Error deleting exercise:', error)
    }
  }

  return (
    <div className="flex gap-6 items-start">
      <ContentSidebar role="professor" />
      <div className="min-w-0 flex-1 space-y-6">
        <SectionHeader
          icon={<ListChecks className="h-7 w-7" />}
          title="Gestion des exercices"
          description="Créez des exercices QCM ou à questions ouvertes pour vos leçons."
          action={
            <Button onClick={() => (isCreating ? resetForm() : setIsCreating(true))} className="bg-[#C9A227] hover:bg-[#B8860B] text-white">
              <Plus className="mr-2 h-4 w-4" />
              {isCreating ? 'Annuler' : 'Nouvel exercice'}
            </Button>
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard label="Exercices" value={exercises.length} icon={<GraduationCap className="h-5 w-5" />} />
          <StatCard label="Note max moyenne" value={exercises.length ? Math.round(exercises.reduce((s, e) => s + e.note_max, 0) / exercises.length) : 0} icon={<Award className="h-5 w-5" />} />
        </div>

        <div className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1a1a2e] p-5">
          <div className="space-y-3">
            <p className="text-sm font-medium text-[rgba(255,255,255,0.6)]">Formation</p>
            <FormationPills formations={formations.map((f) => ({ id: f.id, name: f.titre }))} selected={selectedFormation} onSelect={setSelectedFormation} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-[rgba(255,255,255,0.6)]">Module</p>
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white">
                  <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)]">
                  {modules.map((m) => (
                    <SelectItem key={m.id} value={m.id} className="text-white">{m.titre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-[rgba(255,255,255,0.6)]">Leçon</p>
              <Select value={selectedLesson} onValueChange={setSelectedLesson}>
                <SelectTrigger className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white">
                  <SelectValue placeholder="Leçon" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)]">
                  {lessons.map((l) => (
                    <SelectItem key={l.id} value={l.id} className="text-white">{l.titre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isCreating && (
          <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
            <CardHeader>
              <CardTitle className="text-white">{editingId ? "Modifier l'exercice" : 'Créer un exercice'}</CardTitle>
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
                  required
                />

                <div className="space-y-2">
                  <Label className="text-[rgba(255,255,255,0.8)]">Description</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white" rows={3} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[rgba(255,255,255,0.8)]">Type</Label>
                    <Select value={type} onValueChange={(v) => setType(v as any)}>
                      <SelectTrigger className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)]">
                        <SelectItem value="qcm" className="text-white">QCM</SelectItem>
                        <SelectItem value="ouvert" className="text-white">Ouvert</SelectItem>
                        <SelectItem value="mixte" className="text-white">Mixte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[rgba(255,255,255,0.8)]">Durée (min)</Label>
                    <Input type="number" value={duree} onChange={(e) => setDuree(e.target.value ? parseInt(e.target.value) : '')} className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[rgba(255,255,255,0.8)]">Note max</Label>
                    <Input type="number" value={noteMax} onChange={(e) => setNoteMax(parseInt(e.target.value) || 20)} className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white" />
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
                              <input
                                type="radio"
                                checked={c.est_correct}
                                onChange={() => updateChoix(qIndex, cIndex, { est_correct: true })}
                              />
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
          {exercises.map((ex) => (
            <Card key={ex.id} className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
              <CardContent className="pt-6 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{ex.titre}</h3>
                  {ex.description && <p className="text-[rgba(255,255,255,0.6)] text-sm mb-2">{ex.description}</p>}
                  <div className="flex items-center gap-4 text-xs text-[rgba(255,255,255,0.5)]">
                    <span>{ex.type}</span>
                    <span>{ex.note_max} points</span>
                    {ex.duree ? <span>{ex.duree} min</span> : null}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleEdit(ex)} variant="outline" size="sm" className="border-[rgba(255,255,255,0.2)] text-white">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => handleDelete(ex.id)} variant="outline" size="sm" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {exercises.length === 0 && !isCreating && (
            <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
              <CardContent className="pt-12 text-center">
                <ListChecks className="w-12 h-12 text-[rgba(255,255,255,0.2)] mx-auto mb-4" />
                <p className="text-[rgba(255,255,255,0.6)]">Aucun exercice créé</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
