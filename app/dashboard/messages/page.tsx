'use client'

import { useEffect, useState, useRef } from 'react'
import { DashboardSidebar, DashboardHeader } from '@/components/dashboard-layout'
import { messageService, type Conversation, type DirectMessage } from '@/lib/message-service'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquare, Send } from 'lucide-react'

/**
 * Messagerie privée — commune aux 3 rôles (admin/professor/student),
 * placée hors des dossiers spécifiques à un rôle pour éviter la
 * duplication. Accessible via /dashboard/messages quel que soit le
 * rôle connecté.
 */
export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeUserId, setActiveUserId] = useState<string | null>(null)
  const [thread, setThread] = useState<DirectMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messageService.getConversations().then((c) => {
      setConversations(c)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!activeUserId) return
    messageService.getThread(activeUserId).then(setThread)
  }, [activeUserId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread])

  async function handleSend() {
    if (!activeUserId || !newMessage.trim()) return
    setSending(true)
    const res = await messageService.send(activeUserId, newMessage.trim())
    if (res.data) {
      setThread((prev) => [...prev, res.data as DirectMessage])
      setNewMessage('')
    }
    setSending(false)
  }

  const activeConversation = conversations.find((c) => c.userId === activeUserId)

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Messages" subtitle="Tes conversations privées" />

        <div className="p-4 md:p-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-220px)] min-h-[400px]">
              {/* Liste des conversations */}
              <div className="bg-[#0d0d1a] border border-[rgba(255,255,255,0.05)] rounded-xl overflow-y-auto md:col-span-1">
                {conversations.length === 0 ? (
                  <div className="p-6 text-center">
                    <MessageSquare className="w-8 h-8 text-[rgba(255,255,255,0.2)] mx-auto mb-2" />
                    <p className="text-[rgba(255,255,255,0.4)] text-sm">Aucune conversation pour le moment.</p>
                  </div>
                ) : (
                  conversations.map((c) => (
                    <button
                      key={c.userId}
                      onClick={() => setActiveUserId(c.userId)}
                      className={`w-full text-left p-4 border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.03)] transition-colors ${
                        activeUserId === c.userId ? 'bg-[rgba(201,162,39,0.08)]' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm font-medium">{c.prenom} {c.nom}</span>
                        {c.nonLus > 0 && (
                          <span className="bg-[#C9A227] text-[#0a0a1a] text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {c.nonLus}
                          </span>
                        )}
                      </div>
                      <p className="text-[rgba(255,255,255,0.4)] text-xs truncate mt-1">{c.dernierMessage}</p>
                    </button>
                  ))
                )}
              </div>

              {/* Fil de discussion */}
              <div className="bg-[#0d0d1a] border border-[rgba(255,255,255,0.05)] rounded-xl md:col-span-2 flex flex-col">
                {!activeUserId ? (
                  <div className="flex-1 flex items-center justify-center text-[rgba(255,255,255,0.4)] text-sm">
                    Sélectionne une conversation
                  </div>
                ) : (
                  <>
                    <div className="p-4 border-b border-[rgba(255,255,255,0.05)]">
                      <p className="text-white font-medium">{activeConversation?.prenom} {activeConversation?.nom}</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {thread.map((m) => (
                        <div key={m.id} className={`flex ${m.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                              m.sender_id === user?.id ? 'bg-[#C9A227] text-[#0a0a1a]' : 'bg-[rgba(255,255,255,0.06)] text-white'
                            }`}
                          >
                            {m.content}
                          </div>
                        </div>
                      ))}
                      <div ref={bottomRef} />
                    </div>
                    <div className="p-4 border-t border-[rgba(255,255,255,0.05)] flex gap-2">
                      <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSend()
                          }
                        }}
                        placeholder="Écris un message..."
                        rows={1}
                        className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white resize-none"
                      />
                      <Button onClick={handleSend} disabled={sending || !newMessage.trim()} className="bg-[#C9A227] hover:bg-[#B8860B] shrink-0">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
