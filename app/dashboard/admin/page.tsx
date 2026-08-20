"use client"

import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { ComingSoon } from '@/components/dashboard/coming-soon'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="ml-64">
        <DashboardHeader title="Tableau de bord" subtitle="Vue d'ensemble de la plateforme" />
        <ComingSoon message="Le tableau de bord avec les vraies statistiques (inscriptions, revenus, activité) arrive bientôt." />
      </main>
    </div>
  )
}
