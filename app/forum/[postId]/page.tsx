"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { forumService, type ForumPost, type ForumReply } from "@/lib/forum-service"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ThumbsUp, Trash2, Pin } from "lucide-react"

export default function ForumPostPage() {
  const params = useParams()
  const { user } = useAuth()
  const [post, setPost] = useState<(ForumPost & { replies: ForumReply[] }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [newReply, setNewReply] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    load()
  }, [params.postId])

  async function load() {
    setLoading(true)
    const data = await forumService.getPost(params.postId as string)
    setPost(data)
    setLoading(false)
  }

  async function handleReply() {
    if (!newReply.trim()) return
    setSaving(true)
    const reply = await forumService.createReply(params.postId as string, newReply.trim())
    if (reply) {
      setNewReply("")
      await load()
    }
    setSaving(false)
  }

  async function handleLikePost() {
    if (!post) return
    const res = await forumService.likePost(post.id)
    if (res) setPost({ ...post, like_count: res.like_count })
  }

  async function handleLikeReply(replyId: string) {
    const res = await forumService.likeReply(replyId)
    if (res && post) {
      setPost({
        ...post,
        replies: post.replies.map((r) => (r.id === replyId ? { ...r, like_count: res.like_count } : r)),
      })
    }
  }

  async function handleDeleteReply(replyId: string) {
    const ok = await forumService.deleteReply(replyId)
    if (ok) await load()
  }

  // Charte graphique unifiée avec le reste de la plateforme (même
  // traitement déjà appliqué aux pages d'évaluation/certification) :
  // fond #0a0a1a, cartes #0d0d1a avec bordure discrète, texte blanc/gris
  // clair. Corrige au passage le bug signalé : le champ de réponse était
  // un Textarea sans aucune couleur de texte définie, posé sur une carte
  // blanche — le texte tapé héritait du blanc par défaut du thème sombre
  // global et devenait donc invisible sur ce fond clair.
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C9A227]" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center text-white">
        <p>Sujet introuvable.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/dashboard/student/forum"
          className="inline-flex items-center gap-2 text-[rgba(255,255,255,0.6)] hover:text-white mb-6 text-sm transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour au forum
        </Link>

        <div className="bg-[#0d0d1a] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            {post.is_pinned && <Pin className="w-4 h-4 text-[#C9A227]" />}
            <h1 className="text-2xl font-bold text-white">{post.title}</h1>
          </div>
          <p className="text-sm text-[rgba(255,255,255,0.5)] mb-4">
            {post.user ? `${post.user.prenom} ${post.user.nom}` : "Utilisateur"} ·{" "}
            {new Date(post.created_at).toLocaleDateString("fr-FR")}
          </p>
          <p className="text-[rgba(255,255,255,0.8)] whitespace-pre-wrap mb-4">{post.content}</p>
          <button
            onClick={handleLikePost}
            className="flex items-center gap-1.5 text-[rgba(255,255,255,0.5)] hover:text-[#C9A227] transition-colors text-sm"
          >
            <ThumbsUp className="w-4 h-4" />
            {post.like_count} j&apos;aime
          </button>
        </div>

        <h2 className="text-white font-semibold mb-3">
          {post.replies.length} réponse{post.replies.length !== 1 ? "s" : ""}
        </h2>

        <div className="space-y-3 mb-6">
          {post.replies.map((reply) => (
            <div key={reply.id} className="bg-[#0d0d1a] border border-[rgba(255,255,255,0.05)] rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-[rgba(255,255,255,0.5)] mb-1">
                    {reply.user ? `${reply.user.prenom} ${reply.user.nom}` : "Utilisateur"} ·{" "}
                    {new Date(reply.created_at).toLocaleDateString("fr-FR")}
                  </p>
                  <p className="text-[rgba(255,255,255,0.8)] whitespace-pre-wrap">{reply.content}</p>
                </div>
                {reply.user_id === user?.id && (
                  <Button size="icon" variant="ghost" onClick={() => handleDeleteReply(reply.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 w-7 shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
              <button
                onClick={() => handleLikeReply(reply.id)}
                className="flex items-center gap-1.5 text-[rgba(255,255,255,0.4)] hover:text-[#C9A227] transition-colors text-xs mt-2"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                {reply.like_count}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-[#0d0d1a] border border-[rgba(255,255,255,0.05)] rounded-xl p-4 space-y-3">
          <Textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Écris une réponse..."
            rows={3}
            className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.35)]"
          />
          <Button onClick={handleReply} disabled={saving || !newReply.trim()} className="bg-[#C9A227] hover:bg-[#B8860B] text-[#0a0a1a] font-semibold">
            {saving ? "Envoi..." : "Répondre"}
          </Button>
        </div>
      </div>
    </div>
  )
}
