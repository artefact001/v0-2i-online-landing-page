"use client"

import { useEffect, useState, useTransition } from "react"
import { DashboardSidebar, DashboardHeader } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ValidatedInput } from "@/components/ui/validated-input"
import { Label } from "@/components/ui/label"
import { Edit, Trash2, Key, Power } from "lucide-react"
import {
  combine,
  required,
  minLength,
  email as emailValidator,
  phone as phoneValidator,
} from "@/lib/validators"
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
  listModules,
  listFormationsForEnrollment,
  createUser,
  updateUser,
  deleteUser,
  setUserActive,
  resetUserPassword,
} from "./actions"
import { TablePagination } from "@/components/admin/table-pagination"

const ROLE_LABELS: Record<ManagedUser["role"], string> = {
  professor: "Professeur",
  student: "Élève",
}

const ROLE_STYLES: Record<ManagedUser["role"], string> = {
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
  const [modules, setModules] = useState<{ id: string; titre: string }[]>([])
  const [formations, setFormations] = useState<{ id: string; titre: string }[]>([])
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [lastPassword, setLastPassword] = useState<string | null>(null)

  // dialog state
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<ManagedUser | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ManagedUser | null>(null)

  // champs communs
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState<ManagedUser["role"]>("student")

  // champs spécifiques formateur
  const [specialite, setSpecialite] = useState("")
  const [moduleIds, setModuleIds] = useState<string[]>([])

  // champs spécifiques étudiant
  const [dateNaissance, setDateNaissance] = useState("")
  const [lieuNaissance, setLieuNaissance] = useState("")
  const [niveau, setNiveau] = useState("")
  const [formationIds, setFormationIds] = useState<string[]>([])

  useEffect(() => {
    listModules().then(setModules).catch(() => {})
    listFormationsForEnrollment().then(setFormations).catch(() => {})
  }, [])

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

  function resetFormFields(presetRole: ManagedUser["role"]) {
    setFirstName("")
    setLastName("")
    setEmail("")
    setPhone("")
    setRole(presetRole)
    setSpecialite("")
    setModuleIds([])
    setDateNaissance("")
    setLieuNaissance("")
    setNiveau("")
    setFormationIds([])
  }

  function openCreate(presetRole: ManagedUser["role"] = "student") {
    setEditing(null)
    resetFormFields(presetRole)
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
    setRole(u.role)
    setSpecialite(u.specialite ?? "")
    setModuleIds(u.moduleIds ?? [])
    setDateNaissance(u.dateNaissance ?? "")
    setLieuNaissance(u.lieuNaissance ?? "")
    setNiveau(u.niveau ?? "")
    setFormationIds(u.formationIds ?? [])
    setFormOpen(true)
  }

  function toggleModuleId(id: string) {
    setModuleIds((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]))
  }

  function toggleFormationId(id: string) {
    setFormationIds((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  function submitForm() {
    startTransition(async () => {
      const common = { firstName, lastName, role, phone }
      const roleSpecific =
        role === "professor"
          ? { specialite, moduleIds }
          : { dateNaissance, lieuNaissance, niveau, formationIds }

      if (editing) {
        const res = await updateUser(editing.id, { ...common, email, ...roleSpecific })
        if (res.success) {
          notify({ type: "success", message: "Utilisateur mis à jour" })
          setFormOpen(false)
          await refresh()
        } else {
          notify({ type: "error", message: res.error ?? "Erreur" })
        }
      } else {
        if (!email) {
          notify({ type: "error", message: "Email requis" })
          return
        }
        const res = await createUser({ email, ...common, ...roleSpecific })
        if (res.success) {
          notify({
            type: "success",
            message: res.passwordTemporaire
              ? `Compte créé — mot de passe envoyé par email (${res.passwordTemporaire})`
              : "Compte créé avec succès",
          })
          setLastPassword(res.passwordTemporaire ?? null)
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
      const res = await deleteUser(deleteTarget.id, deleteTarget.role)
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

  function handleToggleActive(u: ManagedUser) {
    startTransition(async () => {
      const res = await setUserActive(u.id, u.role)
      if (res.success) {
        notify({ type: "success", message: u.isActive ? "Compte désactivé" : "Compte activé" })
        await refresh()
      } else {
        notify({ type: "error", message: res.error ?? "Erreur" })
      }
    })
  }

  function handleResetPassword(u: ManagedUser) {
    if (!confirm(`Réinitialiser le mot de passe de ${u.firstName} ${u.lastName} ? Un nouveau mot de passe lui sera envoyé par email.`)) return
    startTransition(async () => {
      const res = await resetUserPassword(u.id, u.role)
      if (res.success) {
        notify({
          type: "success",
          message: res.passwordTemporaire
            ? `Mot de passe réinitialisé et envoyé par email (${res.passwordTemporaire})`
            : "Mot de passe réinitialisé",
        })
      } else {
        notify({ type: "error", message: res.error ?? "Erreur" })
      }
    })
  }

  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 10

  const filtered = users.filter((u) => {
    const matchesSearch =
      `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === "all" || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pagedUsers = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  // Reset page on filter/search change
  useEffect(() => { setCurrentPage(1) }, [search, roleFilter])

  const counts = {
    total: users.length,
    professor: users.filter((u) => u.role === "professor").length,
    student: users.filter((u) => u.role === "student").length,
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <DashboardSidebar />
      <main className="lg:ml-64">
        <DashboardHeader title="Utilisateurs" subtitle="Gérez les comptes professeurs et élèves" />

        <div className="p-4 md:p-8 space-y-6">
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
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
              <CardContent className="p-5">
                <p className="text-[rgba(255,255,255,0.5)] text-sm">Total</p>
                <p className="text-2xl font-bold text-white mt-1">{counts.total}</p>
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
                      <th className="p-4 text-[rgba(255,255,255,0.4)] text-xs font-medium uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedUsers.map((u) => (
                      <tr key={`${u.role}-${u.id}`} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)]">
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
                          {!u.isActive && (
                            <span className="ml-1.5 text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">
                              Désactivé
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1.5 justify-end flex-wrap">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => openEdit(u)}
                              title="Modifier"
                              className="border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.05)] h-8 w-8"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleResetPassword(u)}
                              title="Réinitialiser le mot de passe"
                              className="border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.05)] h-8 w-8"
                            >
                              <Key className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleToggleActive(u)}
                              title={u.isActive ? "Désactiver" : "Activer"}
                              className="border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.05)] h-8 w-8"
                            >
                              <Power className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => setDeleteTarget(u)}
                              title="Supprimer"
                              className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-8 w-8"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-[rgba(255,255,255,0.4)]">
                          Aucun utilisateur trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {filtered.length > PAGE_SIZE && (
                <div className="p-4 border-t border-[rgba(255,255,255,0.05)]">
                  <TablePagination
                    currentPage={currentPage}
                    totalItems={filtered.length}
                    pageSize={PAGE_SIZE}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Create / Edit dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-[#0d0d1a] border-[rgba(255,255,255,0.1)] text-white max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editing ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
            </DialogTitle>
            <DialogDescription className="text-[rgba(255,255,255,0.5)]">
              {editing
                ? "Mettez à jour les informations du compte."
                : "Un mot de passe est généré automatiquement et envoyé par email — aucune saisie nécessaire ici."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!editing && (
              <div className="space-y-2">
                <Label className="text-[rgba(255,255,255,0.7)]">Type de compte</Label>
                <Select value={role} onValueChange={(v) => setRole(v as ManagedUser["role"])}>
                  <SelectTrigger className="bg-[#0a0a1a] border-[rgba(255,255,255,0.1)] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Élève</SelectItem>
                    <SelectItem value="professor">Professeur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <ValidatedInput
                label="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                validator={combine(required("Le prénom est obligatoire"), minLength(2))}
                className="bg-[#0a0a1a] border-[rgba(255,255,255,0.1)] text-white"
              />
              <ValidatedInput
                label="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                validator={combine(required("Le nom est obligatoire"), minLength(2))}
                className="bg-[#0a0a1a] border-[rgba(255,255,255,0.1)] text-white"
              />
            </div>
            <ValidatedInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              validator={combine(required("L'email est obligatoire"), emailValidator)}
              className="bg-[#0a0a1a] border-[rgba(255,255,255,0.1)] text-white"
            />
            <ValidatedInput
              label="Téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              validator={combine(required("Le téléphone est obligatoire"), phoneValidator)}
              className="bg-[#0a0a1a] border-[rgba(255,255,255,0.1)] text-white"
            />

            {role === "professor" ? (
              <>
                <ValidatedInput
                  label="Spécialité"
                  value={specialite}
                  onChange={(e) => setSpecialite(e.target.value)}
                  placeholder="Ex: Cuisine française"
                  validator={required("La spécialité est obligatoire")}
                  className="bg-[#0a0a1a] border-[rgba(255,255,255,0.1)] text-white"
                />
                <div className="space-y-2">
                  <Label className="text-[rgba(255,255,255,0.7)]">Modules enseignés (optionnel)</Label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-[#0a0a1a] rounded-lg border border-[rgba(255,255,255,0.1)]">
                    {modules.length === 0 && (
                      <p className="text-xs text-[rgba(255,255,255,0.4)]">Aucun module disponible</p>
                    )}
                    {modules.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleModuleId(m.id)}
                        className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                          moduleIds.includes(m.id)
                            ? "bg-[#C9A227] text-[#0a0a1a]"
                            : "bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.6)]"
                        }`}
                      >
                        {m.titre}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-[rgba(255,255,255,0.7)]">Date de naissance</Label>
                    <Input
                      type="date"
                      value={dateNaissance}
                      onChange={(e) => setDateNaissance(e.target.value)}
                      className="bg-[#0a0a1a] border-[rgba(255,255,255,0.1)] text-white"
                    />
                  </div>
                  <ValidatedInput
                    label="Lieu de naissance"
                    value={lieuNaissance}
                    onChange={(e) => setLieuNaissance(e.target.value)}
                    validator={required("Le lieu de naissance est obligatoire")}
                    className="bg-[#0a0a1a] border-[rgba(255,255,255,0.1)] text-white"
                  />
                </div>
                <ValidatedInput
                  label="Niveau"
                  value={niveau}
                  onChange={(e) => setNiveau(e.target.value)}
                  placeholder="Ex: Débutant"
                  validator={required("Le niveau est obligatoire")}
                  className="bg-[#0a0a1a] border-[rgba(255,255,255,0.1)] text-white"
                />
                <div className="space-y-2">
                  <Label className="text-[rgba(255,255,255,0.7)]">Formation(s) *</Label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-[#0a0a1a] rounded-lg border border-[rgba(255,255,255,0.1)]">
                    {formations.length === 0 && (
                      <p className="text-xs text-[rgba(255,255,255,0.4)]">Aucune formation disponible</p>
                    )}
                    {formations.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => toggleFormationId(f.id)}
                        className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                          formationIds.includes(f.id)
                            ? "bg-[#C9A227] text-[#0a0a1a]"
                            : "bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.6)]"
                        }`}
                      >
                        {f.titre}
                      </button>
                    ))}
                  </div>
                  {formationIds.length === 0 && (
                    <p className="text-xs text-red-400">Au moins une formation est obligatoire</p>
                  )}
                </div>
              </>
            )}
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
