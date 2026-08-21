"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { forgotPassword, resetPassword } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ValidatedInput } from '@/components/ui/validated-input'
import { Label } from '@/components/ui/label'
import { combine, required, email as emailValidator, matches } from '@/lib/validators'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'reset'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const result = await forgotPassword(email)

      if (!result.success) {
        setError(result.message || 'Une erreur est survenue')
        setIsLoading(false)
        return
      }

      setSuccess('Un code de réinitialisation a été envoyé à votre adresse email.')
      setStep('reset')
    } catch (err) {
      setError('Une erreur est survenue')
      console.error('[v0] Forgot password error:', err)
    }

    setIsLoading(false)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setIsLoading(true)

    try {
      const result = await resetPassword({
        email,
        code,
        password,
        password_confirmation: confirmPassword,
      })

      if (!result.success) {
        setError(result.message || 'Une erreur est survenue')
        setIsLoading(false)
        return
      }

      setSuccess('Mot de passe réinitialisé avec succès. Redirection...')
      setTimeout(() => router.push('/login'), 1500)
    } catch (err) {
      setError('Une erreur est survenue')
      console.error('[v0] Reset password error:', err)
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex">
      {/* Left side - Form */}
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
              Mot de passe oublié
            </h1>
            <p className="text-[rgba(255,255,255,0.6)]">
              {step === 'email'
                ? 'Entrez votre email pour recevoir un code de réinitialisation'
                : 'Entrez le code reçu par email et votre nouveau mot de passe'}
            </p>
          </div>

          {step === 'email' ? (
            <form onSubmit={handleRequestCode} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <ValidatedInput
                label="Adresse email"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                validator={combine(required("L'email est obligatoire"), emailValidator)}
                className="h-12 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.3)] focus:border-[#C9A227] focus:ring-[#C9A227]/20"
                required
              />

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
                    Envoi en cours...
                  </span>
                ) : (
                  'Recevoir le code'
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                  {success}
                </div>
              )}

              <ValidatedInput
                label="Code de réinitialisation"
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Code reçu par email"
                validator={required("Le code est obligatoire")}
                className="h-12 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.3)] focus:border-[#C9A227] focus:ring-[#C9A227]/20"
                required
              />

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[rgba(255,255,255,0.8)]">
                  Nouveau mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setPasswordTouched(true)}
                    placeholder="••••••••"
                    className={`h-12 pr-12 bg-[rgba(255,255,255,0.05)] text-white placeholder:text-[rgba(255,255,255,0.3)] ${
                      passwordTouched && password && password.length < 6
                        ? 'border-red-500'
                        : password.length >= 6
                          ? 'border-green-500'
                          : 'border-[rgba(255,255,255,0.1)]'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.5)] hover:text-[#C9A227] transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {passwordTouched && password && password.length < 6 && (
                  <p className="text-xs text-red-400">Le mot de passe doit contenir au moins 6 caractères</p>
                )}
              </div>

              <ValidatedInput
                label="Confirmer le mot de passe"
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                validator={combine(required("La confirmation est obligatoire"), matches(password, "Les mots de passe ne correspondent pas"))}
                className="h-12 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.3)] focus:border-[#C9A227] focus:ring-[#C9A227]/20"
                required
              />

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
                    Réinitialisation...
                  </span>
                ) : (
                  'Réinitialiser le mot de passe'
                )}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep('email')
                  setError('')
                  setSuccess('')
                }}
                className="w-full text-center text-sm text-[#C9A227] hover:underline"
              >
                Renvoyer le code / Changer d'email
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-[rgba(255,255,255,0.5)] text-sm">
            Vous vous souvenez de votre mot de passe ?{' '}
            <Link href="/login" className="text-[#C9A227] hover:underline">
              Se connecter
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
              Récupérez l&apos;accès à votre espace de formation
            </h2>
            <p className="text-[rgba(255,255,255,0.7)]">
              Un code de réinitialisation vous sera envoyé par email pour créer un nouveau mot de passe en toute sécurité.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
