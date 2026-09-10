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

  // Charte graphique unifiée avec le reste de la plateforme (même
  // correctif déjà appliqué au forum et aux pages d'évaluation) : fond
  // #0a0a1a au lieu de l'ancien bleu #0D2545, carte #0d0d1a au lieu de
  // blanc. Corrige au passage le même bug de texte invisible : les
  // champs Input/Textarea n'avaient aucune couleur de texte définie,
  // posés sur une carte blanche — le texte tapé héritait du blanc par
  // défaut du thème sombre global et devenait donc invisible.
  return (
    <main className="min-h-screen bg-[#0a0a1a]">
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

          <form onSubmit={handleSubmit} className="bg-[#0d0d1a] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 space-y-4">
            <div>
              <Label className="text-[rgba(255,255,255,0.7)]">Montant (FCFA)</Label>
              <div className="grid grid-cols-4 gap-2 mt-2 mb-3">
                {MONTANTS_SUGGERES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMontant(m)}
                    className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                      montant === m ? "bg-[#C9A227] text-[#0a0a1a]" : "bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.6)]"
                    }`}
                  >
                    {m.toLocaleString()}
                  </button>
                ))}
              </div>
              <Input
                type="number"
                value={montant}
                onChange={(e) => setMontant(Number(e.target.value))}
                min={500}
                className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
              />
            </div>

            {!user && (
              <>
                <div>
                  <Label className="text-[rgba(255,255,255,0.7)]">Nom</Label>
                  <Input
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Votre nom"
                    className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.35)]"
                  />
                </div>
                <div>
                  <Label className="text-[rgba(255,255,255,0.7)]">Email (optionnel)</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@exemple.com"
                    className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.35)]"
                  />
                </div>
              </>
            )}

            <div>
              <Label className="text-[rgba(255,255,255,0.7)]">Message (optionnel)</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.35)]"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-[#C9A227] hover:bg-[#B8860B] text-[#0a0a1a] font-semibold">
              {loading ? "Redirection..." : `Faire un don de ${montant.toLocaleString()} FCFA`}
            </Button>
          </form>
        </div>
      </section>
    </main>
  )
}
