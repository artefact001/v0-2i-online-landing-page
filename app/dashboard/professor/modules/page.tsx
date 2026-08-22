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
import { Edit, Trash2, Plus, Book, Layers, FileText } from 'lucide-react'
import { SectionHeader, StatCard, FormationPills } from '@/components/professor/section-header'
import { combine, required, minLength } from '@/lib/validators'

// Schéma Laravel réel (table modules) : id, titre, description (nullable),
// ordre, formation_id. Pas de is_published dans ce schéma.
interface Module {
  id: string
  titre: string
  description?: string
  ordre: number
  formation_id: string
  lecons?: any[]
}

interface Formation {
  id: string
  titre: string
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [formations, setFormations] = useState<Formation[]>([])
  const [selectedFormation, setSelectedFormation] = useState<string>('')
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState('')

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
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
      setModules(res.data || [])
    } catch (error) {
      console.error('Error loading modules:', error)
    }
  }

  const validateForm = () => {
    if (!selectedFormation) return 'Veuillez sélectionner une formation.'
    if (!formData.titre.trim()) return 'Le titre du module est obligatoire.'
    if (formData.titre.trim().length < 3) return 'Le titre doit contenir au moins 3 caractères.'
    if (formData.ordre < 0) return "L'ordre ne peut pas être négatif."
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
        description: formData.description.trim() || undefined,
        ordre: formData.ordre,
      }
      if (editingId) {
        await apiClient(`/modules/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      } else {
        await apiClient('/modules', {
          method: 'POST',
          body: JSON.stringify({
            ...payload,
            formation_id: selectedFormation,
          }),
        })
      }

      await loadModules()
      resetForm()
    } catch (error) {
      console.error('[v0] Error saving module:', error)
      setFormError("Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr?')) return

    try {
      await apiClient(`/modules/${id}`, { method: 'DELETE' })
      loadModules()
    } catch (error) {
      console.error('Error deleting module:', error)
    }
  }

  const resetForm = () => {
    setFormData({ titre: '', description: '', ordre: 0 })
    setFormError('')
    setEditingId(null)
    setIsCreating(false)
  }

  const handleEdit = (module: Module) => {
    setFormData({
      titre: module.titre,
      description: module.description || '',
      ordre: module.ordre,
    })
    setEditingId(module.id)
    setIsCreating(true)
  }

  const totalLessons = modules.reduce((sum, m) => sum + (m.lecons?.length || 0), 0)

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Gestion des modules" subtitle="Organisez votre formation en modules thématiques" />
        <div className="p-4 md:p-8 space-y-6">
      <SectionHeader
        icon={<Layers className="h-7 w-7" />}
        title="Gestion des modules"
        description="Organisez votre formation en modules thématiques. Chaque module regroupe plusieurs leçons."
        action={
          <Button onClick={() => setIsCreating(!isCreating)} className="bg-[#C9A227] hover:bg-[#B8860B] text-white">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau module
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Modules" value={modules.length} icon={<Book className="h-5 w-5" />} />
        <StatCard label="Leçons totales" value={totalLessons} icon={<FileText className="h-5 w-5" />} />
      </div>

      {formations.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[rgba(255,255,255,0.6)]">Formation</p>
          <FormationPills
            formations={formations.map((f) => ({ id: f.id, name: f.titre }))}
            selected={selectedFormation}
            onSelect={setSelectedFormation}
          />
        </div>
      )}

      {/* Create/Edit Form */}
      {isCreating && (
        <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
          <CardHeader>
            <CardTitle className="text-white">
              {editingId ? 'Modifier le module' : 'Créer un nouveau module'}
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
                placeholder="Titre du module"
                validator={combine(required("Le titre est obligatoire"), minLength(3))}
                className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                required
              />

              <div className="space-y-2">
                <Label className="text-[rgba(255,255,255,0.8)]">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description du module"
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                  rows={4}
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

      {/* Modules List */}
      <div className="space-y-3">
        {modules.map((module) => (
          <div
            key={module.id}
            className="group flex items-start gap-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1a1a2e] p-5 transition-all hover:border-[rgba(201,162,39,0.4)] hover:bg-[#1d1d33]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#C9A227]/10 text-lg font-bold text-[#C9A227]">
              {module.ordre || '–'}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="mb-1 text-lg font-semibold text-white">{module.titre}</h3>
              <p className="mb-3 line-clamp-2 text-sm text-[rgba(255,255,255,0.55)]">{module.description}</p>
              <div className="flex items-center gap-2 text-xs text-[rgba(255,255,255,0.5)]">
                <FileText className="h-3.5 w-3.5 text-[#C9A227]" />
                <span>{module.lecons?.length || 0} leçon(s)</span>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                onClick={() => handleEdit(module)}
                variant="outline"
                size="sm"
                className="border-[rgba(255,255,255,0.15)] text-white hover:border-[#C9A227]/50 hover:bg-[#C9A227]/10"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => handleDelete(module.id)}
                variant="outline"
                size="sm"
                className="border-red-500/20 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {modules.length === 0 && !isCreating && (
        <div className="rounded-xl border border-dashed border-[rgba(255,255,255,0.15)] bg-[#1a1a2e] py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(255,255,255,0.04)]">
            <Layers className="h-8 w-8 text-[rgba(255,255,255,0.25)]" />
          </div>
          <p className="text-[rgba(255,255,255,0.6)]">Aucun module pour cette formation</p>
          <Button
            onClick={() => setIsCreating(true)}
            variant="outline"
            className="mt-4 border-[#C9A227]/40 text-[#C9A227] hover:bg-[#C9A227]/10"
          >
            <Plus className="mr-2 h-4 w-4" />
            Créer le premier module
          </Button>
        </div>
      )}
        </div>
      </main>
    </div>
  )
}
