"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { impactService, type ImpactStats } from "@/lib/impact-service"
import { GraduationCap, Users, HandCoins, Award, Building2, Heart } from "lucide-react"

export default function ImpactPage() {
  const [stats, setStats] = useState<ImpactStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    impactService.getStats().then((s) => {
      setStats(s)
      setLoading(false)
    })
  }, [])

  const cards = stats
    ? [
        { label: "Étudiants formés", value: stats.totalEtudiants, icon: GraduationCap },
        { label: "Certificats délivrés", value: stats.totalDiplomes, icon: Award },
        { label: "Formations proposées", value: stats.totalFormations, icon: Users },
        { label: "Partenaires engagés", value: stats.totalPartenaires, icon: Building2 },
        { label: "Investi par nos partenaires", value: `${stats.totalInvesti.toLocaleString()} FCFA`, icon: HandCoins },
        { label: "Reçu en dons", value: `${stats.totalDons.toLocaleString()} FCFA`, icon: Heart },
      ]
    : []

  return (
    <main className="min-h-screen bg-[#0D2545]">
      <Navbar />
      <section className="pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Notre impact</h1>
          <p className="text-[rgba(255,255,255,0.6)] max-w-2xl mx-auto">
            Depuis notre création, 2I Online forme les talents de demain dans l&apos;hôtellerie et la restauration au Sénégal.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C9A227]" />
          </div>
        ) : (
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((c) => (
              <div
                key={c.label}
                className="bg-[rgba(255,255,255,0.03)] border border-[rgba(201,162,39,0.15)] rounded-2xl p-8 text-center hover:border-[rgba(201,162,39,0.4)] transition-colors"
              >
                <c.icon className="w-8 h-8 text-[#C9A227] mx-auto mb-4" />
                <p className="font-serif text-3xl font-bold text-white mb-2">{c.value}</p>
                <p className="text-[rgba(255,255,255,0.5)] text-sm uppercase tracking-wider">{c.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="max-w-2xl mx-auto text-center mt-16">
          <p className="text-[rgba(255,255,255,0.6)] mb-6">
            Vous souhaitez soutenir notre mission et contribuer à la formation de nos étudiants ?
          </p>
          <a
            href="/don"
            className="inline-block bg-[#C9A227] hover:bg-[#E8C050] text-[#0D2545] font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Faire un don
          </a>
        </div>
      </section>
    </main>
  )
}
