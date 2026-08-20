import { apiClient } from '@/lib/api/client'

/**
 * Schéma Laravel réel (table progressions) :
 * id, statut (enum: 'commencer' | 'en cours' | 'termine'), user_id, lecon_id.
 * Pas de watch_time_seconds/last_position_seconds/is_completed — juste un
 * statut discret par leçon.
 */
export type ProgressionStatut = 'commencer' | 'en cours' | 'termine'

export interface LessonProgress {
  id: string
  user_id: string
  lecon_id: string
  statut: ProgressionStatut
  updated_at?: string
}

export interface FormationProgress {
  formation_id: string
  user_id: string
  total_lessons: number
  completed_lessons: number
  completion_percentage: number
  last_updated: string
}

export class ProgressService {
  // GET /v1/progressions?user_id=...&lecon_id=...
  async getLessonProgress(userId: string, leconId: string): Promise<LessonProgress | null> {
    try {
      const res = await apiClient(`/progressions?user_id=${userId}&lecon_id=${leconId}`)
      const list = Array.isArray(res.data) ? res.data : []
      return (list[0] as LessonProgress) ?? null
    } catch (error) {
      console.error('Error fetching lesson progress:', error)
      return null
    }
  }

  async updateLessonProgress(userId: string, leconId: string, statut: ProgressionStatut): Promise<boolean> {
    try {
      const existing = await this.getLessonProgress(userId, leconId)
      const payload = { user_id: userId, lecon_id: leconId, statut }

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

  // Reconstitue la progression d'une formation à partir de /v1/modules,
  // /v1/lecons, /v1/progressions (aucune route dédiée n'existe).
  async getFormationProgress(userId: string, formationId: string): Promise<FormationProgress | null> {
    try {
      const modulesRes = await apiClient(`/modules?formation_id=${formationId}`)
      const modules = Array.isArray(modulesRes.data) ? modulesRes.data : []
      const moduleIds = modules.map((m: any) => m.id)
      if (moduleIds.length === 0) return null

      const leconsLists = await Promise.all(
        moduleIds.map((id: string) => apiClient(`/lecons?module_id=${id}`).catch(() => null)),
      )
      const lecons = leconsLists.flatMap((r) => (r?.data as any[]) || [])
      const totalLessons = lecons.length
      if (totalLessons === 0) return null

      const progressLists = await Promise.all(
        lecons.map((l: any) =>
          apiClient(`/progressions?user_id=${userId}&lecon_id=${l.id}`).catch(() => null),
        ),
      )
      const completedLessons = progressLists.filter((r) => {
        const list = (r?.data as any[]) || []
        return list[0]?.statut === 'termine'
      }).length

      const completionPercentage = Math.round((completedLessons / totalLessons) * 100)

      return {
        formation_id: formationId,
        user_id: userId,
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

  async getStudentAllProgress(userId: string) {
    try {
      // Contrainte unique confirmée: inscriptions(user_id, formation_id).
      const res = await apiClient(`/inscriptions?user_id=${userId}&status=active`)
      const enrollments = Array.isArray(res.data) ? res.data : []

      const progressData = []
      for (const enrollment of enrollments) {
        const progress = await this.getFormationProgress(userId, enrollment.formation_id)
        if (progress) progressData.push(progress)
      }
      return progressData
    } catch (error) {
      console.error('Error fetching all student progress:', error)
      return []
    }
  }

  // AUCUN équivalent Laravel de "professor_formations" — on suppose que
  // /v1/formations accepte un filtre ?user_id=... (le propriétaire de la
  // formation, confirmé par le schéma réel de la table formations).
  async getProfessorStudentProgress(professorId: string, userId: string) {
    try {
      const formationsRes = await apiClient(`/formations?user_id=${professorId}`)
      const formations = Array.isArray(formationsRes.data) ? formationsRes.data : []
      const formationIds = formations.map((f: any) => f.id)
      if (formationIds.length === 0) return []

      const enrollmentsRes = await apiClient(
        `/inscriptions?user_id=${userId}&formation_id=${formationIds.join(',')}`,
      )
      const enrollments = Array.isArray(enrollmentsRes.data) ? enrollmentsRes.data : []

      const progressData = []
      for (const enrollment of enrollments) {
        const progress = await this.getFormationProgress(userId, enrollment.formation_id)
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
        const progress = await this.getFormationProgress(enrollment.user_id, formationId)
        if (progress) {
          progressData.push({
            ...progress,
            student_name: `${enrollment.student?.prenom ?? ''} ${enrollment.student?.nom ?? ''}`.trim(),
          })
        }
      }
      return progressData.sort((a, b) => b.completion_percentage - a.completion_percentage)
    } catch (error) {
      console.error('Error fetching students progress:', error)
      return []
    }
  }

  async markLessonAsCompleted(userId: string, leconId: string): Promise<boolean> {
    return this.updateLessonProgress(userId, leconId, 'termine')
  }
}

export const progressService = new ProgressService()
