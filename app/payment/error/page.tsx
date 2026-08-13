'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { XCircle, Loader } from 'lucide-react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const paiementId = searchParams.get('paiement_id')

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-8">
      <Card className="w-full max-w-md bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-red-500">Paiement annulé ou échoué</CardTitle>
          <CardDescription>
            Aucun montant n&apos;a été débité. Tu peux réessayer quand tu veux.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {paiementId && (
            <Link href={`/payment/success?paiement_id=${paiementId}`} className="block">
              <Button variant="outline" className="w-full border-[rgba(255,255,255,0.2)] text-white">
                Vérifier le statut du paiement
              </Button>
            </Link>
          )}
          <Link href="/dashboard/student" className="block">
            <Button className="w-full bg-[#C9A227] hover:bg-[#B8860B] text-white">
              Retour au tableau de bord
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-8">
          <Loader className="w-8 h-8 animate-spin text-[#C9A227]" />
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  )
}
