"use client"

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api/client'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { CreditCard } from 'lucide-react'

interface Paiement {
  id: string
  amount: number
  payment_method?: string
  currency?: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  created_at?: string
}

const statusStyle: Record<string, string> = {
  completed: 'bg-green-500/20 text-green-400',
  pending: 'bg-yellow-500/20 text-yellow-400',
  failed: 'bg-red-500/20 text-red-400',
  cancelled: 'bg-gray-500/20 text-gray-400',
}

const statusLabel: Record<string, string> = {
  completed: 'Complété',
  pending: 'En attente',
  failed: 'Échoué',
  cancelled: 'Annulé',
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Paiement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient<Paiement[]>('/paiements')
        setPayments(res.data || [])
      } catch (err) {
        console.error('[admin/payments] Erreur de chargement:', err)
      }
      setLoading(false)
    }
    load()
  }, [])

  const totalCompleted = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0)

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Paiements" subtitle="Suivi des revenus et des transactions" />

        <div className="p-4 md:p-8 space-y-6">
          <Card className="bg-gradient-to-r from-[#0d0d1a] to-[#C9A227]/10 border-[#C9A227]/30">
            <CardContent className="p-6">
              <p className="text-[rgba(255,255,255,0.5)] text-xs uppercase tracking-wider mb-1">
                Total encaissé (paiements complétés)
              </p>
              <p className="text-3xl font-bold text-white">{totalCompleted.toLocaleString()} FCFA</p>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : payments.length === 0 ? (
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="py-12 text-center">
                <p className="text-[rgba(255,255,255,0.5)]">Aucun paiement pour le moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {payments.map((p) => (
                <Card key={p.id} className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#C9A227]/10 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-[#C9A227]" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{Number(p.amount).toLocaleString()} FCFA</p>
                        <p className="text-[rgba(255,255,255,0.4)] text-xs">
                          {p.payment_method || 'Bictorys'} {p.created_at ? `· ${new Date(p.created_at).toLocaleDateString('fr-FR')}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[p.status] || statusStyle.pending}`}>
                      {statusLabel[p.status] || p.status}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
