import { createClient } from '@/lib/supabase/client';

export interface Badge {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon_url: string;
  requirement_type: 'lessons_completed' | 'quiz_score' | 'streak' | 'participation';
  requirement_value: number;
}

export interface StudentBadge {
  id: string;
  student_id: string;
  badge_id: string;
  unlocked_at: string;
}

export interface Achievement {
  id: string;
  student_id: string;
  title: string;
  description: string;
  points: number;
  created_at: string;
}

export const badgeService = {
  // Get all available badges
  async getAllBadges(): Promise<Badge[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('badges')
      .select('*');

    if (error) throw error;
    return data as Badge[];
  },

  // Get student badges
  async getStudentBadges(studentId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('student_badges')
      .select(`
        *,
        badge:badges(*)
      `)
      .eq('student_id', studentId)
      .order('unlocked_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Unlock badge
  async unlockBadge(studentId: string, badgeSlug: string) {
    const supabase = createClient();

    // Get badge
    const { data: badge } = await supabase
      .from('badges')
      .select('id')
      .eq('slug', badgeSlug)
      .single();

    if (!badge) return;

    // Check if already unlocked
    const { data: existing } = await supabase
      .from('student_badges')
      .select('id')
      .eq('student_id', studentId)
      .eq('badge_id', badge.id)
      .single();

    if (existing) return;

    // Unlock badge
    const { error } = await supabase
      .from('student_badges')
      .insert([{
        student_id: studentId,
        badge_id: badge.id,
        unlocked_at: new Date().toISOString(),
      }]);

    if (error) throw error;
  },

  // Check badge eligibility
  async checkBadgeEligibility(studentId: string, badgeSlug: string): Promise<boolean> {
    const supabase = createClient();

    const { data: badge } = await supabase
      .from('badges')
      .select('*')
      .eq('slug', badgeSlug)
      .single();

    if (!badge) return false;

    switch (badge.requirement_type) {
      case 'lessons_completed': {
        const { count } = await supabase
          .from('lesson_progress')
          .select('id', { count: 'exact' })
          .eq('student_id', studentId)
          .eq('is_completed', true);

        return (count || 0) >= badge.requirement_value;
      }

      case 'quiz_score': {
        const { data: attempts } = await supabase
          .from('quiz_attempts')
          .select('score')
          .eq('student_id', studentId);

        return attempts?.some(a => (a.score || 0) >= badge.requirement_value) ?? false;
      }

      case 'streak': {
        // Check if student has consecutive days of activity
        const { data: activity } = await supabase
          .from('lesson_progress')
          .select('updated_at')
          .eq('student_id', studentId)
          .order('updated_at', { ascending: false })
          .limit(badge.requirement_value);

        if (!activity || activity.length < badge.requirement_value) return false;

        // Check if dates are consecutive
        let streak = 1;
        for (let i = 1; i < activity.length; i++) {
          const prev = new Date(activity[i - 1].updated_at);
          const curr = new Date(activity[i].updated_at);
          const dayDiff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
          if (dayDiff <= 1) streak++;
          else break;
        }

        return streak >= badge.requirement_value;
      }

      case 'participation': {
        const { count } = await supabase
          .from('forum_posts')
          .select('id', { count: 'exact' })
          .eq('author_id', studentId);

        return (count || 0) >= badge.requirement_value;
      }

      default:
        return false;
    }
  },

  // Award multiple badges based on achievement
  async awardBadgesForAchievement(studentId: string) {
    const badges = await this.getAllBadges();

    for (const badge of badges) {
      const eligible = await this.checkBadgeEligibility(studentId, badge.slug);
      if (eligible) {
        await this.unlockBadge(studentId, badge.slug);
      }
    }
  },
};

export const achievementService = {
  // Add achievement
  async addAchievement(studentId: string, title: string, description: string, points: number) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('achievements')
      .insert([{
        student_id: studentId,
        title,
        description,
        points,
      }])
      .select()
      .single();

    if (error) throw error;
    return data as Achievement;
  },

  // Get student achievements
  async getStudentAchievements(studentId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Achievement[];
  },

  // Get student points
  async getStudentPoints(studentId: string): Promise<number> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('achievements')
      .select('points')
      .eq('student_id', studentId);

    if (error) throw error;
    return data?.reduce((sum, a) => sum + (a.points || 0), 0) || 0;
  },

  // Get leaderboard
  async getLeaderboard(limit = 50) {
    const supabase = createClient();
    
    // Get top students by points
    const { data, error } = await supabase
      .rpc('get_top_students_by_points', { limit_count: limit });

    if (error) throw error;
    return data;
  },

  // Award points
  async awardPoints(studentId: string, points: number, reason: string) {
    return this.addAchievement(studentId, `Bonus de ${points} points`, reason, points);
  },

  // Get milestones
  async getMilestones(): Promise<{ points: number; title: string; description: string }[]> {
    return [
      { points: 10, title: 'Premiers pas', description: 'Gagnez 10 points' },
      { points: 50, title: 'Apprenant', description: 'Atteignez 50 points' },
      { points: 100, title: 'Étudiant assidu', description: 'Atteignez 100 points' },
      { points: 250, title: 'Expert', description: 'Atteignez 250 points' },
      { points: 500, title: 'Maître', description: 'Atteignez 500 points' },
      { points: 1000, title: 'Légendaire', description: 'Atteignez 1000 points' },
    ];
  },

  // Get student milestone progress
  async getStudentMilestoneProgress(studentId: string) {
    const points = await this.getStudentPoints(studentId);
    const milestones = await this.getMilestones();

    return {
      currentPoints: points,
      nextMilestone: milestones.find(m => m.points > points),
      completedMilestones: milestones.filter(m => m.points <= points),
    };
  },
};
