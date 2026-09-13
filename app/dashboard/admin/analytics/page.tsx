'use client';

import { useState, useEffect } from 'react';
import { analyticsService } from '@/lib/analytics-service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, FileDown } from 'lucide-react';
import { alertError } from '@/lib/alerts';

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [formations, setFormations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Vide = vue globale (tout l'historique) — au format YYYY-MM attendu
  // par le backend (?month=...) une fois renseigné.
  const [month, setMonth] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const adminAnalytics = await analyticsService.getAdminAnalytics(month || undefined);
        setAnalytics(adminAnalytics);

        const formationsAnalytics = await analyticsService.getAllFormationsAnalytics(month || undefined);
        setFormations(formationsAnalytics);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [month]);

  async function handleExportPdf() {
    setExporting(true);
    try {
      await analyticsService.exportPdf(month || undefined);
    } catch (error: any) {
      alertError(error?.message || "Erreur lors de l'export du PDF");
    }
    setExporting(false);
  }

  const chartData = formations.map(f => ({
    name: f.name,
    enrollments: f.enrolledStudents,
    completed: f.completedStudents,
    revenue: Math.round(f.revenue),
  }));

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Analytiques" subtitle="Vue d'ensemble des performances de la plateforme" />

        <div className="p-4 md:p-8">
          {/* Filtre par mois + export PDF — le PDF est pensé pour être
              partagé hors plateforme (email à un partenaire, par
              exemple), pas seulement consulté en ligne. */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-6">
            <div className="flex-1 max-w-[200px]">
              <label className="text-xs text-[rgba(255,255,255,0.5)] mb-1.5 block">Filtrer par mois</label>
              <Input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
              />
            </div>
            {month && (
              <Button variant="outline" onClick={() => setMonth('')} className="border-[rgba(255,255,255,0.2)] text-white">
                Voir tout l&apos;historique
              </Button>
            )}
            <Button onClick={handleExportPdf} disabled={exporting} className="bg-[#C9A227] hover:bg-[#B8860B] text-[#0a0a1a] font-semibold sm:ml-auto">
              <FileDown className="w-4 h-4 mr-2" />
              {exporting ? 'Génération...' : 'Exporter en PDF'}
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : !analytics ? (
            <p className="text-[rgba(255,255,255,0.5)] text-center py-12">Erreur lors du chargement</p>
          ) : (
            <>
              {/* KPI Cards */}
              {month && (
                <p className="text-xs text-[#C9A227] mb-3 uppercase tracking-wide">
                  Données du mois sélectionné — les comptes actifs restent une mesure globale
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <Card className="p-6 bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-[rgba(255,255,255,0.5)] mb-2">{month ? 'Nouveaux apprenants' : 'Étudiants Total'}</p>
                      <p className="text-3xl font-bold text-white">{analytics.totalStudents}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-[#C9A227]" />
                  </div>
                </Card>

                <Card className="p-6 bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <p className="text-sm text-[rgba(255,255,255,0.5)] mb-2">{month ? 'Revenus du mois' : 'Revenus Total'}</p>
                  <p className="text-3xl font-bold text-white">{analytics.totalRevenue.toLocaleString()} FCFA</p>
                </Card>

                <Card className="p-6 bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <p className="text-sm text-[rgba(255,255,255,0.5)] mb-2">Inscriptions</p>
                  <p className="text-3xl font-bold text-white">{analytics.totalEnrollments}</p>
                </Card>

                <Card className="p-6 bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <p className="text-sm text-[rgba(255,255,255,0.5)] mb-2">Comptes actifs</p>
                  <p className="text-3xl font-bold text-white">{analytics.activeUsers}</p>
                </Card>

                <Card className="p-6 bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <p className="text-sm text-[rgba(255,255,255,0.5)] mb-2">Taux de réussite</p>
                  <p className="text-3xl font-bold text-white">{analytics.completionRate}%</p>
                </Card>

                <Card className="p-6 bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <p className="text-sm text-[rgba(255,255,255,0.5)] mb-2">Score Moyen</p>
                  <p className="text-3xl font-bold text-white">{analytics.averageScore}/20</p>
                </Card>
              </div>

              {/* Charts */}
              {chartData.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card className="p-6 bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                    <h3 className="text-lg font-bold text-white mb-4">Inscriptions par Formation</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                        <YAxis stroke="rgba(255,255,255,0.5)" />
                        <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: 'none', color: '#fff' }} />
                        <Legend />
                        <Bar dataKey="enrollments" fill="#C9A227" name="Inscrits" />
                        <Bar dataKey="completed" fill="#4ade80" name="Terminés" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>

                  <Card className="p-6 bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                    <h3 className="text-lg font-bold text-white mb-4">Revenus par Formation</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                        <YAxis stroke="rgba(255,255,255,0.5)" />
                        <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: 'none', color: '#fff' }} />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#C9A227" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </div>
              )}

              {/* Formations Table */}
              <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Performance des Formations</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-[rgba(255,255,255,0.05)]">
                          <th className="py-3 px-4 text-[rgba(255,255,255,0.4)] text-xs uppercase">Formation</th>
                          <th className="py-3 px-4 text-[rgba(255,255,255,0.4)] text-xs uppercase">Inscrits</th>
                          <th className="py-3 px-4 text-[rgba(255,255,255,0.4)] text-xs uppercase">Terminés</th>
                          <th className="py-3 px-4 text-[rgba(255,255,255,0.4)] text-xs uppercase">Taux</th>
                          <th className="py-3 px-4 text-[rgba(255,255,255,0.4)] text-xs uppercase">Revenus</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formations.map((f) => (
                          <tr key={f.formationId} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)]">
                            <td className="py-3 px-4 text-white">{f.name}</td>
                            <td className="py-3 px-4 text-[rgba(255,255,255,0.7)]">{f.enrolledStudents}</td>
                            <td className="py-3 px-4 text-[rgba(255,255,255,0.7)]">{f.completedStudents}</td>
                            <td className="py-3 px-4 text-[rgba(255,255,255,0.7)]">{f.completionRate}%</td>
                            <td className="py-3 px-4 font-bold text-[#C9A227]">{f.revenue.toLocaleString()} FCFA</td>
                          </tr>
                        ))}
                        {formations.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-[rgba(255,255,255,0.4)]">
                              Aucune donnée disponible
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
