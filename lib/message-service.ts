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

export interface Contact {
  userId: string
  prenom: string
  nom: string
  role: string
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

  async getContacts(): Promise<Contact[]> {
    try {
      const res = await apiClient<Contact[]>('/messages/contacts')
      return res.data || []
    } catch (error) {
      console.error('[messageService.getContacts]', error)
      return []
    }
  },

  async getThread(userId: string): Promise<DirectMessage[]> {
    try {
      const res = await apiClient<DirectMessage[]>(`/messages/${userId}`)
      // CORRIGÉ: le JSON brut renvoyé par Laravel a sender_id/receiver_id
      // en tant que NOMBRES (clés primaires auto-incrémentées), alors que
      // user.id côté frontend est explicitement forcé en chaîne (voir
      // auth-context.tsx: id: String(raw.id)) — la comparaison stricte
      // "m.sender_id === user?.id" utilisée pour distinguer messages
      // envoyés/reçus (42 === "42") était donc TOUJOURS fausse, quel que
      // soit l'expéditeur réel : chaque message s'affichait comme reçu,
      // jamais comme envoyé, même les siens.
      return (res.data || []).map((m) => ({
        ...m,
        id: String(m.id),
        sender_id: String(m.sender_id),
        receiver_id: String(m.receiver_id),
      }))
    } catch (error) {
      console.error('[messageService.getThread]', error)
      return []
    }
  },

  async send(receiverId: string, content: string) {
    const res = await apiClient<DirectMessage>('/messages', {
      method: 'POST',
      body: JSON.stringify({ receiver_id: receiverId, content }),
    })
    // Même correctif que getThread() ci-dessus — sans lui, le message
    // qu'on vient soi-même d'envoyer s'afficherait un instant comme
    // "reçu" (avant le prochain rechargement complet du fil).
    if (res.data) {
      res.data = {
        ...res.data,
        id: String(res.data.id),
        sender_id: String(res.data.sender_id),
        receiver_id: String(res.data.receiver_id),
      }
    }
    return res
  },
}
