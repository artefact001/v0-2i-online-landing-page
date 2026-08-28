import { apiClient } from '@/lib/api/client'

export interface MentorDisponible {
  userId: string
  prenom: string
  nom: string
  type: 'alumni' | 'formateur'
  posteActuel?: string
  specialite?: string
}

export interface Mentorat {
  id: string
  mentor_id: string
  mentore_id: string
  statut: 'en_attente' | 'actif' | 'termine' | 'refuse'
  message_demande: string | null
  mentor?: { prenom: string; nom: string }
  mentore?: { prenom: string; nom: string }
}

export const mentoratService = {
  async getMentorsDisponibles(): Promise<MentorDisponible[]> {
    try {
      const res = await apiClient<MentorDisponible[]>('/mentors-disponibles')
      return res.data || []
    } catch (error) {
      console.error('[mentoratService.getMentorsDisponibles]', error)
      return []
    }
  },

  async demander(mentorId: string, message?: string) {
    return apiClient<Mentorat>('/mentorats/demander', {
      method: 'POST',
      body: JSON.stringify({ mentor_id: mentorId, message_demande: message }),
    })
  },

  async getMesMentorats(): Promise<Mentorat[]> {
    try {
      const res = await apiClient<Mentorat[]>('/mes-mentorats')
      return res.data || []
    } catch (error) {
      console.error('[mentoratService.getMesMentorats]', error)
      return []
    }
  },

  async getDemandesRecues(): Promise<Mentorat[]> {
    try {
      const res = await apiClient<Mentorat[]>('/mentorats/demandes-recues')
      return res.data || []
    } catch (error) {
      console.error('[mentoratService.getDemandesRecues]', error)
      return []
    }
  },

  async updateStatut(mentoratId: string, statut: Mentorat['statut']) {
    return apiClient(`/mentorats/${mentoratId}/statut`, { method: 'PUT', body: JSON.stringify({ statut }) })
  },
}
