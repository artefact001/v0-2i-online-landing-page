"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/lib/auth-context"
import { forumService, type ForumPost } from "@/lib/forum-service"
import { DashboardSidebar, DashboardHeader } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Plus, Pin, ThumbsUp } from "lucide-react"

interface Inscription {
  formation_id: string
  formation?: { titre: string }
}

export default function StudentForumPage() {
  const { user } = useAuth()
  const [inscriptions, setInscriptions] = useState<Inscription[]>([])
  const [selectedFormation, setSelectedFormation] = useState("")
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadInscriptions() {
      if (!user) return
      try {
        const res = await apiClient<Inscription[]>(`/inscriptions?user_id=${user.id}`)
        const list = res.data || []
        setInscriptions(list)
        if (list.length > 0) setSelectedFormation(list[0].formation_id)
        else setLoading(false)
      } catch (error) {
        console.error("Error loading inscriptions:", error)
        setLoading(false)
      }
    }
    loadInscriptions()
  }, [user])

  useEffect(() => {
    if (selectedFormation) loadPosts()
  }, [selectedFormation])

  async function loadPosts() {
    setLoading(true)
    const list = await forumService.getFormationPosts(selectedFormation)
    setPosts(list)
    setLoading(false)
  }

  async function handleCreate() {
    if (!title.trim() || !content.trim()) return
    setSaving(true)
    const post = await forumService.createPost(selectedFormation, title.trim(), content.trim())
    if (post) {
      setTitle("")
      setContent("")
      setIsCreating(false)
      await loadPosts()
    }
    setSaving(false)
  }

  async function handleLike(postId: string) {
    const res = await forumService.likePost(postId)
    if (res) {
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, like_count: res.like_count } : p)))
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Forum" subtitle="Échange avec les autres élèves de tes formations" />

        <div className="p-4 md:p-8 space-y-6">
          {inscriptions.length === 0 && !loading ? (
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="py-12 text-center">
                <p className="text-[rgba(255,255,255,0.5)]">Inscris-toi à une formation pour accéder à son forum.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {inscriptions.map((i) => (
                    <button
                      key={i.formation_id}
                      onClick={() => setSelectedFormation(i.formation_id)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        selectedFormation === i.formation_id
                          ? "bg-[#C9A227] text-[#0a0a1a]"
                          : "bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.6)]"
                      }`}
                    >
                      {i.formation?.titre || "Formation"}
                    </button>
                  ))}
                </div>
                <Button onClick={() => setIsCreating((v) => !v)} className="bg-[#C9A227] hover:bg-[#B8860B] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  {isCreating ? "Annuler" : "Nouveau sujet"}
                </Button>
              </div>

              {isCreating && (
                <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="pt-6 space-y-3">
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Titre du sujet"
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                    />
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Ton message..."
                      className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                      rows={4}
                    />
                    <Button onClick={handleCreate} disabled={saving} className="bg-[#C9A227] hover:bg-[#B8860B] text-white">
                      {saving ? "Publication..." : "Publier"}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C9A227]" />
                </div>
              ) : posts.length === 0 ? (
                <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                  <CardContent className="py-12 text-center">
                    <MessageSquare className="w-10 h-10 text-[rgba(255,255,255,0.2)] mx-auto mb-3" />
                    <p className="text-[rgba(255,255,255,0.5)]">Aucun sujet pour le moment — lance la discussion !</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {posts.map((post) => (
                    <Card key={post.id} className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
                      <CardContent className="py-4">
                        <div className="flex items-start justify-between gap-4">
                          <Link href={`/forum/${post.id}`} className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {post.is_pinned && <Pin className="w-3.5 h-3.5 text-[#C9A227]" />}
                              <h3 className="text-white font-medium hover:text-[#C9A227] transition-colors truncate">
                                {post.title}
                              </h3>
                            </div>
                            <p className="text-[rgba(255,255,255,0.5)] text-sm line-clamp-2">{post.content}</p>
                            <p className="text-[rgba(255,255,255,0.35)] text-xs mt-2">
                              {post.user ? `${post.user.prenom} ${post.user.nom}` : "Utilisateur"} ·{" "}
                              {new Date(post.created_at).toLocaleDateString("fr-FR")} · {post.reply_count} réponse
                              {post.reply_count !== 1 ? "s" : ""}
                            </p>
                          </Link>
                          <button
                            onClick={() => handleLike(post.id)}
                            className="flex items-center gap-1 text-[rgba(255,255,255,0.5)] hover:text-[#C9A227] transition-colors shrink-0 text-sm"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            {post.like_count}
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
