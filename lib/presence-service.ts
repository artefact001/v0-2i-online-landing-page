import { apiClient } from '@/lib/api/client'

export interface Presence {
  id: string
  live_session_id: string
  user_id: string
  present: boolean
  user?: { prenom: string; nom: string }
}

export interface Attestation {
  id: string
  numero_attestation: string
  fichier_pdf_url?: string
  date_delivrance: string
  liveSession?: { title: string; formation?: { titre: string } }
}

export const presenceService = {
  async marquer(liveSessionId: string, presences: { user_id: string; present: boolean }[]) {
    return apiClient(`/directs/${liveSessionId}/presences`, {
      method: 'POST',
      body: JSON.stringify({ presences }),
    })
  },

  async getForSession(liveSessionId: string): Promise<Presence[]> {
    try {
      const res = await apiClient<Presence[]>(`/directs/${liveSessionId}/presences`)
      return res.data || []
    } catch (error) {
      console.error('[presenceService.getForSession]', error)
      return []
    }
  },

  async genererAttestations(liveSessionId: string) {
    return apiClient(`/directs/${liveSessionId}/attestations`, { method: 'POST' })
  },

  async getMesAttestations(): Promise<Attestation[]> {
    try {
      const res = await apiClient<Attestation[]>('/mes-attestations')
      return res.data || []
    } catch (error) {
      console.error('[presenceService.getMesAttestations]', error)
      return []
    }
  },
}
