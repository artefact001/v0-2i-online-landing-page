import { apiClient } from '@/lib/api/client'

export const donService = {
  async faireUnDon(data: { montant: number; nom_donateur?: string; email_donateur?: string; message?: string }) {
    const res = await apiClient<{ checkout_url: string }>('/dons', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return res.data ?? null
  },

  async getTotal(): Promise<{ total: number; nombre: number } | null> {
    try {
      const res = await apiClient<{ total: number; nombre: number }>('/dons/total')
      return res.data ?? null
    } catch (error) {
      console.error('[donService.getTotal]', error)
      return null
    }
  },
}
