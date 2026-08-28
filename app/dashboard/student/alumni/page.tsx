'use client'

import { useEffect, useState } from 'react'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { alumniService } from '@/lib/alumni-service'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { alertSuccess, alertError } from '@/lib/alerts'
import { Users } from 'lucide-react'

export default function StudentAlumniSettingsPage() {
  const { user } = useAuth()
  const [visible, setVisible] = useState(false)
  const [posteActuel, setPosteActuel] = useState('')
  const [entrepriseActuelle, setEntrepriseActuelle] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await alumniService.updateVisibilite({
        alumni_visible: visible,
        poste_actuel: posteActuel || undefined,
        entreprise_actuelle: entrepriseActuelle || undefined,
      })
      alertSuccess('Préférences alumni mises à jour avec succès.')
    } catch (err: any) {
      alertError(err?.message || 'Erreur lors de la mise à jour')
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Espace Alumni" subtitle="Choisis d'apparaître ou non dans l'annuaire public" />

        <div className="p-4 md:p-8 max-w-xl">
          <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-[#C9A227]" />
                <p className="text-white font-semibold">Visibilité dans l&apos;annuaire</p>
              </div>

              <div className="flex items-center justify-between bg-[rgba(255,255,255,0.03)] rounded-lg p-4">
                <div>
                  <p className="text-white text-sm">Apparaître dans l&apos;annuaire alumni public</p>
                  <p className="text-[rgba(255,255,255,0.4)] text-xs mt-1">
                    Visible par tous les visiteurs du site — désactivé par défaut.
                  </p>
                </div>
                <Switch checked={visible} onCheckedChange={setVisible} />
              </div>

              {visible && (
                <>
                  <div className="space-y-2">
                    <Label className="text-[rgba(255,255,255,0.7)]">Poste actuel</Label>
                    <Input
                      value={posteActuel}
                      onChange={(e) => setPosteActuel(e.target.value)}
                      placeholder="Ex: Chef de partie"
                      className="bg-[#0a0a1a] border-[rgba(255,255,255,0.1)] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[rgba(255,255,255,0.7)]">Entreprise actuelle</Label>
                    <Input
                      value={entrepriseActuelle}
                      onChange={(e) => setEntrepriseActuelle(e.target.value)}
                      placeholder="Ex: Hôtel Terrou-Bi"
                      className="bg-[#0a0a1a] border-[rgba(255,255,255,0.1)] text-white"
                    />
                  </div>
                </>
              )}

              <Button onClick={handleSave} disabled={saving} className="bg-[#C9A227] hover:bg-[#B8860B] w-full">
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
