"use client"

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api/client'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Edit, Trash2, Plus, Briefcase } from 'lucide-react'

// Schéma Laravel réel (table opportunites) : id, titre, type
// ('stage'|'emploi'|'formation'|'bourse'|'partenariat'), description,
// documents (URL PDF), date_debut, date_fin, ville, pays, entreprise,
// lien_inscription, statut ('ouvert'|'ferme'|'en cours')
interface Opportunite {
  id: string
  titre: string
  type: 'stage' | 'emploi' | 'formation' | 'bourse' | 'partenariat'
  description: string
  documents?: string
  date_debut: string
  date_fin: string
  ville: string
  pays: string
  entreprise?: string
  lien_inscription?: string
  statut: 'ouvert' | 'ferme' | 'en cours'
}

const typeLabel: Record<Opportunite['type'], string> = {
  stage: 'Stage',
  emploi: 'Emploi',
  formation: 'Formation',
  bourse: 'Bourse',
  partenariat: 'Partenariat',
}

const statutLabel: Record<Opportunite['statut'], string> = {
  ouvert: 'Ouvert',
  ferme: 'Fermé',
  'en cours': 'En cours',
}

const statutStyle: Record<Opportunite['statut'], string> = {
  ouvert: 'bg-green-500/20 text-green-400',
  ferme: 'bg-red-500/20 text-red-400',
  'en cours': 'bg-amber-500/20 text-amber-400',
}

const emptyForm = {
  titre: '',
  type: 'emploi' as Opportunite['type'],
  description: '',
  documents: '',
  date_debut: new Date().toISOString().slice(0, 10),
  date_fin: '',
  ville: '',
  pays: 'Sénégal',
  entreprise: '',
  lien_inscription: '',
  statut: 'ouvert' as Opportunite['statut'],
}

export default function AdminOpportunitesPage() {
  const [opportunites, setOpportunites] = useState<Opportunite[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await apiClient<Opportunite[]>('/opportunites')
      setOpportunites(res.data || [])
    } catch (err) {
      console.error('[admin/opportunites] Erreur de chargement:', err)
    }
    setLoading(false)
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setEditingId(null)
    setIsCreating(false)
    setError('')
  }

  const handleEdit = (o: Opportunite) => {
    setFormData({
      titre: o.titre,
      type: o.type,
      description: o.description,
      documents: o.documents || '',
      date_debut: o.date_debut?.slice(0, 10) || emptyForm.date_debut,
      date_fin: o.date_fin?.slice(0, 10) || '',
      ville: o.ville,
      pays: o.pays,
      entreprise: o.entreprise || '',
      lien_inscription: o.lien_inscription || '',
      statut: o.statut,
    })
    setEditingId(o.id)
    setIsCreating(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      titre: formData.titre,
      type: formData.type,
      description: formData.description,
      documents: formData.documents || undefined,
      date_debut: formData.date_debut,
      date_fin: formData.date_fin,
      ville: formData.ville,
      pays: formData.pays,
      entreprise: formData.entreprise || undefined,
      lien_inscription: formData.lien_inscription || undefined,
      statut: formData.statut,
    }

    try {
      if (editingId) {
        await apiClient(`/opportunites/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) })
      } else {
        await apiClient('/opportunites', { method: 'POST', body: JSON.stringify(payload) })
      }
      await load()
      resetForm()
    } catch (err: any) {
      console.error('[admin/opportunites] Erreur de sauvegarde:', err)
      setError(err?.message || "Erreur lors de l'enregistrement")
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette opportunité ?')) return
    try {
      await apiClient(`/opportunites/${id}`, { method: 'DELETE' })
      await load()
    } catch (err) {
      console.error('[admin/opportunites] Erreur de suppression:', err)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Opportunités" subtitle="Gérer les offres de stage, emploi, bourses et partenariats" />

        <div className="p-4 md:p-8 space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => (isCreating ? resetForm() : setIsCreating(true))} className="bg-[#C9A227] hover:bg-[#B8860B] text-white">
              <Plus className="w-4 h-4 mr-2" />
              {isCreating ? 'Annuler' : 'Nouvelle opportunité'}
            </Button>
          </div>

          {isCreating && (
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[rgba(255,255,255,0.8)]">Titre</Label>
                      <Input
                        value={formData.titre}
                        onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                        className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[rgba(255,255,255,0.8)]">Type</Label>
                      <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as Opportunite['type'] })}>
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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[rgba(255,255,255,0.8)]">Entreprise / Organisation</Label>
                      <Input
                        value={formData.entreprise}
                        onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
                        className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[rgba(255,255,255,0.8)]">Statut</Label>
                      <Select value={formData.statut} onValueChange={(v) => setFormData({ ...formData, statut: v as Opportunite['statut'] })}>
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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[rgba(255,255,255,0.8)]">Ville</Label>
                      <Input
                        value={formData.ville}
                        onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                        className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[rgba(255,255,255,0.8)]">Pays</Label>
                      <Input
                        value={formData.pays}
                        onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                        className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[rgba(255,255,255,0.8)]">Date de début</Label>
                      <Input
                        type="date"
                        value={formData.date_debut}
                        onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
                        className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[rgba(255,255,255,0.8)]">Date limite</Label>
                      <Input
                        type="date"
                        value={formData.date_fin}
                        onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
                        className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[rgba(255,255,255,0.8)]">Lien d'inscription (optionnel)</Label>
                    <Input
                      value={formData.lien_inscription}
                      onChange={(e) => setFormData({ ...formData, lien_inscription: e.target.value })}
                      placeholder="https://..."
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                    />
                    <p className="text-xs text-[rgba(255,255,255,0.4)]">
                      Si vide, le bouton "Postuler" redirigera vers WhatsApp par défaut.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[rgba(255,255,255,0.8)]">Document (URL PDF, optionnel)</Label>
                    <Input
                      value={formData.documents}
                      onChange={(e) => setFormData({ ...formData, documents: e.target.value })}
                      placeholder="https://..."
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[rgba(255,255,255,0.8)]">Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                      rows={4}
                      required
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
              {opportunites.map((o) => (
                <Card key={o.id} className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[#C9A227]/10 flex items-center justify-center shrink-0">
                        <Briefcase className="w-5 h-5 text-[#C9A227]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-white font-medium truncate">{o.titre}</h3>
                        <p className="text-[rgba(255,255,255,0.4)] text-xs flex items-center gap-2">
                          <span>{typeLabel[o.type]} · {o.ville}</span>
                          <span className={`px-2 py-0.5 rounded-full ${statutStyle[o.statut]}`}>{statutLabel[o.statut]}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <Button size="icon" variant="outline" onClick={() => handleEdit(o)} title="Modifier" className="border-[rgba(255,255,255,0.2)] text-white h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => handleDelete(o.id)} title="Supprimer" className="border-red-500/20 text-red-400 hover:bg-red-500/10 h-8 w-8">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {opportunites.length === 0 && (
                <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="py-12 text-center">
                    <p className="text-[rgba(255,255,255,0.5)]">Aucune opportunité pour le moment.</p>
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
