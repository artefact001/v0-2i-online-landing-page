'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { searchService, type SearchResult } from '@/lib/search-service'
import { Input } from '@/components/ui/input'
import { Search, BookOpen, Newspaper, Briefcase, GraduationCap } from 'lucide-react'

const typeIcon: Record<SearchResult['type'], typeof BookOpen> = {
  formation: GraduationCap,
  lesson: BookOpen,
  post: Newspaper,
  resource: Briefcase,
}

const typeLabel: Record<SearchResult['type'], string> = {
  formation: 'Formation',
  lesson: 'Leçon',
  post: 'Actualité',
  resource: 'Opportunité',
}

function SearchContent() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([])
        return
      }
      setLoading(true)
      const found = await searchService.search(query)
      setResults(found)
      setLoading(false)
    }, 350)
    return () => clearTimeout(timer)
  }, [query])

  // Charte graphique unifiée avec le reste de la plateforme (même
  // correctif déjà appliqué au forum, aux pages d'évaluation et au don) :
  // fond #0a0a1a, cartes #0d0d1a. Le champ de recherche avait "bg-white"
  // sans couleur de texte définie — texte blanc (hérité du thème sombre
  // global) sur fond blanc, donc invisible en tapant.
  return (
    <div className="min-h-screen bg-[#0a0a1a] p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Recherche</h1>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgba(255,255,255,0.4)]" />
          <Input
            type="text"
            placeholder="Rechercher une formation, une leçon, une actualité..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 py-6 text-lg bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.35)]"
            autoFocus
          />
        </div>

        {loading && <p className="text-[rgba(255,255,255,0.6)] text-center">Recherche en cours...</p>}

        {!loading && query.trim().length >= 2 && (
          <p className="text-[rgba(255,255,255,0.6)] mb-4">
            {results.length} résultat{results.length !== 1 ? 's' : ''} trouvé{results.length !== 1 ? 's' : ''}
          </p>
        )}

        <div className="space-y-3">
          {results.map((r) => {
            const Icon = typeIcon[r.type]
            return (
              <Link
                key={`${r.type}-${r.id}`}
                href={r.url}
                className="flex items-start gap-4 bg-[#0d0d1a] border border-[rgba(255,255,255,0.05)] rounded-xl p-4 hover:border-[rgba(201,162,39,0.4)] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[#C9A227]/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#C9A227]" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-[#C9A227] uppercase tracking-wide">
                    {typeLabel[r.type]}
                  </span>
                  <h3 className="font-bold text-white truncate">{r.title}</h3>
                  {r.description && <p className="text-sm text-[rgba(255,255,255,0.5)] line-clamp-1">{r.description}</p>}
                </div>
              </Link>
            )
          })}
        </div>

        {!loading && query.trim().length >= 2 && results.length === 0 && (
          <p className="text-[rgba(255,255,255,0.5)] text-center py-12">Aucun résultat pour &quot;{query}&quot;.</p>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a1a]" />}>
      <SearchContent />
    </Suspense>
  )
}
