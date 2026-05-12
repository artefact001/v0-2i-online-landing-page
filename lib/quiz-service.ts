import { createClient } from '@/lib/supabase/client';
import { createClient as createServerClient } from '@/lib/supabase/server';

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correct_answer: string;
  explanation?: string;
  order_index: number;
  points: number;
}

export interface Quiz {
  id: string;
  lesson_id: string;
  title: string;
  description?: string;
  duration_minutes: number;
  pass_score: number;
  is_published: boolean;
  created_at: string;
  questions?: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  student_id: string;
  quiz_id: string;
  score: number;
  passed: boolean;
  time_spent_minutes: number;
  answers: Record<string, string>;
  completed_at: string;
}

export const quizService = {
  // Get all quizzes for a lesson
  async getQuizzesByLesson(lessonId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('lesson_id', lessonId)
      .eq('is_published', true);

    if (error) throw error;
    return data as Quiz[];
  },

  // Get quiz with questions
  async getQuizWithQuestions(quizId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        quiz_questions (*)
      `)
      .eq('id', quizId)
      .single();

    if (error) throw error;
    return data as Quiz & { quiz_questions: QuizQuestion[] };
  },

  // Create quiz (admin/professor)
  async createQuiz(quiz: Omit<Quiz, 'id' | 'created_at'>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('quizzes')
      .insert([quiz])
      .select()
      .single();

    if (error) throw error;
    return data as Quiz;
  },

  // Add question to quiz
  async addQuestion(question: Omit<QuizQuestion, 'id'>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('quiz_questions')
      .insert([question])
      .select()
      .single();

    if (error) throw error;
    return data as QuizQuestion;
  },

  // Submit quiz attempt
  async submitQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'completed_at'>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert([{
        ...attempt,
        completed_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data as QuizAttempt;
  },

  // Grade quiz attempt
  async gradeQuizAttempt(quizId: string, answers: Record<string, string>) {
    const supabase = createClient();
    
    // Get quiz with questions
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .select(`
        *,
        quiz_questions (*)
      `)
      .eq('id', quizId)
      .single();

    if (quizError) throw quizError;

    const quiz = quizData as any;
    let score = 0;
    let totalPoints = 0;

    // Grade each question
    quiz.quiz_questions.forEach((question: QuizQuestion) => {
      totalPoints += question.points;
      if (answers[question.id] === question.correct_answer) {
        score += question.points;
      }
    });

    const percentage = (score / totalPoints) * 100;
    const passed = percentage >= quiz.pass_score;

    return {
      score: Math.round(percentage),
      totalPoints,
      passed,
      percentage,
    };
  },

  // Get student quiz attempts
  async getStudentAttempts(studentId: string, quizId?: string) {
    const supabase = createClient();
    let query = supabase
      .from('quiz_attempts')
      .select('*')
      .eq('student_id', studentId);

    if (quizId) {
      query = query.eq('quiz_id', quizId);
    }

    const { data, error } = await query.order('completed_at', { ascending: false });

    if (error) throw error;
    return data as QuizAttempt[];
  },

  // Get best attempt for quiz
  async getBestAttempt(studentId: string, quizId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('student_id', studentId)
      .eq('quiz_id', quizId)
      .order('score', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return (data as QuizAttempt) || null;
  },
};
