"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
  Camera,
  Upload
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

interface Question {
  id: number
  question: string
  options?: string[]
  correct?: number
}

interface Task {
  id: number
  task: string
  points: number
}

interface Exercise {
  id: string
  title: string
  description: string
  exercise_type: string
  content: {
    questions?: Question[]
    instructions?: string
    tasks?: Task[]
    submission_type?: string
  }
  points: number
  time_limit_minutes: number | null
}

interface Submission {
  id: string
  answers: Record<string, any>
  score: number | null
  max_score: number | null
  is_passed: boolean
  feedback: string | null
}

export default function ExercisePage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()

  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [user, setUser] = useState<any>(null)

  // Fetch user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase.auth])

  // Fetch exercise
  useEffect(() => {
    const fetchExercise = async () => {
      setLoading(true)
      
      const { data } = await supabase
        .from("exercises")
        .select("*")
        .eq("id", params.exerciseId)
        .single()
      
      if (data) {
        const parsedContent = typeof data.content === 'string' 
          ? JSON.parse(data.content) 
          : data.content
        setExercise({ ...data, content: parsedContent })
        
        if (data.time_limit_minutes) {
          setTimeLeft(data.time_limit_minutes * 60)
        }
      }
      
      setLoading(false)
    }
    
    fetchExercise()
  }, [params.exerciseId, supabase])

  // Fetch existing submission
  useEffect(() => {
    const fetchSubmission = async () => {
      if (!exercise || !user) return
      
      const { data } = await supabase
        .from("exercise_submissions")
        .select("*")
        .eq("exercise_id", exercise.id)
        .eq("student_id", user.id)
        .single()
      
      if (data) {
        setSubmission(data)
        setAnswers(data.answers || {})
        if (data.score !== null) {
          setShowResults(true)
        }
      }
    }
    
    fetchSubmission()
  }, [exercise, user, supabase])

  // Timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || showResults) return
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [timeLeft, showResults])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const calculateScore = () => {
    if (!exercise?.content.questions) return { score: 0, maxScore: 0 }
    
    let score = 0
    const maxScore = exercise.content.questions.length * 10
    
    exercise.content.questions.forEach(q => {
      if (answers[q.id] === q.correct) {
        score += 10
      }
    })
    
    return { score, maxScore }
  }

  const handleSubmit = async () => {
    if (!exercise || !user) return
    
    setSubmitting(true)
    
    const { score, maxScore } = exercise.exercise_type === 'qcm' 
      ? calculateScore() 
      : { score: null, maxScore: exercise.points }
    
    const isPassed = score !== null ? (score / maxScore) >= 0.6 : null
    
    const { data, error } = await supabase
      .from("exercise_submissions")
      .upsert({
        exercise_id: exercise.id,
        student_id: user.id,
        answers,
        score,
        max_score: maxScore,
        is_passed: isPassed,
        submitted_at: new Date().toISOString(),
        graded_at: exercise.exercise_type === 'qcm' ? new Date().toISOString() : null
      }, {
        onConflict: "exercise_id,student_id"
      })
      .select()
      .single()
    
    if (data) {
      setSubmission(data)
      setShowResults(true)
    }
    
    setSubmitting(false)
  }

  const handleRetry = () => {
    setAnswers({})
    setCurrentQuestion(0)
    setShowResults(false)
    setSubmission(null)
    if (exercise?.time_limit_minutes) {
      setTimeLeft(exercise.time_limit_minutes * 60)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A227]"></div>
      </div>
    )
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center text-white">
        <p>Exercice non trouve</p>
      </div>
    )
  }

  // QCM Results View
  if (showResults && exercise.exercise_type === 'qcm') {
    const { score, maxScore } = calculateScore()
    const percentage = Math.round((score / maxScore) * 100)
    const passed = percentage >= 60

    return (
      <div className="min-h-screen bg-[#0a0f1a] text-white">
        <header className="bg-[#0D1B2A] border-b border-[#1a2942] px-6 py-4">
          <Link 
            href={`/cours/${params.formationSlug}/${params.lessonId}`}
            className="text-[#C9A227] hover:underline flex items-center gap-2 text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour au cours
          </Link>
        </header>
        
        <main className="max-w-2xl mx-auto p-6">
          <div className="bg-[#0D1B2A] rounded-xl p-8 border border-[#1a2942] text-center">
            <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
              passed ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              {passed ? (
                <CheckCircle className="w-10 h-10 text-green-500" />
              ) : (
                <XCircle className="w-10 h-10 text-red-500" />
              )}
            </div>
            
            <h1 className="text-2xl font-bold mb-2">
              {passed ? 'Felicitations !' : 'Continuez vos efforts'}
            </h1>
            <p className="text-gray-400 mb-6">
              {passed 
                ? 'Vous avez reussi cet exercice' 
                : 'Vous pouvez reessayer pour ameliorer votre score'}
            </p>
            
            <div className="mb-8">
              <div className="text-5xl font-bold text-[#C9A227] mb-2">{percentage}%</div>
              <p className="text-gray-400">{score} / {maxScore} points</p>
            </div>
            
            {/* Answers review */}
            <div className="text-left space-y-4 mb-8">
              <h3 className="font-semibold text-lg border-b border-[#1a2942] pb-2">
                Revision des reponses
              </h3>
              {exercise.content.questions?.map((q, idx) => {
                const isCorrect = answers[q.id] === q.correct
                return (
                  <div key={q.id} className={`p-4 rounded-lg border ${
                    isCorrect ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'
                  }`}>
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium mb-2">Q{idx + 1}: {q.question}</p>
                        <p className="text-sm text-gray-400">
                          Votre reponse: <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                            {q.options?.[answers[q.id]] || 'Non repondu'}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-400 mt-1">
                            Bonne reponse: {q.options?.[q.correct!]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleRetry}
                variant="outline"
                className="border-[#1a2942] text-white hover:bg-[#1a2942]"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reessayer
              </Button>
              <Link href={`/cours/${params.formationSlug}/${params.lessonId}`}>
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

  // QCM Quiz View
  if (exercise.exercise_type === 'qcm') {
    const questions = exercise.content.questions || []
    const question = questions[currentQuestion]
    const totalQuestions = questions.length
    const answeredCount = Object.keys(answers).length

    return (
      <div className="min-h-screen bg-[#0a0f1a] text-white">
        <header className="bg-[#0D1B2A] border-b border-[#1a2942] px-6 py-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <Link 
              href={`/cours/${params.formationSlug}/${params.lessonId}`}
              className="text-[#C9A227] hover:underline flex items-center gap-2 text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Quitter
            </Link>
            
            <h1 className="font-semibold">{exercise.title}</h1>
            
            {timeLeft !== null && (
              <div className={`flex items-center gap-2 ${timeLeft < 60 ? 'text-red-500' : 'text-gray-400'}`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
        </header>
        
        {/* Progress bar */}
        <div className="bg-[#0D1B2A] px-6 py-2 border-b border-[#1a2942]">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Question {currentQuestion + 1} sur {totalQuestions}</span>
              <span>{answeredCount} repondu(s)</span>
            </div>
            <Progress value={(currentQuestion + 1) / totalQuestions * 100} className="h-2 bg-[#1a2942]" />
          </div>
        </div>
        
        <main className="max-w-3xl mx-auto p-6">
          {question && (
            <div className="bg-[#0D1B2A] rounded-xl p-8 border border-[#1a2942]">
              <h2 className="text-xl font-semibold mb-6">{question.question}</h2>
              
              <div className="space-y-3">
                {question.options?.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerChange(question.id, idx)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      answers[question.id] === idx
                        ? 'border-[#C9A227] bg-[#C9A227]/20'
                        : 'border-[#1a2942] hover:border-[#C9A227]/50 hover:bg-[#1a2942]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        answers[question.id] === idx
                          ? 'bg-[#C9A227] text-[#0D1B2A]'
                          : 'bg-[#1a2942] text-gray-400'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Question navigation */}
          <div className="flex flex-wrap gap-2 mt-6 justify-center">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                  idx === currentQuestion
                    ? 'bg-[#C9A227] text-[#0D1B2A]'
                    : answers[q.id] !== undefined
                      ? 'bg-green-500/20 text-green-500 border border-green-500/50'
                      : 'bg-[#1a2942] text-gray-400 hover:bg-[#1a2942]/80'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <Button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              variant="outline"
              className="border-[#1a2942] text-white hover:bg-[#1a2942]"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Precedent
            </Button>
            
            {currentQuestion === totalQuestions - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={submitting || answeredCount < totalQuestions}
                className="bg-[#C9A227] text-[#0D1B2A] hover:bg-[#E8C050]"
              >
                {submitting ? 'Envoi...' : 'Terminer'}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestion(prev => Math.min(totalQuestions - 1, prev + 1))}
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

  // Practical/TD Exercise View
  if (exercise.exercise_type === 'practical') {
    return (
      <div className="min-h-screen bg-[#0a0f1a] text-white">
        <header className="bg-[#0D1B2A] border-b border-[#1a2942] px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <Link 
              href={`/cours/${params.formationSlug}/${params.lessonId}`}
              className="text-[#C9A227] hover:underline flex items-center gap-2 text-sm mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              Retour au cours
            </Link>
            <h1 className="text-xl font-bold">{exercise.title}</h1>
            <p className="text-gray-400 text-sm mt-1">Travaux Diriges - {exercise.points} points</p>
          </div>
        </header>
        
        <main className="max-w-3xl mx-auto p-6">
          {/* Instructions */}
          <div className="bg-[#0D1B2A] rounded-xl p-6 border border-[#1a2942] mb-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#C9A227]" />
              Instructions
            </h2>
            <p className="text-gray-300">{exercise.content.instructions}</p>
          </div>
          
          {/* Tasks */}
          <div className="space-y-4 mb-8">
            {exercise.content.tasks?.map((task, idx) => (
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
                    
                    {/* Response area */}
                    <Textarea
                      placeholder="Decrivez votre realisation..."
                      value={answers[task.id]?.text || ''}
                      onChange={(e) => handleAnswerChange(task.id, { ...answers[task.id], text: e.target.value })}
                      className="bg-[#1a2942] border-[#1a2942] text-white mb-3"
                      rows={3}
                    />
                    
                    {/* Photo upload (simulated) */}
                    {exercise.content.submission_type === 'photo' && (
                      <div className="border-2 border-dashed border-[#1a2942] rounded-lg p-6 text-center hover:border-[#C9A227]/50 transition-colors cursor-pointer">
                        <Camera className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">
                          Cliquez pour ajouter une photo de votre realisation
                        </p>
                        <input type="file" accept="image/*" className="hidden" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Submit */}
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-[#C9A227] text-[#0D1B2A] hover:bg-[#E8C050]"
            >
              {submitting ? 'Envoi...' : 'Soumettre le TD'}
              <Upload className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          {showResults && (
            <div className="mt-6 bg-green-500/20 border border-green-500/50 rounded-xl p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">TD soumis avec succes !</h3>
              <p className="text-gray-400 text-sm">
                Votre professeur evaluera votre travail prochainement.
              </p>
            </div>
          )}
        </main>
      </div>
    )
  }

  return null
}
