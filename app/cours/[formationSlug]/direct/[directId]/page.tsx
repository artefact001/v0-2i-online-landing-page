'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Radio } from 'lucide-react'

interface LiveSession {
  id: string
  title: string
  description: string
  youtube_video_id: string
  scheduled_at: string
  duration_minutes: number
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
  formation?: { name: string }
}

export default function WatchLivePage() {
  const params = useParams()
  const router = useRouter()
  const [session, setSession] = useState<LiveSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [embedDomain, setEmbedDomain] = useState('')

  useEffect(() => {
    // Le chat live YouTube exige le domaine exact d'où la page est servie.
    setEmbedDomain(window.location.hostname)
  }, [])

  useEffect(() => {
    async function load() {
      try {
        // Route Laravel réelle: /v1/directs/{id}
        const res = await apiClient<LiveSession>(`/directs/${params.directId}`)
        setSession(res.data || null)
      } catch (error) {
        console.error('Error loading live session:', error)
      }
      setLoading(false)
    }
    load()
  }, [params.directId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080F1E] flex items-center justify-center">
        <p className="text-white">Chargement...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#080F1E] flex items-center justify-center">
        <p className="text-white">Session introuvable.</p>
      </div>
    )
  }

  const isLive = session.status === 'live'
  const isEnded = session.status === 'completed'

  return (
    <div className="min-h-screen bg-[#080F1E] px-4 py-8 md:px-10">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push(`/cours/${params.formationSlug}`)}
          className="text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la formation
        </Button>

        <div className="flex items-center gap-3 mb-2">
          {isLive && (
            <span className="flex items-center gap-1.5 bg-red-500/20 text-red-400 text-xs font-semibold px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              EN DIRECT
            </span>
          )}
          {isEnded && (
            <span className="bg-white/10 text-[rgba(255,255,255,0.6)] text-xs font-semibold px-3 py-1 rounded-full">
              Replay
            </span>
          )}
          {!isLive && !isEnded && (
            <span className="flex items-center gap-1.5 bg-[#C9A227]/20 text-[#C9A227] text-xs font-semibold px-3 py-1 rounded-full">
              <Calendar className="w-3 h-3" />
              Programmé
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">{session.title}</h1>
        <p className="text-[rgba(255,255,255,0.6)] mb-8">{session.description}</p>

        {!isLive && !isEnded ? (
          <div className="aspect-video rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4">
            <Radio className="w-12 h-12 text-[#C9A227]" />
            <p className="text-white text-lg">
              Ce cours en direct démarre le{' '}
              {new Date(session.scheduled_at).toLocaleString('fr-FR', {
                dateStyle: 'long',
                timeStyle: 'short',
              })}
            </p>
            <p className="text-[rgba(255,255,255,0.5)] text-sm">Reviens sur cette page à l'heure du live.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Vidéo */}
            <div className="lg:col-span-2 aspect-video rounded-2xl overflow-hidden bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${session.youtube_video_id}?autoplay=1`}
                title={session.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Chat en direct — uniquement pertinent pendant le live, pas en replay */}
            {isLive && embedDomain && (
              <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 h-[400px] lg:h-auto">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/live_chat?v=${session.youtube_video_id}&embed_domain=${embedDomain}`}
                  title="Chat en direct"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
