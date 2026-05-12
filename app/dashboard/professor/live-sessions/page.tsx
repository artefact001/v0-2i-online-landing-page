'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Edit, Trash2, Plus, Calendar, Users, Radio } from 'lucide-react'

interface LiveSession {
  id: string
  formation_id: string
  professor_id: string
  title: string
  description: string
  scheduled_at: string
  duration_minutes: number
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
  meeting_url: string | null
  recording_url: string | null
  max_participants: number
  formations?: {
    name: string
  }
  _count?: {
    session_attendance: number
  }
}

interface Formation {
  id: string
  name: string
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
    meeting_url: '',
    max_participants: 100,
  })

  const supabase = createClient()

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
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return

      const { data, error } = await supabase
        .from('professor_formations')
        .select('formations(id, name)')
        .eq('professor_id', user.user.id)

      if (error) throw error
      
      const uniqueFormations = data?.map(pf => pf.formations).filter(Boolean) || []
      setFormations(uniqueFormations as Formation[])
      if (uniqueFormations.length > 0) {
        setSelectedFormation(uniqueFormations[0].id)
      }
    } catch (error) {
      console.error('Error loading formations:', error)
    }
  }

  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .select('*, formations(name), session_attendance(id)')
        .eq('formation_id', selectedFormation)
        .order('scheduled_at', { ascending: false })

      if (error) throw error
      setSessions(data || [])
    } catch (error) {
      console.error('Error loading sessions:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFormation) return

    setIsLoading(true)
    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return

      if (editingId) {
        const { error } = await supabase
          .from('live_sessions')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('live_sessions')
          .insert({
            ...formData,
            formation_id: selectedFormation,
            professor_id: user.user.id,
            status: 'scheduled',
          })

        if (error) throw error
      }

      await loadSessions()
      resetForm()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr?')) return

    try {
      const { error } = await supabase
        .from('live_sessions')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadSessions()
    } catch (error) {
      console.error('Error deleting session:', error)
    }
  }

  const handleStartSession = async (id: string) => {
    try {
      const { error } = await supabase
        .from('live_sessions')
        .update({ status: 'live' })
        .eq('id', id)

      if (error) throw error
      loadSessions()
    } catch (error) {
      console.error('Error starting session:', error)
    }
  }

  const handleEndSession = async (id: string) => {
    try {
      const { error } = await supabase
        .from('live_sessions')
        .update({ status: 'completed' })
        .eq('id', id)

      if (error) throw error
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
      meeting_url: '',
      max_participants: 100,
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
      meeting_url: session.meeting_url || '',
      max_participants: session.max_participants,
    })
    setEditingId(session.id)
    setIsCreating(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif font-bold text-white">Cours en direct</h1>
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
              <div className="space-y-2">
                <Label className="text-[rgba(255,255,255,0.8)]">Titre</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Titre du cours"
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                  required
                />
              </div>

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

              <div className="grid grid-cols-2 gap-4">
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
                  <Label className="text-[rgba(255,255,255,0.8)]">Participants max</Label>
                  <Input
                    type="number"
                    value={formData.max_participants}
                    onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) })}
                    className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[rgba(255,255,255,0.8)]">URL de la réunion</Label>
                <Input
                  value={formData.meeting_url}
                  onChange={(e) => setFormData({ ...formData, meeting_url: e.target.value })}
                  placeholder="https://zoom.us/... ou https://jitsi.meet/..."
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                />
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
                      <Users className="w-3 h-3" />
                      {session._count?.session_attendance || 0} / {session.max_participants}
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
  )
}
