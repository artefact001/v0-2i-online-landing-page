"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth as useAuthContext, UserRole } from '@/lib/auth-context'

export interface UserProfile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  avatar_url: string | null
  role: UserRole
  is_active: boolean
  created_at: string
}

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, isLoading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.push('/login')
      return
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      switch (user.role) {
        case 'admin':
          router.push('/dashboard/admin')
          break
        case 'professor':
          router.push('/dashboard/professor')
          break
        default:
          router.push('/dashboard/student')
      }
    }
  }, [user, isLoading, allowedRoles, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}

/**
 * Compatibility hook for components that expect a `profile` object and `signOut`.
 * Delegates to the single unified Supabase auth context.
 */
export function useAuth() {
  const { user, isLoading, logout } = useAuthContext()

  const profile: UserProfile | null = user
    ? {
        id: user.id,
        email: user.email,
        first_name: user.first_name || null,
        last_name: user.last_name || null,
        phone: user.phone ?? null,
        avatar_url: user.avatar_url ?? null,
        role: user.role,
        is_active: true,
        created_at: user.createdAt,
      }
    : null

  return { user, profile, loading: isLoading, signOut: logout }
}
