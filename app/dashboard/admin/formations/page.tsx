"use client"

import { useState, useEffect } from 'react'
import { apiClient, apiClientUpload } from '@/lib/api/client'
import { ImageUpload } from '@/components/ui/image-upload'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Edit, Trash2, Plus, GraduationCap, Users } from 'lucide-react'

// Schéma Laravel réel (table formations) :
// id, titre, description, image, niveau, duree, prix (decimal), statut
// (enum: 'en ligne' | 'presentiel' | 'hybride'), nb_inscrit (auto, lecture
// seule), user_id, categorie_id (obligatoire).
interface Formation {
  id: string
  titre: string
  description?: string
  image?: string
  niveau?: string
  duree?: string
  prix: number
  statut: 'en ligne' | 'presentiel' | 'hybride'
  nb_inscrit?: number
  categorie_id?: string
}

interface Categorie {
  id: string
  nom?: string
  titre?: string
  name?: string
}

const emptyForm = {
  titre: '',
  description: '',
  niveau: '',
  duree: '',
  prix: '',
  statut: 'en ligne' as Formation['statut'],
  categorie_id: '',
}

export default function AdminFormationsPage() {
  const [formations, setFormations] = useState<Formation[]>([])
  const [categories, setCategories] = useState<Categorie[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)
  const [existingNbInscrit, setExistingNbInscrit] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadFormations()
    loadCategories()
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

  const loadCategories = async () => {
    try {
      const res = await apiClient<Categorie[]>('/categories')
      setCategories(res.data || [])
    } catch (err) {
      console.error('[admin/formations] Erreur de chargement des catégories:', err)
    }
  }

  const categoryLabel = (c: Categorie) => c.titre || c.nom || c.name || `Catégorie #${c.id}`

  const resetForm = () => {
    setFormData(emptyForm)
    setImageFile(null)
    setExistingImageUrl(null)
    setExistingNbInscrit(0)
    setEditingId(null)
    setIsCreating(false)
    setError('')
  }

  const handleEdit = (f: Formation) => {
    setFormData({
      titre: f.titre || '',
      description: f.description || '',
      niveau: f.niveau || '',
      duree: f.duree || '',
      prix: f.prix != null ? String(f.prix) : '',
      statut: f.statut || 'en ligne',
      categorie_id: f.categorie_id ? String(f.categorie_id) : '',
    })
    setImageFile(null)
    setExistingImageUrl(f.image || null)
    setExistingNbInscrit(f.nb_inscrit ?? 0)
    setEditingId(f.id)
    setIsCreating(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    if (!formData.categorie_id) {
      setError('La catégorie est obligatoire')
      setSaving(false)
      return
    }

    const body = new FormData()
    body.append('titre', formData.titre)
    body.append('description', formData.description)
    body.append('niveau', formData.niveau)
    body.append('duree', formData.duree)
    body.append('prix', String(formData.prix ? Number(formData.prix) : 0))
    body.append('statut', formData.statut)
    body.append('categorie_id', formData.categorie_id)
    // Laravel exige ce champ explicitement malgré ->default(0) en base — la
    // validation FormRequest ne connaît pas la valeur par défaut SQL.
    body.append('nb_inscrit', String(editingId ? existingNbInscrit : 0))
    if (imageFile) {
      body.append('image', imageFile)
    }

    try {
      if (editingId) {
        await apiClientUpload(`/formations/${editingId}`, body, 'PUT')
      } else {
        await apiClientUpload('/formations', body, 'POST')
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
      <main className="lg:ml-64">
        <DashboardHeader title="Gestion des Formations" subtitle="Créer et gérer le catalogue de formations" />

        <div className="p-4 md:p-8 space-y-6">
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
                  <div className="space-y-2">
                    <Label className="text-[rgba(255,255,255,0.8)]">Titre de la formation</Label>
                    <Input
                      value={formData.titre}
                      onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                      placeholder="Ex: CAP Cuisinier"
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[rgba(255,255,255,0.8)]">Catégorie *</Label>
                      <Select
                        value={formData.categorie_id}
                        onValueChange={(v) => setFormData({ ...formData, categorie_id: v })}
                      >
                        <SelectTrigger className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white">
                          <SelectValue placeholder="Choisir une catégorie" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)]">
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)} className="text-white">
                              {categoryLabel(c)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[rgba(255,255,255,0.8)]">Statut</Label>
                      <Select
                        value={formData.statut}
                        onValueChange={(v) => setFormData({ ...formData, statut: v as Formation['statut'] })}
                      >
                        <SelectTrigger className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)]">
                          <SelectItem value="en ligne" className="text-white">En ligne</SelectItem>
                          <SelectItem value="presentiel" className="text-white">Présentiel</SelectItem>
                          <SelectItem value="hybride" className="text-white">Hybride</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[rgba(255,255,255,0.8)]">Niveau</Label>
                      <Input
                        value={formData.niveau}
                        onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
                        placeholder="Ex: Débutant"
                        className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[rgba(255,255,255,0.8)]">Durée</Label>
                      <Input
                        value={formData.duree}
                        onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                        placeholder="Ex: 3 ans"
                        className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[rgba(255,255,255,0.8)]">Prix (FCFA)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.prix}
                        onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                        placeholder="Ex: 60000"
                        className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                      />
                    </div>
                  </div>

                  <ImageUpload
                    label="Image de la formation"
                    value={existingImageUrl}
                    onFileSelected={setImageFile}
                    disabled={saving}
                  />

                  <div className="space-y-2">
                    <Label className="text-[rgba(255,255,255,0.8)]">Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={saving} className="flex-1 bg-[#C9A227] hover:bg-[#B8860B] text-white">
                      {saving ? 'Enregistrement...' : editingId ? 'Modifier' : 'Créer'}
                    </Button>
                    <Button type="button" onClick={resetForm} variant="outline" className="flex-1 border-[rgba(255,255,255,0.2)] text-white">
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
                        <h3 className="text-white font-medium">{f.titre}</h3>
                        <p className="text-[rgba(255,255,255,0.4)] text-xs flex items-center gap-3">
                          <span>{f.duree}</span>
                          <span>{Number(f.prix).toLocaleString()} FCFA</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" /> {f.nb_inscrit ?? 0}
                          </span>
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
