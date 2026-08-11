import { apiClient } from '@/lib/api/client'

/**
 * NOTE IMPORTANTE: le code d'origine (Supabase) ne faisait déjà QUE simuler les paiements
 * (URLs "demo", aucun vrai appel aux API Wave/Orange Money/Free Money). Cette version
 * reproduit fidèlement ce comportement de simulation via /v1/paiements.
 *
 * Pour une vraie intégration: la validation des paiements (webhooks Wave/OM/FreeMoney,
 * vérification de signature) doit être implémentée côté Laravel (PaiementController),
 * jamais côté frontend — un statut "completed" ne doit jamais pouvoir être forgé
 * uniquement par un appel client.
 */

export interface PaymentRequest {
  studentId: string
  enrollmentId: string
  amount: number
  paymentMethod: 'wave' | 'orange_money' | 'free_money'
  phone: string
}

export interface PaymentResponse {
  success: boolean
  transactionId?: string
  message: string
  redirectUrl?: string
}

const METHOD_LABELS: Record<PaymentRequest['paymentMethod'], string> = {
  wave: 'Wave',
  orange_money: 'Orange Money',
  free_money: 'Free Money',
}

const DEMO_CHECKOUT_HOSTS: Record<PaymentRequest['paymentMethod'], string> = {
  wave: 'https://wave.com/checkout/demo',
  orange_money: 'https://orangemoney.com/checkout/demo',
  free_money: 'https://freemoney.com/checkout/demo',
}

export class PaymentService {
  // POST /v1/paiements
  private async initiatePayment(
    request: PaymentRequest,
    method: PaymentRequest['paymentMethod'],
  ): Promise<PaymentResponse> {
    try {
      const res = await apiClient<{ id: string }>('/paiements', {
        method: 'POST',
        body: JSON.stringify({
          student_id: request.studentId,
          enrollment_id: request.enrollmentId,
          amount: request.amount,
          payment_method: METHOD_LABELS[method],
          currency: 'XOF',
          status: 'pending',
        }),
      })

      const paymentId = (res.data as any)?.id
      const checkoutUrl = `${DEMO_CHECKOUT_HOSTS[method]}?amount=${request.amount}&phone=${request.phone}&ref=${paymentId}`

      return {
        success: true,
        transactionId: paymentId,
        message: `Paiement ${METHOD_LABELS[method]} initié`,
        redirectUrl: checkoutUrl,
      }
    } catch (error) {
      console.error(`${METHOD_LABELS[method]} payment error:`, error)
      return {
        success: false,
        message: `Erreur lors du paiement ${METHOD_LABELS[method]}`,
      }
    }
  }

  async initiateWavePayment(request: PaymentRequest) {
    return this.initiatePayment(request, 'wave')
  }

  async initiateOrangeMoneyPayment(request: PaymentRequest) {
    return this.initiatePayment(request, 'orange_money')
  }

  async initiateFreeMoneyPayment(request: PaymentRequest) {
    return this.initiatePayment(request, 'free_money')
  }

  // PUT /v1/paiements/{id} puis, si complété, PUT /v1/inscriptions/{id}
  async updatePaymentStatus(
    paymentId: string,
    status: 'pending' | 'completed' | 'failed' | 'cancelled',
  ): Promise<boolean> {
    try {
      await apiClient(`/paiements/${paymentId}`, {
        method: 'PUT',
        body: JSON.stringify({
          status,
          paid_at: status === 'completed' ? new Date().toISOString() : null,
        }),
      })

      if (status === 'completed') {
        const paymentRes = await apiClient(`/paiements/${paymentId}`)
        const enrollmentId = (paymentRes.data as any)?.enrollment_id

        if (enrollmentId) {
          await apiClient(`/inscriptions/${enrollmentId}`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'active', payment_status: 'completed' }),
          })
        }
      }

      return true
    } catch (error) {
      console.error('Error updating payment status:', error)
      return false
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
