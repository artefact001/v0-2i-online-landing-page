import { apiClient } from '@/lib/api/client'

export interface Badge {
  id: string
  code: string
  titre: string
  description: string
  icone?: string
  points: number
}

export interface LeaderboardEntry {
  id: string
  prenom: string
  nom: string
  points: number
}

export const gamificationService = {
  async getMesBadges(): Promise<{ points: number; badges: Badge[] } | null> {
    try {
      const res = await apiClient<{ points: number; badges: Badge[] }>('/mes-badges')
      return res.data ?? null
    } catch (error) {
      console.error('[gamificationService.getMesBadges]', error)
      return null
    }
  },

  async getClassement(): Promise<LeaderboardEntry[]> {
    try {
      const res = await apiClient<LeaderboardEntry[]>('/classement')
      return res.data || []
    } catch (error) {
      console.error('[gamificationService.getClassement]', error)
      return []
    }
  },

  async getAllBadges(): Promise<Badge[]> {
    try {
      const res = await apiClient<Badge[]>('/badges')
      return res.data || []
    } catch (error) {
      console.error('[gamificationService.getAllBadges]', error)
      return []
    }
  },
}
