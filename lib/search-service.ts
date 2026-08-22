import { apiClient } from '@/lib/api/client'

/**
 * Connecté au vrai backend (SearchController) — recherche simple (LIKE)
 * à travers formations/leçons/actus/opportunités. GET /v1/search?q=...
 */

export interface SearchResult {
  id: string
  type: 'lesson' | 'formation' | 'post' | 'resource'
  title: string
  description?: string
  url: string
}

export const searchService = {
  async search(query: string): Promise<SearchResult[]> {
    if (query.trim().length < 2) return []
    try {
      const res = await apiClient<SearchResult[]>(`/search?q=${encodeURIComponent(query)}`)
      return res.data || []
    } catch (error) {
      console.error('[searchService.search]', error)
      return []
    }
  },
}
