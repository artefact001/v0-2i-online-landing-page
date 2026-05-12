import { createClient } from '@/lib/supabase/client';

export interface SearchResult {
  id: string;
  type: 'lesson' | 'formation' | 'post' | 'resource';
  title: string;
  description?: string;
  url: string;
}

export const searchService = {
  // Full-text search
  async search(query: string, filters?: {
    type?: 'lesson' | 'formation' | 'post';
    formationId?: string;
    difficulty?: string;
  }): Promise<SearchResult[]> {
    if (!query.trim()) return [];

    const supabase = createClient();
    const results: SearchResult[] = [];

    // Search lessons
    if (!filters?.type || filters.type === 'lesson') {
      const { data: lessons } = await supabase
        .from('lessons')
        .select('id, title, description')
        .ilike('title', `%${query}%`)
        .limit(5);

      lessons?.forEach((lesson) => {
        results.push({
          id: lesson.id,
          type: 'lesson',
          title: lesson.title,
          description: lesson.description,
          url: `/courses/${lesson.id}`,
        });
      });
    }

    // Search formations
    if (!filters?.type || filters.type === 'formation') {
      const { data: formations } = await supabase
        .from('formations')
        .select('id, name, short_description, slug')
        .ilike('name', `%${query}%`)
        .limit(5);

      formations?.forEach((formation) => {
        results.push({
          id: formation.id,
          type: 'formation',
          title: formation.name,
          description: formation.short_description,
          url: `/courses/${formation.slug}`,
        });
      });
    }

    // Search forum posts
    if (!filters?.type || filters.type === 'post') {
      const { data: posts } = await supabase
        .from('forum_posts')
        .select('id, title, content')
        .ilike('title', `%${query}%`)
        .limit(5);

      posts?.forEach((post) => {
        results.push({
          id: post.id,
          type: 'post',
          title: post.title,
          description: post.content?.substring(0, 100),
          url: `/dashboard/forum/${post.id}`,
        });
      });
    }

    return results;
  },

  // Advanced filtering
  async searchAdvanced(filters: {
    query?: string;
    formationId?: string;
    difficulty?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    const supabase = createClient();

    let query = supabase.from('formations').select('*');

    if (filters.query) {
      query = query.ilike('name', `%${filters.query}%`);
    }

    if (filters.difficulty) {
      query = query.eq('level', filters.difficulty);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  // Get trending searches
  async getTrendingSearches(): Promise<string[]> {
    return [
      'CAP Cuisine',
      'Service Restaurant',
      'Hygiène alimentaire',
      'Sommellerie',
      'Management',
    ];
  },

  // Get search suggestions
  async getSuggestions(query: string): Promise<string[]> {
    if (!query.trim()) return [];

    const supabase = createClient();

    const { data: formations } = await supabase
      .from('formations')
      .select('name')
      .ilike('name', `%${query}%`)
      .limit(5);

    const { data: lessons } = await supabase
      .from('lessons')
      .select('title')
      .ilike('title', `%${query}%`)
      .limit(5);

    const suggestions = [
      ...(formations?.map(f => f.name) || []),
      ...(lessons?.map(l => l.title) || []),
    ];

    return [...new Set(suggestions)]; // Remove duplicates
  },

  // Search by category
  async searchByCategory(category: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('formations')
      .select('*')
      .eq('category', category);

    if (error) throw error;
    return data;
  },

  // Get all categories
  async getCategories() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('formations')
      .select('category')
      .distinct();

    if (error) throw error;
    return data?.map(d => d.category).filter(Boolean) || [];
  },
};
