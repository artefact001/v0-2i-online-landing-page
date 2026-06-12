"use client"

import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { STUDENTS, FORMATIONS, PLATFORM_STATS } from '@/lib/platform-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function formatXOF(amount: number) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
}

const PAYMENT_METHODS = ['Orange Money', 'Wave', 'Carte bancaire', 'Free Money']

// Build demo payments from enrolled students
const PAYMENTS = STUDENTS.map((student, i) => {
  const formation = FORMATIONS.find((f) => f.id === student.formation)
  const statuses = ['Payé', 'Payé', 'Payé', 'En attente', 'Payé'] as const
  return {
    id: `PAY-${1000 + i}`,
    student: student.name,
    formation: formation?.name ?? '—',
    amount: formation?.price ?? 0,
    method: PAYMENT_METHODS[i % PAYMENT_METHODS.length],
    date: student.enrolledAt,
    status: statuses[i % statuses.length],
  }
})

export default function AdminPaymentsPage() {
  const totalRevenue = PAYMENTS.filter((p) => p.status === 'Payé').reduce((acc, p) => acc + p.amount, 0)
  const pending = PAYMENTS.filter((p) => p.status === 'En attente')
  const pendingAmount = pending.reduce((acc, p) => acc + p.amount, 0)

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="ml-64">
        <DashboardHeader title="Paiements" subtitle="Suivi des revenus et des transactions" />

        <div className="p-8 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-[#0d0d1a] to-[#C9A227]/10 border-[#C9A227]/30">
              <CardContent className="p-6">
                <p className="text-[rgba(255,255,255,0.5)] text-sm">Revenus encaissés</p>
                <p className="text-2xl font-bold text-[#C9A227] mt-1">{formatXOF(totalRevenue)}</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="p-6">
                <p className="text-[rgba(255,255,255,0.5)] text-sm">En attente</p>
                <p className="text-2xl font-bold text-white mt-1">{formatXOF(pendingAmount)}</p>
                <p className="text-[rgba(255,255,255,0.4)] text-xs mt-1">{pending.length} transaction(s)</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="p-6">
                <p className="text-[rgba(255,255,255,0.5)] text-sm">Taux de complétion</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{PLATFORM_STATS.completionRate}%</p>
              </CardContent>
            </Card>
          </div>

          {/* Transactions table */}
          <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
            <CardHeader>
              <CardTitle className="text-white font-serif">Transactions récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[rgba(255,255,255,0.05)]">
                      <th className="pb-3 text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase">Référence</th>
                      <th className="pb-3 text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase">Élève</th>
                      <th className="pb-3 text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase">Formation</th>
                      <th className="pb-3 text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase">Montant</th>
                      <th className="pb-3 text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase">Méthode</th>
                      <th className="pb-3 text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PAYMENTS.map((p) => (
                      <tr key={p.id} className="border-b border-[rgba(255,255,255,0.03)]">
                        <td className="py-4 text-[rgba(255,255,255,0.5)] text-sm font-mono">{p.id}</td>
                        <td className="py-4 text-white font-medium">{p.student}</td>
                        <td className="py-4 text-[rgba(255,255,255,0.7)] text-sm">{p.formation}</td>
                        <td className="py-4 text-white text-sm">{formatXOF(p.amount)}</td>
                        <td className="py-4 text-[rgba(255,255,255,0.7)] text-sm">{p.method}</td>
                        <td className="py-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              p.status === 'Payé'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-[#C9A227]/20 text-[#C9A227]'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
