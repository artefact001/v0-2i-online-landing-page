/**
 * STAND BY — aucune route Laravel pour forum/messagerie dans routes/api.php.
 * Fonctions désactivées en attendant les endpoints côté backend.
 */

export interface ForumPost {
  id: string
  formation_id: string
  author_id: string
  title: string
  content: string
  is_pinned: boolean
  reply_count: number
  like_count: number
  created_at: string
  updated_at: string
}

export interface ForumReply {
  id: string
  post_id: string
  author_id: string
  content: string
  like_count: number
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  is_read: boolean
  created_at: string
}

function notReady(fn: string) {
  console.warn(`[forumService.${fn}] en attente d'un endpoint Laravel — fonctionnalité en pause`)
}

export const forumService = {
  async createPost(..._args: any[]): Promise<ForumPost | null> {
    notReady('createPost')
    return null
  },
  async getFormationPosts(..._args: any[]): Promise<ForumPost[]> {
    notReady('getFormationPosts')
    return []
  },
  async createReply(..._args: any[]): Promise<ForumReply | null> {
    notReady('createReply')
    return null
  },
  async getPostReplies(..._args: any[]): Promise<ForumReply[]> {
    notReady('getPostReplies')
    return []
  },
  async likePost(..._args: any[]): Promise<boolean> {
    notReady('likePost')
    return false
  },
  async likeReply(..._args: any[]): Promise<boolean> {
    notReady('likeReply')
    return false
  },
}

export const messagingService = {
  async sendMessage(..._args: any[]): Promise<Message | null> {
    notReady('sendMessage')
    return null
  },
  async getConversation(..._args: any[]): Promise<Message[]> {
    notReady('getConversation')
    return []
  },
  async getUnreadMessages(..._args: any[]): Promise<Message[]> {
    notReady('getUnreadMessages')
    return []
  },
  async markAsRead(..._args: any[]): Promise<boolean> {
    notReady('markAsRead')
    return false
  },
  async getConversationsList(..._args: any[]): Promise<any[]> {
    notReady('getConversationsList')
    return []
  },
}
