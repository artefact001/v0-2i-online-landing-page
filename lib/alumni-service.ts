import { apiClient } from '@/lib/api/client'

export interface Alumnus {
  id: string
  prenom: string
  nom: string
  posteActuel: string | null
  entrepriseActuelle: string | null
  formations: string[]
}

export const alumniService = {
  async getAll(): Promise<Alumnus[]> {
    try {
      const res = await apiClient<Alumnus[]>('/alumni')
      return res.data || []
    } catch (error) {
      console.error('[alumniService.getAll]', error)
      return []
    }
  },

  async updateVisibilite(data: { alumni_visible: boolean; poste_actuel?: string; entreprise_actuelle?: string }) {
    return apiClient('/mon-profil-alumni', { method: 'PUT', body: JSON.stringify(data) })
  },
}
