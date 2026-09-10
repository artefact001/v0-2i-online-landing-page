"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { verificationService, type VerificationResult } from "@/lib/verification-service"
import { CheckCircle2, XCircle } from "lucide-react"

export default function VerifierCertificatPage() {
  const params = useParams()
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    verificationService.verifierCertificat(params.code as string).then((r) => {
      setResult(r)
      setLoading(false)
    })
  }, [params.code])

  // Charte graphique unifiée avec le reste de la plateforme (même
  // correctif déjà appliqué au forum, aux évaluations, au don et à la
  // recherche) : fond #0a0a1a, cartes #0d0d1a.
  return (
    <main className="min-h-screen bg-[#0a0a1a]">
      <Navbar />
      <section className="pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="max-w-md w-full">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : result?.valide ? (
            <div className="bg-[#0d0d1a] border border-[rgba(255,255,255,0.05)] rounded-2xl p-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-white mb-1">Certificat authentique</h1>
              <p className="text-[rgba(255,255,255,0.5)] text-sm mb-6">Ce certificat a bien été délivré par 2I Online.</p>
              <div className="text-left bg-[rgba(255,255,255,0.03)] rounded-lg p-4 space-y-2">
                <p className="text-sm"><span className="text-[rgba(255,255,255,0.5)]">Titulaire :</span> <span className="font-semibold text-white">{result.nom}</span></p>
                <p className="text-sm"><span className="text-[rgba(255,255,255,0.5)]">Formation :</span> <span className="font-semibold text-white">{result.formation}</span></p>
                <p className="text-sm"><span className="text-[rgba(255,255,255,0.5)]">N° certificat :</span> <span className="font-semibold text-white">{result.numero_certificat}</span></p>
                <p className="text-sm"><span className="text-[rgba(255,255,255,0.5)]">Date d&apos;obtention :</span> <span className="font-semibold text-white">{new Date(result.date_obtention).toLocaleDateString('fr-FR')}</span></p>
              </div>
            </div>
          ) : (
            <div className="bg-[#0d0d1a] border border-[rgba(255,255,255,0.05)] rounded-2xl p-8 text-center">
              <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-white mb-1">Certificat introuvable</h1>
              <p className="text-[rgba(255,255,255,0.5)] text-sm">Ce code de vérification n&apos;est associé à aucun certificat valide.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
