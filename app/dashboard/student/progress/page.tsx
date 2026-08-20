"use client"

import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { ComingSoon } from '@/components/dashboard/coming-soon'

export default function StudentProgressPage() {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="ml-64">
        <DashboardHeader title="Ma Progression" subtitle="Suis ton avancement en détail" />
        <ComingSoon message="Le détail complet de ta progression (par module, par leçon) arrive bientôt. En attendant, retrouve ta progression globale sur le tableau de bord." />
      </main>
    </div>
  )
}
