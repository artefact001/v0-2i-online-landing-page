import { apiClient } from '@/lib/api/client'

/**
 * Connecté au vrai backend (AnalyticsController) — agrégation calculée
 * côté Laravel depuis les données existantes (formations, inscriptions,
 * paiements, resultats), aucune nouvelle table.
 */

export interface AnalyticsData {
  totalStudents: number
  totalRevenue: number
  totalEnrollments: number
  activeUsers: number
  completionRate: number
  averageScore: number
}

export interface FormationAnalytics {
  formationId: string
  name: string
  enrolledStudents: number
  completedStudents: number
  averageScore: number
  revenue: number
  completionRate: number
}

export interface StudentAnalytics {
  studentId: string
  firstName: string
  lastName: string
  email: string
  enrollmentsCount: number
  completedCourses: number
  averageScore: number
  lastActivity: string
}

export const analyticsService = {
  // GET /v1/analytics/admin
  async getAdminAnalytics(): Promise<AnalyticsData | null> {
    try {
      const res = await apiClient<AnalyticsData>('/analytics/admin')
      return res.data ?? null
    } catch (error) {
      console.error('[analyticsService.getAdminAnalytics]', error)
      return null
    }
  },

  // GET /v1/analytics/formations/{id}
  async getFormationAnalytics(formationId: string): Promise<FormationAnalytics | null> {
    try {
      const res = await apiClient<FormationAnalytics>(`/analytics/formations/${formationId}`)
      return res.data ?? null
    } catch (error) {
      console.error('[analyticsService.getFormationAnalytics]', error)
      return null
    }
  },

  // GET /v1/analytics/formations
  async getAllFormationsAnalytics(): Promise<FormationAnalytics[]> {
    try {
      const res = await apiClient<FormationAnalytics[]>('/analytics/formations')
      return res.data || []
    } catch (error) {
      console.error('[analyticsService.getAllFormationsAnalytics]', error)
      return []
    }
  },

  // GET /v1/analytics/students?student_id=...
  async getStudentAnalytics(studentId?: string): Promise<StudentAnalytics[]> {
    try {
      const query = studentId ? `?student_id=${studentId}` : ''
      const res = await apiClient<StudentAnalytics[]>(`/analytics/students${query}`)
      return res.data || []
    } catch (error) {
      console.error('[analyticsService.getStudentAnalytics]', error)
      return []
    }
  },

  exportAnalyticsCSV(data: Record<string, any>[]): string {
    if (data.length === 0) return ''
    const headers = Object.keys(data[0])
    const rows = data.map((row) => headers.map((h) => JSON.stringify(row[h] ?? '')).join(','))
    return [headers.join(','), ...rows].join('\n')
  },
}
