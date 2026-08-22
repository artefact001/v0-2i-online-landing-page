'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { apiClient } from '@/lib/api/client'
import { useAuth } from '@/lib/auth-context'
import { paymentService, type MethodePaiement } from '@/lib/payment-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Loader, ShieldCheck, Smartphone, Landmark, CreditCard } from 'lucide-react'

interface Formation {
  id: string
  titre: string
  prix: number
}

const methodeOptions: { value: MethodePaiement; label: string; icon: typeof Smartphone }[] = [
  { value: 'Wave', label: 'Wave', icon: Smartphone },
  { value: 'Orange Money', label: 'Orange Money', icon: Smartphone },
  { value: 'Free Money', label: 'Free Money', icon: Smartphone },
  { value: 'Virement', label: 'Virement bancaire', icon: Landmark },
  { value: 'CB', label: 'Carte bancaire', icon: CreditCard },
]

function PaymentContent() {
  const searchParams = useSearchParams()
  const formationId = searchParams.get('formation_id')

  const [formation, setFormation] = useState<Formation | null>(null)
  const [methode, setMethode] = useState<MethodePaiement>('Wave')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    async function loadFormation() {
      if (!formationId) {
        setError('Formation manquante')
        return
      }

      try {
        const res = await apiClient<Formation>(`/formations/${formationId}`)
        if (!res.data) {
          setError('Formation non trouvée')
          return
        }
        setFormation(res.data)
      } catch (err) {
        setError('Formation non trouvée')
      }
    }

    loadFormation()
  }, [formationId])

  const handlePayment = async () => {
    if (!formation || !formationId || !user) {
      setError('Vous devez être connecté pour payer')
      return
    }

    setIsLoading(true)
    setError('')

    const result = await paymentService.initiatePayDunyaPayment({
      formationId,
      montant: formation.prix,
      methode,
    })

    if (result.success && result.checkoutUrl) {
      // Redirection réelle vers la page de paiement hébergée PayDunya.
      window.location.href = result.checkoutUrl
      return
    }

    setError(result.message)
    setIsLoading(false)
  }

  if (!formation && !error) {
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

  if (!formation) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-8">
        <Card className="w-full max-w-md bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <p className="text-red-400">{error}</p>
            <Link href="/dashboard/student" className="text-[#C9A227] hover:underline text-sm">
              Retour au tableau de bord
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Finaliser l&apos;inscription</h1>
          <p className="text-[rgba(255,255,255,0.6)]">
            Formation : <span className="text-[#C9A227] font-semibold">{formation.titre}</span>
          </p>
        </div>

        <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
          <CardHeader>
            <CardTitle className="text-white">Résumé</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.1)] pt-4">
              <p className="text-[rgba(255,255,255,0.6)] text-sm">Montant à payer</p>
              <p className="text-2xl font-bold text-[#C9A227]">
                {Number(formation.prix).toLocaleString()} FCFA
              </p>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
          <CardHeader>
            <CardTitle className="text-white text-base">Moyen de paiement</CardTitle>
            <CardDescription>
              Tu confirmeras le paiement via {methode} sur la page sécurisée PayDunya.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {methodeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setMethode(opt.value)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-colors touch-manipulation ${
                  methode === opt.value
                    ? 'border-[#C9A227] bg-[#C9A227]/10 text-[#C9A227]'
                    : 'border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.05)]'
                }`}
              >
                <opt.icon className="w-4 h-4" />
                {opt.label}
              </button>
            ))}
          </CardContent>
        </Card>

        <Button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full h-12 bg-[#C9A227] hover:bg-[#B8860B] text-white font-semibold disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader className="w-4 h-4 animate-spin" />
              Redirection en cours...
            </span>
          ) : (
            `Payer ${Number(formation.prix).toLocaleString()} FCFA`
          )}
        </Button>

        <p className="flex items-center justify-center gap-2 text-center text-[rgba(255,255,255,0.5)] text-xs">
          <ShieldCheck className="w-4 h-4" />
          Paiement sécurisé par PayDunya. Aucun frais supplémentaire.
        </p>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-8">
          <Card className="w-full max-w-md bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
            <CardHeader>
              <Loader className="w-8 h-8 animate-spin mx-auto text-[#C9A227]" />
            </CardHeader>
          </Card>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  )
}
