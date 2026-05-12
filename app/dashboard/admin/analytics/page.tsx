'use client';

import { useState, useEffect } from 'react';
import { analyticsService } from '@/lib/analytics-service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

  if (loading) {
    return <div className="p-8">Chargement des données...</div>;
  }

  if (!analytics) {
    return <div className="p-8">Erreur lors du chargement</div>;
  }

  const chartData = formations.map(f => ({
    name: f.name,
    enrollments: f.enrolledStudents,
    completed: f.completedStudents,
    revenue: Math.round(f.revenue),
  }));

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#0D2545]">Analytiques</h1>
        <Button className="bg-[#0D2545] hover:bg-[#0a1d2e] flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exporter rapport
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 mb-2">Étudiants Total</p>
              <p className="text-3xl font-bold text-[#0D2545]">{analytics.totalStudents}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-[#C9A227]" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
          <div>
            <p className="text-sm text-gray-600 mb-2">Revenus Total</p>
            <p className="text-3xl font-bold text-[#0D2545]">{analytics.totalRevenue.toLocaleString()} XOF</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
          <div>
            <p className="text-sm text-gray-600 mb-2">Inscriptions</p>
            <p className="text-3xl font-bold text-[#0D2545]">{analytics.totalEnrollments}</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100">
          <div>
            <p className="text-sm text-gray-600 mb-2">Utilisateurs Actifs (7j)</p>
            <p className="text-3xl font-bold text-[#0D2545]">{analytics.activeUsers}</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-pink-50 to-pink-100">
          <div>
            <p className="text-sm text-gray-600 mb-2">Taux Complément</p>
            <p className="text-3xl font-bold text-[#0D2545]">{analytics.completionRate}%</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div>
            <p className="text-sm text-gray-600 mb-2">Score Moyen</p>
            <p className="text-3xl font-bold text-[#0D2545]">{analytics.averageScore}%</p>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-[#0D2545] mb-4">Inscriptions par Formation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="enrollments" fill="#0D2545" name="Inscrits" />
              <Bar dataKey="completed" fill="#C9A227" name="Terminés" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-[#0D2545] mb-4">Revenus par Formation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#C9A227" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Formations Table */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-[#0D2545] mb-4">Performance des Formations</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-bold">Formation</th>
                <th className="text-left py-3 px-4 font-bold">Inscrits</th>
                <th className="text-left py-3 px-4 font-bold">Terminés</th>
                <th className="text-left py-3 px-4 font-bold">Taux</th>
                <th className="text-left py-3 px-4 font-bold">Score Moyen</th>
                <th className="text-left py-3 px-4 font-bold">Revenus</th>
              </tr>
            </thead>
            <tbody>
              {formations.map((f) => (
                <tr key={f.formationId} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{f.name}</td>
                  <td className="py-3 px-4">{f.enrolledStudents}</td>
                  <td className="py-3 px-4">{f.completedStudents}</td>
                  <td className="py-3 px-4">{f.completionRate}%</td>
                  <td className="py-3 px-4">{f.averageScore}%</td>
                  <td className="py-3 px-4 font-bold text-[#C9A227]">{f.revenue.toLocaleString()} XOF</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
