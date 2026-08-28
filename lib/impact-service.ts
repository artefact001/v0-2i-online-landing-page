import { apiClient } from '@/lib/api/client'

export interface ImpactStats {
  totalDiplomes: number
  totalFormations: number
  totalEtudiants: number
  totalPartenaires: number
  totalInvesti: number
  totalDons: number
}

export const impactService = {
  async getStats(): Promise<ImpactStats | null> {
    try {
      const res = await apiClient<ImpactStats>('/impact')
      return res.data ?? null
    } catch (error) {
      console.error('[impactService.getStats]', error)
      return null
    }
  },
}
