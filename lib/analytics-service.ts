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
  // GET /v1/analytics/admin — ?month=YYYY-MM optionnel, restreint aux
  // revenus/inscriptions/résultats de ce mois précis (comportement
  // global inchangé si omis).
  async getAdminAnalytics(month?: string): Promise<AnalyticsData | null> {
    try {
      const query = month ? `?month=${month}` : ''
      const res = await apiClient<AnalyticsData>(`/analytics/admin${query}`)
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

  // GET /v1/analytics/formations — même filtre ?month= optionnel
  async getAllFormationsAnalytics(month?: string): Promise<FormationAnalytics[]> {
    try {
      const query = month ? `?month=${month}` : ''
      const res = await apiClient<FormationAnalytics[]>(`/analytics/formations${query}`)
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

  // GET /v1/analytics/export-pdf — renvoie un vrai fichier binaire (PDF),
  // pas du JSON : apiClient() ne convient pas ici (il tente toujours de
  // parser la réponse comme du JSON). Passe par la même route relais
  // (/api/backend/...) pour que le cookie de session soit transmis,
  // récupère un blob, puis déclenche un téléchargement classique.
  async exportPdf(month?: string): Promise<void> {
    const query = month ? `?month=${month}` : ''
    const res = await fetch(`/api/backend/analytics/export-pdf${query}`)
    if (!res.ok) {
      throw new Error("Impossible de générer le PDF. Réessaie dans un instant.")
    }
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rapport-analytics-${month || 'global'}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
  },
}
