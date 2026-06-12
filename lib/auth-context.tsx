"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

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

function buildUser(authUser: SupabaseUser, profile: Record<string, unknown> | null): User {
  const meta = (authUser.user_metadata ?? {}) as Record<string, unknown>
  const firstName = (profile?.first_name as string) || (meta.first_name as string) || ''
  const lastName = (profile?.last_name as string) || (meta.last_name as string) || ''
  const role = ((profile?.role as UserRole) || (meta.role as UserRole) || 'student') as UserRole
  const avatarUrl = (profile?.avatar_url as string) ?? null
  const name = [firstName, lastName].filter(Boolean).join(' ') || (authUser.email ?? 'Utilisateur')

  return {
    id: authUser.id,
    email: authUser.email ?? '',
    name,
    first_name: firstName,
    last_name: lastName,
    role,
    avatar: avatarUrl ?? undefined,
    avatar_url: avatarUrl,
    phone: (profile?.phone as string) ?? null,
    formation: (profile?.formation as string) ?? undefined,
    createdAt: (profile?.created_at as string) || authUser.created_at || new Date().toISOString(),
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const loadProfile = useCallback(
    async (authUser: SupabaseUser | null) => {
      if (!authUser) {
        setUser(null)
        return null
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle()

      const built = buildUser(authUser, profile)
      setUser(built)
      return built
    },
    [supabase],
  )

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getUser()
    await loadProfile(data.user ?? null)
  }, [supabase, loadProfile])

  useEffect(() => {
    let active = true

    async function init() {
      // getSession reads from local storage/cookies (no network), avoiding lock contention
      const { data } = await supabase.auth.getSession()
      if (!active) return
      await loadProfile(data.session?.user ?? null)
      if (active) setIsLoading(false)
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // IMPORTANT: do not `await` Supabase calls directly inside this callback.
      // supabase-js holds an internal lock during the callback; awaiting another
      // Supabase request here causes a deadlock. Defer the work instead.
      const sessionUser = session?.user ?? null
      setTimeout(() => {
        if (!active) return
        loadProfile(sessionUser).finally(() => {
          if (active) setIsLoading(false)
        })
      }, 0)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [supabase, loadProfile])

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        const message =
          error.message === 'Invalid login credentials'
            ? 'Email ou mot de passe incorrect'
            : error.message === 'Email not confirmed'
              ? 'Veuillez confirmer votre email avant de vous connecter'
              : error.message
        return { success: false, error: message }
      }

      const built = await loadProfile(data.user)
      return { success: true, role: built?.role }
    },
    [supabase, loadProfile],
  )

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
  }, [supabase])

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, refresh, isAuthenticated: !!user }}
    >
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
