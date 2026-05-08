"use client"

import { useState } from 'react'
import Image from 'next/image'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { FORMATIONS, PROFESSORS, STUDENTS } from '@/lib/platform-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

export default function FormationsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedFormation, setSelectedFormation] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      
      <main className="ml-64">
        <DashboardHeader 
          title="Gestion des Formations" 
          subtitle={`${FORMATIONS.length} formations disponibles`}
        />

        <div className="p-8 space-y-6">
          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-[rgba(255,255,255,0.5)]">
                Total des inscriptions: <span className="text-white font-bold">{FORMATIONS.reduce((acc, f) => acc + f.studentsCount, 0)}</span>
              </div>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-[#C9A227] to-[#B8860B] hover:from-[#B8860B] hover:to-[#C9A227]">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Nouvelle formation
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)] text-white max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl font-serif">Nouvelle Formation</DialogTitle>
                  <DialogDescription className="text-[rgba(255,255,255,0.5)]">
                    Créez une nouvelle formation
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Nom de la formation</Label>
                    <Input className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white" placeholder="CAP Boulangerie" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white" placeholder="Description de la formation..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Durée</Label>
                      <Input className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white" placeholder="6 mois" />
                    </div>
                    <div className="space-y-2">
                      <Label>Prix (FCFA)</Label>
                      <Input type="number" className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white" placeholder="150000" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
                  <Button className="bg-[#C9A227] hover:bg-[#B8860B]">Créer la formation</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Formations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {FORMATIONS.map((formation) => {
              const formationProfessors = PROFESSORS.filter(p => p.formations.includes(formation.id))
              const formationStudents = STUDENTS.filter(s => s.formation === formation.id)
              const avgProgress = formationStudents.length > 0 
                ? Math.round(formationStudents.reduce((acc, s) => acc + s.progress, 0) / formationStudents.length)
                : 0

              return (
                <Card 
                  key={formation.id} 
                  className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)] hover:border-[#C9A227]/30 transition-all cursor-pointer"
                  onClick={() => setSelectedFormation(selectedFormation === formation.id ? null : formation.id)}
                >
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Image */}
                      <div className="relative w-48 h-48 flex-shrink-0">
                        <Image 
                          src={formation.image} 
                          alt={formation.name}
                          fill
                          className="object-cover rounded-l-lg"
                        />
                        <div 
                          className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d0d1a]"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-white font-serif font-bold text-xl mb-1">{formation.name}</h3>
                            <p className="text-[rgba(255,255,255,0.5)] text-sm line-clamp-2">{formation.description}</p>
                          </div>
                          <span 
                            className="px-3 py-1 rounded-full text-sm font-bold"
                            style={{ backgroundColor: `${formation.color}20`, color: formation.color }}
                          >
                            {formation.price.toLocaleString()} FCFA
                          </span>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[rgba(255,255,255,0.4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-[rgba(255,255,255,0.6)] text-sm">{formation.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[rgba(255,255,255,0.4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span className="text-[rgba(255,255,255,0.6)] text-sm">{formation.coursesCount} cours</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                          <div>
                            <p className="text-white font-bold text-lg">{formation.studentsCount}</p>
                            <p className="text-[rgba(255,255,255,0.4)] text-xs">Élèves</p>
                          </div>
                          <div>
                            <p className="text-white font-bold text-lg">{formationProfessors.length}</p>
                            <p className="text-[rgba(255,255,255,0.4)] text-xs">Professeurs</p>
                          </div>
                          <div>
                            <p className="text-[#C9A227] font-bold text-lg">{avgProgress}%</p>
                            <p className="text-[rgba(255,255,255,0.4)] text-xs">Prog. moy.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedFormation === formation.id && (
                      <div className="p-6 border-t border-[rgba(255,255,255,0.05)] space-y-4">
                        {/* Professors */}
                        <div>
                          <h4 className="text-white font-semibold mb-3">Équipe pédagogique</h4>
                          <div className="flex flex-wrap gap-3">
                            {formationProfessors.map((prof) => (
                              <div key={prof.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.02)]">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                  <Image src={prof.avatar} alt={prof.name} fill className="object-cover" />
                                </div>
                                <span className="text-white text-sm">{prof.name}</span>
                              </div>
                            ))}
                            {formationProfessors.length === 0 && (
                              <p className="text-[rgba(255,255,255,0.4)] text-sm">Aucun professeur assigné</p>
                            )}
                          </div>
                        </div>

                        {/* Recent Students */}
                        <div>
                          <h4 className="text-white font-semibold mb-3">Élèves récents</h4>
                          <div className="space-y-2">
                            {formationStudents.slice(0, 3).map((student) => (
                              <div key={student.id} className="flex items-center justify-between p-2 rounded-lg bg-[rgba(255,255,255,0.02)]">
                                <div className="flex items-center gap-2">
                                  <div className="relative w-6 h-6 rounded-full overflow-hidden">
                                    <Image src={student.avatar} alt={student.name} fill className="object-cover" />
                                  </div>
                                  <span className="text-white text-sm">{student.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Progress value={student.progress} className="h-1.5 w-20" />
                                  <span className="text-[#C9A227] text-xs">{student.progress}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                          <Button variant="outline" className="flex-1 border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.05)]">
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Modifier
                          </Button>
                          <Button variant="outline" className="flex-1 border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.05)]">
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Ajouter cours
                          </Button>
                          <Button className="flex-1 bg-[#C9A227] hover:bg-[#B8860B]">
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Voir élèves
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
