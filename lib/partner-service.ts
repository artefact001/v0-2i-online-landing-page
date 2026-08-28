import { apiClient } from '@/lib/api/client'

/**
 * Connecté au vrai backend (PartenaireDashboardController) — espace en
 * lecture seule du partenaire connecté sur les formations qu'il finance.
 */

export interface FinancedFormation {
  id: string
  titre: string
  image?: string
  prix: number
  inscriptions_count?: number
  pivot: {
    montant_finance: string
    date_financement: string
  }
}

export interface PartnerStats {
  totalFormationsFinancees: number
  totalInvesti: number
  totalEtudiants: number
  tauxReussite: number
  certificatsDelivres: number
}

export interface FinancedStudent {
  userId: string
  prenom: string
  nom: string
  email: string
  progression: number
  moyenneExamens: number | null
  statutInscription: string
}

export const partnerService = {
  // GET /v1/mes-financements
  async getFinancedFormations(): Promise<FinancedFormation[]> {
    try {
      const res = await apiClient<FinancedFormation[]>('/mes-financements')
      return res.data || []
    } catch (error) {
      console.error('[partnerService.getFinancedFormations]', error)
      return []
    }
  },

  // GET /v1/mes-financements/stats
  async getStats(): Promise<PartnerStats | null> {
    try {
      const res = await apiClient<PartnerStats>('/mes-financements/stats')
      return res.data ?? null
    } catch (error) {
      console.error('[partnerService.getStats]', error)
      return null
    }
  },

  // GET /v1/mes-financements/{formationId}/etudiants
  async getFormationStudents(formationId: string): Promise<FinancedStudent[]> {
    try {
      const res = await apiClient<FinancedStudent[]>(`/mes-financements/${formationId}/etudiants`)
      return res.data || []
    } catch (error) {
      console.error('[partnerService.getFormationStudents]', error)
      return []
    }
  },
}
