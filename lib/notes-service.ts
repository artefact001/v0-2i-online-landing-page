/**
 * STAND BY — aucune route Laravel pour notes/favoris étudiants dans routes/api.php.
 * Fonctions désactivées en attendant le backend.
 */

export interface StudentNote {
  id: string
  student_id: string
  lesson_id: string
  content: string
  timestamp_seconds: number
  created_at: string
  updated_at: string
}

export interface Favorite {
  id: string
  student_id: string
  lesson_id: string
  formation_id: string
  created_at: string
}

function notReady(fn: string) {
  console.warn(`[notesService.${fn}] en attente d'un endpoint Laravel — fonctionnalité en pause`)
}

export const notesService = {
  async createNote(..._args: any[]): Promise<StudentNote | null> {
    notReady('createNote')
    return null
  },
  async getLessonNotes(..._args: any[]): Promise<StudentNote[]> {
    notReady('getLessonNotes')
    return []
  },
  async updateNote(..._args: any[]): Promise<StudentNote | null> {
    notReady('updateNote')
    return null
  },
  async deleteNote(..._args: any[]): Promise<boolean> {
    notReady('deleteNote')
    return false
  },
  async getAllStudentNotes(_studentId: string): Promise<StudentNote[]> {
    notReady('getAllStudentNotes')
    return []
  },
  async exportNotes(_studentId: string): Promise<string> {
    notReady('exportNotes')
    return ''
  },
}

export const favoritesService = {
  async addFavorite(..._args: any[]): Promise<Favorite | null> {
    notReady('addFavorite')
    return null
  },
  async removeFavorite(..._args: any[]): Promise<boolean> {
    notReady('removeFavorite')
    return false
  },
  async isFavorite(..._args: any[]): Promise<boolean> {
    notReady('isFavorite')
    return false
  },
  async getStudentFavorites(_studentId: string): Promise<Favorite[]> {
    notReady('getStudentFavorites')
    return []
  },
  async getFavoriteCount(_lessonId: string): Promise<number> {
    notReady('getFavoriteCount')
    return 0
  },
}
