"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type UserRole = 'admin' | 'professor' | 'student'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  formation?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for testing
const DEMO_USERS: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@2ionline.com',
    password: 'admin123',
    name: 'Administrateur Principal',
    role: 'admin',
    avatar: '/images/testimonial-2.jpg',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    email: 'chef.kouame@2ionline.com',
    password: 'prof123',
    name: 'Chef Kouamé Yao',
    role: 'professor',
    avatar: '/images/testimonial-1.jpg',
    formation: 'CAP Cuisine',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    email: 'prof.diallo@2ionline.com',
    password: 'prof123',
    name: 'Professeur Amadou Diallo',
    role: 'professor',
    avatar: '/images/testimonial-3.jpg',
    formation: 'CAP Service',
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    email: 'eleve.marie@2ionline.com',
    password: 'eleve123',
    name: 'Marie Koné',
    role: 'student',
    avatar: '/images/testimonial-1.jpg',
    formation: 'CAP Cuisine',
    createdAt: '2024-03-01',
  },
  {
    id: '5',
    email: 'eleve.jean@2ionline.com',
    password: 'eleve123',
    name: 'Jean-Baptiste Mensah',
    role: 'student',
    avatar: '/images/testimonial-2.jpg',
    formation: 'CAP Service',
    createdAt: '2024-03-15',
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('2ionline_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('2ionline_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const foundUser = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem('2ionline_user', JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return { success: true }
    }
    
    setIsLoading(false)
    return { success: false, error: 'Email ou mot de passe incorrect' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('2ionline_user')
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
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

export { DEMO_USERS }
