"use client"

import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { ComingSoon } from '@/components/dashboard/coming-soon'

export default function AdminPaymentsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="ml-64">
        <DashboardHeader title="Paiements" subtitle="Suivi des revenus et des transactions" />
        <ComingSoon message="Le suivi des paiements Bictorys en temps réel arrive bientôt sur cette page." />
      </main>
    </div>
  )
}
