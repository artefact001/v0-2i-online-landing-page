"use client"

import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { ComingSoon } from '@/components/dashboard/coming-soon'

export default function AdminFormationsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="ml-64">
        <DashboardHeader title="Gestion des Formations" subtitle="Créer et gérer le catalogue de formations" />
        <ComingSoon message="La gestion des formations depuis le dashboard admin arrive bientôt." />
      </main>
    </div>
  )
}
