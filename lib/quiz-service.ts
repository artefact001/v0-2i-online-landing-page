import { apiClient } from '@/lib/api/client'

/**
 * ATTENTION — mapping le plus incertain de toute la migration.
 * Le frontend V0 modélisait les quiz comme: quizzes -> quiz_questions -> quiz_attempts.
 * Le backend Laravel expose: examens -> questions -> resultats (+ reponses pour les
 * réponses individuelles/correction manuelle des questions ouvertes).
 * Les noms de champs ci-dessous (lesson_id, pass_score, correct_answer, etc.) sont
 * repris tels quels du code Supabase d'origine: à confirmer contre les vrais
 * Resource/Request Laravel (QuestionController, ExamenController, ResultatController).
 */

export interface QuizQuestion {
  id: string
  quiz_id: string
  question_text: string
  question_type: 'multiple_choice' | 'true_false' | 'short_answer'
  options?: string[]
  correct_answer: string
  explanation?: string
  order_index: number
  points: number
}

export interface Quiz {
  id: string
  lesson_id: string
  title: string
  description?: string
  duration_minutes: number
  pass_score: number
  is_published: boolean
  created_at: string
  questions?: QuizQuestion[]
}

export interface QuizAttempt {
  id: string
  student_id: string
  quiz_id: string
  score: number
  passed: boolean
  time_spent_minutes: number
  answers: Record<string, string>
  completed_at: string
}

export const quizService = {
  // GET /v1/examens?lesson_id=...&is_published=1
  async getQuizzesByLesson(lessonId: string) {
    const res = await apiClient(`/examens?lesson_id=${lessonId}&is_published=1`)
    return res.data as Quiz[]
  },

  // GET /v1/examens/{id} — suppose que la réponse inclut les questions imbriquées.
  // Si ce n'est pas le cas côté Laravel, il faut un appel séparé GET /v1/questions?examen_id=...
  async getQuizWithQuestions(quizId: string) {
    const res = await apiClient(`/examens/${quizId}`)
    return res.data as Quiz & { quiz_questions: QuizQuestion[] }
  },

  // POST /v1/examens (réservé admin/formateur d'après routes/api.php)
  async createQuiz(quiz: Omit<Quiz, 'id' | 'created_at'>) {
    const res = await apiClient('/examens', {
      method: 'POST',
      body: JSON.stringify(quiz),
    })
    return res.data as Quiz
  },

  // POST /v1/questions (réservé admin/formateur)
  async addQuestion(question: Omit<QuizQuestion, 'id'>) {
    const res = await apiClient('/questions', {
      method: 'POST',
      body: JSON.stringify(question),
    })
    return res.data as QuizQuestion
  },

  // POST /v1/resultats
  async submitQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'completed_at'>) {
    const res = await apiClient('/resultats', {
      method: 'POST',
      body: JSON.stringify({ ...attempt, completed_at: new Date().toISOString() }),
    })
    return res.data as QuizAttempt
  },

  // Correction calculée côté frontend à partir de /v1/examens/{id} (avec questions imbriquées).
  async gradeQuizAttempt(quizId: string, answers: Record<string, string>) {
    const quiz = await this.getQuizWithQuestions(quizId)

    let score = 0
    let totalPoints = 0

    quiz.quiz_questions.forEach((question) => {
      totalPoints += question.points
      if (answers[question.id] === question.correct_answer) {
        score += question.points
      }
    })

    const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0
    const passed = percentage >= quiz.pass_score

    return {
      score: Math.round(percentage),
      totalPoints,
      passed,
      percentage,
    }
  },

  // GET /v1/resultats?student_id=...&quiz_id=...
  async getStudentAttempts(studentId: string, quizId?: string) {
    const query = quizId
      ? `/resultats?student_id=${studentId}&quiz_id=${quizId}`
      : `/resultats?student_id=${studentId}`
    const res = await apiClient(query)
    return res.data as QuizAttempt[]
  },

  // GET /v1/resultats?student_id=...&quiz_id=...&sort=-score&limit=1
  // À VÉRIFIER: ResultatController::index supporte-t-il le tri/limit en query params ?
  async getBestAttempt(studentId: string, quizId: string) {
    const res = await apiClient(`/resultats?student_id=${studentId}&quiz_id=${quizId}&sort=-score&limit=1`)
    const list = Array.isArray(res.data) ? (res.data as QuizAttempt[]) : []
    return list[0] ?? null
  },
}
