"use client"

import { useRef, useState, useEffect } from "react"
import { ImagePlus, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  label?: string
  value?: string | null // URL existante (édition) à afficher en aperçu
  onFileSelected: (file: File | null) => void
  disabled?: boolean
}

/**
 * Champ d'upload d'image avec aperçu, pour remplacer les anciens champs
 * "URL de l'image" — Laravel valide ces champs comme de vrais fichiers
 * (règle 'image'), pas comme des chaînes d'URL.
 */
export function ImageUpload({ label = "Image", value, onFileSelected, disabled }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(value ?? null)
  const [fileName, setFileName] = useState<string | null>(null)

  useEffect(() => {
    setPreviewUrl(value ?? null)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Le fichier doit être une image (JPEG, PNG, WebP...).")
      e.target.value = ""
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5 Mo.")
      e.target.value = ""
      return
    }

    setFileName(file.name)
    setPreviewUrl(URL.createObjectURL(file))
    onFileSelected(file)
  }

  const handleClear = () => {
    setPreviewUrl(null)
    setFileName(null)
    onFileSelected(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="space-y-2">
      {label && <p className="text-sm text-[rgba(255,255,255,0.8)]">{label}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
        id={`image-upload-${label}`}
      />

      {previewUrl ? (
        <div className="relative w-full max-w-xs">
          <img
            src={previewUrl}
            alt="Aperçu"
            className="w-full h-40 object-cover rounded-lg border border-[rgba(255,255,255,0.1)]"
          />
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
          {fileName && <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1 truncate">{fileName}</p>}
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.05)]"
        >
          <ImagePlus className="w-4 h-4 mr-2" />
          Choisir une image
        </Button>
      )}
    </div>
  )
}
