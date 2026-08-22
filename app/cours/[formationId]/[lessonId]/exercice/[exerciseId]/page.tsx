"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/lib/auth-context"
import { ChevronLeft, CheckCircle, XCircle, Clock, Award, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

/**
 * Schéma Laravel réel :
 * - exercices: id, lecon_id, titre, description, type ('qcm'|'ouvert'|'mixte'),
 *   duree (minutes), note_max
 * - questions: id, exercice_id, contenu, type ('qcm'|'ouvert'), points, ordre
 * - choix: id, question_id, contenu, est_correct, ordre (options QCM)
 * - reponses: id, exercice_id, user_id, question_id, choix_id (QCM),
 *   reponse_texte (ouvert), score, statut ('en_attente'|'corrige'),
 *   commentaire_formateur — unique par (exercice_id, user_id, question_id)
 */

interface Choix {
  id: string
  contenu: string
  est_correct: boolean
  ordre: number
}

interface Question {
  id: string
  contenu: string
  type: "qcm" | "ouvert"
  points: number
  ordre: number
  choix?: Choix[]
}

interface Exercice {
  id: string
  titre: string
  description?: string
  type: "qcm" | "ouvert" | "mixte"
  duree: number | null
  note_max: number
}

interface Reponse {
  id: string
  question_id: string
  choix_id?: string | null
  reponse_texte?: string | null
  score: number | null
  statut: "en_attente" | "corrige"
}

export default function ExercisePage() {
  const params = useParams()
  const { user } = useAuth()
  const backHref = `/cours/${params.formationId}/${params.lessonId}`

  const [exercice, setExercice] = useState<Exercice | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, { choix_id?: string; reponse_texte?: string }>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [existingReponses, setExistingReponses] = useState<Reponse[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  useEffect(() => {
    let active = true
    async function bootstrap() {
      setLoading(true)
      if (!user) {
        if (active) setLoading(false)
        return
      }

      try {
        // GET /exercices/{id} charge déjà ->load('questions.choix') côté
        // Laravel — un seul appel suffit.
        const exerciceRes = await apiClient<Exercice & { questions?: Question[] }>(`/exercices/${params.exerciseId}`)
        const questionsList = ((exerciceRes.data as any)?.questions || []).sort(
          (a: Question, b: Question) => a.ordre - b.ordre,
        )
        const withChoix = questionsList.map((q: any) => ({
          ...q,
          choix: q.type === 'qcm' ? [...(q.choix || [])].sort((a: any, b: any) => a.ordre - b.ordre) : [],
        }))

        if (!active) return

        if (exerciceRes.data) {
          setExercice(exerciceRes.data)
          if (exerciceRes.data.duree) {
            setTimeLeft(exerciceRes.data.duree * 60)
          }
        }
        setQuestions(withChoix)

        // Vérifie si l'étudiant a déjà répondu (résultats disponibles via
        // GET /exercices/{id}/resultats, déjà scopé à l'utilisateur connecté
        // côté Laravel par défaut).
        const reponsesRes = await apiClient<Reponse[]>(`/exercices/${params.exerciseId}/resultats`)
        const reponses = reponsesRes.data || []
        if (reponses.length > 0) {
          setExistingReponses(reponses)
          const prefilled: Record<string, { choix_id?: string; reponse_texte?: string }> = {}
          reponses.forEach((r) => {
            prefilled[r.question_id] = { choix_id: r.choix_id ?? undefined, reponse_texte: r.reponse_texte ?? undefined }
          })
          setAnswers(prefilled)
          setShowResults(true)
        }
      } catch (error) {
        console.error("Error loading exercise:", error)
      }

      setLoading(false)
    }
    bootstrap()
    return () => {
      active = false
    }
  }, [params.exerciseId, user])

  // Minuteur
  useEffect(() => {
    if (timeLeft === null || showResults) return
    if (timeLeft <= 0) {
      handleSubmit()
      return
    }
    const timer = setInterval(() => setTimeLeft((prev) => (prev ? prev - 1 : 0)), 1000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, showResults])

  const handleChoixAnswer = (questionId: string, choixId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { choix_id: choixId } }))
  }

  const handleTextAnswer = (questionId: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { reponse_texte: text } }))
  }

  const handleSubmit = useCallback(async () => {
    if (!exercice || !user || submitting || showResults) return
    setSubmitting(true)

    try {
      // Le vrai backend (POST /exercices/{id}/soumettre) attend TOUTES les
      // réponses en un seul appel, sous la clé "reponses", et note lui-même
      // automatiquement les QCM côté serveur (pas besoin de le faire ici).
      const reponses = questions.map((q) => {
        const answer = answers[q.id]
        return {
          question_id: q.id,
          choix_id: answer?.choix_id ?? null,
          reponse_texte: answer?.reponse_texte ?? null,
        }
      })

      const res = await apiClient<Reponse[]>(
        `/exercices/${exercice.id}/soumettre`,
        { method: 'POST', body: JSON.stringify({ reponses }) },
      )

      setExistingReponses(res.data || [])
      setShowResults(true)
    } catch (error) {
      console.error('[exercice submission error]:', error)
    } finally {
      setSubmitting(false)
    }
  }, [exercice, user, questions, answers, submitting, showResults])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A227]" />
      </div>
    )
  }

  if (!exercice || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="mb-4">Exercice non trouvé ou sans questions.</p>
          <Link href={backHref} className="text-[#C9A227] hover:underline">
            Retour à la leçon
          </Link>
        </div>
      </div>
    )
  }

  if (showResults) {
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)
    const gradedPoints = existingReponses.reduce((sum, r) => sum + (r.score ?? 0), 0)
    const pendingCount = existingReponses.filter((r) => r.statut === "en_attente").length
    const percentage = totalPoints > 0 ? Math.round((gradedPoints / totalPoints) * 100) : 0

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0D2545] to-[#1a3a5c] p-8 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white rounded-2xl p-8 text-center">
          <Award className="w-16 h-16 text-[#C9A227] mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2 text-[#0D2545]">Réponses enregistrées</h1>
          <div className="text-6xl font-bold text-[#C9A227] my-6">{percentage}%</div>
          <p className="text-lg text-gray-600 mb-2">
            {gradedPoints} / {totalPoints} points (questions déjà corrigées)
          </p>
          {pendingCount > 0 && (
            <p className="text-sm text-amber-600 bg-amber-50 rounded-lg p-3 mb-4">
              {pendingCount} question{pendingCount > 1 ? "s" : ""} ouverte{pendingCount > 1 ? "s" : ""} en attente de
              correction par ton formateur — le score final peut encore évoluer.
            </p>
          )}
          <Link href={backHref}>
            <Button className="bg-[#0D2545] hover:bg-[#0a1d2e]">Retour au cours</Button>
          </Link>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D2545] to-[#1a3a5c] p-8">
      <div className="max-w-3xl mx-auto">
        <Link href={backHref} className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 text-sm">
          <ChevronLeft className="w-4 h-4" />
          Retour à la leçon
        </Link>

        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">{exercice.titre}</h1>
          {timeLeft !== null && (
            <div className="text-white text-2xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>
          )}
        </div>

        {exercice.description && <p className="text-white/70 mb-6">{exercice.description}</p>}

        <div className="mb-6 bg-white rounded-lg overflow-hidden">
          <div className="h-2 bg-[#C9A227] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <div className="bg-white rounded-2xl p-8 mb-6">
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">
              Question {currentQuestion + 1} de {questions.length} — {question.points} point
              {question.points > 1 ? "s" : ""}
            </p>
            <h2 className="text-2xl font-bold text-[#0D2545] mb-4">{question.contenu}</h2>
          </div>

          {question.type === "qcm" ? (
            <div className="space-y-3">
              {question.choix?.map((choix) => (
                <label
                  key={choix.id}
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    checked={answers[question.id]?.choix_id === choix.id}
                    onChange={() => handleChoixAnswer(question.id, choix.id)}
                    className="mr-3"
                  />
                  <span>{choix.contenu}</span>
                </label>
              ))}
            </div>
          ) : (
            <Textarea
              value={answers[question.id]?.reponse_texte || ""}
              onChange={(e) => handleTextAnswer(question.id, e.target.value)}
              placeholder="Ta réponse..."
              className="w-full"
              rows={5}
            />
          )}
        </div>

        <div className="flex justify-between gap-4">
          <Button
            onClick={() => setCurrentQuestion((p) => Math.max(0, p - 1))}
            disabled={currentQuestion === 0}
            variant="outline"
            className="bg-white"
          >
            Précédent
          </Button>

          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-[#C9A227] hover:bg-[#E8C050] text-[#0D2545]"
            >
              {submitting ? "Envoi..." : "Soumettre"}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestion((p) => Math.min(questions.length - 1, p + 1))}
              className="bg-[#0D2545] hover:bg-[#0a1d2e]"
            >
              Suivant
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
