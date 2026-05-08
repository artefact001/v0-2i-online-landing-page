"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      // Redirect based on role
      const storedUser = localStorage.getItem('2ionline_user')
      if (storedUser) {
        const user = JSON.parse(storedUser)
        switch (user.role) {
          case 'admin':
            router.push('/dashboard/admin')
            break
          case 'professor':
            router.push('/dashboard/professor')
            break
          case 'student':
            router.push('/dashboard/student')
            break
          default:
            router.push('/')
        }
      }
    } else {
      setError(result.error || 'Une erreur est survenue')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9A227] to-[#B8860B] flex items-center justify-center">
              <span className="text-white font-bold text-xl font-serif">2I</span>
            </div>
            <div>
              <span className="text-white font-serif text-xl font-semibold tracking-wide">2I Online</span>
              <p className="text-[rgba(255,255,255,0.5)] text-xs">Plateforme de Formation</p>
            </div>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-white mb-2">
              Connexion
            </h1>
            <p className="text-[rgba(255,255,255,0.6)]">
              Accédez à votre espace de formation
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[rgba(255,255,255,0.8)]">
                Adresse email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="h-12 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.3)] focus:border-[#C9A227] focus:ring-[#C9A227]/20"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[rgba(255,255,255,0.8)]">
                  Mot de passe
                </Label>
                <Link href="#" className="text-sm text-[#C9A227] hover:underline">
                  Mot de passe oublié?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.3)] focus:border-[#C9A227] focus:ring-[#C9A227]/20"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-[#C9A227] to-[#B8860B] hover:from-[#B8860B] hover:to-[#C9A227] text-white font-semibold"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Connexion en cours...
                </span>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 p-4 bg-[rgba(201,162,39,0.1)] border border-[rgba(201,162,39,0.2)] rounded-lg">
            <h3 className="text-[#C9A227] font-semibold text-sm mb-3">Comptes de démonstration</h3>
            <div className="space-y-2 text-xs text-[rgba(255,255,255,0.7)]">
              <div className="flex justify-between">
                <span className="font-medium">Admin:</span>
                <span>admin@2ionline.com / admin123</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Professeur:</span>
                <span>chef.kouame@2ionline.com / prof123</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Élève:</span>
                <span>eleve.marie@2ionline.com / eleve123</span>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-[rgba(255,255,255,0.5)] text-sm">
            Pas encore inscrit?{' '}
            <Link href="/#tarifs" className="text-[#C9A227] hover:underline">
              Découvrir nos formations
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1a] via-transparent to-transparent z-10" />
        <Image
          src="/images/hero-chef.jpg"
          alt="Formation culinaire"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-transparent z-10" />
        
        {/* Overlay content */}
        <div className="absolute bottom-0 left-0 right-0 p-12 z-20">
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-[#C9A227] rounded-full" />
              <span className="text-[#C9A227] text-sm font-medium uppercase tracking-wider">Formation d&apos;excellence</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-white mb-4">
              Rejoignez plus de 500 professionnels formés
            </h2>
            <p className="text-[rgba(255,255,255,0.7)]">
              Accédez à des cours de qualité dispensés par des experts de l&apos;industrie hôtelière et culinaire.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
