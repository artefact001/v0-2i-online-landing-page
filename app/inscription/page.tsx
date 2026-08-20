"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { apiClient } from '@/lib/api/client'
import { register } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle, Eye, EyeOff } from 'lucide-react'

interface Formation {
  id: string
  name: string
  price: number
  slug: string
}

export default function InscriptionPage() {
  const [step, setStep] = useState(1)
  const [formations, setFormations] = useState<Formation[]>([])
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    formationId: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [formationsLoading, setFormationsLoading] = useState(true)
  const [formationsError, setFormationsError] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function loadFormations() {
      setFormationsLoading(true)
      setFormationsError('')
      try {
        // Pas de filtre ?is_active côté requête : on ne sait pas si
        // FormationController::index le supporte, et le pire cas (afficher
        // une formation inactive) est bien moins grave que le pire cas
        // actuel (liste vide silencieuse).
        const res = await apiClient<Formation[]>('/formations')

        // Tolère plusieurs formes de réponse possibles côté Laravel :
        // { success: true, data: [...] }, { data: [...] } (wrapping par
        // défaut d'un ResourceCollection Laravel), ou un tableau brut.
        const raw: unknown = res
        let list: Formation[] = []
        if (Array.isArray((res as any)?.data)) {
          list = (res as any).data
        } else if (Array.isArray(raw)) {
          list = raw as Formation[]
        } else {
          console.error('[inscription] Forme de réponse /formations inattendue:', res)
        }

        if (list.length === 0) {
          setFormationsError(
            "Aucune formation disponible pour le moment. Si tu es admin, vérifie que la table formations n'est pas vide côté Laravel.",
          )
        }
        setFormations(list)
      } catch (err) {
        console.error('Error loading formations:', err)
        setFormationsError('Impossible de charger les formations. Réessaie dans quelques instants.')
      }
      setFormationsLoading(false)
    }
    loadFormations()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setIsLoading(true)

    try {
      // NOTE: noms de champs (first_name/last_name/phone) supposés d'après
      // RegisterRequest — à vérifier côté Laravel si l'inscription échoue.
      const result = await register({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      })

      if (!result.success) {
        if (result.message?.toLowerCase().includes('already') || result.message?.toLowerCase().includes('déjà')) {
          setError('Un compte existe déjà avec cette adresse email')
        } else {
          setError(result.message || 'Une erreur est survenue')
        }
        setIsLoading(false)
        return
      }

      // Créer l'inscription si une formation a été sélectionnée
      // À VÉRIFIER: champs attendus par InscriptionController::store
      if (formData.formationId && result.user) {
        try {
          const enrollRes = await apiClient<{ id: string }>('/inscriptions', {
            method: 'POST',
            body: JSON.stringify({
              student_id: result.user.id,
              formation_id: formData.formationId,
              status: 'pending',
              payment_status: 'pending',
            }),
          })

          const enrollmentId = (enrollRes.data as any)?.id
          if (enrollmentId) {
            // Compte + inscription créés : direction le paiement pour finaliser.
            router.push(`/payment?enrollment_id=${enrollmentId}`)
            return
          }
        } catch (enrollErr) {
          console.error('Error creating enrollment:', enrollErr)
        }
      }

      // Pas de formation sélectionnée (ou création d'inscription échouée) :
      // écran de confirmation classique.
      setSuccess(true)
    } catch (err) {
      setError('Une erreur est survenue')
      console.error(err)
    }

    setIsLoading(false)
  }

  const selectedFormation = formations.find(f => f.id === formData.formationId)

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-4">
            Inscription réussie!
          </h1>
          <p className="text-[rgba(255,255,255,0.6)] mb-8">
            Votre compte a été créé avec succès. Vous pouvez dès maintenant accéder à votre espace.
          </p>
          <Link href="/dashboard">
            <Button className="bg-[#C9A227] hover:bg-[#B8860B] text-white px-8">
              Accéder à mon espace
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C9A227] to-[#B8860B] flex items-center justify-center">
              <span className="text-white font-bold text-lg font-serif">2I</span>
            </div>
            <span className="text-white font-serif text-lg font-semibold">2I Online</span>
          </Link>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  step >= s 
                    ? 'bg-[#C9A227] text-white' 
                    : 'bg-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.4)]'
                }`}>
                  {s}
                </div>
                <span className={`text-sm ${step >= s ? 'text-white' : 'text-[rgba(255,255,255,0.4)]'}`}>
                  {s === 1 ? 'Informations' : 'Formation'}
                </span>
                {s < 2 && <div className="w-12 h-px bg-[rgba(255,255,255,0.2)]" />}
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-serif font-bold text-white mb-2">
              {step === 1 ? 'Créer votre compte' : 'Choisir une formation'}
            </h1>
            <p className="text-[rgba(255,255,255,0.6)] text-sm">
              {step === 1 
                ? 'Remplissez vos informations personnelles' 
                : 'Sélectionnez la formation qui vous intéresse'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-[rgba(255,255,255,0.8)]">
                      Prénom
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Jean"
                      className="h-11 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.3)]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-[rgba(255,255,255,0.8)]">
                      Nom
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Dupont"
                      className="h-11 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.3)]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[rgba(255,255,255,0.8)]">
                    Adresse email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="votre@email.com"
                    className="h-11 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.3)]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[rgba(255,255,255,0.8)]">
                    Téléphone (WhatsApp)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+221 77 000 00 00"
                    className="h-11 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.3)]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[rgba(255,255,255,0.8)]">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Min. 6 caractères"
                      className="h-11 pr-11 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.3)]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.5)] hover:text-[#C9A227] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[rgba(255,255,255,0.8)]">
                    Confirmer le mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="h-11 pr-11 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white placeholder:text-[rgba(255,255,255,0.3)]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label={showConfirm ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.5)] hover:text-[#C9A227] transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => {
                    if (formData.firstName && formData.lastName && formData.email && formData.phone && formData.password && formData.confirmPassword) {
                      if (formData.password !== formData.confirmPassword) {
                        setError('Les mots de passe ne correspondent pas')
                        return
                      }
                      setError('')
                      setStep(2)
                    } else {
                      setError('Veuillez remplir tous les champs')
                    }
                  }}
                  className="w-full h-11 bg-[#C9A227] hover:bg-[#B8860B] text-white font-semibold"
                >
                  Continuer
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label className="text-[rgba(255,255,255,0.8)]">
                    Choisissez votre formation
                  </Label>
                  <Select
                    value={formData.formationId}
                    onValueChange={(value) => setFormData({ ...formData, formationId: value })}
                    disabled={formationsLoading || formations.length === 0}
                  >
                    <SelectTrigger className="h-11 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white">
                      <SelectValue
                        placeholder={
                          formationsLoading ? 'Chargement des formations...' : 'Sélectionnez une formation'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a2e] border-[rgba(255,255,255,0.1)]">
                      {formations.map((formation) => (
                        <SelectItem 
                          key={formation.id} 
                          value={formation.id}
                          className="text-white hover:bg-[rgba(255,255,255,0.1)] focus:bg-[rgba(255,255,255,0.1)]"
                        >
                          {formation.name} - {formation.price.toLocaleString()} FCFA
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formationsError && (
                    <p className="text-amber-400 text-xs mt-1">{formationsError}</p>
                  )}
                </div>

                {selectedFormation && (
                  <div className="p-4 bg-[rgba(201,162,39,0.1)] border border-[rgba(201,162,39,0.3)] rounded-lg">
                    <h3 className="text-[#C9A227] font-semibold mb-2">{selectedFormation.name}</h3>
                    <p className="text-2xl font-bold text-white">
                      {selectedFormation.price.toLocaleString()} <span className="text-sm font-normal text-[rgba(255,255,255,0.6)]">FCFA</span>
                    </p>
                    <p className="text-[rgba(255,255,255,0.6)] text-sm mt-2">
                      Le paiement sera effectué après validation de votre compte
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-11 bg-transparent border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.05)]"
                  >
                    Retour
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.formationId}
                    className="flex-1 h-11 bg-[#C9A227] hover:bg-[#B8860B] text-white font-semibold"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Inscription...
                      </span>
                    ) : (
                      "S'inscrire"
                    )}
                  </Button>
                </div>
              </>
            )}
          </form>

          <p className="mt-6 text-center text-[rgba(255,255,255,0.5)] text-sm">
            Déjà inscrit?{' '}
            <Link href="/login" className="text-[#C9A227] hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block w-[45%] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1a] via-transparent to-transparent z-10" />
        <Image
          src="/images/course-patisserie.jpg"
          alt="Formation pâtisserie"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}
