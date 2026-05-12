'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Edit, Trash2, Plus, Book, Eye } from 'lucide-react'

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif font-bold text-white">Gestion des modules</h1>
        <Button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-[#C9A227] hover:bg-[#B8860B] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau module
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
          <Card key={module.id} className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Book className="w-5 h-5 text-[#C9A227]" />
                    <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                    {module.is_published && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                        Publié
                      </span>
                    )}
                  </div>
                  <p className="text-[rgba(255,255,255,0.6)] text-sm mb-2">{module.description}</p>
                  <div className="flex items-center gap-4 text-xs text-[rgba(255,255,255,0.5)]">
                    <span>Ordre: {module.order_index}</span>
                    <span>Leçons: {module.lessons?.length || 0}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(module)}
                    variant="outline"
                    size="sm"
                    className="border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.05)]"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(module.id)}
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

      {modules.length === 0 && !isCreating && (
        <Card className="bg-[#1a1a2e] border-[rgba(201,162,39,0.2)]">
          <CardContent className="pt-12 text-center">
            <Book className="w-12 h-12 text-[rgba(255,255,255,0.2)] mx-auto mb-4" />
            <p className="text-[rgba(255,255,255,0.6)]">Aucun module créé</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
