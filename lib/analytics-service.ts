import { createClient } from '@/lib/supabase/client';

export interface AnalyticsData {
  totalStudents: number;
  totalRevenue: number;
  totalEnrollments: number;
  activeUsers: number;
  completionRate: number;
  averageScore: number;
}

export interface FormationAnalytics {
  formationId: string;
  name: string;
  enrolledStudents: number;
  completedStudents: number;
  averageScore: number;
  revenue: number;
  completionRate: number;
}

export interface StudentAnalytics {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  enrollmentsCount: number;
  completedCourses: number;
  averageScore: number;
  lastActivity: string;
  totalTimeSpent: number;
}

export const analyticsService = {
  // Get admin dashboard analytics
  async getAdminAnalytics() {
    const supabase = createClient();

    // Total students
    const { count: totalStudents } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .eq('role', 'student');

    // Total revenue
    const { data: payments } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'paid');

    const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

    // Total enrollments
    const { count: totalEnrollments } = await supabase
      .from('enrollments')
      .select('id', { count: 'exact' });

    // Active users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: activeUsers } = await supabase
      .from('lesson_progress')
      .select('id', { count: 'exact' })
      .gte('updated_at', sevenDaysAgo.toISOString());

    // Completion rate
    const { data: completedEnrollments } = await supabase
      .from('enrollments')
      .select('id')
      .eq('status', 'completed');

    const completionRate = totalEnrollments 
      ? ((completedEnrollments?.length || 0) / totalEnrollments) * 100 
      : 0;

    // Average score
    const { data: attempts } = await supabase
      .from('quiz_attempts')
      .select('score');

    const averageScore = attempts && attempts.length > 0
      ? attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length
      : 0;

    return {
      totalStudents: totalStudents || 0,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalEnrollments: totalEnrollments || 0,
      activeUsers: activeUsers || 0,
      completionRate: Math.round(completionRate),
      averageScore: Math.round(averageScore),
    };
  },

  // Get formation-specific analytics
  async getFormationAnalytics(formationId: string): Promise<FormationAnalytics> {
    const supabase = createClient();

    const { data: formation } = await supabase
      .from('formations')
      .select('name')
      .eq('id', formationId)
      .single();

    const { count: enrolledStudents } = await supabase
      .from('enrollments')
      .select('id', { count: 'exact' })
      .eq('formation_id', formationId);

    const { count: completedStudents } = await supabase
      .from('enrollments')
      .select('id', { count: 'exact' })
      .eq('formation_id', formationId)
      .eq('status', 'completed');

    const { data: payments } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'paid');

    const revenue = payments
      ?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

    const { data: attempts } = await supabase
      .from('quiz_attempts')
      .select('score');

    const averageScore = attempts && attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length)
      : 0;

    const completionRate = enrolledStudents
      ? Math.round(((completedStudents || 0) / enrolledStudents) * 100)
      : 0;

    return {
      formationId,
      name: formation?.name || '',
      enrolledStudents: enrolledStudents || 0,
      completedStudents: completedStudents || 0,
      averageScore,
      revenue: Number(revenue.toFixed(2)),
      completionRate,
    };
  },

  // Get all formations analytics
  async getAllFormationsAnalytics() {
    const supabase = createClient();

    const { data: formations } = await supabase
      .from('formations')
      .select('id, name');

    if (!formations) return [];

    const analyticsPromises = formations.map((f) =>
      this.getFormationAnalytics(f.id)
    );

    return Promise.all(analyticsPromises);
  },

  // Get student-specific analytics
  async getStudentAnalytics(studentId: string): Promise<StudentAnalytics | null> {
    const supabase = createClient();

    const { data: student } = await supabase
      .from('profiles')
      .select('first_name, last_name, email')
      .eq('id', studentId)
      .single();

    if (!student) return null;

    const { count: enrollmentsCount } = await supabase
      .from('enrollments')
      .select('id', { count: 'exact' })
      .eq('student_id', studentId);

    const { count: completedCourses } = await supabase
      .from('enrollments')
      .select('id', { count: 'exact' })
      .eq('student_id', studentId)
      .eq('status', 'completed');

    const { data: attempts } = await supabase
      .from('quiz_attempts')
      .select('score')
      .eq('student_id', studentId);

    const averageScore = attempts && attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length)
      : 0;

    const { data: lastProgress } = await supabase
      .from('lesson_progress')
      .select('updated_at')
      .eq('student_id', studentId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    const { data: progressData } = await supabase
      .from('lesson_progress')
      .select('watch_time_seconds')
      .eq('student_id', studentId);

    const totalTimeSpent = progressData
      ?.reduce((sum, p) => sum + (p.watch_time_seconds || 0), 0) || 0;

    return {
      studentId,
      firstName: student.first_name || '',
      lastName: student.last_name || '',
      email: student.email,
      enrollmentsCount: enrollmentsCount || 0,
      completedCourses: completedCourses || 0,
      averageScore,
      lastActivity: lastProgress?.updated_at || '',
      totalTimeSpent: Math.round(totalTimeSpent / 3600), // Convert to hours
    };
  },

  // Export analytics as CSV
  async exportAnalyticsCSV(data: any[]): Promise<Blob> {
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((h) => `"${row[h]}"`).join(',')
      ),
    ].join('\n');

    return new Blob([csv], { type: 'text/csv' });
  },

  // Get payment history
  async getPaymentHistory(limit = 50) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        student:profiles(first_name, last_name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },
};
