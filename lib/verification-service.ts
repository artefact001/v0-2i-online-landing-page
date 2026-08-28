import { apiClient } from '@/lib/api/client'

export interface VerificationResult {
  valide: boolean
  nom: string
  formation: string
  numero_certificat: string
  date_obtention: string
}

export const verificationService = {
  async verifierCertificat(code: string): Promise<VerificationResult | null> {
    try {
      const res = await apiClient<VerificationResult>(`/certificats/verifier/${code}`)
      return res.data ?? null
    } catch (error) {
      console.error('[verificationService.verifierCertificat]', error)
      return null
    }
  },
}
