"use client"

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api/client'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Edit, Trash2, Plus, GraduationCap } from 'lucide-react'

interface Formation {
  id: string
  name: string
  slug?: string
  description?: string
  short_description?: string
  duration?: string
  price?: number
  is_active?: boolean
}

const emptyForm = {
  name: '',
  slug: '',
  short_description: '',
  description: '',
  duration: '',
  price: '',
}

export default function AdminFormationsPage() {
  const [formations, setFormations] = useState<Formation[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadFormations()
  }, [])

  const loadFormations = async () => {
    setLoading(true)
    try {
      const res = await apiClient<Formation[]>('/formations')
      setFormations(res.data || [])
    } catch (err) {
      console.error('[admin/formations] Erreur de chargement:', err)
    }
    setLoading(false)
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setEditingId(null)
    setIsCreating(false)
    setError('')
  }

  const handleEdit = (f: Formation) => {
    setFormData({
      name: f.name || '',
      slug: f.slug || '',
      short_description: f.short_description || '',
      description: f.description || '',
      duration: f.duration || '',
      price: f.price != null ? String(f.price) : '',
    })
    setEditingId(f.id)
    setIsCreating(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    // À VÉRIFIER: noms de champs exacts attendus par FormationController
    // (store/update) — repris de la structure déjà utilisée ailleurs dans
    // le projet (formations, is_active, etc.), à ajuster si Laravel
    // attend d'autres noms.
    const payload = {
      name: formData.name,
      slug: formData.slug || undefined,
      short_description: formData.short_description,
      description: formData.description,
      duration: formData.duration,
      price: formData.price ? Number(formData.price) : undefined,
    }

    try {
      if (editingId) {
        await apiClient(`/formations/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      } else {
        await apiClient('/formations', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }
      await loadFormations()
      resetForm()
    } catch (err: any) {
      console.error('[admin/formations] Erreur de sauvegarde:', err)
      setError(err?.message || "Erreur lors de l'enregistrement")
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette formation ? Cette action est irréversible.')) return
    try {
      await apiClient(`/formations/${id}`, { method: 'DELETE' })
      await loadFormations()
    } catch (err) {
      console.error('[admin/formations] Erreur de suppression:', err)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="ml-64">
        <DashboardHeader title="Gestion des Formations" subtitle="Créer et gérer le catalogue de formations" />

        <div className="p-8 space-y-6">
          <div className="flex justify-end">
            <Button
              onClick={() => (isCreating ? resetForm() : setIsCreating(true))}
              className="bg-[#C9A227] hover:bg-[#B8860B] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isCreating ? 'Annuler' : 'Nouvelle formation'}
            </Button>
          </div>

          {isCreating && (
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[rgba(255,255,255,0.8)]">Nom de la formation</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: CAP Cuisinier"
                        className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[rgba(255,255,255,0.8)]">Slug (URL)</Label>
                      <Input
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="Ex: CAP-cuisinier"
                        className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[rgba(255,255,255,0.8)]">Durée</Label>
                      <Input
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="Ex: 3 ans / 36 mois"
                        className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[rgba(255,255,255,0.8)]">Prix d'inscription (FCFA)</Label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="Ex: 60000"
                        className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[rgba(255,255,255,0.8)]">Description courte</Label>
                    <Input
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[rgba(255,255,255,0.8)]">Description complète</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-[#C9A227] hover:bg-[#B8860B] text-white"
                    >
                      {saving ? 'Enregistrement...' : editingId ? 'Modifier' : 'Créer'}
                    </Button>
                    <Button
                      type="button"
                      onClick={resetForm}
                      variant="outline"
                      className="flex-1 border-[rgba(255,255,255,0.2)] text-white"
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : (
            <div className="space-y-3">
              {formations.map((f) => (
                <Card key={f.id} className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#C9A227]/10 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-[#C9A227]" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{f.name}</h3>
                        <p className="text-[rgba(255,255,255,0.4)] text-xs">
                          {f.duration} {f.price ? `· ${Number(f.price).toLocaleString()} FCFA` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(f)} className="border-[rgba(255,255,255,0.2)] text-white">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(f.id)} className="border-red-500/20 text-red-400 hover:bg-red-500/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {formations.length === 0 && (
                <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="py-12 text-center">
                    <p className="text-[rgba(255,255,255,0.5)]">Aucune formation pour le moment.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
