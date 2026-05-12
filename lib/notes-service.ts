import { createClient } from '@/lib/supabase/client';

export interface StudentNote {
  id: string;
  student_id: string;
  lesson_id: string;
  content: string;
  timestamp_seconds: number;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  student_id: string;
  lesson_id: string;
  formation_id: string;
  created_at: string;
}

export const notesService = {
  // Create note
  async createNote(studentId: string, lessonId: string, content: string, timestampSeconds: number) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('student_notes')
      .insert([{
        student_id: studentId,
        lesson_id: lessonId,
        content,
        timestamp_seconds: timestampSeconds,
      }])
      .select()
      .single();

    if (error) throw error;
    return data as StudentNote;
  },

  // Get notes for lesson
  async getLessonNotes(studentId: string, lessonId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('student_notes')
      .select('*')
      .eq('student_id', studentId)
      .eq('lesson_id', lessonId)
      .order('timestamp_seconds', { ascending: true });

    if (error) throw error;
    return data as StudentNote[];
  },

  // Update note
  async updateNote(noteId: string, content: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('student_notes')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', noteId)
      .select()
      .single();

    if (error) throw error;
    return data as StudentNote;
  },

  // Delete note
  async deleteNote(noteId: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('student_notes')
      .delete()
      .eq('id', noteId);

    if (error) throw error;
  },

  // Get all student notes
  async getAllStudentNotes(studentId: string, page = 1, limit = 50) {
    const supabase = createClient();
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('student_notes')
      .select(`
        *,
        lesson:lessons(id, title, module_id)
      `, { count: 'exact' })
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { notes: data, total: count };
  },

  // Export notes as PDF/TXT
  async exportNotes(studentId: string, lessonId?: string): Promise<Blob> {
    const supabase = createClient();
    
    let query = supabase
      .from('student_notes')
      .select('*')
      .eq('student_id', studentId);

    if (lessonId) {
      query = query.eq('lesson_id', lessonId);
    }

    const { data, error } = await query.order('timestamp_seconds', { ascending: true });

    if (error) throw error;

    let content = 'Mes Notes - 2I Online\n';
    content += '=' .repeat(40) + '\n\n';

    data?.forEach((note: StudentNote) => {
      const time = new Date(note.timestamp_seconds * 1000).toISOString().substr(11, 8);
      content += `[${time}] ${note.content}\n`;
      content += '-'.repeat(20) + '\n';
    });

    return new Blob([content], { type: 'text/plain' });
  },
};

export const favoritesService = {
  // Add to favorites
  async addFavorite(studentId: string, lessonId: string, formationId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('favorites')
      .insert([{
        student_id: studentId,
        lesson_id: lessonId,
        formation_id: formationId,
      }])
      .select()
      .single();

    if (error) throw error;
    return data as Favorite;
  },

  // Remove from favorites
  async removeFavorite(studentId: string, lessonId: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('student_id', studentId)
      .eq('lesson_id', lessonId);

    if (error) throw error;
  },

  // Check if favorite
  async isFavorite(studentId: string, lessonId: string): Promise<boolean> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('student_id', studentId)
      .eq('lesson_id', lessonId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },

  // Get student favorites
  async getStudentFavorites(studentId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        lesson:lessons(id, title, duration_minutes, module_id),
        formation:formations(id, name, slug)
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get favorite count for lesson
  async getFavoriteCount(lessonId: string) {
    const supabase = createClient();
    const { count, error } = await supabase
      .from('favorites')
      .select('id', { count: 'exact' })
      .eq('lesson_id', lessonId);

    if (error) throw error;
    return count || 0;
  },
};
