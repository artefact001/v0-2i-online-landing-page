'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api/client'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ValidatedInput } from '@/components/ui/validated-input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { Edit, Trash2, Plus, Calendar, Radio, Youtube } from 'lucide-react'
import { combine, required, minLength } from '@/lib/validators'

interface LiveSession {
  id: string
  formation_id: string
  user_id: string
  title: string
  description: string
  youtube_video_id: string
  scheduled_at: string
  duration_minutes: number
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
  formation?: { name: string }
}

interface Formation {
  id: string
  name: string
}

// Accepte un lien YouTube complet (regarder, live, youtu.be, embed) ou déjà
// juste l'ID, et retourne uniquement l'ID (11 caractères typiquement).
function extractYoutubeId(input: string): string {
  const trimmed = input.trim()
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/live\/|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{6,})/,
  ]
  for (const pattern of patterns) {
    const match = trimmed.match(pattern)
    if (match) return match[1]
  }
  return trimmed
}

export default function LiveSessionsPage() {
  const [sessions, setSessions] = useState<LiveSession[]>([])
  const [formations, setFormations] = useState<Formation[]>([])
  const [selectedFormation, setSelectedFormation] = useState<string>('')
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduled_at: '',
    duration_minutes: 60,
    youtube_link: '',
  })

  const { user } = useAuth()

  useEffect(() => {
    loadFormations()
  }, [])

  useEffect(() => {
    if (selectedFormation) {
      loadSessions()
    }
  }, [selectedFormation])

  const loadFormations = async () => {
    try {
      if (!user) return
      // ATTENTION: pas d'équivalent Laravel de "professor_formations". On suppose
      // que /v1/formations accepte un filtre ?formateur_id=... À vérifier.
      const res = await apiClient<Formation[]>(`/formations?user_id=${user.id}`)
      const uniqueFormations = res.data || []
      setFormations(uniqueFormations)
      if (uniqueFormations.length > 0) {
        setSelectedFormation(uniqueFormations[0].id)
      }
    } catch (error) {
      console.error('Error loading formations:', error)
    }
  }

  // Route Laravel réelle: /v1/directs (à ajouter côté backend, voir DirectController)
  const loadSessions = async () => {
    try {
      const res = await apiClient<LiveSession[]>(`/directs?formation_id=${selectedFormation}`)
      setSessions(res.data || [])
    } catch (error) {
      console.error('Error loading sessions:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFormation) return
    setIsLoading(true)

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        scheduled_at: formData.scheduled_at,
        duration_minutes: formData.duration_minutes,
        youtube_video_id: extractYoutubeId(formData.youtube_link),
        formation_id: selectedFormation,
      }

      if (editingId) {
        await apiClient(`/directs/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      } else {
        await apiClient('/directs', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }

      await loadSessions()
      resetForm()
    } catch (error) {
      console.error('Error saving session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce cours en direct ?')) return
    try {
      await apiClient(`/directs/${id}`, { method: 'DELETE' })
      loadSessions()
    } catch (error) {
      console.error('Error deleting session:', error)
    }
  }

  const handleStartSession = async (id: string) => {
    try {
      await apiClient(`/directs/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'live' }),
      })
      loadSessions()
    } catch (error) {
      console.error('Error starting session:', error)
    }
  }

  const handleEndSession = async (id: string) => {
    try {
      await apiClient(`/directs/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'completed' }),
      })
      loadSessions()
    } catch (error) {
      console.error('Error ending session:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      scheduled_at: '',
      duration_minutes: 60,
      youtube_link: '',
    })
    setEditingId(null)
    setIsCreating(false)
  }

  const handleEdit = (session: LiveSession) => {
    setFormData({
      title: session.title,
      description: session.description,
      scheduled_at: session.scheduled_at,
      duration_minutes: session.duration_minutes,
      youtube_link: session.youtube_video_id,
    })
    setEditingId(session.id)
    setIsCreating(true)
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Cours en direct" subtitle="Planifiez et gérez vos sessions en direct YouTube" />
        <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div />
        <Button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-[#C9A227] hover:bg-[#B8860B] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau cours
        </Button>
      </div>

      {/* Formation Selector */}
      <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
        <CardHeader>
          <CardTitle className="text-white">Sélectionner une formation</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedFormation} onValueChange={setSelectedFormation}>
            <SelectTrigger className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)]">
              {formations.map((f) => (
                <SelectItem key={f.id} value={f.id} className="text-white">
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
          <CardHeader>
            <CardTitle className="text-white">
              {editingId ? 'Modifier le cours' : 'Créer un nouveau cours en direct'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <ValidatedInput
                label="Titre"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Titre du cours"
                validator={combine(required("Le titre est obligatoire"), minLength(3))}
                className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                required
              />

              <div className="space-y-2">
                <Label className="text-[rgba(255,255,255,0.8)]">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description du cours"
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[rgba(255,255,255,0.8)]">Date et heure</Label>
                <Input
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[rgba(255,255,255,0.8)]">Durée (minutes)</Label>
                <Input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[rgba(255,255,255,0.8)] flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-red-500" />
                  Lien YouTube Live (non répertorié)
                </Label>
                <ValidatedInput
                  value={formData.youtube_link}
                  onChange={(e) => setFormData({ ...formData, youtube_link: e.target.value })}
                  placeholder="https://youtube.com/watch?v=... ou juste l'ID de la vidéo"
                  validator={required("Le lien YouTube est obligatoire")}
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                  required
                />
                <p className="text-xs text-[rgba(255,255,255,0.4)]">
                  Crée d'abord ton live "non répertorié" dans YouTube Studio, puis colle le lien ici.
                  L'ID est extrait automatiquement.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[#C9A227] hover:bg-[#B8860B] text-white"
                >
                  {isLoading ? 'Enregistrement...' : editingId ? 'Modifier' : 'Créer'}
                </Button>
                <Button
                  type="button"
                  onClick={resetForm}
                  variant="outline"
                  className="flex-1 border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.05)]"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Sessions List */}
      <div className="space-y-3">
        {sessions.map((session) => (
          <Card key={session.id} className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {session.status === 'live' ? (
                      <>
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-red-400 text-sm font-semibold">EN DIRECT</span>
                      </>
                    ) : (
                      <Calendar className="w-5 h-5 text-[#C9A227]" />
                    )}
                    <h3 className="text-lg font-semibold text-white">{session.title}</h3>
                  </div>
                  <p className="text-[rgba(255,255,255,0.6)] text-sm mb-2">{session.description}</p>
                  <div className="flex items-center gap-4 text-xs text-[rgba(255,255,255,0.5)] mb-3">
                    <span>
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {new Date(session.scheduled_at).toLocaleString('fr-FR')}
                    </span>
                    <span>Durée: {session.duration_minutes} min</span>
                    <span className="flex items-center gap-1">
                      <Youtube className="w-3 h-3 text-red-500" />
                      {session.youtube_video_id}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {session.status === 'scheduled' && (
                    <>
                      <Button
                        onClick={() => handleStartSession(session.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs"
                      >
                        <Radio className="w-3 h-3 mr-1" />
                        Démarrer
                      </Button>
                      <Button
                        onClick={() => handleEdit(session)}
                        variant="outline"
                        size="sm"
                        className="border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.05)]"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(session.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  {session.status === 'live' && (
                    <Button
                      onClick={() => handleEndSession(session.id)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs"
                    >
                      Terminer
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sessions.length === 0 && !isCreating && (
        <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
          <CardContent className="pt-12 text-center">
            <Calendar className="w-12 h-12 text-[rgba(255,255,255,0.2)] mx-auto mb-4" />
            <p className="text-[rgba(255,255,255,0.6)]">Aucun cours en direct créé</p>
          </CardContent>
        </Card>
      )}
        </div>
      </main>
    </div>
  )
}
