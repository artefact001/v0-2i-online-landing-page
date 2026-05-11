"use client"

import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="font-serif text-2xl text-white mb-4">
          Erreur d&apos;authentification
        </h1>
        <p className="text-white/60 mb-8">
          Une erreur s&apos;est produite lors de la connexion. Veuillez réessayer.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center px-6 py-3 bg-[#C9A227] text-[#0a1628] font-semibold rounded-lg hover:bg-[#E8C050] transition-colors"
        >
          Retour à la connexion
        </Link>
      </div>
    </div>
  )
}
