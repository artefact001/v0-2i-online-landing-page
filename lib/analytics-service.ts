/**
 * STAND BY — aucune route Laravel équivalente pour l'analytics n'existe dans
 * routes/api.php. Fonctions désactivées (retournent des valeurs neutres) en
 * attendant la création des endpoints côté backend.
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
  totalTimeSpent: number
}

function notReady(fn: string) {
  console.warn(`[analyticsService.${fn}] en attente d'un endpoint Laravel — fonctionnalité en pause`)
}

export const analyticsService = {
  async getAdminAnalytics(): Promise<AnalyticsData | null> {
    notReady('getAdminAnalytics')
    return null
  },
  async getFormationAnalytics(_formationId: string): Promise<FormationAnalytics | null> {
    notReady('getFormationAnalytics')
    return null
  },
  async getAllFormationsAnalytics(): Promise<FormationAnalytics[]> {
    notReady('getAllFormationsAnalytics')
    return []
  },
  async getStudentAnalytics(_studentId?: string): Promise<StudentAnalytics[]> {
    notReady('getStudentAnalytics')
    return []
  },
  async exportAnalyticsCSV(_data: any[]): Promise<string> {
    notReady('exportAnalyticsCSV')
    return ''
  },
  async getPaymentHistory(_studentId?: string): Promise<any[]> {
    notReady('getPaymentHistory')
    return []
  },
}
