'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { certificateService } from '@/lib/certificate-service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';

export default function CertificatesPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCertificates = async () => {
      if (!user?.id) return;

      try {
        const data = await certificateService.getStudentCertificates(user.id);
        setCertificates(data || []);
      } catch (error) {
        console.error('Error loading certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, [user?.id]);

  const handleDownloadPDF = async (certificate: any) => {
    try {
      const blob = await certificateService.generatePDF(certificate);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificat-${certificate.certificate_number}.pdf`;
      link.click();
    } catch (error) {
      console.error('Error downloading certificate:', error);
    }
  };

  if (loading) {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-[#0D2545] mb-6">Mes Certificats</h1>

      {certificates.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">Aucun certificat pour le moment.</p>
          <p className="text-sm text-gray-500 mt-2">Complétez une formation pour obtenir un certificat</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {certificates.map((cert) => (
            <Card key={cert.id} className="p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#0D2545]">
                    {cert.formation?.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Émis le {new Date(cert.issue_date).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-sm text-[#C9A227] font-mono mt-2">
                    N° {cert.certificate_number}
                  </p>
                  <div className="mt-4 flex gap-3">
                    <Button
                      onClick={() => handleDownloadPDF(cert)}
                      className="bg-[#0D2545] hover:bg-[#0a1d2e] text-white flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Aperçu
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-block bg-[#C9A227] text-[#0D2545] px-4 py-2 rounded font-bold">
                    Validé
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
