"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { user, refresh } = useAuth()
  const supabase = createClient()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Sync form fields whenever the dialog opens or the user changes
  useEffect(() => {
    if (open && user) {
      setFirstName(user.first_name || "")
      setLastName(user.last_name || "")
      setPhone(user.phone || "")
      setAvatarUrl(user.avatar_url || "")
      setFeedback(null)
    }
  }, [open, user])

  const roleLabel =
    user?.role === "admin" ? "Administrateur" : user?.role === "professor" ? "Professeur" : "Élève"

  async function handleSave() {
    if (!user) return
    setIsSaving(true)
    setFeedback(null)

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim() || null,
        avatar_url: avatarUrl.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) {
      setFeedback({ type: "error", message: "Erreur lors de l'enregistrement : " + error.message })
      setIsSaving(false)
      return
    }

    await refresh()
    setFeedback({ type: "success", message: "Profil mis à jour avec succès." })
    setIsSaving(false)
  }

  const initials = [firstName, lastName]
    .filter(Boolean)
    .map((n) => n.charAt(0).toUpperCase())
    .join("") || (user?.email?.charAt(0).toUpperCase() ?? "U")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)] text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">Mon Profil</DialogTitle>
          <DialogDescription className="text-[rgba(255,255,255,0.5)]">
            Consultez et modifiez vos informations personnelles
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Avatar + identity preview */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[rgba(255,255,255,0.1)] flex items-center justify-center">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl || "/placeholder.svg"} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-semibold text-xl">{initials}</span>
              )}
            </div>
            <div>
              <p className="text-white font-medium">
                {[firstName, lastName].filter(Boolean).join(" ") || user?.email}
              </p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#C9A227]/20 text-[#C9A227]">{roleLabel}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                placeholder="Prénom"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
                placeholder="Nom"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user?.email || ""}
              disabled
              className="bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.5)] cursor-not-allowed"
            />
            <p className="text-xs text-[rgba(255,255,255,0.35)]">L&apos;email ne peut pas être modifié ici.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
              placeholder="+221 77 000 00 00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatarUrl">URL de la photo (avatar)</Label>
            <Input
              id="avatarUrl"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
              placeholder="https://..."
            />
          </div>

          {feedback && (
            <p
              className={`text-sm ${feedback.type === "success" ? "text-green-400" : "text-red-400"}`}
              role="status"
            >
              {feedback.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.05)]"
          >
            Fermer
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-[#C9A227] hover:bg-[#B8860B]">
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
