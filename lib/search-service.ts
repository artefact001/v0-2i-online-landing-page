/**
 * STAND BY — aucune route Laravel de recherche full-text dans routes/api.php.
 * Fonctions désactivées en attendant le backend (ou un filtrage manuel via
 * GET /v1/formations, /v1/lecons avec des query params, si suffisant).
 */

export interface SearchResult {
  id: string
  type: 'lesson' | 'formation' | 'post' | 'resource'
  title: string
  description?: string
  url: string
}

function notReady(fn: string) {
  console.warn(`[searchService.${fn}] en attente d'un endpoint Laravel — fonctionnalité en pause`)
}

export const searchService = {
  async search(_query: string, _filters?: any): Promise<SearchResult[]> {
    notReady('search')
    return []
  },
  async searchAdvanced(..._args: any[]): Promise<SearchResult[]> {
    notReady('searchAdvanced')
    return []
  },
  async getTrendingSearches(): Promise<string[]> {
    notReady('getTrendingSearches')
    return []
  },
  async getSuggestions(_query: string): Promise<string[]> {
    notReady('getSuggestions')
    return []
  },
  async searchByCategory(..._args: any[]): Promise<SearchResult[]> {
    notReady('searchByCategory')
    return []
  },
  async getCategories(): Promise<string[]> {
    notReady('getCategories')
    return []
  },
}
