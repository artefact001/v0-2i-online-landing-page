"use client"

import { useState, useEffect } from 'react'
import { apiClient, apiClientUpload } from '@/lib/api/client'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ValidatedInput } from '@/components/ui/validated-input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageUpload } from '@/components/ui/image-upload'
import { Edit, Trash2, Plus, Newspaper } from 'lucide-react'
import { alertSuccess, alertError, confirmDelete } from '@/lib/alerts'
import { ActuCard } from '@/components/dashboard/actu-card'
import { combine, required, minLength } from '@/lib/validators'

// Schéma Laravel réel (table 'actuses', endpoint /actus) : id, titre,
// description, contenu_html, image, type ('actualite'|'evenement'|
// 'communique'|'blog'), date_publication, date_expiration, statut
// ('brouillon'|'publie'|'archive')
interface Actu {
  id: string
  titre: string
  description?: string
  contenu_html: string
  image?: string
  type: 'actualite' | 'evenement' | 'communique' | 'blog'
  date_publication: string
  date_expiration?: string
  statut: 'brouillon' | 'publie' | 'archive'
}

const typeLabel: Record<Actu['type'], string> = {
  actualite: 'Actualité',
  evenement: 'Événement',
  communique: 'Communiqué',
  blog: 'Blog',
}

const statutLabel: Record<Actu['statut'], string> = {
  brouillon: 'Brouillon',
  publie: 'Publié',
  archive: 'Archivé',
}

const statutStyle: Record<Actu['statut'], string> = {
  brouillon: 'bg-gray-500/20 text-gray-400',
  publie: 'bg-green-500/20 text-green-400',
  archive: 'bg-amber-500/20 text-amber-400',
}

const emptyForm = {
  titre: '',
  description: '',
  contenu_html: '',
  type: 'actualite' as Actu['type'],
  date_publication: new Date().toISOString().slice(0, 10),
  date_expiration: '',
  statut: 'publie' as Actu['statut'],
}

export default function AdminActusPage() {
  const [actus, setActus] = useState<Actu[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadActus()
  }, [])

  const loadActus = async () => {
    setLoading(true)
    try {
      const res = await apiClient<Actu[]>('/actus')
      setActus(res.data || [])
    } catch (err) {
      console.error('[admin/actus] Erreur de chargement:', err)
    }
    setLoading(false)
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setImageFile(null)
    setExistingImageUrl(null)
    setEditingId(null)
    setIsCreating(false)
    setError('')
  }

  const handleEdit = (a: Actu) => {
    setFormData({
      titre: a.titre,
      description: a.description || '',
      contenu_html: a.contenu_html,
      type: a.type,
      date_publication: a.date_publication?.slice(0, 10) || emptyForm.date_publication,
      date_expiration: a.date_expiration?.slice(0, 10) || '',
      statut: a.statut,
    })
    setImageFile(null)
    setExistingImageUrl(a.image || null)
    setEditingId(a.id)
    setIsCreating(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const body = new FormData()
    body.append('titre', formData.titre)
    body.append('description', formData.description)
    body.append('contenu_html', formData.contenu_html)
    body.append('type', formData.type)
    body.append('date_publication', formData.date_publication)
    if (formData.date_expiration) body.append('date_expiration', formData.date_expiration)
    body.append('statut', formData.statut)
    if (imageFile) body.append('image', imageFile)

    try {
      if (editingId) {
        await apiClientUpload(`/actus/${editingId}`, body, 'PUT')
      } else {
        await apiClientUpload('/actus', body, 'POST')
      }
      await loadActus()
      resetForm()
      alertSuccess(editingId ? 'Actualité modifiée avec succès.' : 'Actualité créée avec succès.')
    } catch (err: any) {
      console.error('[admin/actus] Erreur de sauvegarde:', err)
      const msg = err?.message || "Erreur lors de l'enregistrement"
      setError(msg)
      alertError(msg)
    }
    setSaving(false)
  }

  const handleDelete = async (id: string, titre?: string) => {
    const confirmed = await confirmDelete(titre)
    if (!confirmed) return
    try {
      await apiClient(`/actus/${id}`, { method: 'DELETE' })
      await loadActus()
      alertSuccess('Actualité supprimée avec succès.')
    } catch (err: any) {
      console.error('[admin/actus] Erreur de suppression:', err)
      alertError(err?.message || 'Erreur lors de la suppression')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Actualités" subtitle="Gérer les actualités, événements et communiqués" />

        <div className="p-4 md:p-8 space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => (isCreating ? resetForm() : setIsCreating(true))} className="bg-[#C9A227] hover:bg-[#B8860B] text-white">
              <Plus className="w-4 h-4 mr-2" />
              {isCreating ? 'Annuler' : 'Nouvelle actualité'}
            </Button>
          </div>

          {isCreating && (
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
                  )}

                  <ValidatedInput
                    label="Titre"
                    value={formData.titre}
                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                    validator={combine(required("Le titre est obligatoire"), minLength(3))}
                    className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                    required
                  />

                  <ImageUpload label="Image" value={existingImageUrl} onFileSelected={setImageFile} disabled={saving} />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[rgba(255,255,255,0.8)]">Type</Label>
                      <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as Actu['type'] })}>
                        <SelectTrigger className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)]">
                          {Object.entries(typeLabel).map(([value, label]) => (
                            <SelectItem key={value} value={value} className="text-white">{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[rgba(255,255,255,0.8)]">Statut</Label>
                      <Select value={formData.statut} onValueChange={(v) => setFormData({ ...formData, statut: v as Actu['statut'] })}>
                        <SelectTrigger className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)]">
                          {Object.entries(statutLabel).map(([value, label]) => (
                            <SelectItem key={value} value={value} className="text-white">{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[rgba(255,255,255,0.8)]">Date de publication</Label>
                      <Input
                        type="date"
                        value={formData.date_publication}
                        onChange={(e) => setFormData({ ...formData, date_publication: e.target.value })}
                        className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[rgba(255,255,255,0.8)]">Date d'expiration (optionnel)</Label>
                    <Input
                      type="date"
                      value={formData.date_expiration}
                      onChange={(e) => setFormData({ ...formData, date_expiration: e.target.value })}
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white max-w-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[rgba(255,255,255,0.8)]">Description courte</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[rgba(255,255,255,0.8)]">Contenu (HTML)</Label>
                    <Textarea
                      value={formData.contenu_html}
                      onChange={(e) => setFormData({ ...formData, contenu_html: e.target.value })}
                      placeholder="<p>Contenu de l'article...</p>"
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white font-mono text-sm"
                      rows={8}
                      required
                    />
                    <p className="text-xs text-[rgba(255,255,255,0.4)]">
                      Balises HTML acceptées (&lt;p&gt;, &lt;strong&gt;, &lt;a&gt;...), affichées telles quelles sur la page publique.
                    </p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {actus.map((a) => (
                <ActuCard key={a.id} actu={a} onEdit={() => handleEdit(a)} onDelete={() => handleDelete(a.id, a.titre)} />
              ))}

              {actus.length === 0 && (
                <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="py-12 text-center">
                    <p className="text-[rgba(255,255,255,0.5)]">Aucune actualité pour le moment.</p>
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
