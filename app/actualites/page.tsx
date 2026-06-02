import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ActualitesContent } from "@/components/actualites-content"

export const metadata: Metadata = {
  title: "Actu & Opportunités — 2I Online",
  description:
    "Suivez les dernières actualités de 2I Online et découvrez les opportunités d'emploi, de stage, de bourses et de concours dans l'hôtellerie et la restauration.",
}

export default function ActualitesPage() {
  return (
    <main className="min-h-screen bg-[#080F1E]">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-16 px-6 md:px-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.12),transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(201,162,39,0.1)] border border-[rgba(201,162,39,0.25)] mb-6">
            <span className="w-2 h-2 bg-[#C9A227] rounded-full" />
            <span className="text-[#C9A227] text-xs font-medium tracking-[2px] uppercase">Restez informé</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 text-balance">
            Actu & Opportunités
          </h1>
          <p className="text-[rgba(255,255,255,0.6)] text-lg max-w-2xl mx-auto leading-relaxed text-pretty">
            Découvrez les dernières nouvelles de notre institut, nos événements, et les opportunités
            professionnelles offertes à nos étudiants et diplômés.
          </p>
        </div>
      </section>

      <ActualitesContent />

      <Footer />
    </main>
  )
}
