import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function apiServer<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<{ success: boolean; message?: string; data?: T }> {
  if (!API_URL) {
    throw new Error('Configuration serveur manquante (NEXT_PUBLIC_API_URL)')
  }

  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    cache: 'no-store',
  })

  const text = await res.text()
  let json: any = null
  if (text) {
    try {
      json = JSON.parse(text)
    } catch {
      throw new Error(`Réponse invalide du serveur API (HTTP ${res.status})`)
    }
  }

  if (!res.ok) throw new Error(json?.message || `Erreur API (${res.status})`)
  return json
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) return null

  try {
    const res = await apiServer('/v1/me')
    return res.data ?? null
  } catch {
    return null
  }
}
