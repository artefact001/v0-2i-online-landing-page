import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { opportunites, getOpportuniteBySlug, formatNewsDate } from "@/lib/news-data"

const categoryColors: Record<string, string> = {
  Emploi: "bg-[#C9A227]/20 text-[#C9A227]",
  Stage: "bg-blue-500/20 text-blue-400",
  Bourse: "bg-emerald-500/20 text-emerald-400",
  Concours: "bg-rose-500/20 text-rose-400",
}

export function generateStaticParams() {
  return opportunites.map((o) => ({ slug: o.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const opportunite = getOpportuniteBySlug(slug)
  if (!opportunite) return { title: "Opportunité introuvable | 2I Online" }
  return {
    title: `${opportunite.title} — ${opportunite.organization} | 2I Online`,
    description: opportunite.description,
  }
}

export default async function OpportuniteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const opportunite = getOpportuniteBySlug(slug)

  if (!opportunite) {
    notFound()
  }

  const whatsappMessage = encodeURIComponent(
    `Bonjour 2i Online, je souhaite postuler à l'offre "${opportunite.title}" (${opportunite.organization}).`,
  )

  return (
    <main className="min-h-screen bg-[#080F1E] text-white">
      <Navbar />

      <section className="relative pt-32 pb-24 px-6 md:px-10">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-[rgba(255,255,255,0.5)] hover:text-[#C9A227] text-sm mb-8 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux opportunités
          </Link>

          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-5 ${categoryColors[opportunite.category]}`}>
            {opportunite.category}
          </span>

          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-3 text-balance">{opportunite.title}</h1>
          <p className="text-[#C9A227] text-lg mb-1">{opportunite.organization}</p>

          <div className="flex items-center gap-2 text-[rgba(255,255,255,0.5)] text-sm mb-8">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {opportunite.location}
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {opportunite.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.6)] text-xs"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="space-y-5 mb-10">
            {opportunite.details.map((paragraph, i) => (
              <p key={i} className="text-[rgba(255,255,255,0.75)] leading-relaxed text-base">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex items-center justify-between p-6 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] mb-8">
            <div>
              <p className="text-[rgba(255,255,255,0.45)] text-xs mb-1">Date limite</p>
              <p className="text-white font-semibold">{formatNewsDate(opportunite.deadline)}</p>
            </div>
          </div>

          <a
            href={`https://wa.me/221774662921?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl bg-[#C9A227] text-[#0D2545] font-bold tracking-wide hover:bg-[#E8C050] transition-colors"
          >
            Postuler via WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
