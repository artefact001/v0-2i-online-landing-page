'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { paymentService } from '@/lib/payment-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Loader, Clock, XCircle } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const paiementId = searchParams.get('paiement_id')
  const [status, setStatus] = useState<'loading' | 'completed' | 'pending' | 'failed' | 'error'>('loading')

  useEffect(() => {
    async function checkStatus() {
      if (!paiementId) {
        setStatus('error')
        return
      }

      // On ne fait JAMAIS confiance à l'URL de retour elle-même — on relit
      // le statut réel depuis Laravel, mis à jour uniquement par le webhook
      // PayDunya (IPN). PayDunya peut rediriger ici avant que l'IPN
      // n'arrive (léger délai réseau), donc on retente quelques fois si
      // le paiement est encore "en attente".
      for (let attempt = 0; attempt < 5; attempt++) {
        const data = await paymentService.getPaymentStatus(paiementId)

        if (!data) {
          setStatus('error')
          return
        }

        if (data.statut === 'confirme') {
          setStatus('completed')
          return
        }

        if (data.statut === 'echec') {
          setStatus('failed')
          return
        }

        // statut "en attente" : l'IPN n'est peut-être pas encore arrivée,
        // on patiente un peu avant de réessayer.
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      setStatus('pending')
    }

    checkStatus()
  }, [paiementId])

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-8">
      <Card className="w-full max-w-md bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
        {status === 'loading' && (
          <CardHeader className="text-center">
            <Loader className="w-10 h-10 animate-spin mx-auto text-[#C9A227] mb-4" />
            <CardTitle className="text-white">Vérification du paiement...</CardTitle>
            <CardDescription>Merci de patienter quelques instants.</CardDescription>
          </CardHeader>
        )}

        {status === 'completed' && (
          <>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-green-500">Paiement réussi !</CardTitle>
              <CardDescription>Ton inscription a été confirmée.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/student" className="block">
                <Button className="w-full bg-[#C9A227] hover:bg-[#B8860B] text-white">
                  Accéder à mes cours
                </Button>
              </Link>
            </CardContent>
          </>
        )}

        {status === 'pending' && (
          <>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
              <CardTitle className="text-2xl text-yellow-500">Paiement en cours de traitement</CardTitle>
              <CardDescription>
                Ça peut prendre quelques minutes. Tu recevras un email dès que ton inscription sera confirmée.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/student" className="block">
                <Button variant="outline" className="w-full border-[rgba(255,255,255,0.2)] text-white">
                  Retour au tableau de bord
                </Button>
              </Link>
            </CardContent>
          </>
        )}

        {(status === 'failed' || status === 'error') && (
          <>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <CardTitle className="text-2xl text-red-500">Paiement non confirmé</CardTitle>
              <CardDescription>
                {status === 'error'
                  ? "Impossible de vérifier ce paiement."
                  : "Le paiement n'a pas abouti. Aucun montant n'a été débité si tu as annulé."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/student" className="block">
                <Button variant="outline" className="w-full border-[rgba(255,255,255,0.2)] text-white">
                  Retour au tableau de bord
                </Button>
              </Link>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-8">
          <Loader className="w-8 h-8 animate-spin text-[#C9A227]" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
