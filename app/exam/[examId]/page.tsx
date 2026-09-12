"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/lib/auth-context"
import { ChevronLeft, Clock, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

/**
 * Schéma Laravel réel :
 * - examens: type, titre, description, duree_minutes, bareme_pts,
 *   formation_id, avec questions.choix imbriquées (même principe que les
 *   exercices, ExamenService::create())
 * - Soumission groupée : POST /examens/{id}/soumettre avec { reponses: [...] }
 *   → crée un Resultat (score/statut), pas de détail par question conservé
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

interface Examen {
  id: string
  titre: string
  description?: string
  duree_minutes: number
  bareme_pts: number
  questions?: Question[]
}

interface Resultat {
  id: string
  score: number
  statut: "reussi" | "echoue" | "en cours"
}

export default function ExamPage() {
  const params = useParams()
  const { user } = useAuth()
  const backHref = "/dashboard/student"

  const [examen, setExamen] = useState<Examen | null>(null)
  const [answers, setAnswers] = useState<Record<string, { choix_id?: string; reponse_texte?: string }>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [resultat, setResultat] = useState<Resultat | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  useEffect(() => {
    let active = true
    async function bootstrap() {
      setLoading(true)
      try {
        const res = await apiClient<Examen>(`/examens/${params.examId}`)
        if (!active) return
        if (res.data) {
          setExamen(res.data)
          if (res.data.duree_minutes) setTimeLeft(res.data.duree_minutes * 60)
        }
      } catch (error) {
        console.error("Error loading examen:", error)
      }
      setLoading(false)
    }
    bootstrap()
    return () => {
      active = false
    }
  }, [params.examId])

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

  const questions = (examen?.questions || []).slice().sort((a, b) => a.ordre - b.ordre)

  const handleChoixAnswer = (questionId: string, choixId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { choix_id: choixId } }))
  }

  const handleTextAnswer = (questionId: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { reponse_texte: text } }))
  }

  const handleSubmit = useCallback(async () => {
    if (!examen || !user || submitting || showResults) return
    setSubmitting(true)

    try {
      // CORRIGÉ: n'envoyait que choix_id — le texte des réponses aux
      // questions ouvertes n'était jamais transmis au backend, donc
      // jamais enregistré, rendant toute correction manuelle impossible.
      const reponses = questions.map((q) => {
        const answer = answers[q.id]
        return { question_id: q.id, choix_id: answer?.choix_id ?? null, reponse_texte: answer?.reponse_texte ?? null }
      })

      const res = await apiClient<Resultat>(`/examens/${examen.id}/soumettre`, {
        method: "POST",
        body: JSON.stringify({ reponses }),
      })

      setResultat(res.data ?? null)
      setShowResults(true)
    } catch (error) {
      console.error("[examen submission error]:", error)
    } finally {
      setSubmitting(false)
    }
  }, [examen, user, questions, answers, submitting, showResults])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Charte graphique unifiée avec le reste de la plateforme (voir même
  // correctif appliqué à la page d'évaluation/exercice) : fond #0a0a1a,
  // cartes #0d0d1a, texte blanc/gris clair pour un contraste suffisant.
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A227]" />
      </div>
    )
  }

  if (!examen || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="mb-4 text-[rgba(255,255,255,0.7)]">Certification non trouvée ou sans questions.</p>
          <Link href={backHref} className="text-[#C9A227] hover:underline">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    )
  }

  if (showResults) {
    const statutLabel = { reussi: "Réussi", echoue: "Échoué", "en cours": "En attente de correction" }
    const statutColor = {
      reussi: "text-green-400",
      echoue: "text-red-400",
      "en cours": "text-amber-300",
    }

    return (
      <div className="min-h-screen bg-[#0a0a1a] p-6 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-[#0d0d1a] border border-[rgba(255,255,255,0.05)] rounded-2xl p-8 text-center">
          <Award className="w-16 h-16 text-[#C9A227] mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2 text-white">Certification soumise</h1>
          {resultat && (
            <>
              <div className="text-6xl font-bold text-[#C9A227] my-6">
                {resultat.score} / {examen.bareme_pts}
              </div>
              <p className={`text-lg font-semibold ${statutColor[resultat.statut]}`}>
                {statutLabel[resultat.statut]}
              </p>
              {resultat.statut === "en cours" && (
                <p className="text-sm text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mt-4">
                  Certaines questions ouvertes doivent encore être corrigées par ton formateur — le score final peut évoluer.
                </p>
              )}
            </>
          )}
          <Link href={backHref}>
            <Button className="bg-[#C9A227] hover:bg-[#B8860B] text-[#0a0a1a] font-semibold mt-6">
              Retour au tableau de bord
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-[#0a0a1a] p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-[rgba(255,255,255,0.6)] hover:text-white mb-4 text-sm transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour
        </Link>

        <div className="mb-6 flex justify-between items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">{examen.titre}</h1>
          {timeLeft !== null && (
            <div
              className={`text-xl md:text-2xl font-bold flex items-center gap-2 shrink-0 ${
                timeLeft <= 60 ? 'text-red-400' : 'text-white'
              }`}
            >
              <Clock className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>
          )}
        </div>

        {examen.description && <p className="text-[rgba(255,255,255,0.6)] mb-6">{examen.description}</p>}

        <div className="mb-6 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden h-2">
          <div
            className="h-full bg-[#C9A227] transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="bg-[#0d0d1a] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 md:p-8 mb-6">
          <div className="mb-6">
            <p className="text-sm text-[rgba(255,255,255,0.5)] mb-2">
              Question {currentQuestion + 1} de {questions.length} — {question.points} point{question.points > 1 ? "s" : ""}
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{question.contenu}</h2>
          </div>

          {question.type === "qcm" ? (
            <div className="space-y-3" role="radiogroup" aria-label={question.contenu}>
              {question.choix?.map((choix) => {
                const selected = answers[question.id]?.choix_id === choix.id
                return (
                  <label
                    key={choix.id}
                    className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer border transition-colors ${
                      selected
                        ? 'border-[#C9A227] bg-[#C9A227]/10'
                        : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.25)] hover:bg-[rgba(255,255,255,0.03)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      checked={selected}
                      onChange={() => handleChoixAnswer(question.id, choix.id)}
                      className="w-4 h-4 accent-[#C9A227] shrink-0"
                    />
                    <span className="text-white">{choix.contenu}</span>
                  </label>
                )
              })}
            </div>
          ) : (
            <Textarea
              value={answers[question.id]?.reponse_texte || ""}
              onChange={(e) => handleTextAnswer(question.id, e.target.value)}
              placeholder="Ta réponse..."
              className="w-full bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.35)]"
              rows={5}
            />
          )}
        </div>

        <div className="flex justify-between gap-4">
          <Button
            onClick={() => setCurrentQuestion((p) => Math.max(0, p - 1))}
            disabled={currentQuestion === 0}
            variant="outline"
            className="border-[rgba(255,255,255,0.15)] text-white bg-transparent hover:bg-[rgba(255,255,255,0.05)] disabled:opacity-40"
          >
            Précédent
          </Button>

          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-[#C9A227] hover:bg-[#B8860B] text-[#0a0a1a] font-semibold"
            >
              {submitting ? "Envoi..." : "Soumettre"}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestion((p) => Math.min(questions.length - 1, p + 1))}
              className="bg-[#C9A227] hover:bg-[#B8860B] text-[#0a0a1a] font-semibold"
            >
              Suivant
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
