import { createClient } from '@/lib/supabase/client';

export interface ForumPost {
  id: string;
  formation_id: string;
  author_id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  reply_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
}

export interface ForumReply {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  like_count: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export const forumService = {
  // Create forum post
  async createPost(formationId: string, authorId: string, title: string, content: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('forum_posts')
      .insert([{
        formation_id: formationId,
        author_id: authorId,
        title,
        content,
        is_pinned: false,
        reply_count: 0,
        like_count: 0,
      }])
      .select()
      .single();

    if (error) throw error;
    return data as ForumPost;
  },

  // Get forum posts by formation
  async getFormationPosts(formationId: string, page = 1, limit = 20) {
    const supabase = createClient();
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('forum_posts')
      .select(`
        *,
        author:profiles(id, first_name, last_name, avatar_url)
      `, { count: 'exact' })
      .eq('formation_id', formationId)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { posts: data, total: count };
  },

  // Create reply
  async createReply(postId: string, authorId: string, content: string) {
    const supabase = createClient();
    
    // Insert reply
    const { data: reply, error: replyError } = await supabase
      .from('forum_replies')
      .insert([{
        post_id: postId,
        author_id: authorId,
        content,
        like_count: 0,
      }])
      .select()
      .single();

    if (replyError) throw replyError;

    // Update reply count
    await supabase.rpc('increment_forum_reply_count', { post_id: postId });

    return reply as ForumReply;
  },

  // Get replies for post
  async getPostReplies(postId: string, page = 1, limit = 10) {
    const supabase = createClient();
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('forum_replies')
      .select(`
        *,
        author:profiles(id, first_name, last_name, avatar_url)
      `, { count: 'exact' })
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { replies: data, total: count };
  },

  // Like post
  async likePost(postId: string) {
    const supabase = createClient();
    const { error } = await supabase.rpc('increment_forum_post_likes', { post_id: postId });
    if (error) throw error;
  },

  // Like reply
  async likeReply(replyId: string) {
    const supabase = createClient();
    const { error } = await supabase.rpc('increment_forum_reply_likes', { reply_id: replyId });
    if (error) throw error;
  },
};

export const messagingService = {
  // Send message
  async sendMessage(senderId: string, recipientId: string, content: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        sender_id: senderId,
        recipient_id: recipientId,
        content,
        is_read: false,
      }])
      .select()
      .single();

    if (error) throw error;
    return data as Message;
  },

  // Get conversation
  async getConversation(userId1: string, userId2: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId1},recipient_id.eq.${userId2}),and(sender_id.eq.${userId2},recipient_id.eq.${userId1})`)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as Message[];
  },

  // Get unread messages
  async getUnreadMessages(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('recipient_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Message[];
  },

  // Mark as read
  async markAsRead(messageId: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId);

    if (error) throw error;
  },

  // Get conversations list
  async getConversationsList(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('messages')
      .select(`
        sender_id,
        sender:profiles!messages_sender_id_fkey(id, first_name, last_name, avatar_url),
        recipient_id,
        recipient:profiles!messages_recipient_id_fkey(id, first_name, last_name, avatar_url)
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get unique conversations
    const conversationMap = new Map();
    data?.forEach((msg: any) => {
      const otherId = msg.sender_id === userId ? msg.recipient_id : msg.sender_id;
      const otherUser = msg.sender_id === userId ? msg.recipient : msg.sender;
      conversationMap.set(otherId, otherUser);
    });

    return Array.from(conversationMap.values());
  },
};
