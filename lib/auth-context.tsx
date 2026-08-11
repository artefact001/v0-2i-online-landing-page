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

function buildUser(raw: any): User {
  const firstName = raw.first_name ?? ''
  const lastName = raw.last_name ?? ''
  const role = (raw.role ?? 'student') as UserRole
  const avatarUrl = raw.avatar_url ?? null
  const name = [firstName, lastName].filter(Boolean).join(' ') || raw.email || 'Utilisateur'

  return {
    id: String(raw.id),
    email: raw.email ?? '',
    name,
    first_name: firstName,
    last_name: lastName,
    role,
    avatar: avatarUrl ?? undefined,
    avatar_url: avatarUrl,
    phone: raw.phone ?? null,
    formation: raw.formation ?? undefined,
    createdAt: raw.created_at ?? new Date().toISOString(),
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await apiClient('/me')
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
