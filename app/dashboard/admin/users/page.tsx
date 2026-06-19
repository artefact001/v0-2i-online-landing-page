"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { UsersManager } from "./users-manager"
import { listUsers, type ManagedUser } from "./actions"

function AdminUsersContent() {
  const [users, setUsers] = useState<ManagedUser[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  const newParam = searchParams.get("new")
  const initialNewRole =
    newParam === "student" || newParam === "professor" || newParam === "admin" ? newParam : null

  useEffect(() => {
    listUsers()
      .then(setUsers)
      .catch((e) => setError(e instanceof Error ? e.message : "Erreur de chargement"))
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  if (users === null) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <UsersManager initialUsers={users} initialNewRole={initialNewRole} />
}

export default function AdminUsersPage() {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <AdminUsersContent />
      </Suspense>
    </AuthGuard>
  )
}
