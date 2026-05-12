import { createClient } from '@/lib/supabase/client';

export interface PromoCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_uses: number;
  current_uses: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  applicable_formations?: string[];
}

export interface AffiliateAccount {
  id: string;
  user_id: string;
  affiliate_code: string;
  commission_rate: number;
  total_referrals: number;
  total_commissions: number;
  is_active: boolean;
}

export const promoService = {
  // Validate promo code
  async validatePromoCode(code: string): Promise<PromoCode | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error) return null;

    const now = new Date();
    const validFrom = new Date(data.valid_from);
    const validUntil = new Date(data.valid_until);

    if (now < validFrom || now > validUntil) return null;
    if (data.current_uses >= data.max_uses) return null;

    return data as PromoCode;
  },

  // Apply promo code
  async applyPromoCode(code: string, amount: number): Promise<{ discountAmount: number; finalAmount: number }> {
    const promo = await this.validatePromoCode(code);
    if (!promo) throw new Error('Code promo invalide');

    let discountAmount = 0;
    if (promo.discount_type === 'percentage') {
      discountAmount = (amount * promo.discount_value) / 100;
    } else {
      discountAmount = promo.discount_value;
    }

    const finalAmount = Math.max(0, amount - discountAmount);
    return { discountAmount, finalAmount };
  },

  // Create promo code (admin only)
  async createPromoCode(promo: Omit<PromoCode, 'id' | 'current_uses'>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('promo_codes')
      .insert([{
        ...promo,
        code: promo.code.toUpperCase(),
        current_uses: 0,
      }])
      .select()
      .single();

    if (error) throw error;
    return data as PromoCode;
  },

  // Increment promo code usage
  async incrementPromoUsage(code: string) {
    const supabase = createClient();
    const { error } = await supabase.rpc('increment_promo_usage', { code });
    if (error) throw error;
  },

  // Get promo code usage stats
  async getPromoStats() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('promo_codes')
      .select('code, current_uses, max_uses, discount_value, discount_type');

    if (error) throw error;
    return data;
  },
};

export const affiliateService = {
  // Create affiliate account
  async createAffiliateAccount(userId: string): Promise<AffiliateAccount> {
    const supabase = createClient();

    // Generate unique affiliate code
    const affiliateCode = `AFF-${userId.substring(0, 8)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const { data, error } = await supabase
      .from('affiliate_accounts')
      .insert([{
        user_id: userId,
        affiliate_code: affiliateCode,
        commission_rate: 10, // 10% default
        total_referrals: 0,
        total_commissions: 0,
        is_active: true,
      }])
      .select()
      .single();

    if (error) throw error;
    return data as AffiliateAccount;
  },

  // Get affiliate account
  async getAffiliateAccount(userId: string): Promise<AffiliateAccount | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('affiliate_accounts')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data as AffiliateAccount;
  },

  // Track referral
  async trackReferral(affiliateCode: string, enrollmentId: string, amount: number) {
    const supabase = createClient();

    // Get affiliate account
    const { data: affiliate } = await supabase
      .from('affiliate_accounts')
      .select('*')
      .eq('affiliate_code', affiliateCode)
      .single();

    if (!affiliate) return;

    const commission = (amount * affiliate.commission_rate) / 100;

    // Record referral
    const { error: refError } = await supabase
      .from('affiliate_referrals')
      .insert([{
        affiliate_id: affiliate.id,
        enrollment_id: enrollmentId,
        amount,
        commission,
      }]);

    if (refError) throw refError;

    // Update affiliate stats
    await supabase
      .from('affiliate_accounts')
      .update({
        total_referrals: affiliate.total_referrals + 1,
        total_commissions: affiliate.total_commissions + commission,
      })
      .eq('id', affiliate.id);
  },

  // Get referral history
  async getReferralHistory(userId: string) {
    const supabase = createClient();

    const { data: affiliate } = await supabase
      .from('affiliate_accounts')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!affiliate) return [];

    const { data, error } = await supabase
      .from('affiliate_referrals')
      .select(`
        *,
        enrollment:enrollments(id, created_at)
      `)
      .eq('affiliate_id', affiliate.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get top affiliates
  async getTopAffiliates(limit = 10) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('affiliate_accounts')
      .select('*')
      .order('total_commissions', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as AffiliateAccount[];
  },

  // Withdraw commission
  async withdrawCommission(userId: string, amount: number) {
    const supabase = createClient();

    const { data: affiliate } = await supabase
      .from('affiliate_accounts')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!affiliate || affiliate.total_commissions < amount) {
      throw new Error('Solde insuffisant');
    }

    // Create withdrawal
    const { error: withdrawError } = await supabase
      .from('affiliate_withdrawals')
      .insert([{
        affiliate_id: affiliate.id,
        amount,
        status: 'pending',
      }]);

    if (withdrawError) throw withdrawError;

    // Update balance
    await supabase
      .from('affiliate_accounts')
      .update({
        total_commissions: affiliate.total_commissions - amount,
      })
      .eq('id', affiliate.id);
  },
};
