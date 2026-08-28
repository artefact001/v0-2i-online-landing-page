"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { alumniService, type Alumnus } from "@/lib/alumni-service"
import { Users, Briefcase } from "lucide-react"

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<Alumnus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    alumniService.getAll().then((a) => {
      setAlumni(a)
      setLoading(false)
    })
  }, [])

  return (
    <main className="min-h-screen bg-[#0D2545]">
      <Navbar />
      <section className="pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Nos Alumni</h1>
          <p className="text-[rgba(255,255,255,0.6)] max-w-2xl mx-auto">
            Découvrez le parcours de nos anciens étudiants, aujourd&apos;hui en poste dans l&apos;hôtellerie et la restauration.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C9A227]" />
          </div>
        ) : alumni.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-12">
            <Users className="w-10 h-10 text-[rgba(255,255,255,0.2)] mx-auto mb-3" />
            <p className="text-[rgba(255,255,255,0.5)]">Aucun alumni visible dans l&apos;annuaire pour le moment.</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {alumni.map((a) => (
              <div key={a.id} className="bg-[rgba(255,255,255,0.03)] border border-[rgba(201,162,39,0.15)] rounded-2xl p-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A227] to-[#E8C050] flex items-center justify-center text-[#0D2545] font-bold mb-4">
                  {a.prenom[0]}{a.nom[0]}
                </div>
                <h3 className="text-white font-semibold mb-1">{a.prenom} {a.nom}</h3>
                {a.posteActuel && (
                  <p className="text-[#C9A227] text-sm flex items-center gap-1.5 mb-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    {a.posteActuel}{a.entrepriseActuelle ? ` · ${a.entrepriseActuelle}` : ''}
                  </p>
                )}
                <p className="text-[rgba(255,255,255,0.4)] text-xs mt-2">
                  {a.formations.join(', ')}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
