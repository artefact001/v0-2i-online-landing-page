"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { apiClient } from "@/lib/api/client"
import {
  ChefHat,
  Cookie,
  UtensilsCrossed,
  ShieldCheck,
  Building2,
  ScrollText,
  Rocket,
  GraduationCap,
  Home,
  Hammer,
  BookOpen,
  type LucideIcon,
} from "lucide-react"

/**
 * ATTENTION: cette section affichait auparavant un plan fictif
 * "Inscription + Mensualité" (ex: 60 000 F + 30 000 F/mois) pour les CAP
 * — ce modèle de paiement échelonné n'existe NULLE PART dans le vrai
 * backend (formations.prix est un montant unique et fixe, et le
 * paiement PayDunya facture ce montant en une seule fois). Un visiteur
 * voyait donc un prix radicalement différent de celui réellement
 * débité au moment de payer. Corrigé en affichant le vrai prix unique,
 * identique à celui de la page de détail formation et du paiement.
 */
interface Formation {
  id: string
  titre: string
  description?: string
  prix: number
  statut: "en ligne" | "presentiel" | "hybride"
  niveau?: string
  nb_inscrit?: number
}

const statutLabel: Record<Formation["statut"], string> = {
  "en ligne": "100 % en ligne",
  presentiel: "Formation en présentiel",
  hybride: "Formation hybride",
}

// Choix d'icône par mots-clés du titre — le backend ne stocke pas
// d'icône, ceci est purement une heuristique visuelle côté client.
function iconFor(titre: string): LucideIcon {
  const t = titre.toLowerCase()
  if (t.includes("cuisin")) return ChefHat
  if (t.includes("pâtiss") || t.includes("patiss")) return Cookie
  if (t.includes("serveur") || t.includes("service")) return UtensilsCrossed
  if (t.includes("haccp") || t.includes("hygiène") || t.includes("hygiene")) return ShieldCheck
  if (t.includes("gestion")) return Building2
  if (t.includes("spécialité") || t.includes("specialite")) return ScrollText
  if (t.includes("incubation") || t.includes("street")) return Rocket
  if (t.includes("vae")) return GraduationCap
  if (t.includes("domicile")) return Home
  if (t.includes("atelier")) return Hammer
  return BookOpen
}

export function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [formations, setFormations] = useState<Formation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient<Formation[]>("/formations")
        setFormations(res.data || [])
      } catch (error) {
        console.error("[PricingSection] Erreur de chargement:", error)
      }
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => {
                el.classList.add('visible')
              }, i * 100)
            })
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // "Le plus suivi" = la formation avec le plus d'inscrits, calculé
  // dynamiquement plutôt qu'un flag fixe arbitraire.
  const mostPopularId = formations.length
    ? formations.reduce((a, b) => ((a.nb_inscrit ?? 0) > (b.nb_inscrit ?? 0) ? a : b)).id
    : null

  return (
    <section id="tarifs" ref={sectionRef} className="py-[120px] px-6 md:px-[60px] bg-[rgba(13,37,69,0.1)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="reveal text-[10px] font-semibold tracking-[5px] uppercase text-[#C9A227] mb-4">
            Tarification transparente
          </p>
          <h2 className="reveal font-serif text-[clamp(36px,4vw,56px)] font-semibold text-white mb-4">
            Nos <em className="italic text-[#C9A227] font-light">formations</em> et tarifs
          </h2>
          <p className="reveal text-base text-[#d0daf0] max-w-[600px] mx-auto">
            Paiement flexible en Mobile Money (Wave, Orange Money, Free Money). Accès immédiat après paiement.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C9A227]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {formations.map((formation, index) => {
              const Icon = iconFor(formation.titre)
              const featured = formation.id === mostPopularId

              return (
                <div
                  key={formation.id}
                  className={`reveal rounded-2xl p-8 lg:p-10 border relative overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
                    featured
                      ? "bg-gradient-to-b from-[rgba(27,58,107,0.6)] to-[rgba(13,37,69,0.8)] border-[rgba(201,162,39,0.5)] shadow-[0_0_80px_rgba(201,162,39,0.1)] md:scale-105 z-10"
                      : "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)] hover:border-[rgba(201,162,39,0.3)]"
                  }`}
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  {featured && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent" />
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <span className="w-12 h-12 rounded-xl bg-[rgba(201,162,39,0.12)] border border-[rgba(201,162,39,0.25)] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#C9A227]" strokeWidth={1.75} />
                    </span>
                    {featured && (
                      <span className="inline-flex items-center gap-1.5 bg-[#C9A227] text-[#0D2545] text-[9px] font-bold tracking-[2px] uppercase rounded-full px-3 py-1">
                        Le plus suivi
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-bold tracking-[3px] uppercase text-[rgba(255,255,255,0.5)] mb-4">
                    {formation.titre}
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-4xl font-bold text-white">
                        {Number(formation.prix).toLocaleString()}
                      </span>
                      <span className="text-sm text-[rgba(255,255,255,0.4)]">F</span>
                    </div>
                    <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1">Paiement unique, accès immédiat</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {[
                      statutLabel[formation.statut] ?? formation.statut,
                      formation.niveau ? `Niveau : ${formation.niveau}` : null,
                      "Vidéos HD + support de cours téléchargeable",
                      "Certificat numérique vérifiable en ligne",
                    ]
                      .filter(Boolean)
                      .map((text) => (
                        <li key={text} className="flex items-start gap-3 text-sm text-[#d0daf0]">
                          <svg className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {text}
                        </li>
                      ))}
                  </ul>

                  <Link
                    href={`/inscription?formation_id=${formation.id}`}
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold tracking-[1.5px] uppercase transition-all duration-300 ${
                      featured
                        ? "bg-[#C9A227] text-[#0D2545] hover:bg-[#E8C050] hover:scale-105"
                        : "border border-[rgba(255,255,255,0.15)] text-[rgba(255,255,255,0.7)] hover:border-[#C9A227] hover:text-[#C9A227] hover:bg-[rgba(201,162,39,0.05)]"
                    }`}
                  >
                    S&apos;inscrire
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
