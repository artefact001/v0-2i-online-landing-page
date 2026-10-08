"use client"

import { useState, useEffect } from 'react'
import { apiClient, apiClientUpload } from '@/lib/api/client'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ValidatedInput } from '@/components/ui/validated-input'
import { Label } from '@/components/ui/label'
import { ImageUpload } from '@/components/ui/image-upload'
import { Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react'
import { alertSuccess, alertError, confirmDelete } from '@/lib/alerts'
import { combine, required, minLength } from '@/lib/validators'

// Table Laravel 'partenaire_logos' (endpoint /partenaire-logos) : id, nom,
// domaine, logo (URL complète), ordre, actif
interface PartenaireLogo {
  id: number
  nom: string
  domaine?: string | null
  logo: string
  ordre: number
  actif: boolean
}

const emptyForm = { nom: '', domaine: '', ordre: '', actif: true }

export default function AdminPartenairesLogosPage() {
  const [items, setItems] = useState<PartenaireLogo[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await apiClient<PartenaireLogo[]>('/admin/partenaire-logos')
      setItems(res.data || [])
    } catch (err) {
      console.error('[admin/partenaires-logos] Erreur de chargement:', err)
    }
    setLoading(false)
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setLogoFile(null)
    setExistingLogoUrl(null)
    setEditingId(null)
    setIsCreating(false)
    setError('')
  }

  const handleEdit = (p: PartenaireLogo) => {
    setFormData({ nom: p.nom, domaine: p.domaine || '', ordre: String(p.ordre), actif: p.actif })
    setLogoFile(null)
    setExistingLogoUrl(p.logo || null)
    setEditingId(p.id)
    setIsCreating(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!editingId && !logoFile) {
      setError('Le logo est obligatoire')
      return
    }

    setSaving(true)
    const body = new FormData()
    body.append('nom', formData.nom)
    body.append('domaine', formData.domaine)
    if (formData.ordre !== '') body.append('ordre', formData.ordre)
    body.append('actif', formData.actif ? '1' : '0')
    if (logoFile) body.append('logo', logoFile)

    try {
      if (editingId) {
        await apiClientUpload(`/partenaire-logos/${editingId}`, body, 'PUT')
      } else {
        await apiClientUpload('/partenaire-logos', body, 'POST')
      }
      await load()
      resetForm()
      alertSuccess(editingId ? 'Partenaire modifié avec succès.' : 'Partenaire ajouté avec succès.')
    } catch (err: any) {
      console.error('[admin/partenaires-logos] Erreur de sauvegarde:', err)
      const msg = err?.message || "Erreur lors de l'enregistrement"
      setError(msg)
      alertError(msg)
    }
    setSaving(false)
  }

  const handleDelete = async (p: PartenaireLogo) => {
    const confirmed = await confirmDelete(p.nom)
    if (!confirmed) return
    try {
      await apiClient(`/partenaire-logos/${p.id}`, { method: 'DELETE' })
      await load()
      alertSuccess('Partenaire supprimé avec succès.')
    } catch (err: any) {
      alertError(err?.message || 'Erreur lors de la suppression')
    }
  }

  const toggleActif = async (p: PartenaireLogo) => {
    try {
      const body = new FormData()
      body.append('actif', p.actif ? '0' : '1')
      await apiClientUpload(`/partenaire-logos/${p.id}`, body, 'PUT')
      await load()
    } catch (err: any) {
      alertError(err?.message || 'Erreur lors de la modification')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader
          title="Partenaires (logos)"
          subtitle="Logos affichés dans la section « Ils nous font confiance » de la page d'accueil"
        />

        <div className="p-4 md:p-8 space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => (isCreating ? resetForm() : setIsCreating(true))} className="bg-[#C9A227] hover:bg-[#B8860B] text-white">
              <Plus className="w-4 h-4 mr-2" />
              {isCreating ? 'Annuler' : 'Nouveau partenaire'}
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
                    label="Nom du partenaire"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    validator={combine(required('Le nom est obligatoire'), minLength(2))}
                    className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                    required
                  />

                  <div className="space-y-2">
                    <Label className="text-[rgba(255,255,255,0.8)]">Domaine / secteur (optionnel)</Label>
                    <Input
                      value={formData.domaine}
                      onChange={(e) => setFormData({ ...formData, domaine: e.target.value })}
                      placeholder="Ex : Coopération Internationale"
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                    />
                  </div>

                  <ImageUpload label="Logo" value={existingLogoUrl} onFileSelected={setLogoFile} disabled={saving} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[rgba(255,255,255,0.8)]">Ordre d'affichage (optionnel)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={formData.ordre}
                        onChange={(e) => setFormData({ ...formData, ordre: e.target.value })}
                        placeholder="Automatique : à la fin"
                        className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                      />
                    </div>
                    <div className="flex items-end pb-2">
                      <label className="flex items-center gap-2 text-sm text-[rgba(255,255,255,0.8)] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.actif}
                          onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                          className="accent-[#C9A227] w-4 h-4"
                        />
                        Visible sur la page d'accueil
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={saving} className="flex-1 bg-[#C9A227] hover:bg-[#B8860B] text-white">
                      {saving ? 'Enregistrement...' : editingId ? 'Modifier' : 'Ajouter'}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {items.map((p) => (
                <Card key={p.id} className={`bg-[#0d0d1a] border-[rgba(255,255,255,0.05)] ${p.actif ? '' : 'opacity-50'}`}>
                  <CardContent className="p-5 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden p-3 mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.logo} alt={p.nom} className="max-w-full max-h-full object-contain" />
                    </div>
                    <h3 className="text-white font-semibold text-sm">{p.nom}</h3>
                    {p.domaine && <p className="text-[#C9A227] text-xs mt-1">{p.domaine}</p>}
                    <p className="text-[rgba(255,255,255,0.4)] text-xs mt-2">
                      Ordre : {p.ordre} {!p.actif && '· Masqué'}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => toggleActif(p)} title={p.actif ? 'Masquer' : 'Afficher'} className="border-[rgba(255,255,255,0.2)] text-white">
                        {p.actif ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(p)} className="border-[rgba(255,255,255,0.2)] text-white">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(p)} className="border-red-500/40 text-red-400 hover:bg-red-500/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {items.length === 0 && (
                <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)] sm:col-span-2 lg:col-span-4">
                  <CardContent className="py-12 text-center">
                    <p className="text-[rgba(255,255,255,0.5)]">Aucun partenaire pour le moment. Ajoutez les logos à afficher sur la page d'accueil.</p>
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
