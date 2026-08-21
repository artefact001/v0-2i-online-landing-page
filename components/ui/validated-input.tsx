"use client"

import { useState, forwardRef } from "react"
import { CheckCircle2, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Validator } from "@/lib/validators"

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  validator?: Validator
  /** Affiche l'état vert dès que le champ est valide, même sans avoir été quitté (blur). */
  validateOnChange?: boolean
  containerClassName?: string
}

/**
 * Champ de formulaire avec retour visuel PERMANENT (pas juste au submit) :
 * - Bordure/texte neutres tant que le champ n'a pas été touché
 * - Bordure/texte ROUGES + icône + message dès que le champ est invalide
 *   (après le premier blur, pour ne pas être agressif dès la 1ère lettre)
 * - Bordure/texte VERTS + icône dès que le champ devient valide
 */
export const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ label, validator, validateOnChange, containerClassName, className, onBlur, onChange, value, ...props }, ref) => {
    const [touched, setTouched] = useState(false)
    const stringValue = typeof value === "string" ? value : String(value ?? "")
    const error = validator ? validator(stringValue) : null
    const showError = touched && !!error
    const showSuccess = (touched || validateOnChange) && !error && stringValue.trim().length > 0 && !!validator

    return (
      <div className={containerClassName ?? "space-y-2"}>
        {label && <Label className="text-[rgba(255,255,255,0.8)]">{label}</Label>}
        <div className="relative">
          <Input
            ref={ref}
            value={value}
            onChange={onChange}
            onBlur={(e) => {
              setTouched(true)
              onBlur?.(e)
            }}
            className={`${className ?? ""} ${
              showError
                ? "border-red-500 focus-visible:ring-red-500/30 pr-9"
                : showSuccess
                  ? "border-green-500 focus-visible:ring-green-500/30 pr-9"
                  : ""
            }`}
            aria-invalid={showError}
            {...props}
          />
          {showError && (
            <XCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500 pointer-events-none" />
          )}
          {showSuccess && (
            <CheckCircle2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500 pointer-events-none" />
          )}
        </div>
        {showError && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  },
)
ValidatedInput.displayName = "ValidatedInput"
