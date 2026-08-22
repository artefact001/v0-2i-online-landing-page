import { apiClient } from '@/lib/api/client'

/**
 * Intégration PayDunya (mode "Payment With Redistribution" — page de
 * paiement hébergée : l'utilisateur choisit Wave/Orange Money/Free
 * Money/carte directement sur la page PayDunya).
 *
 * Schéma Laravel réel (table paiements) : montant (decimal), methode
 * (enum FIXE: 'Wave'|'Orange Money'|'Free Money'|'Virement'|'CB'),
 * statut (enum: 'en attente'|'confirme'|'echec'), date, user_id,
 * formation_id. Pas de champ "enrollment_id" — l'inscription est activée
 * séparément par le webhook Laravel une fois le paiement confirmé.
 *
 * IMPORTANT: le statut "confirme" n'est JAMAIS positionné depuis le
 * frontend. Seul le webhook PayDunya (IPN), vérifié côté Laravel via un
 * hash SHA-512, peut confirmer un paiement et activer l'inscription. Le
 * frontend se contente de rediriger vers PayDunya puis, au retour,
 * d'aller RELIRE le statut réel depuis l'API.
 */

export type MethodePaiement = 'Wave' | 'Orange Money' | 'Free Money' | 'Virement' | 'CB'

export interface CreatePaymentInput {
  formationId: string
  montant: number
  methode: MethodePaiement
}

export interface InitiatePaymentResult {
  success: boolean
  message: string
  checkoutUrl?: string
  paiementId?: string
}

export interface Paiement {
  id: string
  montant: number
  methode: MethodePaiement
  statut: 'en attente' | 'confirme' | 'echec'
  date: string
  user_id: string
  formation_id: string
}

export class PaymentService {
  // POST /v1/paiements — crée l'enregistrement (statut "en attente" côté
  // Laravel, quoi qu'on envoie), puis POST /v1/paiements/{id}/paydunya
  // pour obtenir l'URL de paiement hébergée PayDunya.
  async initiatePayDunyaPayment(input: CreatePaymentInput): Promise<InitiatePaymentResult> {
    try {
      const createRes = await apiClient<Paiement>('/paiements', {
        method: 'POST',
        body: JSON.stringify({
          formation_id: input.formationId,
          montant: input.montant,
          methode: input.methode,
          date: new Date().toISOString().slice(0, 10),
        }),
      })

      const paiementId = (createRes.data as any)?.id
      if (!paiementId) {
        return { success: false, message: "Impossible de créer l'enregistrement de paiement" }
      }

      const chargeRes = await apiClient<{ checkout_url: string }>(`/paiements/${paiementId}/paydunya`, {
        method: 'POST',
      })

      const checkoutUrl = (chargeRes.data as any)?.checkout_url
      if (!chargeRes.success || !checkoutUrl) {
        return {
          success: false,
          message: chargeRes.message || "Erreur lors de l'initialisation du paiement PayDunya",
          paiementId,
        }
      }

      return { success: true, message: 'Redirection vers PayDunya...', checkoutUrl, paiementId }
    } catch (error) {
      console.error('PayDunya payment initiation error:', error)
      return { success: false, message: 'Erreur lors du paiement' }
    }
  }

  // GET /v1/paiements/{id} — relit le statut RÉEL (mis à jour uniquement
  // par le webhook Laravel), jamais déduit de l'URL de retour.
  async getPaymentStatus(paiementId: string) {
    try {
      const res = await apiClient<Paiement>(`/paiements/${paiementId}`)
      return res.data ?? null
    } catch (error) {
      console.error('Error fetching payment status:', error)
      return null
    }
  }

  // GET /v1/paiements?user_id=...
  async getPaymentHistory(userId: string) {
    try {
      const res = await apiClient(`/paiements?user_id=${userId}`)
      return res.data
    } catch (error) {
      console.error('Error fetching payment history:', error)
      return []
    }
  }
}

export const paymentService = new PaymentService()
