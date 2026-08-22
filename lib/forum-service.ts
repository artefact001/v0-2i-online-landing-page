import { apiClient } from '@/lib/api/client'

/**
 * Connecté au vrai backend (ForumController).
 * forum_posts: formation_id, user_id, title, content, is_pinned
 * forum_replies: post_id, user_id, content
 * forum_likes: table polymorphe (posts et réponses), un like par
 * utilisateur par élément (toggle, pas juste un compteur).
 */

export interface ForumPost {
  id: string
  formation_id: string
  user_id: string
  title: string
  content: string
  is_pinned: boolean
  reply_count: number
  like_count: number
  created_at: string
  updated_at: string
  user?: { prenom: string; nom: string }
}

export interface ForumReply {
  id: string
  post_id: string
  user_id: string
  content: string
  like_count: number
  created_at: string
  updated_at: string
  user?: { prenom: string; nom: string }
}

export const forumService = {
  // POST /v1/forum/posts
  async createPost(formationId: string, title: string, content: string): Promise<ForumPost | null> {
    try {
      const res = await apiClient<ForumPost>('/forum/posts', {
        method: 'POST',
        body: JSON.stringify({ formation_id: formationId, title, content }),
      })
      return res.data ?? null
    } catch (error) {
      console.error('[forumService.createPost]', error)
      return null
    }
  },

  // GET /v1/forum/posts?formation_id=...
  async getFormationPosts(formationId: string): Promise<ForumPost[]> {
    try {
      const res = await apiClient<ForumPost[]>(`/forum/posts?formation_id=${formationId}`)
      return res.data || []
    } catch (error) {
      console.error('[forumService.getFormationPosts]', error)
      return []
    }
  },

  // GET /v1/forum/posts/{id} (post + réponses)
  async getPost(postId: string): Promise<(ForumPost & { replies: ForumReply[] }) | null> {
    try {
      const res = await apiClient<ForumPost & { replies: ForumReply[] }>(`/forum/posts/${postId}`)
      return res.data ?? null
    } catch (error) {
      console.error('[forumService.getPost]', error)
      return null
    }
  },

  async deletePost(postId: string): Promise<boolean> {
    try {
      await apiClient(`/forum/posts/${postId}`, { method: 'DELETE' })
      return true
    } catch (error) {
      console.error('[forumService.deletePost]', error)
      return false
    }
  },

  // POST /v1/forum/posts/{id}/replies
  async createReply(postId: string, content: string): Promise<ForumReply | null> {
    try {
      const res = await apiClient<ForumReply>(`/forum/posts/${postId}/replies`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      })
      return res.data ?? null
    } catch (error) {
      console.error('[forumService.createReply]', error)
      return null
    }
  },

  async deleteReply(replyId: string): Promise<boolean> {
    try {
      await apiClient(`/forum/replies/${replyId}`, { method: 'DELETE' })
      return true
    } catch (error) {
      console.error('[forumService.deleteReply]', error)
      return false
    }
  },

  // POST /v1/forum/posts/{id}/like — toggle réel (like/unlike)
  async likePost(postId: string): Promise<{ liked: boolean; like_count: number } | null> {
    try {
      const res = await apiClient<{ liked: boolean; like_count: number }>(`/forum/posts/${postId}/like`, {
        method: 'POST',
      })
      return res.data ?? null
    } catch (error) {
      console.error('[forumService.likePost]', error)
      return null
    }
  },

  // POST /v1/forum/replies/{id}/like
  async likeReply(replyId: string): Promise<{ liked: boolean; like_count: number } | null> {
    try {
      const res = await apiClient<{ liked: boolean; like_count: number }>(`/forum/replies/${replyId}/like`, {
        method: 'POST',
      })
      return res.data ?? null
    } catch (error) {
      console.error('[forumService.likeReply]', error)
      return null
    }
  },
}
