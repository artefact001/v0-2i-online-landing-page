"use client"

import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { ComingSoon } from '@/components/dashboard/coming-soon'

export default function AdminLiveSessionsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Sessions Live" subtitle="Supervisez toutes les sessions en direct de la plateforme" />
        <ComingSoon message="La supervision globale des cours en direct arrive bientôt." />
      </main>
    </div>
  )
}
