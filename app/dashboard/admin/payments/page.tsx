"use client"

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api/client'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CreditCard, Eye } from 'lucide-react'

// Schéma Laravel réel (table paiements) : montant (decimal), methode
// (enum FIXE: 'Wave'|'Orange Money'|'Free Money'|'Virement'|'CB'), statut
// (enum: 'en attente'|'confirme'|'echec'), date, user_id, formation_id.
interface Paiement {
  id: string
  montant: number
  methode: 'Wave' | 'Orange Money' | 'Free Money' | 'Virement' | 'CB'
  statut: 'en attente' | 'confirme' | 'echec'
  date: string
}

const statutStyle: Record<Paiement['statut'], string> = {
  confirme: 'bg-green-500/20 text-green-400',
  'en attente': 'bg-yellow-500/20 text-yellow-400',
  echec: 'bg-red-500/20 text-red-400',
}

const statutLabel: Record<Paiement['statut'], string> = {
  confirme: 'Confirmé',
  'en attente': 'En attente',
  echec: 'Échec',
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Paiement[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Paiement | null>(null)

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

  const totalConfirme = payments
    .filter((p) => p.statut === 'confirme')
    .reduce((sum, p) => sum + Number(p.montant || 0), 0)

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Paiements" subtitle="Suivi des revenus et des transactions" />

        <div className="p-4 md:p-8 space-y-6">
          <Card className="bg-gradient-to-r from-[#0d0d1a] to-[#C9A227]/10 border-[#C9A227]/30">
            <CardContent className="p-6">
              <p className="text-[rgba(255,255,255,0.5)] text-xs uppercase tracking-wider mb-1">
                Total encaissé (paiements confirmés)
              </p>
              <p className="text-3xl font-bold text-white">{totalConfirme.toLocaleString()} FCFA</p>
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
                        <p className="text-white font-medium">{Number(p.montant).toLocaleString()} FCFA</p>
                        <p className="text-[rgba(255,255,255,0.4)] text-xs">
                          {p.methode} {p.date ? `· ${new Date(p.date).toLocaleDateString('fr-FR')}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statutStyle[p.statut] || statutStyle['en attente']}`}>
                        {statutLabel[p.statut] || p.statut}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setSelected(p)}
                        title="Voir détails"
                        className="border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.05)] h-8 w-8"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)] text-white">
          <DialogHeader>
            <DialogTitle className="font-serif">Détails du paiement</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-[rgba(255,255,255,0.08)] pb-2">
                <span className="text-[rgba(255,255,255,0.5)]">Montant</span>
                <span className="text-white font-semibold">{Number(selected.montant).toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between border-b border-[rgba(255,255,255,0.08)] pb-2">
                <span className="text-[rgba(255,255,255,0.5)]">Méthode</span>
                <span className="text-white">{selected.methode}</span>
              </div>
              <div className="flex justify-between border-b border-[rgba(255,255,255,0.08)] pb-2">
                <span className="text-[rgba(255,255,255,0.5)]">Statut</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statutStyle[selected.statut]}`}>
                  {statutLabel[selected.statut]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[rgba(255,255,255,0.5)]">Date</span>
                <span className="text-white">
                  {selected.date ? new Date(selected.date).toLocaleDateString('fr-FR') : '—'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[rgba(255,255,255,0.08)]">
                <span className="text-[rgba(255,255,255,0.5)]">ID transaction</span>
                <span className="text-white font-mono text-xs">{selected.id}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
