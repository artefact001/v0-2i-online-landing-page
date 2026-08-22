'use client';

import { useState, useEffect } from 'react';
import { analyticsService } from '@/lib/analytics-service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [formations, setFormations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const adminAnalytics = await analyticsService.getAdminAnalytics();
        setAnalytics(adminAnalytics);

        const formationsAnalytics = await analyticsService.getAllFormationsAnalytics();
        setFormations(formationsAnalytics);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

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
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : !analytics ? (
            <p className="text-[rgba(255,255,255,0.5)] text-center py-12">Erreur lors du chargement</p>
          ) : (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <Card className="p-6 bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-[rgba(255,255,255,0.5)] mb-2">Étudiants Total</p>
                      <p className="text-3xl font-bold text-white">{analytics.totalStudents}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-[#C9A227]" />
                  </div>
                </Card>

                <Card className="p-6 bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <p className="text-sm text-[rgba(255,255,255,0.5)] mb-2">Revenus Total</p>
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
