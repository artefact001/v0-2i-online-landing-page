'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Edit, Trash2, Plus, Play, Eye, Upload, FileText } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  description: string
  video_url: string | null
  content: string | null
  content_type: string | null
  duration_minutes: number
  order_index: number
  is_published: boolean
  is_free_preview: boolean
  module_id: string
  modules?: {
    title: string
    formation_id: string
  }
}

interface Module {
  id: string
  title: string
  formation_id: string
}

interface Formation {
  id: string
  name: string
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [formations, setFormations] = useState<Formation[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [selectedFormation, setSelectedFormation] = useState<string>('')
  const [selectedModule, setSelectedModule] = useState<string>('')
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    content: '',
    content_type: 'video',
    duration_minutes: 0,
    order_index: 0,
    is_published: false,
    is_free_preview: false,
  })
  const [pdfName, setPdfName] = useState('')
  const [pdfUploading, setPdfUploading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    loadFormations()
  }, [])

  useEffect(() => {
    if (selectedFormation) {
      loadModules()
    }
  }, [selectedFormation])

  useEffect(() => {
    if (selectedModule) {
      loadLessons()
    }
  }, [selectedModule])

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

  const loadModules = async () => {
    try {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('formation_id', selectedFormation)
        .order('order_index')

      if (error) throw error
      setModules(data || [])
      if (data && data.length > 0) {
        setSelectedModule(data[0].id)
      }
    } catch (error) {
      console.error('Error loading modules:', error)
    }
  }

  const loadLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*, modules(title, formation_id)')
        .eq('module_id', selectedModule)
        .order('order_index')

      if (error) throw error
      setLessons(data || [])
    } catch (error) {
      console.error('Error loading lessons:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedModule) return

    setIsLoading(true)
    try {
      if (editingId) {
        const { error } = await supabase
          .from('lessons')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('lessons')
          .insert({
            ...formData,
            module_id: selectedModule,
          })

        if (error) throw error
      }

      await loadLessons()
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
        .from('lessons')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadLessons()
    } catch (error) {
      console.error('Error deleting lesson:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      video_url: '',
      content: '',
      content_type: 'video',
      duration_minutes: 0,
      order_index: 0,
      is_published: false,
      is_free_preview: false,
    })
    setPdfName('')
    setEditingId(null)
    setIsCreating(false)
  }

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      alert('Veuillez sélectionner un fichier PDF.')
      return
    }
    if (file.size > 4 * 1024 * 1024) {
      alert('Le PDF doit faire moins de 4 Mo. Pour des fichiers plus volumineux, collez une URL publique du PDF.')
      return
    }
    setPdfUploading(true)
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      setFormData((prev) => ({ ...prev, content: dataUrl, content_type: 'pdf' }))
      setPdfName(file.name)
    } catch {
      alert('Échec du chargement du PDF.')
    } finally {
      setPdfUploading(false)
    }
  }

  const handleEdit = (lesson: Lesson) => {
    setFormData({
      title: lesson.title,
      description: lesson.description,
      video_url: lesson.video_url || '',
      content: lesson.content || '',
      content_type: lesson.content_type || 'video',
      duration_minutes: lesson.duration_minutes,
      order_index: lesson.order_index,
      is_published: lesson.is_published,
      is_free_preview: lesson.is_free_preview,
    })
    setPdfName(lesson.content_type === 'pdf' && lesson.content ? 'Document PDF joint' : '')
    setEditingId(lesson.id)
    setIsCreating(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif font-bold text-white">Gestion des leçons</h1>
        <Button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-[#C9A227] hover:bg-[#B8860B] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle leçon
        </Button>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
          <CardHeader>
            <CardTitle className="text-white text-sm">Formation</CardTitle>
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

        <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
          <CardHeader>
            <CardTitle className="text-white text-sm">Module</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedModule} onValueChange={setSelectedModule}>
              <SelectTrigger className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)]">
                {modules.map((m) => (
                  <SelectItem key={m.id} value={m.id} className="text-white">
                    {m.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
          <CardHeader>
            <CardTitle className="text-white">
              {editingId ? 'Modifier la leçon' : 'Créer une nouvelle leçon'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[rgba(255,255,255,0.8)]">Titre</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Titre de la leçon"
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[rgba(255,255,255,0.8)]">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description de la leçon"
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[rgba(255,255,255,0.8)]">URL Vidéo</Label>
                <Input
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://example.com/video.mp4"
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                />
                <p className="text-xs text-[rgba(255,255,255,0.5)]">
                  <Upload className="w-3 h-3 inline mr-1" />
                  Support des formats MP4, HLS, WebM
                </p>
              </div>

              {/* PDF support */}
              <div className="space-y-2 rounded-lg border border-dashed border-[rgba(201,162,39,0.3)] p-4">
                <Label className="text-[rgba(255,255,255,0.8)] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#C9A227]" />
                  Support de cours (PDF)
                </Label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[rgba(255,255,255,0.05)] px-4 py-2 text-sm text-white transition-colors hover:bg-[rgba(255,255,255,0.1)]">
                    <Upload className="h-4 w-4" />
                    {pdfUploading ? 'Chargement...' : 'Choisir un PDF'}
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdfUpload}
                      className="hidden"
                      disabled={pdfUploading}
                    />
                  </label>
                  {(pdfName || (formData.content_type === 'pdf' && formData.content)) && (
                    <div className="flex items-center gap-2 text-sm text-[#C9A227]">
                      <FileText className="h-4 w-4" />
                      <span className="truncate max-w-[200px]">{pdfName || 'Document PDF joint'}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, content: '', content_type: formData.video_url ? 'video' : 'text' })
                          setPdfName('')
                        }}
                        className="text-[rgba(255,255,255,0.5)] hover:text-red-400"
                        aria-label="Retirer le PDF"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-[rgba(255,255,255,0.5)]">
                  Téléversez un PDF (max 4 Mo) ou collez une URL publique ci-dessous.
                </p>
                <Input
                  value={formData.content_type === 'pdf' && !formData.content?.startsWith('data:') ? formData.content : ''}
                  onChange={(e) => {
                    setFormData({ ...formData, content: e.target.value, content_type: 'pdf' })
                    setPdfName(e.target.value ? 'Lien PDF externe' : '')
                  }}
                  placeholder="https://exemple.com/support-de-cours.pdf"
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
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
                  <Label className="text-[rgba(255,255,255,0.8)]">Ordre</Label>
                  <Input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                    className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-[rgba(255,255,255,0.7)]">Publier cette leçon</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_free_preview}
                    onChange={(e) => setFormData({ ...formData, is_free_preview: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-[rgba(255,255,255,0.7)]">Accès gratuit (aperçu)</span>
                </label>
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

      {/* Lessons List */}
      <div className="space-y-3">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {lesson.video_url ? (
                      <Play className="w-5 h-5 text-[#C9A227]" />
                    ) : (
                      <Eye className="w-5 h-5 text-[rgba(255,255,255,0.4)]" />
                    )}
                    <h3 className="text-lg font-semibold text-white">{lesson.title}</h3>
                    {lesson.is_free_preview && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                        Aperçu gratuit
                      </span>
                    )}
                    {lesson.is_published && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                        Publié
                      </span>
                    )}
                  </div>
                  <p className="text-[rgba(255,255,255,0.6)] text-sm mb-2">{lesson.description}</p>
                  <div className="flex items-center gap-4 text-xs text-[rgba(255,255,255,0.5)]">
                    <span>Durée: {lesson.duration_minutes} min</span>
                    <span>Ordre: {lesson.order_index}</span>
                    {lesson.video_url && <span className="text-[#C9A227]">✓ Vidéo jointe</span>}
                    {lesson.content_type === 'pdf' && lesson.content && (
                      <span className="text-[#C9A227] flex items-center gap-1">
                        <FileText className="w-3 h-3" /> PDF joint
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(lesson)}
                    variant="outline"
                    size="sm"
                    className="border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.05)]"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(lesson.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {lessons.length === 0 && !isCreating && (
        <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
          <CardContent className="pt-12 text-center">
            <Play className="w-12 h-12 text-[rgba(255,255,255,0.2)] mx-auto mb-4" />
            <p className="text-[rgba(255,255,255,0.6)]">Aucune leçon créée</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
