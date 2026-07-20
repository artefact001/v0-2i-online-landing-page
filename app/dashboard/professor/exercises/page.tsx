'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Edit,
  Trash2,
  Plus,
  CheckCircle2,
  Circle,
  ListChecks,
  X,
  GraduationCap,
  ImageIcon,
  Video,
  Upload,
  FileQuestion,
  Award,
} from 'lucide-react'
import { SectionHeader, StatCard, FormationPills } from '@/components/professor/section-header'
import {
  type EvalQuestion,
  type EvaluationContent,
  type QuestionType,
  emptyQuestion,
} from '@/lib/evaluation-types'

interface Exercise {
  id: string
  lesson_id: string
  title: string
  description: string | null
  exercise_type: string
  content: EvaluationContent
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
  const [isExam, setIsExam] = useState(false)
  const [passScore, setPassScore] = useState(60)
  const [timeLimit, setTimeLimit] = useState(0)
  const [isRequired, setIsRequired] = useState(false)
  const [questions, setQuestions] = useState<EvalQuestion[]>([emptyQuestion()])

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
  const addQuestion = (type: QuestionType = 'qcm') =>
    setQuestions((qs) => [...qs, emptyQuestion(type)])
  const removeQuestion = (qid: string) =>
    setQuestions((qs) => (qs.length > 1 ? qs.filter((q) => q.id !== qid) : qs))
  const updateQuestion = (qid: string, patch: Partial<EvalQuestion>) =>
    setQuestions((qs) => qs.map((q) => (q.id === qid ? { ...q, ...patch } : q)))
  const changeType = (qid: string, type: QuestionType) =>
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === qid
          ? { ...q, type, options: type === 'qcm' ? (q.options.length ? q.options : ['', '']) : [] }
          : q,
      ),
    )
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

  const setMediaType = (qid: string, type: 'none' | 'image' | 'video') =>
    updateQuestion(qid, { media: type === 'none' ? null : { type, url: '' } })
  const setMediaUrl = (qid: string, url: string) =>
    setQuestions((qs) =>
      qs.map((q) => (q.id === qid && q.media ? { ...q, media: { ...q.media, url } } : q)),
    )

  const handleImageUpload = async (qid: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Image trop volumineuse (max 2 Mo). Utilisez plutôt une URL.')
      return
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
    setQuestions((qs) =>
      qs.map((q) => (q.id === qid ? { ...q, media: { type: 'image', url: dataUrl } } : q)),
    )
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setIsExam(false)
    setPassScore(60)
    setTimeLimit(0)
    setIsRequired(false)
    setQuestions([emptyQuestion()])
    setEditingId(null)
    setIsCreating(false)
  }

  const handleEdit = (exercise: Exercise) => {
    setTitle(exercise.title)
    setDescription(exercise.description || '')
    const content = exercise.content || ({} as EvaluationContent)
    setIsExam(content.is_exam ?? exercise.exercise_type === 'exam')
    setPassScore(content.pass_score ?? 60)
    setTimeLimit(exercise.time_limit_minutes || 0)
    setIsRequired(exercise.is_required)
    const qs = content.questions
    setQuestions(
      qs && qs.length > 0
        ? qs.map((q) => ({
            ...emptyQuestion(q.type || 'qcm'),
            ...q,
            id: q.id || crypto.randomUUID(),
          }))
        : [emptyQuestion()],
    )
    setEditingId(exercise.id)
    setIsCreating(true)
  }

  const validate = (): string | null => {
    if (!title.trim()) return 'Le titre est requis.'
    if (!selectedLesson) return 'Veuillez sélectionner une leçon.'
    for (const [i, q] of questions.entries()) {
      if (!q.question.trim()) return `La question ${i + 1} est vide.`
      if (q.points <= 0) return `La question ${i + 1} doit valoir au moins 1 point.`
      if (q.type === 'qcm' && q.options.some((o) => !o.trim()))
        return `Toutes les options de la question ${i + 1} doivent être remplies.`
      if (q.type === 'open' && !(q.answerKey || '').trim())
        return `Indiquez la réponse attendue (mots-clés) pour la question ${i + 1}.`
    }
    return null
  }

  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate()
    if (err) {
      alert(err)
      return
    }
    setIsLoading(true)
    try {
      const content: EvaluationContent = {
        is_exam: isExam,
        pass_score: passScore,
        questions: questions.map((q) => ({ ...q, question: q.question.trim() })),
      }
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        exercise_type: isExam ? 'exam' : 'qcm',
        content,
        points: totalPoints,
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
      alert("Échec de l'enregistrement de l'évaluation.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette évaluation ?')) return
    try {
      const { error } = await supabase.from('exercises').delete().eq('id', id)
      if (error) throw error
      loadExercises()
    } catch (error) {
      console.error('Error deleting exercise:', error)
    }
  }

  const examCount = exercises.filter((ex) => (ex.content?.is_exam ?? ex.exercise_type === 'exam')).length

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<ListChecks className="h-7 w-7" />}
        title="Évaluations interactives"
        description="Créez des exercices et examens avec QCM, questions ouvertes, images et vidéos. Les examens réussis génèrent un certificat téléchargeable."
        action={
          <Button
            onClick={() => (isCreating ? resetForm() : setIsCreating(true))}
            disabled={!selectedLesson}
            className="bg-[#C9A227] hover:bg-[#B8860B] text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle évaluation
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Évaluations" value={exercises.length} icon={<FileQuestion className="h-5 w-5" />} />
        <StatCard label="Examens" value={examCount} icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard label="Exercices" value={exercises.length - examCount} icon={<ListChecks className="h-5 w-5" />} />
      </div>

      {/* Selectors */}
      <div className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1a1a2e] p-5">
        <div className="space-y-3">
          <p className="text-sm font-medium text-[rgba(255,255,255,0.6)]">Classe / Formation</p>
          <FormationPills formations={formations} selected={selectedFormation} onSelect={setSelectedFormation} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[rgba(255,255,255,0.6)]">Module</p>
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
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-[rgba(255,255,255,0.6)]">Leçon</p>
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
          </div>
        </div>
      </div>

      {/* Builder */}
      {isCreating && (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border border-[rgba(201,162,39,0.25)] bg-[#1a1a2e] p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {editingId ? 'Modifier l\u2019évaluation' : 'Créer une évaluation'}
            </h2>
            <div className="flex items-center gap-1 rounded-lg bg-[rgba(255,255,255,0.05)] p-1">
              <button
                type="button"
                onClick={() => setIsExam(false)}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                  !isExam ? 'bg-[#C9A227] text-[#0a0a1a]' : 'text-[rgba(255,255,255,0.6)]'
                }`}
              >
                Exercice
              </button>
              <button
                type="button"
                onClick={() => setIsExam(true)}
                className={`flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                  isExam ? 'bg-[#C9A227] text-[#0a0a1a]' : 'text-[rgba(255,255,255,0.6)]'
                }`}
              >
                <Award className="h-4 w-4" />
                Examen
              </button>
            </div>
          </div>

          {isExam && (
            <div className="flex items-start gap-3 rounded-lg border border-[rgba(201,162,39,0.3)] bg-[#C9A227]/5 p-3 text-sm text-[rgba(255,255,255,0.8)]">
              <Award className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A227]" />
              <p>
                En mode examen, l&apos;élève qui atteint le score de réussite recevra automatiquement un
                <span className="text-[#C9A227]"> certificat PDF</span> aux couleurs de 2I Online.
              </p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-[rgba(255,255,255,0.8)]">Titre</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isExam ? 'Ex: Examen final - Techniques de cuisson' : 'Ex: Quiz sur les sauces'}
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
              <Label className="text-[rgba(255,255,255,0.8)]">Score de réussite (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={passScore}
                onChange={(e) => setPassScore(parseInt(e.target.value) || 0)}
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
              <label className="flex cursor-pointer items-center gap-2 pb-2">
                <input
                  type="checkbox"
                  checked={isRequired}
                  onChange={(e) => setIsRequired(e.target.checked)}
                  className="h-4 w-4 accent-[#C9A227]"
                />
                <span className="text-sm text-[rgba(255,255,255,0.7)]">Obligatoire</span>
              </label>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <ListChecks className="h-5 w-5 text-[#C9A227]" />
                <span className="font-semibold">Questions ({questions.length})</span>
              </div>
              <span className="rounded-full bg-[#C9A227]/10 px-3 py-1 text-sm font-medium text-[#C9A227]">
                Total : {totalPoints} pts
              </span>
            </div>

            {questions.map((q, qIndex) => (
              <div
                key={q.id}
                className="space-y-4 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C9A227] text-sm font-bold text-[#0a0a1a]">
                    {qIndex + 1}
                  </div>
                  <div className="flex-1 space-y-3">
                    {/* type + points row */}
                    <div className="flex flex-wrap items-center gap-3">
                      <Select value={q.type} onValueChange={(v) => changeType(q.id, v as QuestionType)}>
                        <SelectTrigger className="h-9 w-44 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)]">
                          <SelectItem value="qcm" className="text-white">QCM (choix multiple)</SelectItem>
                          <SelectItem value="open" className="text-white">Question ouverte</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-[rgba(255,255,255,0.6)]">Points</Label>
                        <Input
                          type="number"
                          min={1}
                          value={q.points}
                          onChange={(e) => updateQuestion(q.id, { points: parseInt(e.target.value) || 1 })}
                          className="h-9 w-20 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                        />
                      </div>
                      {/* media type */}
                      <div className="flex items-center gap-1 rounded-md bg-[rgba(255,255,255,0.05)] p-0.5">
                        <button
                          type="button"
                          onClick={() => setMediaType(q.id, 'none')}
                          className={`rounded px-2 py-1 text-xs ${!q.media ? 'bg-[#C9A227] text-[#0a0a1a]' : 'text-[rgba(255,255,255,0.6)]'}`}
                        >
                          Aucun
                        </button>
                        <button
                          type="button"
                          onClick={() => setMediaType(q.id, 'image')}
                          className={`flex items-center gap-1 rounded px-2 py-1 text-xs ${q.media?.type === 'image' ? 'bg-[#C9A227] text-[#0a0a1a]' : 'text-[rgba(255,255,255,0.6)]'}`}
                        >
                          <ImageIcon className="h-3 w-3" /> Image
                        </button>
                        <button
                          type="button"
                          onClick={() => setMediaType(q.id, 'video')}
                          className={`flex items-center gap-1 rounded px-2 py-1 text-xs ${q.media?.type === 'video' ? 'bg-[#C9A227] text-[#0a0a1a]' : 'text-[rgba(255,255,255,0.6)]'}`}
                        >
                          <Video className="h-3 w-3" /> Vidéo
                        </button>
                      </div>
                    </div>

                    <Textarea
                      value={q.question}
                      onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
                      placeholder="Saisissez l'énoncé de la question..."
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                      rows={2}
                    />

                    {/* media inputs */}
                    {q.media && (
                      <div className="space-y-2 rounded-md border border-dashed border-[rgba(255,255,255,0.15)] p-3">
                        <Input
                          value={q.media.url.startsWith('data:') ? '' : q.media.url}
                          onChange={(e) => setMediaUrl(q.id, e.target.value)}
                          placeholder={
                            q.media.type === 'image'
                              ? 'URL de l\u2019image (https://...)'
                              : 'URL de la vidéo (YouTube, MP4, ...)'
                          }
                          className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                        />
                        {q.media.type === 'image' && (
                          <div className="flex items-center gap-3">
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[rgba(255,255,255,0.05)] px-3 py-1.5 text-xs text-white hover:bg-[rgba(255,255,255,0.1)]">
                              <Upload className="h-3.5 w-3.5" />
                              Téléverser une image
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(q.id, e)}
                                className="hidden"
                              />
                            </label>
                            {q.media.url && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={q.media.url || '/placeholder.svg'}
                                alt="Aperçu"
                                className="h-12 w-12 rounded object-cover"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* QCM options */}
                    {q.type === 'qcm' && (
                      <div className="space-y-2">
                        <Label className="text-xs text-[rgba(255,255,255,0.6)]">
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
                                <CheckCircle2 className="h-5 w-5 text-green-400" />
                              ) : (
                                <Circle className="h-5 w-5 text-[rgba(255,255,255,0.3)]" />
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
                              <X className="h-4 w-4" />
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
                          <Plus className="mr-1 h-3 w-3" /> Ajouter une option
                        </Button>
                      </div>
                    )}

                    {/* Open answer key */}
                    {q.type === 'open' && (
                      <div className="space-y-1">
                        <Label className="text-xs text-[rgba(255,255,255,0.6)]">
                          Réponse attendue / mots-clés (séparés par des virgules)
                        </Label>
                        <Input
                          value={q.answerKey || ''}
                          onChange={(e) => updateQuestion(q.id, { answerKey: e.target.value })}
                          placeholder="Ex: béchamel, roux, lait"
                          className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                        />
                        <p className="text-[11px] text-[rgba(255,255,255,0.4)]">
                          L&apos;élève obtient les points si sa réponse contient tous les mots-clés.
                        </p>
                      </div>
                    )}

                    {/* Explanation */}
                    <div className="space-y-1">
                      <Label className="text-xs text-[rgba(255,255,255,0.6)]">
                        Explication (affichée après correction, optionnelle)
                      </Label>
                      <Input
                        value={q.explanation || ''}
                        onChange={(e) => updateQuestion(q.id, { explanation: e.target.value })}
                        placeholder="Pourquoi cette réponse est correcte..."
                        className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeQuestion(q.id)}
                    disabled={questions.length <= 1}
                    className="mt-1 text-[rgba(255,255,255,0.4)] hover:text-red-400 disabled:opacity-30"
                    aria-label="Supprimer la question"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => addQuestion('qcm')}
                className="border-[rgba(255,255,255,0.15)] text-white hover:border-[#C9A227]/50 hover:bg-[#C9A227]/10"
              >
                <Plus className="mr-2 h-4 w-4" /> Question QCM
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => addQuestion('open')}
                className="border-[rgba(255,255,255,0.15)] text-white hover:border-[#C9A227]/50 hover:bg-[#C9A227]/10"
              >
                <Plus className="mr-2 h-4 w-4" /> Question ouverte
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-[rgba(255,255,255,0.08)] pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={resetForm}
              className="text-[rgba(255,255,255,0.7)]"
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#C9A227] hover:bg-[#B8860B] text-white">
              {isLoading ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Créer l\u2019évaluation'}
            </Button>
          </div>
        </form>
      )}

      {/* Exercises list */}
      {!isCreating && (
        <div className="space-y-3">
          {exercises.map((ex) => {
            const exam = ex.content?.is_exam ?? ex.exercise_type === 'exam'
            const qCount = ex.content?.questions?.length || 0
            return (
              <div
                key={ex.id}
                className="group flex items-start gap-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1a1a2e] p-5 transition-all hover:border-[rgba(201,162,39,0.4)] hover:bg-[#1d1d33]"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                    exam ? 'bg-[#C9A227]/15 text-[#C9A227]' : 'bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.7)]'
                  }`}
                >
                  {exam ? <Award className="h-6 w-6" /> : <ListChecks className="h-6 w-6" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{ex.title}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        exam ? 'bg-[#C9A227]/20 text-[#C9A227]' : 'bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.6)]'
                      }`}
                    >
                      {exam ? 'Examen' : 'Exercice'}
                    </span>
                    {ex.is_required && (
                      <span className="rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-medium text-red-400">
                        Obligatoire
                      </span>
                    )}
                  </div>
                  {ex.description && (
                    <p className="mb-2 line-clamp-1 text-sm text-[rgba(255,255,255,0.55)]">{ex.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[rgba(255,255,255,0.5)]">
                    <span>{qCount} question(s)</span>
                    <span>{ex.points} points</span>
                    {ex.time_limit_minutes ? <span>{ex.time_limit_minutes} min</span> : null}
                    <span>Réussite : {ex.content?.pass_score ?? 60}%</span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    onClick={() => handleEdit(ex)}
                    variant="outline"
                    size="sm"
                    className="border-[rgba(255,255,255,0.15)] text-white hover:border-[#C9A227]/50 hover:bg-[#C9A227]/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(ex.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}

          {selectedLesson && exercises.length === 0 && (
            <div className="rounded-xl border border-dashed border-[rgba(255,255,255,0.15)] bg-[#1a1a2e] py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(255,255,255,0.04)]">
                <FileQuestion className="h-8 w-8 text-[rgba(255,255,255,0.25)]" />
              </div>
              <p className="text-[rgba(255,255,255,0.6)]">Aucune évaluation pour cette leçon</p>
              <Button
                onClick={() => setIsCreating(true)}
                variant="outline"
                className="mt-4 border-[#C9A227]/40 text-[#C9A227] hover:bg-[#C9A227]/10"
              >
                <Plus className="mr-2 h-4 w-4" />
                Créer la première évaluation
              </Button>
            </div>
          )}

          {!selectedLesson && (
            <div className="rounded-xl border border-dashed border-[rgba(255,255,255,0.15)] bg-[#1a1a2e] py-16 text-center text-[rgba(255,255,255,0.5)]">
              Sélectionnez une formation, un module et une leçon pour gérer les évaluations.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
