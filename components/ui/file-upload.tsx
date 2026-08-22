"use client"

import { useRef, useState, useEffect } from "react"
import { FileUp, X, File as FileIcon, Video as VideoIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  label?: string
  /** URL du fichier déjà existant (édition), affichée en aperçu/lien */
  value?: string | null
  onFileSelected: (file: File | null) => void
  disabled?: boolean
  /** Attribut "accept" natif, ex: ".pdf,.docx,.doc,.pptx,.ppt" */
  accept?: string
  /** Types MIME acceptés, pour validation côté client (préfixes autorisés, ex: ["application/pdf"]) */
  acceptedTypes?: string[]
  maxSizeMb?: number
  /** Libellé du type de fichier attendu, pour les messages d'erreur */
  typeLabel?: string
  kind?: "document" | "video"
}

/**
 * Champ d'upload générique pour tout type de fichier (PDF, docx, vidéo...)
 * — pendant de ImageUpload mais sans contrainte "image uniquement".
 * Remplace les anciens champs texte "URL du document/vidéo" qui ne
 * correspondaient à aucune validation réelle côté Laravel (les vrais
 * champs sont validés comme de vrais fichiers uploadés : file|mimes:...).
 */
export function FileUpload({
  label = "Fichier",
  value,
  onFileSelected,
  disabled,
  accept,
  acceptedTypes,
  maxSizeMb = 20,
  typeLabel = "fichier",
  kind = "document",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [existingUrl, setExistingUrl] = useState<string | null>(value ?? null)

  useEffect(() => {
    setExistingUrl(value ?? null)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return

    if (acceptedTypes && !acceptedTypes.some((t) => file.type === t || file.type.startsWith(t))) {
      alert(`Le fichier doit être un ${typeLabel} valide.`)
      e.target.value = ""
      return
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      alert(`Le fichier ne doit pas dépasser ${maxSizeMb} Mo.`)
      e.target.value = ""
      return
    }

    setFileName(file.name)
    setExistingUrl(null)
    onFileSelected(file)
  }

  const handleClear = () => {
    setFileName(null)
    setExistingUrl(null)
    onFileSelected(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  const Icon = kind === "video" ? VideoIcon : FileIcon

  return (
    <div className="space-y-2">
      {label && <p className="text-sm text-[rgba(255,255,255,0.8)]">{label}</p>}

      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} disabled={disabled} className="hidden" />

      {fileName || existingUrl ? (
        <div className="flex items-center gap-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2.5">
          <Icon className="w-4 h-4 text-[#C9A227] shrink-0" />
          <span className="text-sm text-white truncate flex-1">
            {fileName || (existingUrl ? "Fichier déjà enregistré" : "")}
          </span>
          {existingUrl && !fileName && (
            <a href={existingUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#C9A227] hover:underline shrink-0">
              Voir
            </a>
          )}
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="text-[rgba(255,255,255,0.4)] hover:text-red-400 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.05)]"
        >
          <FileUp className="w-4 h-4 mr-2" />
          Choisir un {typeLabel}
        </Button>
      )}
    </div>
  )
}
