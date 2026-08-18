"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { login as loginAction, logout as logoutAction } from '@/app/actions/auth'
import { apiClient } from '@/lib/api/client'

export type UserRole = 'admin' | 'professor' | 'student'

export interface User {
  id: string
  email: string
  name: string
  first_name: string
  last_name: string
  role: UserRole
  avatar?: string
  avatar_url?: string | null
  phone?: string | null
  formation?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>
  logout: () => Promise<void>
  refresh: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Le backend Laravel stocke et renvoie les rôles en français ('admin',
// 'formateur', 'etudiant' — ce sont les valeurs exactes utilisées par le
// middleware role: dans routes/api.php). Le frontend utilise des valeurs
// anglaises partout ('admin', 'professor', 'student'). Sans cette
// normalisation, un professeur ou un étudiant reçoit un rôle qui ne
// correspond à aucun des if (user.role === ...) du frontend, cassant
// silencieusement la redirection après connexion et toutes les
// vérifications de permission basées sur le rôle.
function normalizeRole(rawRole: unknown): UserRole {
  const value = String(rawRole ?? '').toLowerCase().trim()

  switch (value) {
    case 'admin':
    case 'administrateur':
      return 'admin'
    case 'formateur':
    case 'professor':
    case 'prof':
    case 'professeur':
      return 'professor'
    case 'etudiant':
    case 'étudiant':
    case 'student':
    case 'eleve':
    case 'élève':
      return 'student'
    default:
      console.warn(`[auth] Rôle inconnu reçu du backend: "${rawRole}" — repli sur "student"`)
      return 'student'
  }
}

function buildUser(raw: any): User {
  // Tolère plusieurs conventions de nommage possibles côté Laravel
  // (anglais first_name/last_name, français prenom/nom, ou un champ "name"
  // unique déjà combiné) — évite un nom vide si le UserResource réel
  // n'utilise pas exactement les noms de champs supposés.
  const firstName = raw.first_name ?? raw.firstName ?? raw.prenom ?? ''
  const lastName = raw.last_name ?? raw.lastName ?? raw.nom ?? ''
  const role = normalizeRole(raw.role)
  const avatarUrl = raw.avatar_url ?? raw.avatarUrl ?? raw.photo ?? null
  const combinedName = [firstName, lastName].filter(Boolean).join(' ')
  const name = combinedName || raw.name || raw.full_name || raw.email || 'Utilisateur'

  return {
    id: String(raw.id),
    email: raw.email ?? '',
    name,
    first_name: firstName,
    last_name: lastName,
    role,
    avatar: avatarUrl ?? undefined,
    avatar_url: avatarUrl,
    phone: raw.phone ?? raw.telephone ?? null,
    formation: raw.formation ?? undefined,
    createdAt: raw.created_at ?? raw.createdAt ?? new Date().toISOString(),
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await apiClient('/me')
      if (res.data) {
        console.log('[auth] Réponse brute de /me (pour vérifier les noms de champs):', res.data)
      }
      setUser(res.data ? buildUser(res.data) : null)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    let active = true
    refresh().finally(() => {
      if (active) setIsLoading(false)
    })
    return () => {
      active = false
    }
  }, [refresh])

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginAction(email, password)
    if (!result.success) {
      return { success: false, error: result.message || 'Email ou mot de passe incorrect' }
    }
    const built = buildUser(result.user)
    setUser(built)
    return { success: true, role: built.role }
  }, [])

  const logout = useCallback(async () => {
    await logoutAction()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refresh, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
