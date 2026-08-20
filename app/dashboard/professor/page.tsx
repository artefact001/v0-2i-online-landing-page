"use client"

import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { ComingSoon } from '@/components/dashboard/coming-soon'
import { useAuth } from '@/lib/auth-context'

export default function ProfessorDashboard() {
  const { user } = useAuth()
  const displayName = user?.first_name || user?.name || 'Professeur'

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="ml-64">
        <DashboardHeader title={`Bonjour, ${displayName}`} subtitle="Vue d'ensemble de vos formations" />
        <ComingSoon message="Le tableau de bord avec tes statistiques (élèves, progression, activité) arrive bientôt. En attendant, gère tes cours depuis les sections Modules, Leçons et Exercices." />
      </main>
    </div>
  )
}
