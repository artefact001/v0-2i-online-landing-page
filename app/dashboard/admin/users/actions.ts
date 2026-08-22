"use server"

import { revalidatePath } from "next/cache"
import { apiServer, getCurrentUser } from "@/lib/api/server"

/**
 * Schéma Laravel réel (confirmé en lisant FormateurController/Service et
 * EtudiantController/Service) :
 *
 * - Pas de route pour lister/créer un compte "admin" — seuls formateurs et
 *   étudiants sont gérables via l'API. Comptes admin à créer via
 *   seeder/tinker côté Laravel.
 * - GET /formateurs renvoie une structure IMBRIQUÉE :
 *   { id, specialite, user: { id, prenom, nom, email, telephone }, modules: [...] }
 *   (id ci-dessus = l'id du Formateur, PAS l'id du User — distinction
 *   importante pour update/delete, qui opèrent sur l'id Formateur/Etudiant).
 * - GET /etudiants renvoie pareil, avec date_naissance/lieu_naissance/
 *   niveau/formations au lieu de specialite/modules.
 * - Création : AUCUN champ password n'est accepté — Laravel génère un mot
 *   de passe aléatoire à 6 caractères et l'envoie par email. La réponse
 *   contient `password_temporaire` (à afficher à l'admin une seule fois).
 * - Formateur requiert `specialite` (obligatoire), `modules` (optionnel).
 * - Étudiant requiert `date_naissance`, `lieu_naissance`, `niveau`,
 *   `formations` (tous obligatoires, y compris à la MODIFICATION — la
 *   même classe de validation est réutilisée pour update, donc pas de
 *   mise à jour partielle possible côté étudiant).
 * - Aucune route pour activer/désactiver un compte, ni pour qu'un admin
 *   réinitialise le mot de passe d'un tiers.
 */

export type ManagedUser = {
  id: string // id Formateur/Etudiant (PAS l'id User)
  userId: string
  email: string
  firstName: string
  lastName: string
  role: "professor" | "student"
  phone: string | null
  isActive: boolean
  createdAt: string
  emailConfirmed: boolean
  // Spécifique formateur
  specialite?: string
  moduleIds?: string[]
  // Spécifique étudiant
  dateNaissance?: string
  lieuNaissance?: string
  niveau?: string
  formationIds?: string[]
}

type ActionResult = { success: boolean; error?: string; passwordTemporaire?: string }

async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user) throw new Error("Non authentifié")
  if (user.role !== "admin") throw new Error("Accès réservé aux administrateurs")
  return user.id as string
}

function mapUser(raw: any, role: "professor" | "student"): ManagedUser {
  const u = raw.user ?? {}
  return {
    id: String(raw.id),
    userId: String(u.id ?? raw.user_id ?? ""),
    email: u.email ?? "",
    firstName: u.prenom ?? "",
    lastName: u.nom ?? "",
    role,
    phone: u.telephone ?? null,
    isActive: true, // pas de notion de désactivation côté Laravel actuellement
    createdAt: raw.created_at ?? "",
    emailConfirmed: true,
    specialite: raw.specialite ?? undefined,
    moduleIds: Array.isArray(raw.modules) ? raw.modules.map((m: any) => String(m.id)) : undefined,
    dateNaissance: raw.date_naissance ?? undefined,
    lieuNaissance: raw.lieu_naissance ?? undefined,
    niveau: raw.niveau ?? undefined,
    formationIds: Array.isArray(raw.formations) ? raw.formations.map((f: any) => String(f.id)) : undefined,
  }
}

