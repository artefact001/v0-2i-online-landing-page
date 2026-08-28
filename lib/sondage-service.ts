import { apiClient } from '@/lib/api/client'

export interface SondageQuestion {
  id: string
  texte: string
  type: 'note' | 'texte'
}

export interface Sondage {
  id: string
  formation_id: string
  titre: string
  questions: SondageQuestion[]
}

export const sondageService = {
  async getForFormation(formationId: string): Promise<Sondage[]> {
    try {
      const res = await apiClient<Sondage[]>(`/sondages?formation_id=${formationId}`)
      return res.data || []
    } catch (error) {
      console.error('[sondageService.getForFormation]', error)
      return []
    }
  },

  async create(formationId: string, titre: string, questions: SondageQuestion[]) {
    return apiClient<Sondage>('/sondages', {
      method: 'POST',
      body: JSON.stringify({ formation_id: formationId, titre, questions }),
    })
  },

  async repondre(sondageId: string, reponses: { question_id: string; valeur: string | number }[]) {
    return apiClient(`/sondages/${sondageId}/repondre`, {
      method: 'POST',
      body: JSON.stringify({ reponses }),
    })
  },

  async getResultats(sondageId: string) {
    const res = await apiClient(`/sondages/${sondageId}/resultats`)
    return res.data
  },
}
