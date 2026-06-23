// Shared model for interactive evaluations (exercises & exams)
// Everything is stored in the existing `exercises.content` jsonb column,
// so no database migration is required.

export type QuestionType = 'qcm' | 'open'
export type MediaType = 'image' | 'video'

export interface EvalMedia {
  type: MediaType
  url: string
}

export interface EvalQuestion {
  id: string
  type: QuestionType
  question: string
  media?: EvalMedia | null
  /** QCM only */
  options: string[]
  /** QCM only: index of the correct option */
  correct: number
  /** Open only: expected answer or comma-separated accepted keywords */
  answerKey?: string
  /** Points awarded when the answer is correct */
  points: number
  explanation?: string
}

export interface EvaluationContent {
  is_exam: boolean
  /** Percentage needed to pass (0-100) */
  pass_score: number
  questions: EvalQuestion[]
}

export function emptyQuestion(type: QuestionType = 'qcm'): EvalQuestion {
  return {
    id: crypto.randomUUID(),
    type,
    question: '',
    media: null,
    options: type === 'qcm' ? ['', ''] : [],
    correct: 0,
    answerKey: '',
    points: 1,
    explanation: '',
  }
}

/** Normalize text for lenient open-answer comparison. */
export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z0-9\s]/g, ' ') // strip punctuation
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Determine whether a single answer is correct.
 * - QCM: selected index equals `correct`.
 * - Open: the answer key (or all its comma-separated keywords) is present in the student's answer.
 */
export function isAnswerCorrect(question: EvalQuestion, answer: unknown): boolean {
  if (question.type === 'qcm') {
    return typeof answer === 'number' && answer === question.correct
  }
  // open question
  const key = (question.answerKey || '').trim()
  if (!key) return false // cannot auto-grade without a key
  const studentText = normalizeText(typeof answer === 'string' ? answer : '')
  if (!studentText) return false
  const keywords = key.split(',').map((k) => normalizeText(k)).filter(Boolean)
  if (keywords.length === 0) return false
  // All keywords must be present (substring match) for full points
  return keywords.every((kw) => studentText.includes(kw))
}

export interface GradeResult {
  score: number
  maxScore: number
  percentage: number
  passed: boolean
  perQuestion: { id: string; correct: boolean; earned: number; points: number }[]
}

export function gradeEvaluation(
  content: EvaluationContent,
  answers: Record<string, unknown>,
): GradeResult {
  const questions = content.questions || []
  let score = 0
  let maxScore = 0
  const perQuestion = questions.map((q) => {
    const points = q.points || 0
    maxScore += points
    const correct = isAnswerCorrect(q, answers[q.id])
    const earned = correct ? points : 0
    score += earned
    return { id: q.id, correct, earned, points }
  })
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
  const passed = percentage >= (content.pass_score ?? 60)
  return { score, maxScore, percentage, passed, perQuestion }
}
