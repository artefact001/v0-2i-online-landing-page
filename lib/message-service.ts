import { apiClient } from '@/lib/api/client'

export interface Conversation {
  userId: string
  prenom: string
  nom: string
  dernierMessage: string
  dernierMessageDate: string
  nonLus: number
}

export interface DirectMessage {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  read_at: string | null
  created_at: string
}

export const messageService = {
  async getConversations(): Promise<Conversation[]> {
    try {
      const res = await apiClient<Conversation[]>('/messages/conversations')
      return res.data || []
    } catch (error) {
      console.error('[messageService.getConversations]', error)
      return []
    }
  },

  async getThread(userId: string): Promise<DirectMessage[]> {
    try {
      const res = await apiClient<DirectMessage[]>(`/messages/${userId}`)
      return res.data || []
    } catch (error) {
      console.error('[messageService.getThread]', error)
      return []
    }
  },

  async send(receiverId: string, content: string) {
    return apiClient<DirectMessage>('/messages', {
      method: 'POST',
      body: JSON.stringify({ receiver_id: receiverId, content }),
    })
  },
}
