"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, AlertCircle, Shield, User, GraduationCap } from "lucide-react"
import Link from "next/link"

export default function SetupAdminPage() {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSetRole = async () => {
    if (!email || !role) {
      setMessage({ type: "error", text: "Veuillez remplir tous les champs" })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      // Find user by email
      const { data: profile, error: findError } = await supabase
        .from("profiles")
        .select("id, email, role")
        .eq("email", email)
        .single()

      if (findError || !profile) {
        setMessage({ type: "error", text: "Utilisateur non trouve. Verifiez l'email." })
        setLoading(false)
        return
      }

      // Update role
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", profile.id)

      if (updateError) {
        setMessage({ type: "error", text: "Erreur lors de la mise a jour: " + updateError.message })
      } else {
        setMessage({ type: "success", text: `Role "${role}" attribue avec succes a ${email}` })
        setEmail("")
        setRole("")
      }
    } catch (err) {
      setMessage({ type: "error", text: "Une erreur est survenue" })
    }

    setLoading(false)
  }

  const testAccounts = [
    { email: "admin@2ionline.com", role: "admin", label: "Administrateur", icon: Shield },
    { email: "professeur@2ionline.com", role: "professor", label: "Professeur", icon: GraduationCap },
    { email: "etudiant@2ionline.com", role: "student", label: "Etudiant", icon: User },
  ]

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-[#0D1B2A] rounded-xl border border-[#1a2942] p-8">
          <div className="text-center mb-8">
            <Shield className="w-12 h-12 text-[#C9A227] mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Configuration Admin</h1>
            <p className="text-gray-400 text-sm">
              Attribuez les roles aux utilisateurs inscrits
            </p>
          </div>

          {/* Quick setup buttons */}
          <div className="mb-8 space-y-3">
            <p className="text-sm text-gray-400 mb-3">Configuration rapide des comptes de test:</p>
            {testAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => {
                  setEmail(account.email)
                  setRole(account.role)
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-[#1a2942] hover:border-[#C9A227]/50 hover:bg-[#1a2942] transition-all text-left"
              >
                <account.icon className="w-5 h-5 text-[#C9A227]" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{account.label}</p>
                  <p className="text-xs text-gray-500">{account.email}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Manual form */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Email de l&apos;utilisateur</label>
              <Input
                type="email"
                placeholder="email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#1a2942] border-[#1a2942] text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Role a attribuer</label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="bg-[#1a2942] border-[#1a2942] text-white">
                  <SelectValue placeholder="Selectionnez un role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="professor">Professeur</SelectItem>
                  <SelectItem value="student">Etudiant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {message && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              }`}>
                {message.type === "success" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <p className="text-sm">{message.text}</p>
              </div>
            )}

            <Button
              onClick={handleSetRole}
              disabled={loading || !email || !role}
              className="w-full bg-[#C9A227] text-[#0D1B2A] hover:bg-[#E8C050]"
            >
              {loading ? "Attribution..." : "Attribuer le role"}
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-[#1a2942] text-center">
            <Link href="/login" className="text-[#C9A227] text-sm hover:underline">
              Retour a la connexion
            </Link>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-[#0D1B2A]/50 rounded-xl border border-[#1a2942] p-6">
          <h3 className="font-semibold mb-3">Instructions:</h3>
          <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
            <li>Creez d&apos;abord les comptes via <Link href="/inscription" className="text-[#C9A227] hover:underline">/inscription</Link></li>
            <li>Confirmez les emails (verifiez spam)</li>
            <li>Utilisez cette page pour attribuer les roles</li>
            <li>Connectez-vous avec le compte approprie</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
