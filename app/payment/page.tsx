'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { paymentService } from '@/lib/payment-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle, Loader } from 'lucide-react'

interface Enrollment {
  id: string
  formation_id: string
  formations: {
    name: string
    price: number
  }
}

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const enrollmentId = searchParams.get('enrollment_id')
  
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [phone, setPhone] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<'wave' | 'orange_money' | 'free_money' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    async function loadEnrollment() {
      if (!enrollmentId) {
        setError('ID d\'inscription manquant')
        return
      }

      const { data, error: fetchError } = await supabase
        .from('enrollments')
        .select('id, formation_id, formations(name, price)')
        .eq('id', enrollmentId)
        .single()

      if (fetchError || !data) {
        setError('Inscription non trouvée')
        return
      }

      setEnrollment(data)
    }

    loadEnrollment()
  }, [enrollmentId, supabase])

  const handlePayment = async (method: 'wave' | 'orange_money' | 'free_money') => {
    if (!phone || !enrollment) {
      setError('Veuillez entrer votre numéro de téléphone')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const user = await supabase.auth.getUser()
      if (!user.data.user) {
        setError('Vous devez être connecté')
        return
      }

      let response
      if (method === 'wave') {
        response = await paymentService.initiateWavePayment({
          studentId: user.data.user.id,
          enrollmentId,
          amount: enrollment.formations.price,
          paymentMethod: 'wave',
          phone,
        })
      } else if (method === 'orange_money') {
        response = await paymentService.initiateOrangeMoneyPayment({
          studentId: user.data.user.id,
          enrollmentId,
          amount: enrollment.formations.price,
          paymentMethod: 'orange_money',
          phone,
        })
      } else {
        response = await paymentService.initiateFreeMoneyPayment({
          studentId: user.data.user.id,
          enrollmentId,
          amount: enrollment.formations.price,
          paymentMethod: 'free_money',
          phone,
        })
      }

      if (response.success && response.redirectUrl) {
        // In a real implementation, redirect to payment provider
        // window.location.href = response.redirectUrl
        
        // For demo, simulate successful payment
        await paymentService.updatePaymentStatus(response.transactionId!, 'completed')
        setSuccess(true)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError('Erreur lors du paiement')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-8">
        <Card className="w-full max-w-md bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
          <CardHeader>
            <Loader className="w-8 h-8 animate-spin mx-auto text-[#C9A227]" />
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-8">
        <Card className="w-full max-w-md bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-500">Paiement réussi!</CardTitle>
            <CardDescription>
              Votre inscription à {enrollment.formations.name} a été confirmée
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-[rgba(255,255,255,0.6)]">
              Un email de confirmation a été envoyé. Vous pouvez maintenant accéder aux cours.
            </p>
            <Link href="/dashboard/student" className="block">
              <Button className="w-full bg-[#C9A227] hover:bg-[#B8860B] text-white">
                Accéder aux cours
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Complétez votre paiement</h1>
          <p className="text-[rgba(255,255,255,0.6)]">
            Formation: <span className="text-[#C9A227] font-semibold">{enrollment.formations.name}</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <Card className="lg:col-span-1 bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
            <CardHeader>
              <CardTitle className="text-white">Résumé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-[rgba(255,255,255,0.6)] text-sm mb-1">Formation</p>
                <p className="text-white font-semibold">{enrollment.formations.name}</p>
              </div>
              <div className="border-t border-[rgba(255,255,255,0.1)] pt-4">
                <p className="text-[rgba(255,255,255,0.6)] text-sm mb-1">Montant</p>
                <p className="text-2xl font-bold text-[#C9A227]">
                  {enrollment.formations.price.toLocaleString()} FCFA
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-4">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3 text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Phone Input */}
            <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
              <CardHeader>
                <CardTitle className="text-white">Numéro de téléphone</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="phone" className="text-[rgba(255,255,255,0.8)]">
                  Entrez votre numéro (pour le paiement)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+221 77 000 00 00"
                  className="mt-2 h-11 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                />
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
              <CardHeader>
                <CardTitle className="text-white">Méthode de paiement</CardTitle>
                <CardDescription>Sélectionnez votre mode de paiement préféré</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Wave */}
                <button
                  onClick={() => setSelectedMethod('wave')}
                  disabled={isLoading}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    selectedMethod === 'wave'
                      ? 'border-[#C9A227] bg-[rgba(201,162,39,0.1)]'
                      : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(201,162,39,0.3)]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#0099FF] rounded-lg flex items-center justify-center text-white font-bold">
                      W
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-white">Wave</p>
                      <p className="text-xs text-[rgba(255,255,255,0.5)]">Paiement mobile instantané</p>
                    </div>
                  </div>
                </button>

                {/* Orange Money */}
                <button
                  onClick={() => setSelectedMethod('orange_money')}
                  disabled={isLoading}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    selectedMethod === 'orange_money'
                      ? 'border-[#C9A227] bg-[rgba(201,162,39,0.1)]'
                      : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(201,162,39,0.3)]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#FF6600] rounded-lg flex items-center justify-center text-white font-bold">
                      O
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-white">Orange Money</p>
                      <p className="text-xs text-[rgba(255,255,255,0.5)]">Service de paiement mobile</p>
                    </div>
                  </div>
                </button>

                {/* Free Money */}
                <button
                  onClick={() => setSelectedMethod('free_money')}
                  disabled={isLoading}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    selectedMethod === 'free_money'
                      ? 'border-[#C9A227] bg-[rgba(201,162,39,0.1)]'
                      : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(201,162,39,0.3)]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#FF00AA] rounded-lg flex items-center justify-center text-white font-bold">
                      F
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-white">Free Money</p>
                      <p className="text-xs text-[rgba(255,255,255,0.5)]">Portefeuille mobile Free</p>
                    </div>
                  </div>
                </button>
              </CardContent>
            </Card>

            {/* Payment Button */}
            <Button
              onClick={() => selectedMethod && handlePayment(selectedMethod)}
              disabled={!selectedMethod || !phone || isLoading}
              className="w-full h-12 bg-[#C9A227] hover:bg-[#B8860B] text-white font-semibold disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  Traitement du paiement...
                </span>
              ) : (
                `Payer ${enrollment.formations.price.toLocaleString()} FCFA`
              )}
            </Button>

            <p className="text-center text-[rgba(255,255,255,0.5)] text-xs">
              Vos informations de paiement sont sécurisées. Aucun frais supplémentaire ne sera appliqué.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
