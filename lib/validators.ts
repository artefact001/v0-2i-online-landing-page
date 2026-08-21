/**
 * Validateurs réutilisables pour tous les formulaires de la plateforme.
 * Chaque validateur retourne `null` si le champ est valide, ou un message
 * d'erreur (string) sinon.
 */

export type Validator = (value: string) => string | null

export const required =
  (message = "Ce champ est obligatoire"): Validator =>
  (value) =>
    value.trim().length === 0 ? message : null

export const minLength =
  (min: number, message?: string): Validator =>
  (value) =>
    value.trim().length > 0 && value.trim().length < min
      ? message || `Doit contenir au moins ${min} caractères`
      : null

export const maxLength =
  (max: number, message?: string): Validator =>
  (value) =>
    value.trim().length > max ? message || `Ne doit pas dépasser ${max} caractères` : null

export const email: Validator = (value) => {
  if (!value.trim()) return null
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(value.trim()) ? null : "Adresse email invalide"
}

// Numéro sénégalais/international assez permissif : chiffres, espaces, +, -
export const phone: Validator = (value) => {
  if (!value.trim()) return null
  const re = /^\+?[0-9\s-]{8,15}$/
  return re.test(value.trim()) ? null : "Numéro de téléphone invalide"
}

export const password: Validator = (value) => {
  if (!value) return null
  if (value.length < 6) return "Le mot de passe doit contenir au moins 6 caractères"
  return null
}

export const passwordStrength = (value: string): 'faible' | 'moyen' | 'fort' | null => {
  if (!value) return null
  let score = 0
  if (value.length >= 6) score++
  if (value.length >= 10) score++
  if (/[A-Z]/.test(value)) score++
  if (/[0-9]/.test(value)) score++
  if (/[^A-Za-z0-9]/.test(value)) score++
  if (score <= 2) return 'faible'
  if (score <= 3) return 'moyen'
  return 'fort'
}

export const matches =
  (otherValue: string, message = "Les deux champs ne correspondent pas"): Validator =>
  (value) =>
    value && otherValue && value !== otherValue ? message : null

export const url: Validator = (value) => {
  if (!value.trim()) return null
  try {
    new URL(value.trim())
    return null
  } catch {
    return "URL invalide (doit commencer par http:// ou https://)"
  }
}

export const numeric: Validator = (value) => {
  if (!value.trim()) return null
  return /^-?\d+(\.\d+)?$/.test(value.trim()) ? null : "Doit être un nombre"
}

export const positiveNumber: Validator = (value) => {
  if (!value.trim()) return null
  const n = Number(value)
  return !isNaN(n) && n >= 0 ? null : "Doit être un nombre positif"
}

/** Combine plusieurs validateurs — retourne le premier message d'erreur trouvé. */
export function combine(...validators: Validator[]): Validator {
  return (value) => {
    for (const v of validators) {
      const result = v(value)
      if (result) return result
    }
    return null
  }
}
