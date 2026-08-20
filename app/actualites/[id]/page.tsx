"use client"

import { useState, useEffect } from "react"
import { notFound, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { apiClient } from "@/lib/api/client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

interface Actu {
  id: string
  titre: string
  description?: string
  contenu_html: string
  image?: string
  type: 'actualite' | 'evenement' | 'communique' | 'blog'
  date_publication: string
  statut: 'brouillon' | 'publie' | 'archive'
}

const typeLabel: Record<Actu['type'], string> = {
  actualite: 'Actualité',
  evenement: 'Événement',
  communique: 'Communiqué',
  blog: 'Blog',
}

const typeColor: Record<Actu['type'], string> = {
  actualite: 'bg-[#C9A227]/20 text-[#C9A227]',
  evenement: 'bg-blue-500/20 text-blue-400',
  communique: 'bg-emerald-500/20 text-emerald-400',
  blog: 'bg-rose-500/20 text-rose-400',
}

export default function ActualiteDetailPage() {
  const params = useParams()
  const [article, setArticle] = useState<Actu | null>(null)
  const [related, setRelated] = useState<Actu[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient<Actu>(`/actus/${params.id}`)
        setArticle(res.data ?? null)

        const allRes = await apiClient<Actu[]>('/actus')
        const others = (allRes.data || []).filter((a) => a.id !== params.id && a.statut === 'publie').slice(0, 2)
        setRelated(others)
      } catch (error) {
        console.error('Error loading article:', error)
      }
      setLoading(false)
    }
    load()
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080F1E] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C9A227]" />
      </main>
    )
  }

  if (!article) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#080F1E] text-white">
      <Navbar />

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
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColor[article.type]}`}>
              {typeLabel[article.type]}
            </span>
            <span className="text-[rgba(255,255,255,0.4)] text-xs">
              {new Date(article.date_publication).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-8 text-balance">{article.titre}</h1>

          {article.image && (
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-10">
              <Image src={article.image} alt={article.titre} fill className="object-cover" />
            </div>
          )}

          <div
            className="prose prose-invert max-w-none text-[rgba(255,255,255,0.75)] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.contenu_html }}
          />
        </div>
      </section>

      {related.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 md:px-10 pb-24">
          <h2 className="font-serif text-xl font-bold mb-6">À lire aussi</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {related.map((a) => (
              <Link
                href={`/actualites/${a.id}`}
                key={a.id}
                className="group bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden hover:border-[rgba(201,162,39,0.4)] transition-all"
              >
                {a.image && (
                  <div className="relative h-40 overflow-hidden">
                    <Image src={a.image} alt={a.titre} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-serif text-base font-bold text-white group-hover:text-[#C9A227] transition-colors text-balance">
                    {a.titre}
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
