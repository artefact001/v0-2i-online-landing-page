import { apiClient } from '@/lib/api/client'

/**
 * Intégration Bictorys (mode Checkout — page de paiement hébergée).
 * L'utilisateur choisit Mobile Money (Wave/Orange Money/Free Money) ou
 * carte bancaire directement sur la page Bictorys ; on n'a plus besoin de
 * lui faire choisir un opérateur ni saisir son numéro sur notre propre page.
 *
 * IMPORTANT: le statut "completed" d'un paiement n'est JAMAIS positionné
 * depuis le frontend. Seul le webhook Bictorys, vérifié côté Laravel via
 * une clé secrète, peut confirmer un paiement. Le frontend se contente de
 * rediriger vers Bictorys puis, au retour, d'aller RELIRE le statut réel
 * depuis l'API (jamais de le déduire de l'URL de redirection elle-même).
 */

export interface CreatePaymentInput {
  studentId: string
  enrollmentId: string
  amount: number
}

export interface InitiatePaymentResult {
  success: boolean
  message: string
  checkoutUrl?: string
  paiementId?: string
}

export class PaymentService {
  // POST /v1/paiements — crée l'enregistrement de paiement côté Laravel
  // (statut "pending"), puis POST /v1/paiements/{id}/bictorys pour obtenir
  // l'URL de paiement hébergée Bictorys.
  async initiateBictorysPayment(input: CreatePaymentInput): Promise<InitiatePaymentResult> {
    try {
      const createRes = await apiClient<{ id: string }>('/paiements', {
        method: 'POST',
        body: JSON.stringify({
          student_id: input.studentId,
          enrollment_id: input.enrollmentId,
          amount: input.amount,
          payment_method: 'Bictorys',
          currency: 'XOF',
          status: 'pending',
        }),
      })

      const paiementId = (createRes.data as any)?.id
      if (!paiementId) {
        return { success: false, message: "Impossible de créer l'enregistrement de paiement" }
      }

      const chargeRes = await apiClient<{ checkout_url: string }>(`/paiements/${paiementId}/bictorys`, {
        method: 'POST',
      })

      const checkoutUrl = (chargeRes.data as any)?.checkout_url
      if (!chargeRes.success || !checkoutUrl) {
        return {
          success: false,
          message: chargeRes.message || "Erreur lors de l'initialisation du paiement Bictorys",
          paiementId,
        }
      }

      return { success: true, message: 'Redirection vers Bictorys...', checkoutUrl, paiementId }
    } catch (error) {
      console.error('Bictorys payment initiation error:', error)
      return { success: false, message: 'Erreur lors du paiement' }
    }
  }

  // GET /v1/paiements/{id} — relit le statut RÉEL (mis à jour uniquement
  // par le webhook Laravel), jamais déduit de l'URL de retour.
  async getPaymentStatus(paiementId: string) {
    try {
      const res = await apiClient(`/paiements/${paiementId}`)
      return res.data as { status: 'pending' | 'completed' | 'failed' | 'cancelled'; enrollment_id?: string } | null
    } catch (error) {
      console.error('Error fetching payment status:', error)
      return null
    }
  }

  // GET /v1/paiements?student_id=...
  async getPaymentHistory(studentId: string) {
    try {
      const res = await apiClient(`/paiements?student_id=${studentId}`)
      return res.data
    } catch (error) {
      console.error('Error fetching payment history:', error)
      return []
    }
  }
}

export const paymentService = new PaymentService()
