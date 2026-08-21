'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { certificateService, type Certificate } from '@/lib/certificate-service';
import { apiClient } from '@/lib/api/client';
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Award } from 'lucide-react';

export default function CertificatesPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [formationNames, setFormationNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCertificates = async () => {
      if (!user?.id) return;

      try {
        const data = (await certificateService.getStudentCertificates(user.id)) as Certificate[] | undefined;
        const list = data || [];
        setCertificates(list);

        // Récupère le titre de chaque formation liée (le schéma certificats
        // ne stocke que formation_id, pas le titre directement).
        const names: Record<string, string> = {};
        await Promise.all(
          list.map(async (cert) => {
            if (names[cert.formation_id]) return;
            try {
              const res = await apiClient<{ titre: string }>(`/formations/${cert.formation_id}`);
              if (res.data) names[cert.formation_id] = res.data.titre;
            } catch {
              // ignore, on affichera un libellé générique
            }
          }),
        );
        setFormationNames(names);
      } catch (error) {
        console.error('Error loading certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, [user?.id]);

  const handleDownloadPDF = async (certificate: Certificate) => {
    try {
      const blob = await certificateService.generatePDF(certificate, {
        studentName: user?.name,
        formationName: formationNames[certificate.formation_id],
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificat-${certificate.numero_certificat}.pdf`;
      link.click();
    } catch (error) {
      console.error('Error downloading certificate:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Mes Certificats" subtitle="Tes diplômes et attestations obtenus" />

        <div className="p-4 md:p-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : certificates.length === 0 ? (
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="py-12 text-center">
                <Award className="w-12 h-12 text-[rgba(255,255,255,0.2)] mx-auto mb-4" />
                <p className="text-[rgba(255,255,255,0.6)]">Aucun certificat pour le moment.</p>
                <p className="text-sm text-[rgba(255,255,255,0.4)] mt-2">
                  Complète une formation pour obtenir un certificat.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {certificates.map((cert) => (
                <Card key={cert.id} className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="p-6 flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">
                        {formationNames[cert.formation_id] || 'Formation'}
                      </h3>
                      <p className="text-sm text-[rgba(255,255,255,0.5)] mt-2">
                        Obtenu le {new Date(cert.date_obtention).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-sm text-[#C9A227] font-mono mt-2">N° {cert.numero_certificat}</p>
                      <div className="mt-4">
                        <Button
                          onClick={() => handleDownloadPDF(cert)}
                          className="bg-[#C9A227] hover:bg-[#B8860B] text-white flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                    <div className="inline-block bg-[#C9A227]/20 text-[#C9A227] px-4 py-2 rounded font-bold text-sm">
                      Obtenu
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
