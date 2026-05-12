import { createClient } from '@/lib/supabase/client'

export interface LessonProgress {
  id: string
  student_id: string
  lesson_id: string
  is_completed: boolean
  watch_time_seconds: number
  last_position_seconds: number
  completed_at: string | null
  updated_at: string
}

export interface FormationProgress {
  formation_id: string
  student_id: string
  total_lessons: number
  completed_lessons: number
  completion_percentage: number
  last_updated: string
}

export class ProgressService {
  private supabase = createClient()

  async getLessonProgress(
    studentId: string,
    lessonId: string
  ): Promise<LessonProgress | null> {
    try {
      const { data, error } = await this.supabase
        .from('lesson_progress')
        .select('*')
        .eq('student_id', studentId)
        .eq('lesson_id', lessonId)
        .single()

      if (error?.code === 'PGRST116') return null // Not found
      if (error) throw error

      return data
    } catch (error) {
      console.error('Error fetching lesson progress:', error)
      return null
    }
  }

  async updateLessonProgress(
    studentId: string,
    lessonId: string,
    watchTimeSeconds: number,
    lastPositionSeconds: number,
    isCompleted: boolean = false
  ): Promise<boolean> {
    try {
      const existingProgress = await this.getLessonProgress(studentId, lessonId)

      if (existingProgress) {
        const { error } = await this.supabase
          .from('lesson_progress')
          .update({
            watch_time_seconds: watchTimeSeconds,
            last_position_seconds: lastPositionSeconds,
            is_completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq('student_id', studentId)
          .eq('lesson_id', lessonId)

        if (error) throw error
      } else {
        const { error } = await this.supabase
          .from('lesson_progress')
          .insert({
            student_id: studentId,
            lesson_id: lessonId,
            watch_time_seconds: watchTimeSeconds,
            last_position_seconds: lastPositionSeconds,
            is_completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null,
          })

        if (error) throw error
      }

      return true
    } catch (error) {
      console.error('Error updating lesson progress:', error)
      return false
    }
  }

  async getFormationProgress(
    studentId: string,
    formationId: string
  ): Promise<FormationProgress | null> {
    try {
      // Get all lessons in the formation
      const { data: modules, error: modulesError } = await this.supabase
        .from('modules')
        .select('id')
        .eq('formation_id', formationId)

      if (modulesError) throw modulesError

      const moduleIds = modules?.map(m => m.id) || []

      if (moduleIds.length === 0) {
        return null
      }

      // Get all lessons
      const { data: lessons, error: lessonsError } = await this.supabase
        .from('lessons')
        .select('id')
        .in('module_id', moduleIds)

      if (lessonsError) throw lessonsError

      const totalLessons = lessons?.length || 0

      if (totalLessons === 0) {
        return null
      }

      // Get student's completed lessons
      const { data: completedProgress, error: progressError } = await this.supabase
        .from('lesson_progress')
        .select('id')
        .eq('student_id', studentId)
        .eq('is_completed', true)
        .in('lesson_id', lessons?.map(l => l.id) || [])

      if (progressError) throw progressError

      const completedLessons = completedProgress?.length || 0
      const completionPercentage = Math.round((completedLessons / totalLessons) * 100)

      return {
        formation_id: formationId,
        student_id: studentId,
        total_lessons: totalLessons,
        completed_lessons: completedLessons,
        completion_percentage: completionPercentage,
        last_updated: new Date().toISOString(),
      }
    } catch (error) {
      console.error('Error fetching formation progress:', error)
      return null
    }
  }

  async getStudentAllProgress(studentId: string) {
    try {
      const { data: enrollments, error: enrollmentsError } = await this.supabase
        .from('enrollments')
        .select('formation_id')
        .eq('student_id', studentId)
        .eq('status', 'active')

      if (enrollmentsError) throw enrollmentsError

      const progressData = []

      for (const enrollment of enrollments || []) {
        const progress = await this.getFormationProgress(studentId, enrollment.formation_id)
        if (progress) {
          progressData.push(progress)
        }
      }

      return progressData
    } catch (error) {
      console.error('Error fetching all student progress:', error)
      return []
    }
  }

  async getProfessorStudentProgress(
    professorId: string,
    studentId: string
  ) {
    try {
      // Get formations taught by professor
      const { data: professorFormations, error: pfError } = await this.supabase
        .from('professor_formations')
        .select('formation_id')
        .eq('professor_id', professorId)

      if (pfError) throw pfError

      const formationIds = professorFormations?.map(pf => pf.formation_id) || []

      if (formationIds.length === 0) {
        return []
      }

      // Get student enrollments in those formations
      const { data: enrollments, error: enrollmentsError } = await this.supabase
        .from('enrollments')
        .select('formation_id')
        .eq('student_id', studentId)
        .in('formation_id', formationIds)

      if (enrollmentsError) throw enrollmentsError

      const progressData = []

      for (const enrollment of enrollments || []) {
        const progress = await this.getFormationProgress(studentId, enrollment.formation_id)
        if (progress) {
          progressData.push(progress)
        }
      }

      return progressData
    } catch (error) {
      console.error('Error fetching professor student progress:', error)
      return []
    }
  }

  async getStudentsProgress(
    professorId: string,
    formationId: string
  ) {
    try {
      // Get students enrolled in this formation
      const { data: enrollments, error: enrollmentsError } = await this.supabase
        .from('enrollments')
        .select('student_id, profiles(first_name, last_name)')
        .eq('formation_id', formationId)
        .eq('status', 'active')

      if (enrollmentsError) throw enrollmentsError

      const progressData = []

      for (const enrollment of enrollments || []) {
        const progress = await this.getFormationProgress(enrollment.student_id, formationId)
        if (progress) {
          progressData.push({
            ...progress,
            student_name: `${enrollment.profiles?.first_name} ${enrollment.profiles?.last_name}`,
          })
        }
      }

      return progressData.sort((a, b) => 
        b.completion_percentage - a.completion_percentage
      )
    } catch (error) {
      console.error('Error fetching students progress:', error)
      return []
    }
  }

  async markLessonAsCompleted(
    studentId: string,
    lessonId: string
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('lesson_progress')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('student_id', studentId)
        .eq('lesson_id', lessonId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error marking lesson as completed:', error)
      return false
    }
  }
}

export const progressService = new ProgressService()
