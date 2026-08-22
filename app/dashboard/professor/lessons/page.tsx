'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api/client'
import { useAuth } from '@/lib/auth-context'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ValidatedInput } from '@/components/ui/validated-input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Edit, Trash2, Plus, Play, FileText, BookOpen } from 'lucide-react'
import { SectionHeader, StatCard, FormationPills } from '@/components/professor/section-header'
import { TablePagination } from '@/components/admin/table-pagination'
import { combine, required, minLength } from '@/lib/validators'

const LESSONS_PAGE_SIZE = 8

// Schéma Laravel réel (table lecons) : id, titre, contenu (obligatoire),
// video (nullable), document (nullable), ordre, module_id.
interface Lesson {
  id: string
  titre: string
  contenu: string
  video?: string | null
  document?: string | null
  ordre: number
  module_id: string
}

interface Module {
  id: string
  titre: string
  formation_id: string
}

interface Formation {
  id: string
  titre: string
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [formations, setFormations] = useState<Formation[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [selectedFormation, setSelectedFormation] = useState<string>('')
  const [selectedModule, setSelectedModule] = useState<string>('')
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState('')

  const [formData, setFormData] = useState({
    titre: '',
    contenu: '',
    video: '',
    document: '',
    ordre: 0,
  })

  const { user } = useAuth()

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
      if (!user) return
      // Le propriétaire d'une formation est identifié par "user_id" dans le
      // schéma réel (pas "formateur_id").
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

  const loadModules = async () => {
    try {
      const res = await apiClient<Module[]>(`/modules?formation_id=${selectedFormation}`)
      const data = res.data || []
      setModules(data)
      if (data.length > 0) {
        setSelectedModule(data[0].id)
      }
    } catch (error) {
      console.error('Error loading modules:', error)
    }
  }

  const loadLessons = async () => {
    try {
      const res = await apiClient<Lesson[]>(`/lecons?module_id=${selectedModule}`)
      setLessons(res.data || [])
      setCurrentPage(1)
    } catch (error) {
      console.error('Error loading lessons:', error)
    }
  }

  const validateForm = () => {
    if (!selectedModule) return 'Veuillez sélectionner un module.'
    if (!formData.titre.trim()) return 'Le titre de la leçon est obligatoire.'
    if (formData.titre.trim().length < 3) return 'Le titre doit contenir au moins 3 caractères.'
    if (!formData.contenu.trim()) return 'Le contenu de la leçon est obligatoire.'
    if (formData.ordre < 0) return "L'ordre ne peut pas être négatif."
    const video = formData.video.trim()
    if (video && !/^https?:\/\//i.test(video)) return "L'URL de la vidéo doit commencer par http:// ou https://."
    const doc = formData.document.trim()
    if (doc && !/^https?:\/\//i.test(doc)) return "L'URL du document doit commencer par http:// ou https://."
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    const validationError = validateForm()
    if (validationError) {
      setFormError(validationError)
      return
    }
    setFormError('')

    setIsLoading(true)
    try {
      const payload = {
        titre: formData.titre.trim(),
        contenu: formData.contenu.trim(),
        video: formData.video.trim() || undefined,
        document: formData.document.trim() || undefined,
        ordre: formData.ordre,
      }
      if (editingId) {
        await apiClient(`/lecons/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      } else {
        await apiClient('/lecons', {
          method: 'POST',
          body: JSON.stringify({
            ...payload,
            module_id: selectedModule,
          }),
        })
      }

      await loadLessons()
      resetForm()
    } catch (error) {
      console.error('[v0] Error saving lesson:', error)
      setFormError("Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr?')) return

    try {
      await apiClient(`/lecons/${id}`, { method: 'DELETE' })
      loadLessons()
    } catch (error) {
      console.error('Error deleting lesson:', error)
    }
  }

  const resetForm = () => {
    setFormData({ titre: '', contenu: '', video: '', document: '', ordre: 0 })
    setFormError('')
    setEditingId(null)
    setIsCreating(false)
  }

  const handleEdit = (lesson: Lesson) => {
    setFormData({
      titre: lesson.titre,
      contenu: lesson.contenu,
      video: lesson.video || '',
      document: lesson.document || '',
      ordre: lesson.ordre,
    })
    setEditingId(lesson.id)
    setIsCreating(true)
  }

  const withVideo = lessons.filter((l) => l.video).length
  const withDocument = lessons.filter((l) => l.document).length

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Gestion des leçons" subtitle="Créez vos leçons avec vidéos et documents" />
        <div className="p-4 md:p-8 space-y-6">
      <SectionHeader
        icon={<BookOpen className="h-7 w-7" />}
        title="Gestion des leçons"
        description="Créez vos leçons avec vidéos et documents. Sélectionnez une formation et un module pour commencer."
        action={
          <Button onClick={() => setIsCreating(!isCreating)} className="bg-[#C9A227] hover:bg-[#B8860B] text-white">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle leçon
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Leçons" value={lessons.length} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard label="Avec vidéo" value={withVideo} icon={<Play className="h-5 w-5" />} />
        <StatCard label="Avec document" value={withDocument} icon={<FileText className="h-5 w-5" />} />
      </div>

      {/* Selectors */}
      <div className="space-y-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1a1a2e] p-5">
        <div className="space-y-3">
          <p className="text-sm font-medium text-[rgba(255,255,255,0.6)]">Formation</p>
          <FormationPills
            formations={formations.map((f) => ({ id: f.id, name: f.titre }))}
            selected={selectedFormation}
            onSelect={setSelectedFormation}
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-[rgba(255,255,255,0.6)]">Module</p>
          <Select value={selectedModule} onValueChange={setSelectedModule}>
            <SelectTrigger className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white max-w-md">
              <SelectValue placeholder="Sélectionnez un module" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)]">
              {modules.map((m) => (
                <SelectItem key={m.id} value={m.id} className="text-white">
                  {m.titre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {formError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">
                  {formError}
                </div>
              )}
              <ValidatedInput
                label="Titre"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                placeholder="Titre de la leçon"
                validator={combine(required("Le titre est obligatoire"), minLength(3))}
                className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                required
              />

              <div className="space-y-2">
                <Label className="text-[rgba(255,255,255,0.8)]">Contenu</Label>
                <Textarea
                  value={formData.contenu}
                  onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
                  placeholder="Contenu texte de la leçon"
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[rgba(255,255,255,0.8)]">URL Vidéo (optionnel)</Label>
                <Input
                  value={formData.video}
                  onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                  placeholder="https://exemple.com/video.mp4"
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[rgba(255,255,255,0.8)] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#C9A227]" />
                  URL Document (optionnel)
                </Label>
                <Input
                  value={formData.document}
                  onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                  placeholder="https://exemple.com/support-de-cours.pdf"
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[rgba(255,255,255,0.8)]">Ordre</Label>
                <Input
                  type="number"
                  value={formData.ordre}
                  onChange={(e) => setFormData({ ...formData, ordre: parseInt(e.target.value) || 0 })}
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={isLoading} className="flex-1 bg-[#C9A227] hover:bg-[#B8860B] text-white">
                  {isLoading ? 'Enregistrement...' : editingId ? 'Modifier' : 'Créer'}
                </Button>
                <Button type="button" onClick={resetForm} variant="outline" className="flex-1 border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.05)]">
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lessons List */}
      <div className="space-y-3">
        {lessons.slice((currentPage - 1) * LESSONS_PAGE_SIZE, currentPage * LESSONS_PAGE_SIZE).map((lesson) => (
          <Card key={lesson.id} className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {lesson.video ? (
                      <Play className="w-5 h-5 text-[#C9A227]" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-[rgba(255,255,255,0.4)]" />
                    )}
                    <h3 className="text-lg font-semibold text-white">{lesson.titre}</h3>
                  </div>
                  <p className="text-[rgba(255,255,255,0.6)] text-sm mb-2 line-clamp-2">{lesson.contenu}</p>
                  <div className="flex items-center gap-4 text-xs text-[rgba(255,255,255,0.5)]">
                    <span>Ordre: {lesson.ordre}</span>
                    {lesson.video && <span className="text-[#C9A227]">✓ Vidéo jointe</span>}
                    {lesson.document && (
                      <span className="text-[#C9A227] flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Document joint
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

      {lessons.length > LESSONS_PAGE_SIZE && (
        <TablePagination
          currentPage={currentPage}
          totalItems={lessons.length}
          pageSize={LESSONS_PAGE_SIZE}
          onPageChange={setCurrentPage}
          itemLabel="leçons"
        />
      )}

      {lessons.length === 0 && !isCreating && (
        <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
          <CardContent className="pt-12 text-center">
            <Play className="w-12 h-12 text-[rgba(255,255,255,0.2)] mx-auto mb-4" />
            <p className="text-[rgba(255,255,255,0.6)]">Aucune leçon créée</p>
          </CardContent>
        </Card>
      )}
        </div>
      </main>
    </div>
  )
}
