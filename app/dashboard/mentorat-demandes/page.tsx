'use client'

import { useEffect, useState } from 'react'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { mentoratService, type Mentorat } from '@/lib/mentorat-service'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { alertSuccess, alertError } from '@/lib/alerts'
import { Users } from 'lucide-react'

/**
 * Demandes de mentorat reçues — accessible aux formateurs ET aux
 * étudiants (un alumni peut aussi être sollicité comme mentor), placée
 * hors des dossiers spécifiques à un rôle.
 */
export default function MentoratDemandesPage() {
  const { user } = useAuth()
  const [demandes, setDemandes] = useState<Mentorat[]>([])
  const [loading, setLoading] = useState(true)
  const [disponible, setDisponible] = useState(false)
  const [savingDispo, setSavingDispo] = useState(false)

  async function load() {
    const [data, mentors] = await Promise.all([
      mentoratService.getDemandesRecues(),
      mentoratService.getMentorsDisponibles(),
    ])
    setDemandes(data)
    setDisponible(mentors.some((m) => m.userId === user?.id))
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [user])

  async function handleToggleDisponibilite(checked: boolean) {
    setSavingDispo(true)
    setDisponible(checked)
    try {
      await mentoratService.updateDisponibilite(checked)
      alertSuccess(checked ? 'Tu es maintenant visible comme mentor disponible.' : 'Tu ne seras plus proposé comme mentor.')
    } catch (err: any) {
      setDisponible(!checked)
      alertError(err?.message || 'Erreur lors de la mise à jour')
    }
    setSavingDispo(false)
  }

  async function handleUpdate(id: string, statut: Mentorat['statut']) {
    try {
      await mentoratService.updateStatut(id, statut)
      await load()
      alertSuccess(statut === 'actif' ? 'Demande acceptée avec succès.' : 'Demande refusée.')
    } catch (err: any) {
      alertError(err?.message || 'Erreur')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Demandes de mentorat" subtitle="Étudiants souhaitant être accompagnés par toi" />

        <div className="p-4 md:p-8 space-y-6">
          {user?.role === 'professor' && (
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-white text-sm font-medium">Disponible pour du mentorat</p>
                  <p className="text-[rgba(255,255,255,0.4)] text-xs mt-1">
                    Active pour apparaître dans la liste des mentors proposés aux étudiants.
                  </p>
                </div>
                <Switch checked={disponible} disabled={savingDispo} onCheckedChange={handleToggleDisponibilite} />
              </CardContent>
            </Card>
          )}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : demandes.length === 0 ? (
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="py-12 text-center">
                <Users className="w-10 h-10 text-[rgba(255,255,255,0.2)] mx-auto mb-3" />
                <p className="text-[rgba(255,255,255,0.5)]">Aucune demande de mentorat pour le moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {demandes.map((d) => (
                <Card key={d.id} className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-white font-medium">{d.mentore?.prenom} {d.mentore?.nom}</p>
                      {d.message_demande && <p className="text-[rgba(255,255,255,0.5)] text-sm mt-1">{d.message_demande}</p>}
                    </div>
                    {d.statut === 'en_attente' ? (
                      <div className="flex gap-2 shrink-0">
                        <Button size="sm" onClick={() => handleUpdate(d.id, 'actif')} className="bg-[#C9A227] hover:bg-[#B8860B]">
                          Accepter
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleUpdate(d.id, 'refuse')} className="border-red-500/20 text-red-400 hover:bg-red-500/10">
                          Refuser
                        </Button>
                      </div>
                    ) : (
                      <span
                        className={`text-xs px-3 py-1 rounded-full shrink-0 ${
                          d.statut === 'actif' ? 'bg-green-500/20 text-green-400' : d.statut === 'refuse' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {d.statut === 'actif' ? 'Actif' : d.statut === 'refuse' ? 'Refusé' : 'Terminé'}
                      </span>
                    )}
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
