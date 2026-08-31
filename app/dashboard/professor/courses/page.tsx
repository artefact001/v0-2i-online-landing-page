"use client"

import Link from 'next/link'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ProfessorCoursesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Mes Cours" subtitle="Gérez vos formations, modules et leçons" />
        <div className="p-4 md:p-8 grid gap-4 sm:grid-cols-3">
          <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
            <CardHeader><CardTitle className="text-white font-serif text-base">Modules</CardTitle></CardHeader>
            <CardContent>
              <Link href="/dashboard/professor/modules">
                <Button className="w-full bg-[#C9A227] hover:bg-[#B8860B]">Gérer les modules</Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
            <CardHeader><CardTitle className="text-white font-serif text-base">Leçons</CardTitle></CardHeader>
            <CardContent>
              <Link href="/dashboard/professor/lessons">
                <Button className="w-full bg-[#C9A227] hover:bg-[#B8860B]">Gérer les leçons</Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
            <CardHeader><CardTitle className="text-white font-serif text-base">Évaluations</CardTitle></CardHeader>
            <CardContent>
              <Link href="/dashboard/professor/exercises">
                <Button className="w-full bg-[#C9A227] hover:bg-[#B8860B]">Gérer les exercices</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
