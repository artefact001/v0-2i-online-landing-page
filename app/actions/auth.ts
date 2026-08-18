'use server'

import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

async function safeJson(res: Response) {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    console.error('[auth] Réponse non-JSON du serveur API:', res.status, text.slice(0, 500))
    return null
  }
}

export async function login(email: string, password: string) {
  if (!API_URL) {
    return { success: false, message: 'Configuration serveur manquante (NEXT_PUBLIC_API_URL)' }
  }

  try {
    const res = await fetch(`${API_URL}/api/v1/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const json = await safeJson(res)

    if (!res.ok || !json?.success) {
      return {
        success: false,
        message: json?.message || `Identifiants invalides (HTTP ${res.status})`,
      }
    }
    await setAuthCookie(json.token)
    return { success: true, user: json.user }
  } catch (error) {
    console.error('[auth] login fetch failed:', error)
    return { success: false, message: 'Impossible de joindre le serveur' }
  }
}

export async function register(data: Record<string, any>) {
  if (!API_URL) {
    return { success: false, message: 'Configuration serveur manquante (NEXT_PUBLIC_API_URL)' }
  }

  try {
    const res = await fetch(`${API_URL}/api/v1/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await safeJson(res)

    if (!res.ok || !json?.success) {
      return {
        success: false,
        message: json?.message || `Erreur lors de l'inscription (HTTP ${res.status})`,
      }
    }
    await setAuthCookie(json.token)
    return { success: true, user: json.user }
  } catch (error) {
    console.error('[auth] register fetch failed:', error)
    return { success: false, message: 'Impossible de joindre le serveur' }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (token && API_URL) {
    await fetch(`${API_URL}/api/v1/logout`, {
      method: 'POST',
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    }).catch(() => null)
  }

  cookieStore.delete('auth_token')
  return { success: true }
}

// Route Laravel réelle: POST /api/v1/forgotPassword (publique)
export async function forgotPassword(email: string) {
  if (!API_URL) {
    return { success: false, message: 'Configuration serveur manquante (NEXT_PUBLIC_API_URL)' }
  }

  try {
    const res = await fetch(`${API_URL}/api/v1/forgotPassword`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email }),
    })
    const json = await safeJson(res)

    if (!res.ok || !json?.success) {
      return {
        success: false,
        message: json?.message || `Erreur lors de l'envoi du code (HTTP ${res.status})`,
      }
    }
    return { success: true, message: json.message }
  } catch (error) {
    console.error('[auth] forgotPassword fetch failed:', error)
    return { success: false, message: 'Erreur de connexion au serveur' }
  }
}

// Route Laravel réelle: POST /api/v1/resetPassword (publique)
// À VÉRIFIER: champs exacts attendus par ResetPasswordRequest — on suppose
// email, code, password, password_confirmation (pattern standard Laravel).
export async function resetPassword(data: {
  email: string
  code: string
  password: string
  password_confirmation: string
}) {
  if (!API_URL) {
    return { success: false, message: 'Configuration serveur manquante (NEXT_PUBLIC_API_URL)' }
  }

  try {
    const res = await fetch(`${API_URL}/api/v1/resetPassword`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await safeJson(res)

    if (!res.ok || !json?.success) {
      return {
        success: false,
        message: json?.message || `Erreur lors de la réinitialisation (HTTP ${res.status})`,
      }
    }
    return { success: true, message: json.message }
  } catch (error) {
    console.error('[auth] resetPassword fetch failed:', error)
    return { success: false, message: 'Erreur de connexion au serveur' }
  }
}
