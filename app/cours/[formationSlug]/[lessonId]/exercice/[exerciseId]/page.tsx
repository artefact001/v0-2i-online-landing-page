"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import {
  ChevronLeft,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  ArrowRight,
  RotateCcw,
  Download,
  Camera,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  type EvaluationContent,
  type EvalQuestion,
  gradeEvaluation,
  type GradeResult,
} from "@/lib/evaluation-types"
import {
  downloadCertificate,
  generateCertificateNumber,
} from "@/lib/certificate-pdf"

interface LegacyTask {
  id: number
  task: string
  points: number
}

interface ExerciseRow {
  id: string
  title: string
  description: string
  exercise_type: string
  content: any
  points: number
  time_limit_minutes: number | null
}

interface Submission {
  id: string
  answers: Record<string, any>
  score: number | null
  max_score: number | null
  is_passed: boolean | null
  feedback: string | null
}

// Detect the new interactive evaluation format
function isEvaluationContent(content: any): content is EvaluationContent {
  return (
    content &&
    Array.isArray(content.questions) &&
    content.questions.length > 0 &&
    typeof content.questions[0]?.type === "string"
  )
}

function QuestionMedia({ question }: { question: EvalQuestion }) {
  if (!question.media?.url) return null
  if (question.media.type === "image") {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={question.media.url || "/placeholder.svg"}
        alt="Illustration de la question"
        className="mb-4 max-h-72 w-full rounded-lg object-contain bg-[#0a0f1a]"
      />
    )
  }
  return (
    <video
      src={question.media.url}
      controls
      className="mb-4 max-h-72 w-full rounded-lg bg-[#0a0f1a]"
    />
  )
}

