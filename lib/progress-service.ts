import { apiClient } from '@/lib/api/client'

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
  // GET /v1/progressions?student_id=...&lesson_id=...
  // À VÉRIFIER: ProgressionController::index accepte-t-il ces filtres en query params ?
  async getLessonProgress(studentId: string, lessonId: string): Promise<LessonProgress | null> {
    try {
      const res = await apiClient(`/progressions?student_id=${studentId}&lesson_id=${lessonId}`)
      const list = Array.isArray(res.data) ? res.data : []
      return (list[0] as LessonProgress) ?? null
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
    isCompleted = false,
  ): Promise<boolean> {
    try {
      const existing = await this.getLessonProgress(studentId, lessonId)
      const payload = {
        student_id: studentId,
        lesson_id: lessonId,
        watch_time_seconds: watchTimeSeconds,
        last_position_seconds: lastPositionSeconds,
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
      }

      if (existing) {
        await apiClient(`/progressions/${existing.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      } else {
        await apiClient('/progressions', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }
      return true
    } catch (error) {
      console.error('Error updating lesson progress:', error)
      return false
    }
  }

  // Reconstitue la progression d'une formation à partir de /v1/modules, /v1/lecons, /v1/progressions
  // (aucune route dédiée "progression par formation" n'existe côté Laravel — calcul fait ici).
  // À VÉRIFIER: ModuleController::index et LeconController::index acceptent-ils un filtre
  // ?formation_id=... / ?module_id=... comme supposé ci-dessous.
  async getFormationProgress(studentId: string, formationId: string): Promise<FormationProgress | null> {
    try {
      const modulesRes = await apiClient(`/modules?formation_id=${formationId}`)
      const modules = Array.isArray(modulesRes.data) ? modulesRes.data : []
      const moduleIds = modules.map((m: any) => m.id)
      if (moduleIds.length === 0) return null

      const leconsRes = await apiClient(`/lecons?module_id=${moduleIds.join(',')}`)
      const lecons = Array.isArray(leconsRes.data) ? leconsRes.data : []
      const totalLessons = lecons.length
      if (totalLessons === 0) return null

      const progressRes = await apiClient(
        `/progressions?student_id=${studentId}&is_completed=1&lesson_id=${lecons.map((l: any) => l.id).join(',')}`,
      )
      const completedList = Array.isArray(progressRes.data) ? progressRes.data : []
      const completedLessons = completedList.length
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
      const res = await apiClient(`/inscriptions?student_id=${studentId}&status=active`)
      const enrollments = Array.isArray(res.data) ? res.data : []

      const progressData = []
      for (const enrollment of enrollments) {
        const progress = await this.getFormationProgress(studentId, enrollment.formation_id)
        if (progress) progressData.push(progress)
      }
      return progressData
    } catch (error) {
      console.error('Error fetching all student progress:', error)
      return []
    }
  }

  // AUCUN équivalent Laravel de la table "professor_formations" n'apparaît dans les routes.
  // À confirmer: comment un formateur est-il lié à ses formations côté Laravel
  // (champ formateur_id direct sur "formations" ? table pivot dédiée ?).
  async getProfessorStudentProgress(professorId: string, studentId: string) {
    try {
      const formationsRes = await apiClient(`/formations?user_id=${professorId}`)
      const formations = Array.isArray(formationsRes.data) ? formationsRes.data : []
      const formationIds = formations.map((f: any) => f.id)
      if (formationIds.length === 0) return []

      const enrollmentsRes = await apiClient(
        `/inscriptions?student_id=${studentId}&formation_id=${formationIds.join(',')}`,
      )
      const enrollments = Array.isArray(enrollmentsRes.data) ? enrollmentsRes.data : []

      const progressData = []
      for (const enrollment of enrollments) {
        const progress = await this.getFormationProgress(studentId, enrollment.formation_id)
        if (progress) progressData.push(progress)
      }
      return progressData
    } catch (error) {
      console.error('Error fetching professor student progress:', error)
      return []
    }
  }

  async getStudentsProgress(professorId: string, formationId: string) {
    try {
      const res = await apiClient(`/inscriptions?formation_id=${formationId}&status=active`)
      const enrollments = Array.isArray(res.data) ? res.data : []

      const progressData = []
      for (const enrollment of enrollments) {
        const progress = await this.getFormationProgress(enrollment.student_id, formationId)
        if (progress) {
          progressData.push({
            ...progress,
            student_name: `${enrollment.student?.first_name ?? ''} ${enrollment.student?.last_name ?? ''}`.trim(),
          })
        }
      }
      return progressData.sort((a, b) => b.completion_percentage - a.completion_percentage)
    } catch (error) {
      console.error('Error fetching students progress:', error)
      return []
    }
  }

  async markLessonAsCompleted(studentId: string, lessonId: string): Promise<boolean> {
    return this.updateLessonProgress(studentId, lessonId, 0, 0, true)
  }
}

export const progressService = new ProgressService()
