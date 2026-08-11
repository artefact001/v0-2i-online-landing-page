/**
 * STAND BY — aucune route Laravel pour codes promo / affiliation dans routes/api.php.
 * Fonctions désactivées en attendant le backend. Point de vigilance particulier:
 * withdrawCommission touche à de l'argent réel — ne PAS improviser cet endpoint,
 * il doit être conçu et sécurisé explicitement côté Laravel.
 */

export interface PromoCode {
  id: string
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  max_uses: number
  current_uses: number
  valid_from: string
  valid_until: string
  is_active: boolean
  applicable_formations?: string[]
}

export interface AffiliateAccount {
  id: string
  user_id: string
  affiliate_code: string
  commission_rate: number
  total_referrals: number
  total_commissions: number
  is_active: boolean
}

function notReady(fn: string) {
  console.warn(`[promo/affiliate.${fn}] en attente d'un endpoint Laravel — fonctionnalité en pause`)
}

export const promoService = {
  async validatePromoCode(_code: string): Promise<PromoCode | null> {
    notReady('validatePromoCode')
    return null
  },
  async applyPromoCode(..._args: any[]): Promise<boolean> {
    notReady('applyPromoCode')
    return false
  },
  async createPromoCode(..._args: any[]): Promise<PromoCode | null> {
    notReady('createPromoCode')
    return null
  },
  async incrementPromoUsage(..._args: any[]): Promise<boolean> {
    notReady('incrementPromoUsage')
    return false
  },
  async getPromoStats(): Promise<any[]> {
    notReady('getPromoStats')
    return []
  },
}

export const affiliateService = {
  async createAffiliateAccount(..._args: any[]): Promise<AffiliateAccount | null> {
    notReady('createAffiliateAccount')
    return null
  },
  async getAffiliateAccount(_userId: string): Promise<AffiliateAccount | null> {
    notReady('getAffiliateAccount')
    return null
  },
  async trackReferral(..._args: any[]): Promise<boolean> {
    notReady('trackReferral')
    return false
  },
  async getReferralHistory(_userId: string): Promise<any[]> {
    notReady('getReferralHistory')
    return []
  },
  async getTopAffiliates(): Promise<any[]> {
    notReady('getTopAffiliates')
    return []
  },
  async withdrawCommission(..._args: any[]): Promise<boolean> {
    notReady('withdrawCommission')
    return false
  },
}