export default function ExercisePage() {
  const params = useParams()
  const supabase = createClient()
  const backHref = `/cours/${params.formationSlug}/${params.lessonId}`

  const [exercise, setExercise] = useState<ExerciseRow | null>(null)
  const [profile, setProfile] = useState<{ id: string; name: string } | null>(null)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [result, setResult] = useState<GradeResult | null>(null)
  const submittedRef = useRef(false)

  // Single consolidated bootstrap: user + profile + exercise + existing submission.
  // This avoids the cascade of dependent useEffects that fired many redundant requests.
  useEffect(() => {
    let active = true
    async function bootstrap() {
      setLoading(true)
      // getSession reads locally (no network round-trip / no auth lock contention)
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) {
        if (active) setLoading(false)
        return
      }

      const [exerciseRes, profileRes, submissionRes] = await Promise.all([
        supabase.from("exercises").select("*").eq("id", params.exerciseId).single(),
        supabase.from("profiles").select("first_name, last_name").eq("id", user.id).single(),
        supabase
          .from("exercise_submissions")
          .select("*")
          .eq("exercise_id", params.exerciseId)
          .eq("student_id", user.id)
          .maybeSingle(),
      ])

      if (!active) return

      if (exerciseRes.data) {
        const parsed =
          typeof exerciseRes.data.content === "string"
            ? JSON.parse(exerciseRes.data.content)
            : exerciseRes.data.content
        setExercise({ ...exerciseRes.data, content: parsed })
        if (exerciseRes.data.time_limit_minutes) {
          setTimeLeft(exerciseRes.data.time_limit_minutes * 60)
        }
      }

      const p = profileRes.data
      setProfile({
        id: user.id,
        name: p ? `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "Étudiant" : "Étudiant",
      })

      if (submissionRes.data) {
        setAnswers(submissionRes.data.answers || {})
        if (submissionRes.data.score !== null) {
          setShowResults(true)
        }
      }

      setLoading(false)
    }
    bootstrap()
    return () => {
      active = false
    }
  }, [params.exerciseId, supabase])

  const evalContent: EvaluationContent | null =
    exercise && isEvaluationContent(exercise.content) ? exercise.content : null

  const handleSubmit = useCallback(async () => {
    if (!exercise || !profile) return
    if (submittedRef.current) return // guard against double submit / timer race
    submittedRef.current = true
    setSubmitting(true)

    try {
      let score: number | null = null
      let maxScore: number = exercise.points
      let isPassed: boolean | null = null
      let graded: GradeResult | null = null

      if (evalContent) {
        graded = gradeEvaluation(evalContent, answers)
        score = graded.score
        maxScore = graded.maxScore
        isPassed = graded.passed
        setResult(graded)
      }

      const { error } = await supabase.from("exercise_submissions").upsert(
        {
          exercise_id: exercise.id,
          student_id: profile.id,
          answers,
          score,
          max_score: maxScore,
          is_passed: isPassed,
          submitted_at: new Date().toISOString(),
          graded_at: evalContent ? new Date().toISOString() : null,
        },
        { onConflict: "exercise_id,student_id" },
      )
      if (error) {
        console.log("[v0] submission error:", error.message)
      }
      setShowResults(true)
    } finally {
      setSubmitting(false)
    }
  }, [exercise, profile, evalContent, answers, supabase])

  // Timer
  useEffect(() => {
    if (timeLeft === null || showResults) return
    if (timeLeft <= 0) {
      handleSubmit()
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev === null ? null : prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft, showResults, handleSubmit])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleRetry = () => {
    setAnswers({})
    setCurrentQuestion(0)
    setShowResults(false)
    setResult(null)
    submittedRef.current = false
    if (exercise?.time_limit_minutes) {
      setTimeLeft(exercise.time_limit_minutes * 60)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A227]" />
      </div>
    )
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center text-white">
        <p>Exercice non trouvé</p>
      </div>
    )
  }

  // ---- New interactive evaluation (QCM + open + media + points + exam) ----
  if (evalContent) {
    const questions = evalContent.questions
    const isExam = evalContent.is_exam

    // Results view
    if (showResults) {
      const graded = result ?? gradeEvaluation(evalContent, answers)
      const passed = graded.passed
      const canCertify = isExam && passed

      return (
        <div className="min-h-screen bg-[#0a0f1a] text-white">
          <header className="bg-[#0D1B2A] border-b border-[#1a2942] px-6 py-4">
            <Link href={backHref} className="text-[#C9A227] hover:underline flex items-center gap-2 text-sm">
              <ChevronLeft className="w-4 h-4" />
              Retour au cours
            </Link>
          </header>

          <main className="max-w-2xl mx-auto p-6">
            <div className="bg-[#0D1B2A] rounded-xl p-8 border border-[#1a2942] text-center">
              <div
                className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
                  passed ? "bg-green-500/20" : "bg-red-500/20"
                }`}
              >
                {passed ? (
                  <CheckCircle className="w-10 h-10 text-green-500" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-500" />
                )}
              </div>

              <h1 className="text-2xl font-bold mb-2">
                {passed ? "Félicitations !" : "Continuez vos efforts"}
              </h1>
              <p className="text-gray-400 mb-6">
                {isExam
                  ? passed
                    ? "Vous avez réussi l'examen. Téléchargez votre certificat ci-dessous."
                    : "Vous n'avez pas atteint la note minimale pour cet examen."
                  : passed
                    ? "Vous avez réussi cet exercice"
                    : "Vous pouvez réessayer pour améliorer votre score"}
              </p>

              <div className="mb-6">
                <div className="text-5xl font-bold text-[#C9A227] mb-2">{graded.percentage}%</div>
                <p className="text-gray-400">
                  {graded.score} / {graded.maxScore} points (seuil : {evalContent.pass_score}%)
                </p>
              </div>

              {canCertify && (
                <div className="mb-8">
                  <Button
                    onClick={() =>
                      downloadCertificate({
                        studentName: profile?.name || "Étudiant",
                        title: exercise.title,
                        score: graded.score,
                        maxScore: graded.maxScore,
                        percentage: graded.percentage,
                        certificateNumber: generateCertificateNumber(),
                      })
                    }
                    className="bg-[#C9A227] text-[#0D1B2A] hover:bg-[#E8C050]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger le certificat (PDF)
                  </Button>
                </div>
              )}

              {/* Per-question review */}
              <div className="text-left space-y-4 mb-8">
                <h3 className="font-semibold text-lg border-b border-[#1a2942] pb-2">Révision des réponses</h3>
                {questions.map((q, idx) => {
                  const pq = graded.perQuestion.find((p) => p.id === q.id)
                  const isCorrect = pq?.correct ?? false
                  const studentAnswer = answers[q.id]
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-lg border ${
                        isCorrect ? "border-green-500/50 bg-green-500/10" : "border-red-500/50 bg-red-500/10"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium">
                              Q{idx + 1}: {q.question}
                            </p>
                            <span className="text-xs text-[#C9A227] shrink-0">
                              {pq?.earned ?? 0}/{q.points} pts
                            </span>
                          </div>
                          {q.type === "qcm" ? (
                            <>
                              <p className="text-sm text-gray-400 mt-2">
                                Votre réponse:{" "}
                                <span className={isCorrect ? "text-green-400" : "text-red-400"}>
                                  {typeof studentAnswer === "number" ? q.options[studentAnswer] : "Non répondu"}
                                </span>
                              </p>
                              {!isCorrect && (
                                <p className="text-sm text-green-400 mt-1">Bonne réponse: {q.options[q.correct]}</p>
                              )}
                            </>
                          ) : (
                            <>
                              <p className="text-sm text-gray-400 mt-2">
                                Votre réponse:{" "}
                                <span className={isCorrect ? "text-green-400" : "text-red-400"}>
                                  {studentAnswer || "Non répondu"}
                                </span>
                              </p>
                              {q.answerKey && (
                                <p className="text-sm text-green-400 mt-1">Réponse attendue: {q.answerKey}</p>
                              )}
                            </>
                          )}
                          {q.explanation && (
                            <p className="text-xs text-gray-500 mt-2 italic">{q.explanation}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-4 justify-center">
                {!isExam && (
                  <Button onClick={handleRetry} variant="outline" className="border-[#1a2942] text-white hover:bg-[#1a2942]">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Réessayer
                  </Button>
                )}
                <Link href={backHref}>
                  <Button className="bg-[#C9A227] text-[#0D1B2A] hover:bg-[#E8C050]">
                    Continuer le cours
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </main>
        </div>
      )
    }

    // Quiz-taking view
    const question = questions[currentQuestion]
    const totalQuestions = questions.length
    const answeredCount = questions.filter((q) => answers[q.id] !== undefined && answers[q.id] !== "").length
    const totalPoints = questions.reduce((s, q) => s + (q.points || 0), 0)

    return (
      <div className="min-h-screen bg-[#0a0f1a] text-white">
        <header className="bg-[#0D1B2A] border-b border-[#1a2942] px-6 py-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <Link href={backHref} className="text-[#C9A227] hover:underline flex items-center gap-2 text-sm">
              <ChevronLeft className="w-4 h-4" />
              Quitter
            </Link>
            <div className="flex items-center gap-2">
              {isExam && (
                <span className="rounded-full bg-[#C9A227]/20 px-2.5 py-0.5 text-xs font-medium text-[#C9A227]">
                  Examen
                </span>
              )}
              <h1 className="font-semibold">{exercise.title}</h1>
            </div>
            {timeLeft !== null ? (
              <div className={`flex items-center gap-2 ${timeLeft < 60 ? "text-red-500" : "text-gray-400"}`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            ) : (
              <span className="text-xs text-gray-500">{totalPoints} points</span>
            )}
          </div>
        </header>

        <div className="bg-[#0D1B2A] px-6 py-2 border-b border-[#1a2942]">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>
                Question {currentQuestion + 1} sur {totalQuestions}
              </span>
              <span>{answeredCount} répondu(s)</span>
            </div>
            <Progress value={((currentQuestion + 1) / totalQuestions) * 100} className="h-2 bg-[#1a2942]" />
          </div>
        </div>

        <main className="max-w-3xl mx-auto p-6">
          {question && (
            <div className="bg-[#0D1B2A] rounded-xl p-8 border border-[#1a2942]">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-gray-500">
                  {question.type === "qcm" ? "Choix multiple" : "Question ouverte"}
                </span>
                <span className="text-xs text-[#C9A227]">{question.points} pts</span>
              </div>
              <QuestionMedia question={question} />
              <h2 className="text-xl font-semibold mb-6">{question.question}</h2>

              {question.type === "qcm" ? (
                <div className="space-y-3">
                  {question.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerChange(question.id, idx)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        answers[question.id] === idx
                          ? "border-[#C9A227] bg-[#C9A227]/20"
                          : "border-[#1a2942] hover:border-[#C9A227]/50 hover:bg-[#1a2942]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            answers[question.id] === idx ? "bg-[#C9A227] text-[#0D1B2A]" : "bg-[#1a2942] text-gray-400"
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <Textarea
                  placeholder="Saisissez votre réponse..."
                  value={answers[question.id] || ""}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="bg-[#1a2942] border-[#1a2942] text-white"
                  rows={5}
                />
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-6 justify-center">
            {questions.map((q, idx) => {
              const answered = answers[q.id] !== undefined && answers[q.id] !== ""
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    idx === currentQuestion
                      ? "bg-[#C9A227] text-[#0D1B2A]"
                      : answered
                        ? "bg-green-500/20 text-green-500 border border-green-500/50"
                        : "bg-[#1a2942] text-gray-400 hover:bg-[#1a2942]/80"
                  }`}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>

          <div className="flex justify-between mt-8">
            <Button
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              variant="outline"
              className="border-[#1a2942] text-white hover:bg-[#1a2942]"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>

            {currentQuestion === totalQuestions - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-[#C9A227] text-[#0D1B2A] hover:bg-[#E8C050]"
              >
                {submitting ? "Envoi..." : "Terminer"}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestion((prev) => Math.min(totalQuestions - 1, prev + 1))}
                className="bg-[#C9A227] text-[#0D1B2A] hover:bg-[#E8C050]"
              >
                Suivant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </main>
      </div>
    )
  }

  // ---- Legacy practical / TD exercise (kept for backward compatibility) ----
  if (exercise.exercise_type === "practical") {
    const tasks: LegacyTask[] = exercise.content?.tasks || []
    return (
      <div className="min-h-screen bg-[#0a0f1a] text-white">
        <header className="bg-[#0D1B2A] border-b border-[#1a2942] px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <Link href={backHref} className="text-[#C9A227] hover:underline flex items-center gap-2 text-sm mb-4">
              <ChevronLeft className="w-4 h-4" />
              Retour au cours
            </Link>
            <h1 className="text-xl font-bold">{exercise.title}</h1>
            <p className="text-gray-400 text-sm mt-1">Travaux Dirigés - {exercise.points} points</p>
          </div>
        </header>

        <main className="max-w-3xl mx-auto p-6">
          <div className="bg-[#0D1B2A] rounded-xl p-6 border border-[#1a2942] mb-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#C9A227]" />
              Instructions
            </h2>
            <p className="text-gray-300">{exercise.content?.instructions}</p>
          </div>

          <div className="space-y-4 mb-8">
            {tasks.map((task, idx) => (
              <div key={task.id} className="bg-[#0D1B2A] rounded-xl p-6 border border-[#1a2942]">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#C9A227]/20 text-[#C9A227] flex items-center justify-center font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-medium">{task.task}</p>
                      <span className="text-sm text-[#C9A227]">{task.points} pts</span>
                    </div>
                    <Textarea
                      placeholder="Décrivez votre réalisation..."
                      value={answers[task.id]?.text || ""}
                      onChange={(e) => handleAnswerChange(String(task.id), { ...answers[task.id], text: e.target.value })}
                      className="bg-[#1a2942] border-[#1a2942] text-white mb-3"
                      rows={3}
                    />
                    {exercise.content?.submission_type === "photo" && (
                      <div className="border-2 border-dashed border-[#1a2942] rounded-lg p-6 text-center hover:border-[#C9A227]/50 transition-colors cursor-pointer">
                        <Camera className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Cliquez pour ajouter une photo de votre réalisation</p>
                        <input type="file" accept="image/*" className="hidden" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={submitting} className="bg-[#C9A227] text-[#0D1B2A] hover:bg-[#E8C050]">
              {submitting ? "Envoi..." : "Soumettre le TD"}
              <Upload className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {showResults && (
            <div className="mt-6 bg-green-500/20 border border-green-500/50 rounded-xl p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">TD soumis avec succès !</h3>
              <p className="text-gray-400 text-sm">Votre professeur évaluera votre travail prochainement.</p>
            </div>
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center text-white">
      <p>Format d&apos;exercice non pris en charge</p>
    </div>
  )
}
