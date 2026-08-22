"use client"

import { useState, useEffect } from "react"
import { notesService, type StudentNote } from "@/lib/notes-service"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, StickyNote, Plus } from "lucide-react"

/**
 * Panneau de notes personnelles pour une leçon — connecté au vrai
 * backend (NoteController). Chaque note est scopée à l'utilisateur
 * connecté côté serveur.
 */
export function LessonNotesPanel({ leconId }: { leconId: string }) {
  const [notes, setNotes] = useState<StudentNote[]>([])
  const [newContent, setNewContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      const list = await notesService.getLessonNotes(leconId)
      if (active) setNotes(list)
      setLoading(false)
    }
    load()
    return () => {
      active = false
    }
  }, [leconId])

  async function handleAdd() {
    if (!newContent.trim()) return
    setSaving(true)
    const note = await notesService.createNote(leconId, newContent.trim())
    if (note) {
      setNotes((prev) => [...prev, note])
      setNewContent("")
    }
    setSaving(false)
  }

  async function handleDelete(noteId: string) {
    const ok = await notesService.deleteNote(noteId)
    if (ok) setNotes((prev) => prev.filter((n) => n.id !== noteId))
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div className="flex items-center gap-2 text-white">
        <StickyNote className="w-5 h-5 text-[#C9A227]" />
        <h2 className="font-semibold">Mes notes personnelles</h2>
      </div>

      <div className="bg-[#0D1B2A] border border-[#1a2942] rounded-lg p-4 space-y-3">
        <Textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Écris une note sur cette leçon..."
          className="bg-[#0a0f1a] border-[#1a2942] text-white"
          rows={3}
        />
        <Button
          onClick={handleAdd}
          disabled={saving || !newContent.trim()}
          size="sm"
          className="bg-[#C9A227] hover:bg-[#B8860B] text-white"
        >
          <Plus className="w-4 h-4 mr-1" />
          Ajouter la note
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#C9A227]" />
        </div>
      ) : notes.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-6">Aucune note pour cette leçon pour le moment.</p>
      ) : (
        <div className="space-y-2">
          {notes.map((note) => (
            <div key={note.id} className="flex items-start justify-between gap-3 bg-[#0D1B2A] border border-[#1a2942] rounded-lg p-3">
              <p className="text-sm text-gray-200 whitespace-pre-wrap">{note.content}</p>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleDelete(note.id)}
                className="text-red-400 hover:bg-red-500/10 h-7 w-7 shrink-0"
                title="Supprimer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
