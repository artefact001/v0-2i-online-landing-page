"use client"

import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { ComingSoon } from '@/components/dashboard/coming-soon'

export default function StudentLivePage() {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="ml-64">
        <DashboardHeader title="Cours Live" subtitle="Vos sessions en direct et à venir" />
        <ComingSoon message="Cette vue dédiée arrive bientôt. En attendant, tes sessions live à venir apparaissent sur le tableau de bord." />
      </main>
    </div>
  )
}
