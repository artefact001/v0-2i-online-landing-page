"use client"

import { useState } from 'react'
import Image from 'next/image'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { PROFESSORS, FORMATIONS, STUDENTS } from '@/lib/platform-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

type Professor = (typeof PROFESSORS)[number]

export default function ProfessorsPage() {
  const [professors, setProfessors] = useState<Professor[]>(PROFESSORS)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [viewingProfessor, setViewingProfessor] = useState<Professor | null>(null)
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null)
  const [editForm, setEditForm] = useState({ name: '', email: '', speciality: '', bio: '' })
  const [newProfessor, setNewProfessor] = useState({
    name: '',
    email: '',
    speciality: '',
    bio: '',
    formations: [] as string[],
  })

  const filteredProfessors = professors.filter(
    (professor) =>
      professor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      professor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      professor.speciality.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddProfessor = () => {
    const created: Professor = {
      ...PROFESSORS[0],
      id: `prof-${Date.now()}`,
      name: newProfessor.name,
      email: newProfessor.email,
      speciality: newProfessor.speciality,
      bio: newProfessor.bio,
      formations: newProfessor.formations,
      studentsCount: 0,
      coursesCount: 0,
      rating: 0,
    }
    setProfessors((prev) => [created, ...prev])
    setIsAddDialogOpen(false)
    setNewProfessor({ name: '', email: '', speciality: '', bio: '', formations: [] })
  }

  const openEdit = (professor: Professor) => {
    setEditingProfessor(professor)
    setEditForm({
      name: professor.name,
      email: professor.email,
      speciality: professor.speciality,
      bio: professor.bio,
    })
  }

  const handleSaveEdit = () => {
    if (!editingProfessor) return
    setProfessors((prev) =>
      prev.map((p) =>
        p.id === editingProfessor.id
          ? { ...p, name: editForm.name, email: editForm.email, speciality: editForm.speciality, bio: editForm.bio }
          : p
      )
    )
    setEditingProfessor(null)
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />

      <main className="ml-64">
        <DashboardHeader
          title="Gestion des Professeurs"
          subtitle={`${professors.length} professeurs actifs`}
        />

        <div className="p-8 space-y-6">
          {/* Actions Bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgba(255,255,255,0.4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input
                  placeholder="Rechercher un professeur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.3)]"
                />
              </div>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-[#C9A227] to-[#B8860B] hover:from-[#B8860B] hover:to-[#C9A227]">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Ajouter un professeur
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)] text-white max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl font-serif">Nouveau Professeur</DialogTitle>
                  <DialogDescription className="text-[rgba(255,255,255,0.5)]">
                    Ajoutez un nouveau professeur à la plateforme
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={newProfessor.name}
                      onChange={(e) => setNewProfessor({ ...newProfessor, name: e.target.value })}
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                      placeholder="Chef Jean Dupont"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newProfessor.email}
                      onChange={(e) => setNewProfessor({ ...newProfessor, email: e.target.value })}
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                      placeholder="professeur@2ionline.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="speciality">Spécialité</Label>
                    <Input
                      id="speciality"
                      value={newProfessor.speciality}
                      onChange={(e) => setNewProfessor({ ...newProfessor, speciality: e.target.value })}
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                      placeholder="Cuisine française, Pâtisserie..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="formations">Formations assignées</Label>
                    <Select>
                      <SelectTrigger className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white">
                        <SelectValue placeholder="Sélectionner les formations" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)]">
                        {FORMATIONS.map((formation) => (
                          <SelectItem key={formation.id} value={formation.id} className="text-white focus:bg-[rgba(255,255,255,0.1)]">
                            {formation.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea
                      id="bio"
                      value={newProfessor.bio}
                      onChange={(e) => setNewProfessor({ ...newProfessor, bio: e.target.value })}
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white min-h-[100px]"
                      placeholder="Expérience et parcours professionnel..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="text-[rgba(255,255,255,0.7)]">
                    Annuler
                  </Button>
                  <Button onClick={handleAddProfessor} className="bg-[#C9A227] hover:bg-[#B8860B]">
                    Ajouter le professeur
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Professors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProfessors.map((professor) => {
              const professorFormations = FORMATIONS.filter(f => professor.formations.includes(f.id))

              return (
                <Card key={professor.id} className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)] hover:border-[#C9A227]/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={professor.avatar}
                          alt={professor.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-lg truncate">{professor.name}</h3>
                        <p className="text-[#C9A227] text-sm">{professor.speciality}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-white text-sm font-medium">{professor.rating}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[rgba(255,255,255,0.6)] text-sm mb-4 line-clamp-2">
                      {professor.bio}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {professorFormations.map((formation) => (
                        <span
                          key={formation.id}
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: `${formation.color}20`,
                            color: formation.color
                          }}
                        >
                          {formation.name}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-4 py-4 border-t border-[rgba(255,255,255,0.05)]">
                      <div className="text-center">
                        <p className="text-white font-bold">{professor.studentsCount}</p>
                        <p className="text-[rgba(255,255,255,0.4)] text-xs">Élèves</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white font-bold">{professor.coursesCount}</p>
                        <p className="text-[rgba(255,255,255,0.4)] text-xs">Cours</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white font-bold">{professorFormations.length}</p>
                        <p className="text-[rgba(255,255,255,0.4)] text-xs">Formations</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingProfessor(professor)}
                        className="flex-1 border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.05)] bg-transparent"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Voir
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(professor)}
                        className="flex-1 border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.05)] bg-transparent"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Modifier
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredProfessors.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-[rgba(255,255,255,0.2)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-[rgba(255,255,255,0.5)]">Aucun professeur trouvé</p>
            </div>
          )}
        </div>
      </main>

      {/* View Professor Dialog */}
      <Dialog open={!!viewingProfessor} onOpenChange={(open) => !open && setViewingProfessor(null)}>
        <DialogContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)] text-white max-w-lg">
          {viewingProfessor && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-serif">Détails du professeur</DialogTitle>
                <DialogDescription className="text-[rgba(255,255,255,0.5)]">
                  Informations complètes du profil
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={viewingProfessor.avatar} alt={viewingProfessor.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{viewingProfessor.name}</h3>
                    <p className="text-[#C9A227] text-sm">{viewingProfessor.speciality}</p>
                    <p className="text-[rgba(255,255,255,0.5)] text-sm">{viewingProfessor.email}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[rgba(255,255,255,0.4)] text-xs uppercase tracking-wide mb-1">Biographie</p>
                  <p className="text-[rgba(255,255,255,0.8)] text-sm leading-relaxed">{viewingProfessor.bio}</p>
                </div>

                <div>
                  <p className="text-[rgba(255,255,255,0.4)] text-xs uppercase tracking-wide mb-2">Formations</p>
                  <div className="flex flex-wrap gap-2">
                    {FORMATIONS.filter(f => viewingProfessor.formations.includes(f.id)).map((formation) => (
                      <span
                        key={formation.id}
                        className="px-2 py-1 text-xs rounded-full"
                        style={{ backgroundColor: `${formation.color}20`, color: formation.color }}
                      >
                        {formation.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                  <div className="text-center">
                    <p className="text-white font-bold text-lg">{viewingProfessor.studentsCount}</p>
                    <p className="text-[rgba(255,255,255,0.4)] text-xs">Élèves</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-lg">{viewingProfessor.coursesCount}</p>
                    <p className="text-[rgba(255,255,255,0.4)] text-xs">Cours</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-lg">{viewingProfessor.rating}</p>
                    <p className="text-[rgba(255,255,255,0.4)] text-xs">Note</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setViewingProfessor(null)} className="text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.05)]">
                  Fermer
                </Button>
                <Button
                  onClick={() => { openEdit(viewingProfessor); setViewingProfessor(null) }}
                  className="bg-[#C9A227] hover:bg-[#B8860B]"
                >
                  Modifier
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Professor Dialog */}
      <Dialog open={!!editingProfessor} onOpenChange={(open) => !open && setEditingProfessor(null)}>
        <DialogContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)] text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif">Modifier le professeur</DialogTitle>
            <DialogDescription className="text-[rgba(255,255,255,0.5)]">
              Mettez à jour les informations du professeur
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nom complet</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-speciality">Spécialité</Label>
              <Input
                id="edit-speciality"
                value={editForm.speciality}
                onChange={(e) => setEditForm({ ...editForm, speciality: e.target.value })}
                className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-bio">Biographie</Label>
              <Textarea
                id="edit-bio"
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white min-h-[100px]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setEditingProfessor(null)} className="text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.05)]">
              Annuler
            </Button>
            <Button onClick={handleSaveEdit} className="bg-[#C9A227] hover:bg-[#B8860B]">
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
