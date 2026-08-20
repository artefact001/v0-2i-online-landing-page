"use client"

import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { ComingSoon } from '@/components/dashboard/coming-soon'

export default function ProfessorStudentsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="ml-64">
        <DashboardHeader title="Mes Élèves" subtitle="Suivez la progression de vos étudiants" />
        <ComingSoon message="Le suivi détaillé de tes élèves (progression, notes, activité) arrive bientôt." />
      </main>
    </div>
  )
}
