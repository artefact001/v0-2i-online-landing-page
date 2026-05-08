"use client"

import { useState } from 'react'
import Image from 'next/image'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { useAuth } from '@/lib/auth-context'
import { 
  PROFESSORS, 
  FORMATIONS, 
  STUDENTS,
  getStudentsByProfessor 
} from '@/lib/platform-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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

export default function ProfessorStudentsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFormation, setSelectedFormation] = useState<string>('all')
  
  const professor = PROFESSORS.find(p => p.id === user?.id) || PROFESSORS[0]
  const myFormations = FORMATIONS.filter(f => professor.formations.includes(f.id))
  const allMyStudents = getStudentsByProfessor(professor.id)
  
  const filteredStudents = allMyStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFormation = selectedFormation === 'all' || student.formation === selectedFormation
    return matchesSearch && matchesFormation
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400">Actif</Badge>
      case 'inactive':
        return <Badge className="bg-yellow-500/20 text-yellow-400">Inactif</Badge>
      case 'graduated':
        return <Badge className="bg-blue-500/20 text-blue-400">Diplômé</Badge>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      
      <main className="ml-64">
        <DashboardHeader 
          title="Mes Élèves" 
          subtitle={`${allMyStudents.length} élèves dans vos formations`}
        />

        <div className="p-8 space-y-6">
          {/* Formations Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {myFormations.map((formation) => {
              const students = allMyStudents.filter(s => s.formation === formation.id)
              const avgProgress = students.length > 0 
                ? Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length)
                : 0
              
              return (
                <Card 
                  key={formation.id} 
                  className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)] cursor-pointer hover:border-[#C9A227]/30 transition-colors"
                  onClick={() => setSelectedFormation(formation.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                        <Image src={formation.image} alt={formation.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{formation.name}</h3>
                        <p className="text-[rgba(255,255,255,0.5)] text-sm">{students.length} élèves</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#C9A227] font-bold">{avgProgress}%</p>
                        <p className="text-[rgba(255,255,255,0.4)] text-xs">Moy.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgba(255,255,255,0.4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input
                  placeholder="Rechercher un élève..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                />
              </div>
            </div>
            <Select value={selectedFormation} onValueChange={setSelectedFormation}>
              <SelectTrigger className="w-[200px] bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white">
                <SelectValue placeholder="Formation" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)]">
                <SelectItem value="all" className="text-white">Toutes les formations</SelectItem>
                {myFormations.map((formation) => (
                  <SelectItem key={formation.id} value={formation.id} className="text-white">
                    {formation.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Students Table */}
          <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
            <CardHeader>
              <CardTitle className="text-white font-serif">Liste des élèves</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-[rgba(255,255,255,0.05)]">
                    <TableHead className="text-[rgba(255,255,255,0.5)]">Élève</TableHead>
                    <TableHead className="text-[rgba(255,255,255,0.5)]">Formation</TableHead>
                    <TableHead className="text-[rgba(255,255,255,0.5)]">Progression</TableHead>
                    <TableHead className="text-[rgba(255,255,255,0.5)]">Cours terminés</TableHead>
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
                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
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
                            <Progress value={student.progress} className="h-2 w-24" />
                            <span className="text-[#C9A227] font-medium">{student.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          {student.completedCourses}/{student.totalCourses}
                        </TableCell>
                        <TableCell>{getStatusBadge(student.status)}</TableCell>
                        <TableCell className="text-[rgba(255,255,255,0.6)]">
                          {new Date(student.lastActive).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[rgba(255,255,255,0.5)] hover:text-white">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[rgba(255,255,255,0.5)] hover:text-white">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {filteredStudents.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-[rgba(255,255,255,0.5)]">Aucun élève trouvé</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
