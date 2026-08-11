/**
 * STAND BY — aucune route Laravel pour badges/achievements/points/leaderboard
 * dans routes/api.php. Fonctions désactivées en attendant le backend.
 */

export interface Badge {
  id: string
  slug: string
  name: string
  description: string
  icon_url: string
  requirement_type: 'lessons_completed' | 'quiz_score' | 'streak' | 'participation'
  requirement_value: number
}

export interface StudentBadge {
  id: string
  student_id: string
  badge_id: string
  unlocked_at: string
}

export interface Achievement {
  id: string
  student_id: string
  title: string
  description: string
  points: number
  created_at: string
}

function notReady(fn: string) {
  console.warn(`[gamification.${fn}] en attente d'un endpoint Laravel — fonctionnalité en pause`)
}

export const badgeService = {
  async getAllBadges(): Promise<Badge[]> {
    notReady('getAllBadges')
    return []
  },
  async getStudentBadges(_studentId: string): Promise<StudentBadge[]> {
    notReady('getStudentBadges')
    return []
  },
  async unlockBadge(..._args: any[]): Promise<StudentBadge | null> {
    notReady('unlockBadge')
    return null
  },
  async checkBadgeEligibility(..._args: any[]): Promise<Badge[]> {
    notReady('checkBadgeEligibility')
    return []
  },
  async awardBadgesForAchievement(..._args: any[]): Promise<Badge[]> {
    notReady('awardBadgesForAchievement')
    return []
  },
}

export const achievementService = {
  async addAchievement(..._args: any[]): Promise<Achievement | null> {
    notReady('addAchievement')
    return null
  },
  async getStudentAchievements(_studentId: string): Promise<Achievement[]> {
    notReady('getStudentAchievements')
    return []
  },
  async getStudentPoints(_studentId: string): Promise<number> {
    notReady('getStudentPoints')
    return 0
  },
  async getLeaderboard(..._args: any[]): Promise<any[]> {
    notReady('getLeaderboard')
    return []
  },
  async awardPoints(..._args: any[]): Promise<boolean> {
    notReady('awardPoints')
    return false
  },
  async getMilestones(): Promise<any[]> {
    notReady('getMilestones')
    return []
  },
  async getStudentMilestoneProgress(_studentId: string): Promise<any[]> {
    notReady('getStudentMilestoneProgress')
    return []
  },
}
