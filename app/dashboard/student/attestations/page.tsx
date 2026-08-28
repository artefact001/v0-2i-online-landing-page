'use client'

import { useEffect, useState } from 'react'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { presenceService, type Attestation } from '@/lib/presence-service'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileCheck, Download } from 'lucide-react'

export default function StudentAttestationsPage() {
  const [attestations, setAttestations] = useState<Attestation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    presenceService.getMesAttestations().then((a) => {
      setAttestations(a)
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Mes attestations" subtitle="Attestations de présence à tes sessions live" />

        <div className="p-4 md:p-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : attestations.length === 0 ? (
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="py-12 text-center">
                <FileCheck className="w-10 h-10 text-[rgba(255,255,255,0.2)] mx-auto mb-3" />
                <p className="text-[rgba(255,255,255,0.5)]">Aucune attestation pour le moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {attestations.map((a) => (
                <Card key={a.id} className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="p-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-semibold">{a.liveSession?.title}</h3>
                      <p className="text-[rgba(255,255,255,0.5)] text-sm mt-1">
                        {a.liveSession?.formation?.titre} · Délivrée le {new Date(a.date_delivrance).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-[#C9A227] font-mono text-xs mt-1">N° {a.numero_attestation}</p>
                    </div>
                    {a.fichier_pdf_url && (
                      <a href={a.fichier_pdf_url} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-[#C9A227] hover:bg-[#B8860B] text-white flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Télécharger
                        </Button>
                      </a>
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
