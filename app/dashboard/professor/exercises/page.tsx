'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Edit, Trash2, Plus, CheckCircle2, Circle, ListChecks, X, GripVertical } from 'lucide-react'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct: number
  explanation?: string
}

interface Exercise {
  id: string
  lesson_id: string
  title: string
  description: string | null
  exercise_type: string
  content: { questions?: QuizQuestion[] }
  points: number
  time_limit_minutes: number | null
  order_index: number
  is_required: boolean
  lessons?: { title: string; module_id: string }
}

interface Formation {
  id: string
  name: string
}

interface Module {
  id: string
  title: string
  formation_id: string
}

interface Lesson {
  id: string
  title: string
  module_id: string
}

function emptyQuestion(): QuizQuestion {
  return {
    id: crypto.randomUUID(),
    question: '',
    options: ['', ''],
    correct: 0,
    explanation: '',
  }
}

export default function ExercisesPage() {
  const supabase = createClient()

  const [formations, setFormations] = useState<Formation[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])

  const [selectedFormation, setSelectedFormation] = useState('')
  const [selectedModule, setSelectedModule] = useState('')
  const [selectedLesson, setSelectedLesson] = useState('')

  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [points, setPoints] = useState(10)
  const [timeLimit, setTimeLimit] = useState(0)
  const [isRequired, setIsRequired] = useState(false)
  const [questions, setQuestions] = useState<QuizQuestion[]>([emptyQuestion()])

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
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return
      const { data, error } = await supabase
        .from('professor_formations')
        .select('formations(id, name)')
        .eq('professor_id', user.user.id)
      if (error) throw error
      const list = (data?.map((pf) => pf.formations).filter(Boolean) || []) as Formation[]
      setFormations(list)
      if (list.length > 0) setSelectedFormation(list[0].id)
    } catch (error) {
      console.error('Error loading formations:', error)
    }
  }

  const loadModules = async () => {
    try {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('formation_id', selectedFormation)
        .order('order_index')
      if (error) throw error
      setModules(data || [])
      setSelectedModule(data && data.length > 0 ? data[0].id : '')
    } catch (error) {
      console.error('Error loading modules:', error)
    }
  }

  const loadLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('id, title, module_id')
        .eq('module_id', selectedModule)
        .order('order_index')
      if (error) throw error
      setLessons(data || [])
      setSelectedLesson(data && data.length > 0 ? data[0].id : '')
    } catch (error) {
      console.error('Error loading lessons:', error)
    }
  }

  const loadExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*, lessons(title, module_id)')
        .eq('lesson_id', selectedLesson)
        .order('order_index')
      if (error) throw error
      setExercises((data as Exercise[]) || [])
    } catch (error) {
      console.error('Error loading exercises:', error)
    }
  }

  // ---- Question builder helpers ----
  const addQuestion = () => setQuestions((qs) => [...qs, emptyQuestion()])
  const removeQuestion = (qid: string) =>
    setQuestions((qs) => (qs.length > 1 ? qs.filter((q) => q.id !== qid) : qs))
  const updateQuestion = (qid: string, patch: Partial<QuizQuestion>) =>
    setQuestions((qs) => qs.map((q) => (q.id === qid ? { ...q, ...patch } : q)))
  const addOption = (qid: string) =>
    setQuestions((qs) => qs.map((q) => (q.id === qid ? { ...q, options: [...q.options, ''] } : q)))
  const updateOption = (qid: string, idx: number, value: string) =>
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === qid ? { ...q, options: q.options.map((o, i) => (i === idx ? value : o)) } : q,
      ),
    )
  const removeOption = (qid: string, idx: number) =>
    setQuestions((qs) =>
      qs.map((q) => {
        if (q.id !== qid || q.options.length <= 2) return q
        const options = q.options.filter((_, i) => i !== idx)
        let correct = q.correct
        if (idx === q.correct) correct = 0
        else if (idx < q.correct) correct = q.correct - 1
        return { ...q, options, correct }
      }),
    )

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setPoints(10)
    setTimeLimit(0)
    setIsRequired(false)
    setQuestions([emptyQuestion()])
    setEditingId(null)
    setIsCreating(false)
  }

  const handleEdit = (exercise: Exercise) => {
    setTitle(exercise.title)
    setDescription(exercise.description || '')
    setPoints(exercise.points)
    setTimeLimit(exercise.time_limit_minutes || 0)
    setIsRequired(exercise.is_required)
    const qs = exercise.content?.questions
    setQuestions(qs && qs.length > 0 ? qs.map((q) => ({ ...q, id: q.id || crypto.randomUUID() })) : [emptyQuestion()])
    setEditingId(exercise.id)
    setIsCreating(true)
  }

  const validate = (): string | null => {
    if (!title.trim()) return 'Le titre est requis.'
    if (!selectedLesson) return 'Veuillez sélectionner une leçon.'
    for (const [i, q] of questions.entries()) {
      if (!q.question.trim()) return `La question ${i + 1} est vide.`
      if (q.options.some((o) => !o.trim())) return `Toutes les options de la question ${i + 1} doivent être remplies.`
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) {
      alert(err)
      return
    }
    setIsLoading(true)
    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        exercise_type: 'qcm',
        content: { questions: questions.map((q) => ({ ...q, question: q.question.trim() })) },
        points,
        time_limit_minutes: timeLimit > 0 ? timeLimit : null,
        is_required: isRequired,
        lesson_id: selectedLesson,
      }
      if (editingId) {
        const { error } = await supabase.from('exercises').update(payload).eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('exercises')
          .insert({ ...payload, order_index: exercises.length })
        if (error) throw error
      }
      await loadExercises()
      resetForm()
    } catch (error) {
      console.error('Error saving exercise:', error)
      alert("Échec de l'enregistrement de l'exercice.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet exercice ?')) return
    try {
      const { error } = await supabase.from('exercises').delete().eq('id', id)
      if (error) throw error
      loadExercises()
    } catch (error) {
      console.error('Error deleting exercise:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Exercices &amp; QCM</h1>
          <p className="text-[rgba(255,255,255,0.6)] text-sm mt-1">
            Créez des quiz interactifs (approche H5P) pour chaque leçon de vos classes
          </p>
        </div>
        <Button
          onClick={() => (isCreating ? resetForm() : setIsCreating(true))}
          disabled={!selectedLesson}
          className="bg-[#C9A227] hover:bg-[#B8860B] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel exercice
        </Button>
      </div>

      {/* Selectors */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Classe / Formation</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedFormation} onValueChange={setSelectedFormation}>
              <SelectTrigger className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white">
                <SelectValue placeholder="Choisir" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)]">
                {formations.map((f) => (
                  <SelectItem key={f.id} value={f.id} className="text-white">
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Module</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedModule} onValueChange={setSelectedModule}>
              <SelectTrigger className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white">
                <SelectValue placeholder="Choisir" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)]">
                {modules.map((m) => (
                  <SelectItem key={m.id} value={m.id} className="text-white">
                    {m.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Leçon</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedLesson} onValueChange={setSelectedLesson}>
              <SelectTrigger className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white">
                <SelectValue placeholder="Choisir" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)]">
                {lessons.map((l) => (
                  <SelectItem key={l.id} value={l.id} className="text-white">
                    {l.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Builder */}
      {isCreating && (
        <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
          <CardHeader>
            <CardTitle className="text-white">
              {editingId ? "Modifier l'exercice" : 'Créer un exercice QCM'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-[rgba(255,255,255,0.8)]">Titre de l&apos;exercice</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Quiz sur les techniques de cuisson"
                    className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[rgba(255,255,255,0.8)]">Description (optionnelle)</Label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Consignes pour l'élève"
                    className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-[rgba(255,255,255,0.8)]">Points</Label>
                  <Input
                    type="number"
                    min={0}
                    value={points}
                    onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                    className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[rgba(255,255,255,0.8)]">Temps limite (min, 0 = aucun)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(parseInt(e.target.value) || 0)}
                    className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      checked={isRequired}
                      onChange={(e) => setIsRequired(e.target.checked)}
                      className="w-4 h-4 accent-[#C9A227]"
                    />
                    <span className="text-[rgba(255,255,255,0.7)] text-sm">Exercice obligatoire</span>
                  </label>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white">
                  <ListChecks className="w-5 h-5 text-[#C9A227]" />
                  <span className="font-semibold">Questions ({questions.length})</span>
                </div>

                {questions.map((q, qIndex) => (
                  <div
                    key={q.id}
                    className="rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] p-4 space-y-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C9A227] text-sm font-bold text-[#0a0a1a]">
                        {qIndex + 1}
                      </div>
                      <div className="flex-1 space-y-1">
                        <Label className="text-[rgba(255,255,255,0.8)]">Énoncé de la question</Label>
                        <Textarea
                          value={q.question}
                          onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
                          placeholder="Saisissez la question..."
                          className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                          rows={2}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQuestion(q.id)}
                        disabled={questions.length <= 1}
                        className="mt-7 text-[rgba(255,255,255,0.4)] hover:text-red-400 disabled:opacity-30"
                        aria-label="Supprimer la question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2 pl-10">
                      <Label className="text-[rgba(255,255,255,0.6)] text-xs">
                        Cliquez sur le cercle pour marquer la bonne réponse
                      </Label>
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuestion(q.id, { correct: oIndex })}
                            className="shrink-0"
                            aria-label={`Marquer l'option ${oIndex + 1} comme correcte`}
                          >
                            {q.correct === oIndex ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : (
                              <Circle className="w-5 h-5 text-[rgba(255,255,255,0.3)]" />
                            )}
                          </button>
                          <Input
                            value={opt}
                            onChange={(e) => updateOption(q.id, oIndex, e.target.value)}
                            placeholder={`Option ${oIndex + 1}`}
                            className={`bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white ${
                              q.correct === oIndex ? 'border-green-400/50' : ''
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => removeOption(q.id, oIndex)}
                            disabled={q.options.length <= 2}
                            className="shrink-0 text-[rgba(255,255,255,0.4)] hover:text-red-400 disabled:opacity-30"
                            aria-label="Supprimer l'option"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addOption(q.id)}
                        className="text-[#C9A227] hover:bg-[#C9A227]/10"
                      >
                        <Plus className="w-3 h-3 mr-1" /> Ajouter une option
                      </Button>

                      <div className="space-y-1 pt-2">
                        <Label className="text-[rgba(255,255,255,0.6)] text-xs">
                          Explication (affichée après réponse, optionnelle)
                        </Label>
                        <Input
                          value={q.explanation || ''}
                          onChange={(e) => updateQuestion(q.id, { explanation: e.target.value })}
                          placeholder="Pourquoi cette réponse est correcte..."
                          className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addQuestion}
                  className="w-full border-dashed border-[rgba(201,162,39,0.4)] text-[#C9A227] hover:bg-[#C9A227]/10"
                >
                  <Plus className="w-4 h-4 mr-2" /> Ajouter une question
                </Button>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[#C9A227] hover:bg-[#B8860B] text-white"
                >
                  {isLoading ? 'Enregistrement...' : editingId ? "Modifier l'exercice" : "Créer l'exercice"}
                </Button>
                <Button
                  type="button"
                  onClick={resetForm}
                  variant="outline"
                  className="flex-1 border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.05)]"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Exercises list */}
      {!selectedLesson ? (
        <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
          <CardContent className="py-12 text-center text-[rgba(255,255,255,0.5)]">
            Sélectionnez une formation, un module et une leçon pour gérer ses exercices.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {exercises.length === 0 && !isCreating && (
            <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
              <CardContent className="py-12 text-center text-[rgba(255,255,255,0.5)]">
                Aucun exercice pour cette leçon. Cliquez sur « Nouvel exercice » pour en créer un.
              </CardContent>
            </Card>
          )}
          {exercises.map((exercise) => {
            const count = exercise.content?.questions?.length || 0
            return (
              <Card key={exercise.id} className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <ListChecks className="w-5 h-5 text-[#C9A227]" />
                        <h3 className="text-lg font-semibold text-white">{exercise.title}</h3>
                        <span className="px-2 py-1 bg-[#C9A227]/20 text-[#C9A227] rounded text-xs uppercase">
                          QCM
                        </span>
                        {exercise.is_required && (
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                            Obligatoire
                          </span>
                        )}
                      </div>
                      {exercise.description && (
                        <p className="text-[rgba(255,255,255,0.6)] text-sm mb-2">{exercise.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[rgba(255,255,255,0.5)]">
                        <span>{count} question{count > 1 ? 's' : ''}</span>
                        <span>{exercise.points} points</span>
                        {exercise.time_limit_minutes && <span>{exercise.time_limit_minutes} min</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(exercise)}
                        variant="outline"
                        size="sm"
                        className="border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.05)]"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(exercise.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
