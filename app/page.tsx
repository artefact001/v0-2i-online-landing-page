import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Divider } from "@/components/divider"
import { AboutSection } from "@/components/about-section"
import { CoursesSection } from "@/components/courses-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PricingSection } from "@/components/pricing-section"
import { FAQSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { WhatsAppWidget } from "@/components/whatsapp-widget"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080F1E]">
      <Navbar />
      <Hero />
      <Divider />
      <AboutSection />
      <Divider />
      <CoursesSection />
      <Divider />
      <HowItWorksSection />
      <Divider />
      <TestimonialsSection />
      <Divider />
      <PricingSection />
      <Divider />
      <FAQSection />
      <Divider />
      <CTASection />
      <Footer />
      <WhatsAppWidget />
    </main>
  )
}
