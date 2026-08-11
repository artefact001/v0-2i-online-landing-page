'use server'

import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL!

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

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/v1/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const json = await res.json()
  if (!res.ok || !json.success) {
    return { success: false, message: json.message || 'Identifiants invalides' }
  }
  await setAuthCookie(json.token)
  return { success: true, user: json.user }
}

export async function register(data: Record<string, any>) {
  const res = await fetch(`${API_URL}/v1/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok || !json.success) {
    return { success: false, message: json.message || "Erreur lors de l'inscription" }
  }
  await setAuthCookie(json.token)
  return { success: true, user: json.user }
}

export async function logout() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (token) {
    await fetch(`${API_URL}/v1/logout`, {
      method: 'POST',
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    }).catch(() => null)
  }

  cookieStore.delete('auth_token')
  return { success: true }
}

// Route Laravel réelle: POST /v1/forgotPassword (publique)
export async function forgotPassword(email: string) {
  try {
    const res = await fetch(`${API_URL}/v1/forgotPassword`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email }),
    })
    const json = await res.json()
    if (!res.ok || !json.success) {
      return { success: false, message: json.message || "Erreur lors de l'envoi du code" }
    }
    return { success: true, message: json.message }
  } catch (error) {
    return { success: false, message: 'Erreur de connexion au serveur' }
  }
}

// Route Laravel réelle: POST /v1/resetPassword (publique)
// À VÉRIFIER: champs exacts attendus par ResetPasswordRequest — on suppose
// email, code, password, password_confirmation (pattern standard Laravel).
export async function resetPassword(data: {
  email: string
  code: string
  password: string
  password_confirmation: string
}) {
  try {
    const res = await fetch(`${API_URL}/v1/resetPassword`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok || !json.success) {
      return { success: false, message: json.message || 'Erreur lors de la réinitialisation' }
    }
    return { success: true, message: json.message }
  } catch (error) {
    return { success: false, message: 'Erreur de connexion au serveur' }
  }
}