export async function listUsers(): Promise<ManagedUser[]> {
  await requireAdmin()

  const [formateursRes, etudiantsRes] = await Promise.all([
    apiServer("/api/v1/formateurs"),
    apiServer("/api/v1/etudiants"),
  ])

  const formateurs = Array.isArray(formateursRes.data) ? formateursRes.data : []
  const etudiants = Array.isArray(etudiantsRes.data) ? etudiantsRes.data : []

  return [
    ...formateurs.map((f: any) => mapUser(f, "professor")),
    ...etudiants.map((e: any) => mapUser(e, "student")),
  ].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export async function listModules(): Promise<{ id: string; titre: string }[]> {
  await requireAdmin()
  const res = await apiServer("/api/v1/modules")
  const list = Array.isArray(res.data) ? res.data : []
  return list.map((m: any) => ({ id: String(m.id), titre: m.titre }))
}

export async function listFormationsForEnrollment(): Promise<{ id: string; titre: string }[]> {
  await requireAdmin()
  const res = await apiServer("/api/v1/formations")
  const list = Array.isArray(res.data) ? res.data : []
  return list.map((f: any) => ({ id: String(f.id), titre: f.titre }))
}

export async function createUser(input: {
  email: string
  firstName: string
  lastName: string
  role: "admin" | "professor" | "student"
  phone?: string
  specialite?: string
  moduleIds?: string[]
  dateNaissance?: string
  lieuNaissance?: string
  niveau?: string
  formationIds?: string[]
}): Promise<ActionResult> {
  try {
    await requireAdmin()

    if (input.role === "admin") {
      return {
        success: false,
        error: "La création de compte admin n'est pas exposée par l'API — à ajouter côté Laravel.",
      }
    }

    const endpoint = input.role === "professor" ? "/api/v1/formateurs" : "/api/v1/etudiants"

    const body =
      input.role === "professor"
        ? {
            prenom: input.firstName,
            nom: input.lastName,
            telephone: input.phone ?? "",
            email: input.email.trim().toLowerCase(),
            specialite: input.specialite ?? "",
            modules: input.moduleIds ?? [],
          }
        : {
            prenom: input.firstName,
            nom: input.lastName,
            telephone: input.phone ?? "",
            email: input.email.trim().toLowerCase(),
            date_naissance: input.dateNaissance ?? "",
            lieu_naissance: input.lieuNaissance ?? "",
            niveau: input.niveau ?? "",
            formations: input.formationIds ?? [],
          }

    const res = await apiServer(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    })

    revalidatePath("/dashboard/admin/users")
    return { success: true, passwordTemporaire: (res as any)?.password_temporaire }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erreur inconnue" }
  }
}

export async function updateUser(
  id: string,
  input: {
    firstName: string
    lastName: string
    role: "admin" | "professor" | "student"
    phone?: string
    email?: string
    specialite?: string
    moduleIds?: string[]
    dateNaissance?: string
    lieuNaissance?: string
    niveau?: string
    formationIds?: string[]
  },
): Promise<ActionResult> {
  try {
    await requireAdmin()

    if (input.role === "admin") {
      return { success: false, error: "Gestion des comptes admin non exposée par l'API." }
    }

    const endpoint = input.role === "professor" ? `/api/v1/formateurs/${id}` : `/api/v1/etudiants/${id}`

    // ATTENTION: EtudiantController::update réutilise StoreEtudiantRequest
    // (pas de classe "Update" dédiée) — tous les champs y sont validés
    // comme obligatoires, y compris à la modification. On les renvoie donc
    // systématiquement pour un étudiant, même si l'admin ne les a pas
    // changés.
    const body =
      input.role === "professor"
        ? {
            prenom: input.firstName,
            nom: input.lastName,
            telephone: input.phone ?? "",
            email: input.email,
            specialite: input.specialite ?? "",
            modules: input.moduleIds ?? [],
          }
        : {
            prenom: input.firstName,
            nom: input.lastName,
            telephone: input.phone ?? "",
            email: input.email,
            date_naissance: input.dateNaissance ?? "",
            lieu_naissance: input.lieuNaissance ?? "",
            niveau: input.niveau ?? "",
            formations: input.formationIds ?? [],
          }

    await apiServer(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    })

    revalidatePath("/dashboard/admin/users")
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erreur inconnue" }
  }
}

export async function setUserActive(_id: string, _isActive: boolean): Promise<ActionResult> {
  return {
    success: false,
    error: "Fonctionnalité indisponible : aucun endpoint Laravel pour activer/désactiver un compte.",
  }
}

export async function resetUserPassword(_id: string, _password: string): Promise<ActionResult> {
  return {
    success: false,
    error: "Fonctionnalité indisponible : aucun endpoint Laravel pour réinitialiser le mot de passe d'un tiers.",
  }
}

export async function deleteUser(id: string, role: "professor" | "student"): Promise<ActionResult> {
  try {
    const adminId = await requireAdmin()
    if (adminId === id) {
      return { success: false, error: "Vous ne pouvez pas supprimer votre propre compte" }
    }

    const endpoint = role === "professor" ? `/api/v1/formateurs/${id}` : `/api/v1/etudiants/${id}`
    await apiServer(endpoint, { method: "DELETE" })

    revalidatePath("/dashboard/admin/users")
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erreur inconnue" }
  }
}
