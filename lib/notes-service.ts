import { apiClient } from '@/lib/api/client'

/**
 * Connecté au vrai backend (NoteController/FavoriController).
 * notes: user_id, lecon_id, content, timestamp_seconds
 * favoris: user_id, lecon_id, formation_id
 */

export interface StudentNote {
  id: string
  user_id: string
  lecon_id: string
  content: string
  timestamp_seconds: number
  created_at: string
  updated_at: string
}

export interface Favorite {
  id: string
  user_id: string
  lecon_id: string
  formation_id: string
  created_at: string
}

export const notesService = {
  // POST /v1/notes
  async createNote(leconId: string, content: string, timestampSeconds = 0): Promise<StudentNote | null> {
    try {
      const res = await apiClient<StudentNote>('/notes', {
        method: 'POST',
        body: JSON.stringify({ lecon_id: leconId, content, timestamp_seconds: timestampSeconds }),
      })
      return res.data ?? null
    } catch (error) {
      console.error('[notesService.createNote]', error)
      return null
    }
  },

  // GET /v1/notes?lecon_id=...
  async getLessonNotes(leconId: string): Promise<StudentNote[]> {
    try {
      const res = await apiClient<StudentNote[]>(`/notes?lecon_id=${leconId}`)
      return res.data || []
    } catch (error) {
      console.error('[notesService.getLessonNotes]', error)
      return []
    }
  },

  // PUT /v1/notes/{id}
  async updateNote(noteId: string, content: string): Promise<StudentNote | null> {
    try {
      const res = await apiClient<StudentNote>(`/notes/${noteId}`, {
        method: 'PUT',
        body: JSON.stringify({ content }),
      })
      return res.data ?? null
    } catch (error) {
      console.error('[notesService.updateNote]', error)
      return null
    }
  },

  // DELETE /v1/notes/{id}
  async deleteNote(noteId: string): Promise<boolean> {
    try {
      await apiClient(`/notes/${noteId}`, { method: 'DELETE' })
      return true
    } catch (error) {
      console.error('[notesService.deleteNote]', error)
      return false
    }
  },
}

export const favoritesService = {
  // POST /v1/favoris
  async addFavorite(leconId: string, formationId: string): Promise<Favorite | null> {
    try {
      const res = await apiClient<Favorite>('/favoris', {
        method: 'POST',
        body: JSON.stringify({ lecon_id: leconId, formation_id: formationId }),
      })
      return res.data ?? null
    } catch (error) {
      console.error('[favoritesService.addFavorite]', error)
      return null
    }
  },

  // DELETE /v1/favoris/{id}
  async removeFavorite(favoriId: string): Promise<boolean> {
    try {
      await apiClient(`/favoris/${favoriId}`, { method: 'DELETE' })
      return true
    } catch (error) {
      console.error('[favoritesService.removeFavorite]', error)
      return false
    }
  },

  // GET /v1/favoris (filtré côté client sur lecon_id, pas de filtre serveur dédié)
  async getStudentFavorites(): Promise<Favorite[]> {
    try {
      const res = await apiClient<Favorite[]>('/favoris')
      return res.data || []
    } catch (error) {
      console.error('[favoritesService.getStudentFavorites]', error)
      return []
    }
  },

  async isFavorite(leconId: string): Promise<Favorite | null> {
    const all = await this.getStudentFavorites()
    return all.find((f) => f.lecon_id === leconId) ?? null
  },
}
