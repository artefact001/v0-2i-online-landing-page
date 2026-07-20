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
  const [isUploading, setIsUploading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setFeedback({ type: "error", message: "Veuillez sélectionner une image." })
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setFeedback({
        type: "error",
        message: "L'image doit faire moins de 2 Mo. Pour une image plus grande, collez une URL.",
      })
      return
    }
    setIsUploading(true)
    setFeedback(null)
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      setAvatarUrl(dataUrl)
    } catch {
      setFeedback({ type: "error", message: "Échec du chargement de l'image." })
    } finally {
      setIsUploading(false)
    }
  }

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
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[rgba(255,255,255,0.1)] flex items-center justify-center shrink-0">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl || "/placeholder.svg"} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-semibold text-xl">{initials}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-white font-medium truncate">
                {[firstName, lastName].filter(Boolean).join(" ") || user?.email}
              </p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#C9A227]/20 text-[#C9A227]">{roleLabel}</span>
              <div className="mt-2 flex items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-[rgba(255,255,255,0.06)] px-3 py-1.5 text-xs text-white transition-colors hover:bg-[rgba(255,255,255,0.12)]">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {isUploading ? "Chargement..." : "Changer la photo"}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={isUploading} />
                </label>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl("")}
                    className="text-xs text-[rgba(255,255,255,0.5)] hover:text-red-400"
                  >
                    Retirer
                  </button>
                )}
              </div>
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
            <Label htmlFor="avatarUrl">Ou collez une URL de photo</Label>
            <Input
              id="avatarUrl"
              value={avatarUrl.startsWith("data:") ? "" : avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white"
              placeholder="https://..."
            />
            {avatarUrl.startsWith("data:") && (
              <p className="text-xs text-[rgba(255,255,255,0.35)]">Une image a été téléversée depuis votre appareil.</p>
            )}
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
          <Button onClick={handleSave} disabled={isSaving || isUploading} className="bg-[#C9A227] hover:bg-[#B8860B]">
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
