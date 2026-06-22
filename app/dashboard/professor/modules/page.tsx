'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Edit, Trash2, Plus, Book, Layers, CheckCircle2, FileText } from 'lucide-react'
import { SectionHeader, StatCard, FormationPills } from '@/components/professor/section-header'

interface Module {
  id: string
  title: string
  description: string
  order_index: number
  is_published: boolean
  formation_id: string
  formations: {
    name: string
  }
  lessons?: any[]
}

interface Formation {
  id: string
  name: string
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [formations, setFormations] = useState<Formation[]>([])
  const [selectedFormation, setSelectedFormation] = useState<string>('')
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order_index: 0,
    is_published: false,
  })

  const supabase = createClient()

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
        .select('*, formations(name), lessons(id)')
        .eq('formation_id', selectedFormation)
        .order('order_index')

      if (error) throw error
      setModules(data || [])
    } catch (error) {
      console.error('Error loading modules:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFormation) return

    setIsLoading(true)
    try {
      if (editingId) {
        // Update
        const { error } = await supabase
          .from('modules')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
      } else {
        // Create
        const { error } = await supabase
          .from('modules')
          .insert({
            ...formData,
            formation_id: selectedFormation,
          })

        if (error) throw error
      }

      // Reload modules
      await loadModules()
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
        .from('modules')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadModules()
    } catch (error) {
      console.error('Error deleting module:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      order_index: 0,
      is_published: false,
    })
    setEditingId(null)
    setIsCreating(false)
  }

  const handleEdit = (module: Module) => {
    setFormData({
      title: module.title,
      description: module.description,
      order_index: module.order_index,
      is_published: module.is_published,
    })
    setEditingId(module.id)
    setIsCreating(true)
  }

  const publishedCount = modules.filter((m) => m.is_published).length
  const totalLessons = modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0)

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Layers className="h-7 w-7" />}
        title="Gestion des modules"
        description="Organisez votre formation en modules thématiques. Chaque module regroupe plusieurs leçons et exercices."
        action={
          <Button onClick={() => setIsCreating(!isCreating)} className="bg-[#C9A227] hover:bg-[#B8860B] text-white">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau module
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Modules" value={modules.length} icon={<Book className="h-5 w-5" />} />
        <StatCard label="Publiés" value={publishedCount} icon={<CheckCircle2 className="h-5 w-5" />} />
        <StatCard label="Leçons totales" value={totalLessons} icon={<FileText className="h-5 w-5" />} />
      </div>

      {formations.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[rgba(255,255,255,0.6)]">Formation</p>
          <FormationPills formations={formations} selected={selectedFormation} onSelect={setSelectedFormation} />
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[rgba(255,255,255,0.8)]">Titre</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Titre du module"
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                  required
                />
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[rgba(255,255,255,0.8)]">Ordre</Label>
                  <Input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                    className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[rgba(255,255,255,0.8)]">Publié</Label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-[rgba(255,255,255,0.7)]">Publier ce module</span>
                  </label>
                </div>
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

      {/* Modules List */}
      <div className="space-y-3">
        {modules.map((module) => (
          <div
            key={module.id}
            className="group flex items-start gap-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1a1a2e] p-5 transition-all hover:border-[rgba(201,162,39,0.4)] hover:bg-[#1d1d33]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#C9A227]/10 text-lg font-bold text-[#C9A227]">
              {module.order_index || '–'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                {module.is_published ? (
                  <span className="rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs font-medium text-green-400">
                    Publié
                  </span>
                ) : (
                  <span className="rounded-full bg-[rgba(255,255,255,0.06)] px-2.5 py-0.5 text-xs font-medium text-[rgba(255,255,255,0.5)]">
                    Brouillon
                  </span>
                )}
              </div>
              <p className="mb-3 line-clamp-2 text-sm text-[rgba(255,255,255,0.55)]">{module.description}</p>
              <div className="flex items-center gap-2 text-xs text-[rgba(255,255,255,0.5)]">
                <FileText className="h-3.5 w-3.5 text-[#C9A227]" />
                <span>{module.lessons?.length || 0} leçon(s)</span>
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
  )
}
