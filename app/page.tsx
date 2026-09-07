"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api/client"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Divider } from "@/components/divider"
import { AboutSection } from "@/components/about-section"
import { CoursesSection } from "@/components/courses-section"
import { PartnersSection } from "@/components/partners-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PricingSection } from "@/components/pricing-section"
import { FAQSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { WhatsAppWidget } from "@/components/whatsapp-widget"

// Chargé une seule fois ici, au niveau de la page, et transmis aux deux
// sections qui en ont besoin (CoursesSection + PricingSection) — avant
// ce changement, chacune appelait GET /formations indépendamment,
// doublant inutilement cette requête à chaque visite de la page
// d'accueil (la page la plus visitée du site).
interface Formation {
  id: string
  titre: string
  description?: string
  image?: string
  niveau?: string
  duree?: string
  prix: number
  statut: "en ligne" | "presentiel" | "hybride"
  nb_inscrit?: number
}

export default function Home() {
  const [formations, setFormations] = useState<Formation[] | undefined>(undefined)

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient<Formation[]>("/formations")
        setFormations(res.data || [])
      } catch (error) {
        console.error("[Home] Erreur de chargement des formations:", error)
        setFormations([])
      }
    }
    load()
  }, [])

  return (
    <main className="min-h-screen bg-[#080F1E]">
      <Navbar />
      <Hero />
      <Divider />
      <AboutSection />
      <Divider />
      <CoursesSection initialFormations={formations} />
      <Divider />
      <PartnersSection />
      <Divider />
      <TestimonialsSection />
      <Divider />
      <PricingSection initialFormations={formations} />
      <Divider />
      <FAQSection />
      <Divider />
      <CTASection />
      <Footer />
      <WhatsAppWidget />
    </main>
  )
}
