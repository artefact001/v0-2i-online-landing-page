import { createClient } from '@/lib/supabase/client'

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

export class PaymentService {
  private supabase = createClient()

  async initiateWavePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Create payment record in database
      const { data, error } = await this.supabase
        .from('payments')
        .insert({
          student_id: request.studentId,
          enrollment_id: request.enrollmentId,
          amount: request.amount,
          payment_method: 'Wave',
          currency: 'XOF',
          status: 'pending',
        })
        .select()
        .single()

      if (error) throw error

      // In a real implementation, you would call the Wave API
      // For demo: we'll simulate the payment URL
      const waveCheckoutUrl = `https://wave.com/checkout/demo?amount=${request.amount}&phone=${request.phone}&ref=${data.id}`

      return {
        success: true,
        transactionId: data.id,
        message: 'Paiement Wave initié',
        redirectUrl: waveCheckoutUrl,
      }
    } catch (error) {
      console.error('Wave payment error:', error)
      return {
        success: false,
        message: 'Erreur lors du paiement Wave',
      }
    }
  }

  async initiateOrangeMoneyPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const { data, error } = await this.supabase
        .from('payments')
        .insert({
          student_id: request.studentId,
          enrollment_id: request.enrollmentId,
          amount: request.amount,
          payment_method: 'Orange Money',
          currency: 'XOF',
          status: 'pending',
        })
        .select()
        .single()

      if (error) throw error

      // In a real implementation, you would call the Orange Money API
      const orangeCheckoutUrl = `https://orangemoney.com/checkout/demo?amount=${request.amount}&phone=${request.phone}&ref=${data.id}`

      return {
        success: true,
        transactionId: data.id,
        message: 'Paiement Orange Money initié',
        redirectUrl: orangeCheckoutUrl,
      }
    } catch (error) {
      console.error('Orange Money payment error:', error)
      return {
        success: false,
        message: 'Erreur lors du paiement Orange Money',
      }
    }
  }

  async initiateFreeMoneyPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const { data, error } = await this.supabase
        .from('payments')
        .insert({
          student_id: request.studentId,
          enrollment_id: request.enrollmentId,
          amount: request.amount,
          payment_method: 'Free Money',
          currency: 'XOF',
          status: 'pending',
        })
        .select()
        .single()

      if (error) throw error

      const freeMoneyCheckoutUrl = `https://freemoney.com/checkout/demo?amount=${request.amount}&phone=${request.phone}&ref=${data.id}`

      return {
        success: true,
        transactionId: data.id,
        message: 'Paiement Free Money initié',
        redirectUrl: freeMoneyCheckoutUrl,
      }
    } catch (error) {
      console.error('Free Money payment error:', error)
      return {
        success: false,
        message: 'Erreur lors du paiement Free Money',
      }
    }
  }

  async updatePaymentStatus(
    paymentId: string,
    status: 'pending' | 'completed' | 'failed' | 'cancelled'
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('payments')
        .update({ 
          status,
          paid_at: status === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', paymentId)

      if (error) throw error

      // If payment is completed, update enrollment status
      if (status === 'completed') {
        const payment = await this.supabase
          .from('payments')
          .select('enrollment_id')
          .eq('id', paymentId)
          .single()

        if (payment.data?.enrollment_id) {
          await this.supabase
            .from('enrollments')
            .update({ 
              status: 'active',
              payment_status: 'completed'
            })
            .eq('id', payment.data.enrollment_id)
        }
      }

      return true
    } catch (error) {
      console.error('Error updating payment status:', error)
      return false
    }
  }

  async getPaymentHistory(studentId: string) {
    try {
      const { data, error } = await this.supabase
        .from('payments')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching payment history:', error)
      return []
    }
  }
}

export const paymentService = new PaymentService()
