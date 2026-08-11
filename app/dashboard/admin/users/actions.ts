"use server"

import { revalidatePath } from "next/cache"
import { apiServer, getCurrentUser } from "@/lib/api/server"

/**
 * ATTENTION — mismatch d'architecture entre le frontend (une seule table "users"
 * avec un champ role) et le backend Laravel (deux ressources séparées:
 * /v1/formateurs et /v1/etudiants, chacune réservée aux admins). Conséquences :
 *
 * 1. Il n'existe AUCUNE route pour lister/créer un "admin" — seuls formateurs et
 *    étudiants sont gérables via l'API actuelle. La création/liste des comptes admin
 *    doit être ajoutée côté Laravel (ou faite via un seeder/tinker en dehors du frontend).
 * 2. Il n'existe AUCUNE route "activer/désactiver un compte" (is_active/ban) ni de route
 *    "admin réinitialise le mot de passe d'un autre utilisateur". setUserActive() et
 *    resetUserPassword() sont donc désactivées ci-dessous en attendant ces endpoints.
 * 3. Changer un utilisateur d'étudiant à formateur (ou inversement) supposerait de le
 *    supprimer d'une ressource et le recréer dans l'autre — non géré ici, à confirmer
 *    avec toi si ce cas d'usage existe vraiment.
 */

export type ManagedUser = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "admin" | "professor" | "student"
  phone: string | null
  isActive: boolean
  createdAt: string
  emailConfirmed: boolean
}

type ActionResult = { success: boolean; error?: string }

async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user) throw new Error("Non authentifié")
  if (user.role !== "admin") throw new Error("Accès réservé aux administrateurs")
  return user.id as string
}

function mapUser(raw: any, role: "professor" | "student"): ManagedUser {
  return {
    id: String(raw.id),
    email: raw.email ?? "",
    firstName: raw.first_name ?? "",
    lastName: raw.last_name ?? "",
    role,
    phone: raw.phone ?? null,
    isActive: raw.is_active ?? true,
    createdAt: raw.created_at ?? "",
    emailConfirmed: true, // pas de notion de confirmation email visible côté Laravel
  }
}

export async function listUsers(): Promise<ManagedUser[]> {
  await requireAdmin()

  const [formateursRes, etudiantsRes] = await Promise.all([
    apiServer("/v1/formateurs"),
    apiServer("/v1/etudiants"),
  ])

  const formateurs = Array.isArray(formateursRes.data) ? formateursRes.data : []
  const etudiants = Array.isArray(etudiantsRes.data) ? etudiantsRes.data : []

  return [
    ...formateurs.map((f: any) => mapUser(f, "professor")),
    ...etudiants.map((e: any) => mapUser(e, "student")),
  ].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export async function createUser(input: {
  email: string
  password: string
  firstName: string
  lastName: string
  role: "admin" | "professor" | "student"
  phone?: string
}): Promise<ActionResult> {
  try {
    await requireAdmin()

    if (input.role === "admin") {
      return {
        success: false,
        error: "La création de compte admin n'est pas exposée par l'API — à ajouter côté Laravel.",
      }
    }

    const endpoint = input.role === "professor" ? "/v1/formateurs" : "/v1/etudiants"

    await apiServer(endpoint, {
      method: "POST",
      body: JSON.stringify({
        email: input.email.trim().toLowerCase(),
        password: input.password,
        first_name: input.firstName,
        last_name: input.lastName,
        phone: input.phone ?? null,
      }),
    })

    revalidatePath("/dashboard/admin/users")
    return { success: true }
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
  },
): Promise<ActionResult> {
  try {
    await requireAdmin()

    if (input.role === "admin") {
      return { success: false, error: "Gestion des comptes admin non exposée par l'API." }
    }

    const endpoint = input.role === "professor" ? `/v1/formateurs/${id}` : `/v1/etudiants/${id}`

    await apiServer(endpoint, {
      method: "PUT",
      body: JSON.stringify({
        first_name: input.firstName,
        last_name: input.lastName,
        phone: input.phone ?? null,
      }),
    })

    revalidatePath("/dashboard/admin/users")
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erreur inconnue" }
  }
}

export async function setUserActive(_id: string, _isActive: boolean): Promise<ActionResult> {
  // Aucune route Laravel pour activer/désactiver un compte (ban) dans routes/api.php.
  // À ajouter côté backend avant de pouvoir réactiver cette fonctionnalité.
  return {
    success: false,
    error: "Fonctionnalité indisponible : aucun endpoint Laravel pour activer/désactiver un compte.",
  }
}

export async function resetUserPassword(_id: string, _password: string): Promise<ActionResult> {
  // Aucune route "admin réinitialise le mot de passe d'un autre utilisateur" dans
  // routes/api.php — seules les routes self-service (changePassword) et publiques
  // (forgotPassword/resetPassword par email) existent.
  return {
    success: false,
    error: "Fonctionnalité indisponible : aucun endpoint Laravel pour réinitialiser le mot de passe d'un tiers.",
  }
}

export async function deleteUser(id: string): Promise<ActionResult> {
  try {
    const adminId = await requireAdmin()
    if (adminId === id) {
      return { success: false, error: "Vous ne pouvez pas supprimer votre propre compte" }
    }

    // On ne connaît pas le rôle a priori : on tente formateur puis étudiant.
    try {
      await apiServer(`/v1/formateurs/${id}`, { method: "DELETE" })
    } catch {
      await apiServer(`/v1/etudiants/${id}`, { method: "DELETE" })
    }

    revalidatePath("/dashboard/admin/users")
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erreur inconnue" }
  }
}
