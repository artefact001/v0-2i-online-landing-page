"use client"

import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { ComingSoon } from '@/components/dashboard/coming-soon'

export default function StudentCoursesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="ml-64">
        <DashboardHeader title="Mes Cours" subtitle="Accède à tes formations" />
        <ComingSoon message="Cette vue dédiée arrive bientôt. En attendant, accède à tes cours depuis le tableau de bord." />
      </main>
    </div>
  )
}
