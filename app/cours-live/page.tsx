"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { CoursesNavbar } from "@/components/courses-navbar"
import { apiClient } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { Radio, Clock, Calendar } from "lucide-react"

/**
 * Schéma Laravel réel (live_sessions) : title, description,
 * youtube_video_id, scheduled_at, duration_minutes, status
 * ('scheduled'|'live'|'completed'|'cancelled'), formation_id, user_id.
 * Aucune notion de participants/niveau/catégorie — ces champs
 * n'existent pas côté backend, retirés de cette page (auparavant
 * entièrement basée sur des données fictives, lib/courses-data.ts).
 */
interface LiveSession {
  id: string
  title: string
  description?: string
  scheduled_at: string
  duration_minutes: number
  status: "scheduled" | "live" | "completed" | "cancelled"
  formation_id: string
  formation?: { titre: string }
}

function LiveSessionCard({ session }: { session: LiveSession }) {
  const isLive = session.status === "live"
  const date = new Date(session.scheduled_at)

  return (
    <div className="group relative bg-gradient-to-br from-[#0D2545] to-[#1B3A6B] rounded-2xl overflow-hidden border border-[rgba(201,162,39,0.15)] hover:border-[rgba(201,162,39,0.4)] transition-all duration-500 hover:shadow-[0_20px_60px_rgba(201,162,39,0.15)]">
      <div className="relative h-32 bg-gradient-to-br from-[#0a1c38] to-[#0D2545] flex items-center justify-center">
        <Radio className="w-10 h-10 text-[rgba(201,162,39,0.3)]" />

        {isLive && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
            <span className="w-2 h-2 bg-white rounded-full animate-ping" />
            EN DIRECT
          </div>
        )}

        {session.formation && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-[rgba(201,162,39,0.9)] text-[#0D2545] font-semibold">
              {session.formation.titre}
            </Badge>
          </div>
        )}

        <div className="absolute bottom-4 right-4 bg-[rgba(0,0,0,0.7)] backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {session.duration_minutes} min
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 mb-3 text-sm">
          <span className={`font-semibold flex items-center gap-1.5 ${isLive ? "text-red-400" : "text-[#C9A227]"}`}>
            <Calendar className="w-3.5 h-3.5" />
            {date.toLocaleDateString("fr-FR")}
          </span>
          <span className="text-[rgba(255,255,255,0.4)]">•</span>
          <span className="text-[rgba(255,255,255,0.7)]">
            {date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        <h3 className="font-serif text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-[#C9A227] transition-colors">
          {session.title}
        </h3>

        {session.description && (
          <p className="text-[rgba(255,255,255,0.6)] text-sm mb-5 line-clamp-2">{session.description}</p>
        )}

        <Link href={`/cours/${session.formation_id}/direct/${session.id}`}>
          <Button
            className={`w-full font-semibold tracking-wide ${
              isLive ? "bg-red-600 hover:bg-red-700 text-white" : "bg-[#C9A227] hover:bg-[#E8C050] text-[#0D2545]"
            }`}
          >
            {isLive ? "Rejoindre maintenant" : "Voir les détails"}
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </Link>
      </div>
    </div>
  )
}

function CoursLivePageContent() {
  const [sessions, setSessions] = useState<LiveSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient<LiveSession[]>("/directs")
        setSessions(res.data || [])
      } catch (error) {
        console.error("[cours-live] Erreur de chargement:", error)
      }
      setLoading(false)
    }
    load()
  }, [])

  const liveNow = sessions.filter((s) => s.status === "live")
  const upcoming = sessions
    .filter((s) => s.status === "scheduled")
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())

  return (
    <main className="min-h-screen bg-[#0D2545]">
      <CoursesNavbar currentPage="live" />

      <section className="pt-32 pb-12 px-6 md:px-10">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Cours en direct</h1>
          <p className="text-[rgba(255,255,255,0.6)] max-w-2xl mx-auto">
            Rejoins les sessions live de tes formations, animées par nos formateurs experts.
          </p>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-2 gap-4 mb-12">
          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(201,162,39,0.15)] rounded-xl p-5 text-center">
            <p className="font-serif text-3xl font-bold text-red-400">{liveNow.length}</p>
            <p className="text-[rgba(255,255,255,0.5)] text-xs uppercase tracking-wider mt-1">En direct</p>
          </div>
          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(201,162,39,0.15)] rounded-xl p-5 text-center">
            <p className="font-serif text-3xl font-bold text-[#C9A227]">{upcoming.length}</p>
            <p className="text-[rgba(255,255,255,0.5)] text-xs uppercase tracking-wider mt-1">À venir</p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-center text-[rgba(255,255,255,0.5)] py-24">
              Aucune session live programmée pour tes formations pour le moment.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <LiveSessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default function CoursLivePage() {
  return (
    <AuthGuard>
      <CoursLivePageContent />
    </AuthGuard>
  )
}
