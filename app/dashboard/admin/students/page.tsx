"use client"

import { useState } from 'react'
import Image from 'next/image'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { STUDENTS, FORMATIONS } from '@/lib/platform-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFormation, setSelectedFormation] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    formation: '',
  })

  const filteredStudents = STUDENTS.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFormation = selectedFormation === 'all' || student.formation === selectedFormation
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus
    return matchesSearch && matchesFormation && matchesStatus
  })

  const handleAddStudent = () => {
    console.log('Adding student:', newStudent)
    setIsAddDialogOpen(false)
    setNewStudent({ name: '', email: '', phone: '', formation: '' })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">Actif</Badge>
      case 'inactive':
        return <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">Inactif</Badge>
      case 'graduated':
        return <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">Diplômé</Badge>
      default:
        return null
    }
  }

  const studentsByFormation = FORMATIONS.map(formation => ({
    ...formation,
    students: STUDENTS.filter(s => s.formation === formation.id)
  }))

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      
      <main className="ml-64">
        <DashboardHeader 
          title="Gestion des Élèves" 
          subtitle={`${STUDENTS.length} élèves inscrits`}
        />

        <div className="p-8 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{STUDENTS.filter(s => s.status === 'active').length}</p>
                    <p className="text-[rgba(255,255,255,0.5)] text-sm">Actifs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{STUDENTS.filter(s => s.status === 'graduated').length}</p>
                    <p className="text-[rgba(255,255,255,0.5)] text-sm">Diplômés</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{STUDENTS.filter(s => s.status === 'inactive').length}</p>
                    <p className="text-[rgba(255,255,255,0.5)] text-sm">Inactifs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#C9A227]/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{Math.round(STUDENTS.reduce((acc, s) => acc + s.progress, 0) / STUDENTS.length)}%</p>
                    <p className="text-[rgba(255,255,255,0.5)] text-sm">Progression moy.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <TabsList className="bg-[rgba(255,255,255,0.05)]">
                <TabsTrigger value="all" className="data-[state=active]:bg-[#C9A227] data-[state=active]:text-white">
                  Tous les élèves
                </TabsTrigger>
                <TabsTrigger value="by-formation" className="data-[state=active]:bg-[#C9A227] data-[state=active]:text-white">
                  Par formation
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-3">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-[rgba(255,255,255,0.05)] rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#C9A227] text-white' : 'text-[rgba(255,255,255,0.5)]'}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded ${viewMode === 'table' ? 'bg-[#C9A227] text-white' : 'text-[rgba(255,255,255,0.5)]'}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-[#C9A227] to-[#B8860B] hover:from-[#B8860B] hover:to-[#C9A227]">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Ajouter un élève
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)] text-white max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-serif">Nouvel Élève</DialogTitle>
                      <DialogDescription className="text-[rgba(255,255,255,0.5)]">
                        Inscrivez un nouvel élève à une formation
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet</Label>
                        <Input
                          id="name"
                          value={newStudent.name}
                          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                          className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                          placeholder="Jean Dupont"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newStudent.email}
                          onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                          className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                          placeholder="eleve@email.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          value={newStudent.phone}
                          onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                          className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                          placeholder="+225 XX XX XX XX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="formation">Formation</Label>
                        <Select value={newStudent.formation} onValueChange={(value) => setNewStudent({ ...newStudent, formation: value })}>
                          <SelectTrigger className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white">
                            <SelectValue placeholder="Choisir une formation" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)]">
                            {FORMATIONS.map((formation) => (
                              <SelectItem key={formation.id} value={formation.id} className="text-white focus:bg-[rgba(255,255,255,0.1)]">
                                {formation.name} - {formation.price.toLocaleString()} FCFA
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="text-[rgba(255,255,255,0.7)]">
                        Annuler
                      </Button>
                      <Button onClick={handleAddStudent} className="bg-[#C9A227] hover:bg-[#B8860B]">
                        Inscrire l&apos;élève
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <TabsContent value="all" className="space-y-6">
              {/* Filters */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgba(255,255,255,0.4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <Input
                      placeholder="Rechercher un élève..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.3)]"
                    />
                  </div>
                </div>
                <Select value={selectedFormation} onValueChange={setSelectedFormation}>
                  <SelectTrigger className="w-[200px] bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white">
                    <SelectValue placeholder="Formation" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)]">
                    <SelectItem value="all" className="text-white focus:bg-[rgba(255,255,255,0.1)]">Toutes les formations</SelectItem>
                    {FORMATIONS.map((formation) => (
                      <SelectItem key={formation.id} value={formation.id} className="text-white focus:bg-[rgba(255,255,255,0.1)]">
                        {formation.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[150px] bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)]">
                    <SelectItem value="all" className="text-white focus:bg-[rgba(255,255,255,0.1)]">Tous</SelectItem>
                    <SelectItem value="active" className="text-white focus:bg-[rgba(255,255,255,0.1)]">Actif</SelectItem>
                    <SelectItem value="inactive" className="text-white focus:bg-[rgba(255,255,255,0.1)]">Inactif</SelectItem>
                    <SelectItem value="graduated" className="text-white focus:bg-[rgba(255,255,255,0.1)]">Diplômé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredStudents.map((student) => {
                    const formation = FORMATIONS.find(f => f.id === student.formation)
                    return (
                      <Card key={student.id} className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)] hover:border-[#C9A227]/30 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                <Image 
                                  src={student.avatar} 
                                  alt={student.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="text-white font-semibold">{student.name}</h3>
                                <p className="text-[rgba(255,255,255,0.5)] text-sm">{student.email}</p>
                              </div>
                            </div>
                            {getStatusBadge(student.status)}
                          </div>

                          <div 
                            className="px-3 py-2 rounded-lg mb-4"
                            style={{ backgroundColor: `${formation?.color}15` }}
                          >
                            <p className="text-sm" style={{ color: formation?.color }}>{formation?.name}</p>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-[rgba(255,255,255,0.5)]">Progression</span>
                                <span className="text-[#C9A227] font-medium">{student.progress}%</span>
                              </div>
                              <Progress value={student.progress} className="h-2" />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-[rgba(255,255,255,0.5)]">Cours terminés</span>
                              <span className="text-white">{student.completedCourses}/{student.totalCourses}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-[rgba(255,255,255,0.5)]">Dernière activité</span>
                              <span className="text-white">{new Date(student.lastActive).toLocaleDateString('fr-FR')}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                            <Button variant="outline" size="sm" className="flex-1 border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.05)]">
                              Voir profil
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.05)]">
                              Contacter
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[rgba(255,255,255,0.05)] hover:bg-transparent">
                        <TableHead className="text-[rgba(255,255,255,0.5)]">Élève</TableHead>
                        <TableHead className="text-[rgba(255,255,255,0.5)]">Formation</TableHead>
                        <TableHead className="text-[rgba(255,255,255,0.5)]">Progression</TableHead>
                        <TableHead className="text-[rgba(255,255,255,0.5)]">Statut</TableHead>
                        <TableHead className="text-[rgba(255,255,255,0.5)]">Dernière activité</TableHead>
                        <TableHead className="text-[rgba(255,255,255,0.5)]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => {
                        const formation = FORMATIONS.find(f => f.id === student.formation)
                        return (
                          <TableRow key={student.id} className="border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)]">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                  <Image src={student.avatar} alt={student.name} fill className="object-cover" />
                                </div>
                                <div>
                                  <p className="text-white font-medium">{student.name}</p>
                                  <p className="text-[rgba(255,255,255,0.4)] text-xs">{student.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span style={{ color: formation?.color }}>{formation?.name}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress value={student.progress} className="h-1.5 w-20" />
                                <span className="text-white text-sm">{student.progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(student.status)}</TableCell>
                            <TableCell className="text-[rgba(255,255,255,0.6)]">
                              {new Date(student.lastActive).toLocaleDateString('fr-FR')}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-[rgba(255,255,255,0.5)] hover:text-white">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-[rgba(255,255,255,0.5)] hover:text-white">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="by-formation" className="space-y-6">
              {studentsByFormation.map((formation) => (
                <Card key={formation.id} className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                          <Image src={formation.image} alt={formation.name} fill className="object-cover" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-lg">{formation.name}</h3>
                          <p className="text-[rgba(255,255,255,0.5)] text-sm">{formation.students.length} élèves inscrits</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-[rgba(255,255,255,0.1)] text-white">
                        Voir tous
                      </Button>
                    </div>

                    {formation.students.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {formation.students.slice(0, 3).map((student) => (
                          <div key={student.id} className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                              <Image src={student.avatar} alt={student.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium truncate">{student.name}</p>
                              <div className="flex items-center gap-2">
                                <Progress value={student.progress} className="h-1 flex-1" />
                                <span className="text-[#C9A227] text-xs">{student.progress}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[rgba(255,255,255,0.4)] text-center py-4">Aucun élève inscrit</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
