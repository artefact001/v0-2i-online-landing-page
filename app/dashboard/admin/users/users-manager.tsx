"use client"

import { useEffect, useState, useTransition } from "react"
import { DashboardSidebar, DashboardHeader } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  type ManagedUser,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  setUserActive,
  resetUserPassword,
} from "./actions"

const ROLE_LABELS: Record<ManagedUser["role"], string> = {
  admin: "Administrateur",
  professor: "Professeur",
  student: "Élève",
}

const ROLE_STYLES: Record<ManagedUser["role"], string> = {
  admin: "bg-[#C9A227]/20 text-[#C9A227]",
  professor: "bg-blue-500/20 text-blue-400",
  student: "bg-green-500/20 text-green-400",
}

type Feedback = { type: "success" | "error"; message: string } | null

export function UsersManager({
  initialUsers,
  initialNewRole,
}: {
  initialUsers: ManagedUser[]
  initialNewRole?: ManagedUser["role"] | null
}) {
  const [users, setUsers] = useState<ManagedUser[]>(initialUsers)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<Feedback>(null)

  // dialog state
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<ManagedUser | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ManagedUser | null>(null)
  const [pwdTarget, setPwdTarget] = useState<ManagedUser | null>(null)

  // form fields
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<ManagedUser["role"]>("student")

  function notify(f: Feedback) {
    setFeedback(f)
    if (f) setTimeout(() => setFeedback(null), 4000)
  }

  async function refresh() {
    try {
      const fresh = await listUsers()
      setUsers(fresh)
    } catch {
      // ignore refresh errors; feedback already shown for the action
    }
  }

  function openCreate(presetRole: ManagedUser["role"] = "student") {
    setEditing(null)
    setFirstName("")
    setLastName("")
    setEmail("")
    setPhone("")
    setPassword("")
    setRole(presetRole)
    setFormOpen(true)
  }

  useEffect(() => {
    if (initialNewRole) {
      openCreate(initialNewRole)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialNewRole])

  function openEdit(u: ManagedUser) {
    setEditing(u)
    setFirstName(u.firstName)
    setLastName(u.lastName)
    setEmail(u.email)
    setPhone(u.phone ?? "")
    setPassword("")
    setRole(u.role)
    setFormOpen(true)
  }

  function submitForm() {
    startTransition(async () => {
      if (editing) {
        const res = await updateUser(editing.id, { firstName, lastName, role, phone })
        if (res.success) {
          notify({ type: "success", message: "Utilisateur mis à jour" })
          setFormOpen(false)
          await refresh()
        } else {
          notify({ type: "error", message: res.error ?? "Erreur" })
        }
      } else {
        if (!email || !password) {
          notify({ type: "error", message: "Email et mot de passe requis" })
          return
        }
        const res = await createUser({ email, password, firstName, lastName, role, phone })
        if (res.success) {
          notify({ type: "success", message: "Compte créé avec succès" })
          setFormOpen(false)
          await refresh()
        } else {
          notify({ type: "error", message: res.error ?? "Erreur" })
        }
      }
    })
  }

  function confirmDelete() {
    if (!deleteTarget) return
    startTransition(async () => {
      const res = await deleteUser(deleteTarget.id)
      if (res.success) {
        notify({ type: "success", message: "Utilisateur supprimé" })
        setDeleteTarget(null)
        await refresh()
      } else {
        notify({ type: "error", message: res.error ?? "Erreur" })
        setDeleteTarget(null)
      }
    })
  }

  function toggleActive(u: ManagedUser) {
    startTransition(async () => {
      const res = await setUserActive(u.id, !u.isActive)
      if (res.success) {
        notify({ type: "success", message: !u.isActive ? "Compte activé" : "Compte désactivé" })
        await refresh()
      } else {
        notify({ type: "error", message: res.error ?? "Erreur" })
      }
    })
  }

  function submitPassword() {
    if (!pwdTarget || !password) return
    startTransition(async () => {
      const res = await resetUserPassword(pwdTarget.id, password)
      if (res.success) {
        notify({ type: "success", message: "Mot de passe réinitialisé" })
        setPwdTarget(null)
        setPassword("")
      } else {
        notify({ type: "error", message: res.error ?? "Erreur" })
      }
    })
  }

  const filtered = users.filter((u) => {
    const matchesSearch =
      `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === "all" || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const counts = {
    total: users.length,
    admin: users.filter((u) => u.role === "admin").length,
    professor: users.filter((u) => u.role === "professor").length,
    student: users.filter((u) => u.role === "student").length,
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="ml-64">
        <DashboardHeader title="Utilisateurs" subtitle="Gérez les comptes administrateurs, professeurs et élèves" />

        <div className="p-8 space-y-6">
          {feedback && (
            <div
              className={`rounded-lg px-4 py-3 text-sm ${
                feedback.type === "success"
                  ? "bg-green-500/15 text-green-400 border border-green-500/30"
                  : "bg-red-500/15 text-red-400 border border-red-500/30"
              }`}
              role="status"
            >
              {feedback.message}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="p-5">
                <p className="text-[rgba(255,255,255,0.5)] text-sm">Total</p>
                <p className="text-2xl font-bold text-white mt-1">{counts.total}</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="p-5">
                <p className="text-[rgba(255,255,255,0.5)] text-sm">Administrateurs</p>
                <p className="text-2xl font-bold text-[#C9A227] mt-1">{counts.admin}</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="p-5">
                <p className="text-[rgba(255,255,255,0.5)] text-sm">Professeurs</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">{counts.professor}</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="p-5">
                <p className="text-[rgba(255,255,255,0.5)] text-sm">Élèves</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{counts.student}</p>
              </CardContent>
            </Card>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <Input
                placeholder="Rechercher un utilisateur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#0d0d1a] border-[rgba(255,255,255,0.1)] text-white sm:max-w-xs"
              />
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="bg-[#0d0d1a] border-[rgba(255,255,255,0.1)] text-white sm:w-48">
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="admin">Administrateurs</SelectItem>
                  <SelectItem value="professor">Professeurs</SelectItem>
                  <SelectItem value="student">Élèves</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => openCreate()} className="bg-[#C9A227] text-[#0a0a1a] hover:bg-[#b8941f] font-medium">
              + Nouvel utilisateur
            </Button>
          </div>

          {/* Table */}
          <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[rgba(255,255,255,0.05)]">
                      <th className="p-4 text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase">Nom</th>
                      <th className="p-4 text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase">Email</th>
                      <th className="p-4 text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase">Rôle</th>
                      <th className="p-4 text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase">Statut</th>
                      <th className="p-4 text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((u) => (
                      <tr key={u.id} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)]">
                        <td className="p-4">
                          <p className="text-white font-medium">
                            {u.firstName} {u.lastName}
                          </p>
                          {u.phone && <p className="text-[rgba(255,255,255,0.4)] text-xs">{u.phone}</p>}
                        </td>
                        <td className="p-4 text-[rgba(255,255,255,0.7)] text-sm">{u.email}</td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${ROLE_STYLES[u.role]}`}>
                            {ROLE_LABELS[u.role]}
                          </span>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={
                              u.isActive
                                ? "border-green-500/40 text-green-400"
                                : "border-red-500/40 text-red-400"
                            }
                          >
                            {u.isActive ? "Actif" : "Désactivé"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2 justify-end flex-wrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEdit(u)}
                              className="border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.05)]"
                            >
                              Modifier
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setPwdTarget(u)
                                setPassword("")
                              }}
                              className="border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.05)]"
                            >
                              Mot de passe
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleActive(u)}
                              disabled={isPending}
                              className="border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.05)]"
                            >
                              {u.isActive ? "Désactiver" : "Activer"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteTarget(u)}
                              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                            >
                              Supprimer
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-[rgba(255,255,255,0.4)]">
                          Aucun utilisateur trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Create / Edit dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-[#0d0d1a] border-[rgba(255,255,255,0.1)] text-white">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editing ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
            </DialogTitle>
            <DialogDescription className="text-[rgba(255,255,255,0.5)]">
              {editing
                ? "Mettez à jour les informations du compte."
                : "Créez un nouveau compte. L'email sera confirmé automatiquement."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-[rgba(255,255,255,0.7)]">Prénom</Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-[#0a0a1a] border-[rgba(255,255,255,0.1)] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[rgba(255,255,255,0.7)]">Nom</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-[#0a0a1a] border-[rgba(255,255,255,0.1)] text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[rgba(255,255,255,0.7)]">Email</Label>
              <Input
                type="email"
                value={email}
                disabled={!!editing}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#0a0a1a] border-[rgba(255,255,255,0.1)] text-white disabled:opacity-50"
              />
            </div>
            {!editing && (
              <div className="space-y-2">
                <Label className="text-[rgba(255,255,255,0.7)]">Mot de passe</Label>
                <Input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#0a0a1a] border-[rgba(255,255,255,0.1)] text-white"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-[rgba(255,255,255,0.7)]">Téléphone</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-[#0a0a1a] border-[rgba(255,255,255,0.1)] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[rgba(255,255,255,0.7)]">Rôle</Label>
                <Select value={role} onValueChange={(v) => setRole(v as ManagedUser["role"])}>
                  <SelectTrigger className="bg-[#0a0a1a] border-[rgba(255,255,255,0.1)] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Élève</SelectItem>
                    <SelectItem value="professor">Professeur</SelectItem>
                    <SelectItem value="admin">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFormOpen(false)}
              className="border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.05)]"
            >
              Annuler
            </Button>
            <Button
              onClick={submitForm}
              disabled={isPending}
              className="bg-[#C9A227] text-[#0a0a1a] hover:bg-[#b8941f] font-medium"
            >
              {isPending ? "Enregistrement..." : editing ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password reset dialog */}
      <Dialog open={!!pwdTarget} onOpenChange={(o) => !o && setPwdTarget(null)}>
        <DialogContent className="bg-[#0d0d1a] border-[rgba(255,255,255,0.1)] text-white">
          <DialogHeader>
            <DialogTitle className="font-serif">Réinitialiser le mot de passe</DialogTitle>
            <DialogDescription className="text-[rgba(255,255,255,0.5)]">
              Nouveau mot de passe pour {pwdTarget?.firstName} {pwdTarget?.lastName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label className="text-[rgba(255,255,255,0.7)]">Nouveau mot de passe</Label>
            <Input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#0a0a1a] border-[rgba(255,255,255,0.1)] text-white"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPwdTarget(null)}
              className="border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.05)]"
            >
              Annuler
            </Button>
            <Button
              onClick={submitPassword}
              disabled={isPending || !password}
              className="bg-[#C9A227] text-[#0a0a1a] hover:bg-[#b8941f] font-medium"
            >
              {isPending ? "..." : "Réinitialiser"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-[#0d0d1a] border-[rgba(255,255,255,0.1)] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">Supprimer cet utilisateur ?</AlertDialogTitle>
            <AlertDialogDescription className="text-[rgba(255,255,255,0.5)]">
              Le compte de {deleteTarget?.firstName} {deleteTarget?.lastName} ({deleteTarget?.email}) sera
              définitivement supprimé. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.05)]">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
