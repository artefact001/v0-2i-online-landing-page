import { apiClient } from '@/lib/api/client'

export interface Candidature {
  id: string
  opportunite_id: string
  user_id: string
  message: string | null
  statut: 'envoyee' | 'vue' | 'acceptee' | 'refusee'
  opportunite?: { titre: string }
  user?: { prenom: string; nom: string; email: string }
  created_at: string
}

export const candidatureService = {
  async postuler(opportuniteId: string, message?: string) {
    return apiClient<Candidature>(`/opportunites/${opportuniteId}/postuler`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    })
  },

  async getMesCandidatures(): Promise<Candidature[]> {
    try {
      const res = await apiClient<Candidature[]>('/mes-candidatures')
      return res.data || []
    } catch (error) {
      console.error('[candidatureService.getMesCandidatures]', error)
      return []
    }
  },

  async getCandidaturesFor(opportuniteId: string): Promise<Candidature[]> {
    try {
      const res = await apiClient<Candidature[]>(`/opportunites/${opportuniteId}/candidatures`)
      return res.data || []
    } catch (error) {
      console.error('[candidatureService.getCandidaturesFor]', error)
      return []
    }
  },

  async updateStatut(candidatureId: string, statut: Candidature['statut']) {
    return apiClient(`/candidatures/${candidatureId}/statut`, { method: 'PUT', body: JSON.stringify({ statut }) })
  },
}
