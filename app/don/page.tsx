"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { donService } from "@/lib/don-service"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Heart } from "lucide-react"
import { alertError } from "@/lib/alerts"

const MONTANTS_SUGGERES = [5000, 10000, 25000, 50000]

export default function DonPage() {
  const { user } = useAuth()
  const [montant, setMontant] = useState(10000)
  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (montant < 500) {
      alertError("Le montant minimum est de 500 FCFA.")
      return
    }
    if (!user && !nom.trim()) {
      alertError("Merci d'indiquer votre nom.")
      return
    }

    setLoading(true)
    try {
      const result = await donService.faireUnDon({
        montant,
        nom_donateur: nom || undefined,
        email_donateur: email || undefined,
        message: message || undefined,
      })
      if (result?.checkout_url) {
        window.location.href = result.checkout_url
      } else {
        alertError("Impossible de lancer le paiement.")
      }
    } catch (err: any) {
      alertError(err?.message || "Une erreur est survenue.")
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#0D2545]">
      <Navbar />
      <section className="pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Heart className="w-10 h-10 text-[#C9A227] mx-auto mb-4" />
            <h1 className="font-serif text-3xl font-bold text-white mb-2">Faire un don</h1>
            <p className="text-[rgba(255,255,255,0.6)] text-sm">
              Votre soutien aide directement nos étudiants à se former aux métiers de l&apos;hôtellerie et de la restauration.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 space-y-4">
            <div>
              <Label>Montant (FCFA)</Label>
              <div className="grid grid-cols-4 gap-2 mt-2 mb-3">
                {MONTANTS_SUGGERES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMontant(m)}
                    className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                      montant === m ? "bg-[#C9A227] text-[#0D2545]" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {m.toLocaleString()}
                  </button>
                ))}
              </div>
              <Input type="number" value={montant} onChange={(e) => setMontant(Number(e.target.value))} min={500} />
            </div>

            {!user && (
              <>
                <div>
                  <Label>Nom</Label>
                  <Input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Votre nom" />
                </div>
                <div>
                  <Label>Email (optionnel)</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" />
                </div>
              </>
            )}

            <div>
              <Label>Message (optionnel)</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-[#C9A227] hover:bg-[#B8860B] text-[#0D2545] font-semibold">
              {loading ? "Redirection..." : `Faire un don de ${montant.toLocaleString()} FCFA`}
            </Button>
          </form>
        </div>
      </section>
    </main>
  )
}
