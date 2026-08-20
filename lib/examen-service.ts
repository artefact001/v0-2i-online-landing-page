import { apiClient } from '@/lib/api/client'

/**
 * Schéma Laravel réel :
 * - examens: id, type ('quiz'|'examen'), titre, description, duree_minutes,
 *   bareme_pts, formation_id (rattaché à la FORMATION, pas à une leçon)
 * - resultats: id, score (decimal), date_passage, statut
 *   ('reussi'|'echoue'|'en cours'), user_id, examen_id
 *
 * Contrairement à l'ancien système imaginé (quiz par leçon avec questions
 * détaillées), ce schéma ne montre aucune sous-structure de questions liée
 * aux examens — seul un score final est enregistré. Si un examen a besoin
 * de questions détaillées, il faudra clarifier ce point côté backend.
 */

export interface Examen {
  id: string
  type: 'quiz' | 'examen'
  titre: string
  description?: string
  duree_minutes: number
  bareme_pts: number
  formation_id: string
}

export interface Resultat {
  id: string
  score: number
  date_passage: string
  statut: 'reussi' | 'echoue' | 'en cours'
  user_id: string
  examen_id: string
}

export const examenService = {
  // GET /v1/examens?formation_id=...
  async getExamensByFormation(formationId: string) {
    const res = await apiClient<Examen[]>(`/examens?formation_id=${formationId}`)
    return res.data || []
  },

  async getExamen(examenId: string) {
    const res = await apiClient<Examen>(`/examens/${examenId}`)
    return res.data ?? null
  },

  // POST /v1/examens (réservé admin/formateur)
  async createExamen(examen: Omit<Examen, 'id'>) {
    const res = await apiClient<Examen>('/examens', {
      method: 'POST',
      body: JSON.stringify(examen),
    })
    return res.data as Examen
  },

  // Enregistre le résultat d'un passage d'examen — POST /v1/resultats
  async submitResultat(data: { user_id: string; examen_id: string; score: number; statut: Resultat['statut'] }) {
    const res = await apiClient<Resultat>('/resultats', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        date_passage: new Date().toISOString().slice(0, 10),
      }),
    })
    return res.data as Resultat
  },

  // GET /v1/resultats?user_id=...&examen_id=...
  async getResultats(userId: string, examenId?: string) {
    const query = examenId ? `/resultats?user_id=${userId}&examen_id=${examenId}` : `/resultats?user_id=${userId}`
    const res = await apiClient<Resultat[]>(query)
    return res.data || []
  },
}
