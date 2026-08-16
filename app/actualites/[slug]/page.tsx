import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { actualites, getActualiteBySlug, formatNewsDate } from "@/lib/news-data"

const categoryColors: Record<string, string> = {
  Actualité: "bg-[#C9A227]/20 text-[#C9A227]",
  Événement: "bg-blue-500/20 text-blue-400",
  Partenariat: "bg-emerald-500/20 text-emerald-400",
  Réussite: "bg-rose-500/20 text-rose-400",
}

export function generateStaticParams() {
  return actualites.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getActualiteBySlug(slug)
  if (!article) return { title: "Article introuvable | 2I Online" }
  return {
    title: `${article.title} | 2I Online`,
    description: article.excerpt,
  }
}

export default async function ActualiteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getActualiteBySlug(slug)

  if (!article) {
    notFound()
  }

  const related = actualites.filter((a) => a.slug !== article.slug).slice(0, 2)

  return (
    <main className="min-h-screen bg-[#080F1E] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-12 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-[rgba(255,255,255,0.5)] hover:text-[#C9A227] text-sm mb-8 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux actualités
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[article.category]}`}>
              {article.category}
            </span>
            <span className="text-[rgba(255,255,255,0.4)] text-xs">{formatNewsDate(article.date)}</span>
            <span className="text-[rgba(255,255,255,0.4)] text-xs">· {article.readingTime}</span>
          </div>

          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-8 text-balance">{article.title}</h1>

          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-10">
            <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
          </div>

          <div className="prose prose-invert max-w-none">
            {article.content.map((paragraph, i) => (
              <p key={i} className="text-[rgba(255,255,255,0.75)] leading-relaxed mb-6 text-base md:text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 md:px-10 pb-24">
          <h2 className="font-serif text-xl font-bold mb-6">À lire aussi</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {related.map((a) => (
              <Link
                href={`/actualites/${a.slug}`}
                key={a.id}
                className="group bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden hover:border-[rgba(201,162,39,0.4)] transition-all"
              >
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={a.image || "/placeholder.svg"}
                    alt={a.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-base font-bold text-white group-hover:text-[#C9A227] transition-colors text-balance">
                    {a.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
