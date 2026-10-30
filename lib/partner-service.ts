import { apiClient } from '@/lib/api/client'

/**
 * Connecté au vrai backend (PartenaireDashboardController) — espace en
 * lecture seule du partenaire connecté sur les formations qu'il finance.
 */

export interface FinancedFormation {
  id: string
  titre: string
  description?: string | null
  image?: string | null
  niveau?: string | null
  duree?: string | number | null
  prix?: number | string | null
  inscriptions_count?: number
  modules_count?: number
  // Absent si l'API ne le renvoie pas : toujours lire avec pivot?.
  pivot?: {
    montant_finance?: string | number | null
    date_financement?: string | null
  }
}

/** Date lisible, ou « — » si absente/invalide (évite « Invalid Date »). */
export function formatDateFr(value?: string | null): string {
  if (!value) return '—'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('fr-FR')
}

/** Montant en FCFA, ou « 0 FCFA » si absent. */
export function formatFcfa(value?: string | number | null): string {
  const n = Number(value ?? 0)
  return `${(Number.isFinite(n) ? n : 0).toLocaleString('fr-FR')} FCFA`
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

/**
 * Les méthodes ci-dessous LÈVENT l'erreur de l'API (au lieu de renvoyer une
 * liste vide) : l'écran peut ainsi afficher la vraie cause (accès refusé,
 * serveur injoignable...) plutôt qu'un trompeur « Aucun financement ».
 */
export const partnerService = {
  // GET /v1/mes-financements
  async getFinancedFormations(): Promise<FinancedFormation[]> {
    const res = await apiClient<FinancedFormation[]>('/mes-financements')
    return res.data || []
  },

  // GET /v1/mes-financements/{formationId} — fiche + financement
  async getFormationDetail(formationId: string): Promise<FinancedFormation> {
    const res = await apiClient<FinancedFormation>(`/mes-financements/${formationId}`)
    if (!res.data) throw new Error('Formation introuvable.')
    return res.data
  },

  // GET /v1/mes-financements/stats
  async getStats(): Promise<PartnerStats | null> {
    const res = await apiClient<PartnerStats>('/mes-financements/stats')
    return res.data ?? null
  },

  // GET /v1/mes-financements/{formationId}/etudiants
  async getFormationStudents(formationId: string): Promise<FinancedStudent[]> {
    const res = await apiClient<FinancedStudent[]>(`/mes-financements/${formationId}/etudiants`)
    return res.data || []
  },
}
