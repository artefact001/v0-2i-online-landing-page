"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { UsersManager } from "./users-manager"
import { listUsers, type ManagedUser } from "./actions"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ManagedUser[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listUsers()
      .then(setUsers)
      .catch((e) => setError(e instanceof Error ? e.message : "Erreur de chargement"))
  }, [])

  return (
    <AuthGuard allowedRoles={["admin"]}>
      {error ? (
        <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
          <p className="text-red-400">{error}</p>
        </div>
      ) : users === null ? (
        <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <UsersManager initialUsers={users} />
      )}
    </AuthGuard>
  )
}
