"use server"

import { revalidatePath } from "next/cache"
import { apiServer, getCurrentUser } from "@/lib/api/server"

/**
 * Schéma Laravel réel (confirmé en lisant FormateurController/Service,
 * EtudiantController/Service, et désormais PartenaireController/Service) :
 *
 * - Pas de route pour lister/créer un compte "admin" — seuls formateurs,
 *   étudiants et partenaires sont gérables via l'API. Comptes admin à
 *   créer via seeder/tinker côté Laravel.
 * - GET /formateurs|etudiants|partenaires renvoie une structure IMBRIQUÉE :
 *   { id, ..., user: { id, prenom, nom, email, telephone }, ... }
 *   (id ci-dessus = l'id Formateur/Etudiant/Partenaire, PAS l'id du User).
 * - Création : AUCUN champ password n'est accepté — Laravel génère un mot
 *   de passe aléatoire à 6 caractères et l'envoie par email.
 * - Formateur requiert `specialite` (obligatoire), `modules` (optionnel).
 * - Étudiant requiert `date_naissance`, `lieu_naissance`, `niveau`,
 *   `formations` (tous obligatoires, y compris à la MODIFICATION).
 * - Partenaire requiert `nom_organisation` (obligatoire), `secteur`
 *   (optionnel). Le financement d'une formation (montant + date) se
 *   gère séparément via financerFormation()/retirerFinancement().
 */

export type ManagedUser = {
  id: string // id Formateur/Etudiant/Partenaire (PAS l'id User)
  userId: string
  email: string
  firstName: string
  lastName: string
  role: "professor" | "student" | "partner"
  phone: string | null
  isActive: boolean
  createdAt: string
  emailConfirmed: boolean
  // Spécifique formateur
  specialite?: string
  moduleIds?: string[]
  formationId?: string // formation dont ce formateur est propriétaire (formations.user_id) — un seul, pas un tableau
  // Spécifique étudiant
  dateNaissance?: string
  lieuNaissance?: string
  niveau?: string
  formationIds?: string[]
  // Spécifique partenaire
  nomOrganisation?: string
  secteur?: string
  financedFormations?: { id: string; titre: string; montant: string; date: string }[]
}

type ActionResult = { success: boolean; error?: string; passwordTemporaire?: string }

async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user) throw new Error("Non authentifié")
  if (user.role !== "admin") throw new Error("Accès réservé aux administrateurs")
  return user.id as string
}

function mapUser(raw: any, role: "professor" | "student" | "partner"): ManagedUser {
  const u = raw.user ?? {}
  return {
    id: String(raw.id),
    userId: String(u.id ?? raw.user_id ?? ""),
    email: u.email ?? "",
    firstName: u.prenom ?? "",
    lastName: u.nom ?? "",
    role,
    phone: u.telephone ?? null,
    isActive: u.is_active ?? true,
    createdAt: raw.created_at ?? "",
    emailConfirmed: true,
    specialite: raw.specialite ?? undefined,
    moduleIds: Array.isArray(raw.modules) ? raw.modules.map((m: any) => String(m.id)) : undefined,
    // Le backend renvoie "formations" pour un formateur aussi (voir
    // FormateurService::getAll()/getById(), qui charge la formation dont
    // il est réellement propriétaire via formations.user_id) — un seul
    // élément possible ici (pas de many-to-many côté formateur).
    formationId: role === "professor" && Array.isArray(raw.formations) && raw.formations[0] ? String(raw.formations[0].id) : undefined,
    dateNaissance: raw.date_naissance ?? undefined,
    lieuNaissance: raw.lieu_naissance ?? undefined,
    niveau: raw.niveau ?? undefined,
    formationIds: Array.isArray(raw.formations) && role === "student" ? raw.formations.map((f: any) => String(f.id)) : undefined,
    nomOrganisation: raw.nom_organisation ?? undefined,
    secteur: raw.secteur ?? undefined,
    financedFormations:
      role === "partner" && Array.isArray(raw.formations)
        ? raw.formations.map((f: any) => ({
            id: String(f.id),
            titre: f.titre,
            montant: f.pivot?.montant_finance ?? "0",
            date: f.pivot?.date_financement ?? "",
          }))
        : undefined,
  }
}

export async function listUsers(): Promise<ManagedUser[]> {
  await requireAdmin()

  // Promise.allSettled (pas Promise.all) : si UN SEUL de ces 3 appels
  // échoue (ex: /partenaires, le plus récent et donc le plus susceptible
  // de rencontrer un souci ponctuel côté backend), les deux autres
  // doivent quand même s'afficher plutôt que de tout faire planter.
  const [formateursRes, etudiantsRes, partenairesRes] = await Promise.allSettled([
    apiServer("/api/v1/formateurs"),
    apiServer("/api/v1/etudiants"),
    apiServer("/api/v1/partenaires"),
  ])

  if (formateursRes.status === "rejected") console.error("[listUsers] Échec /formateurs:", formateursRes.reason)
  if (etudiantsRes.status === "rejected") console.error("[listUsers] Échec /etudiants:", etudiantsRes.reason)
  if (partenairesRes.status === "rejected") console.error("[listUsers] Échec /partenaires:", partenairesRes.reason)

  const formateurs = formateursRes.status === "fulfilled" && Array.isArray(formateursRes.value.data) ? formateursRes.value.data : []
  const etudiants = etudiantsRes.status === "fulfilled" && Array.isArray(etudiantsRes.value.data) ? etudiantsRes.value.data : []
  const partenaires = partenairesRes.status === "fulfilled" && Array.isArray(partenairesRes.value.data) ? partenairesRes.value.data : []

  return [
    ...formateurs.map((f: any) => mapUser(f, "professor")),
    ...etudiants.map((e: any) => mapUser(e, "student")),
    ...partenaires.map((p: any) => mapUser(p, "partner")),
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
  role: "admin" | "professor" | "student" | "partner"
  phone?: string
  specialite?: string
  moduleIds?: string[]
  formationId?: string
  dateNaissance?: string
  lieuNaissance?: string
  niveau?: string
  formationIds?: string[]
  nomOrganisation?: string
  secteur?: string
}): Promise<ActionResult> {
  try {
    await requireAdmin()

    if (input.role === "admin") {
      return {
        success: false,
        error: "La création de compte admin n'est pas exposée par l'API — à ajouter côté Laravel.",
      }
    }

    const endpoint =
      input.role === "professor" ? "/api/v1/formateurs" : input.role === "partner" ? "/api/v1/partenaires" : "/api/v1/etudiants"

    const common = {
      prenom: input.firstName,
      nom: input.lastName,
      telephone: input.phone ?? "",
      email: input.email.trim().toLowerCase(),
    }

    const body =
      input.role === "professor"
        ? { ...common, specialite: input.specialite ?? "", modules: input.moduleIds ?? [], formation_id: input.formationId || null }
        : input.role === "partner"
          ? { ...common, nom_organisation: input.nomOrganisation ?? "", secteur: input.secteur ?? undefined }
          : {
              ...common,
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
    role: "admin" | "professor" | "student" | "partner"
    phone?: string
    email?: string
    specialite?: string
    moduleIds?: string[]
    formationId?: string
    dateNaissance?: string
    lieuNaissance?: string
    niveau?: string
    formationIds?: string[]
    nomOrganisation?: string
    secteur?: string
  },
): Promise<ActionResult> {
  try {
    await requireAdmin()

    if (input.role === "admin") {
      return { success: false, error: "Gestion des comptes admin non exposée par l'API." }
    }

    const endpoint =
      input.role === "professor"
        ? `/api/v1/formateurs/${id}`
        : input.role === "partner"
          ? `/api/v1/partenaires/${id}`
          : `/api/v1/etudiants/${id}`

    const common = {
      prenom: input.firstName,
      nom: input.lastName,
      telephone: input.phone ?? "",
      email: input.email,
    }

    // ATTENTION: EtudiantController::update réutilise StoreEtudiantRequest
    // (pas de classe "Update" dédiée) — tous les champs y sont validés
    // comme obligatoires, y compris à la modification. On les renvoie donc
    // systématiquement pour un étudiant, même si l'admin ne les a pas
    // changés.
    const body =
      input.role === "professor"
        ? { ...common, specialite: input.specialite ?? "", modules: input.moduleIds ?? [], formation_id: input.formationId || null }
        : input.role === "partner"
          ? { ...common, nom_organisation: input.nomOrganisation ?? "", secteur: input.secteur ?? undefined }
          : {
              ...common,
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

function endpointFor(role: "professor" | "student" | "partner", id: string, suffix = "") {
  const base = role === "professor" ? "formateurs" : role === "partner" ? "partenaires" : "etudiants"
  return `/api/v1/${base}/${id}${suffix}`
}

export async function setUserActive(id: string, role: "professor" | "student" | "partner"): Promise<ActionResult> {
  try {
    await requireAdmin()
    await apiServer(endpointFor(role, id, "/toggle-active"), { method: "PUT" })
    revalidatePath("/dashboard/admin/users")
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erreur inconnue" }
  }
}

export async function resetUserPassword(id: string, role: "professor" | "student" | "partner"): Promise<ActionResult> {
  try {
    await requireAdmin()
    const res = await apiServer(endpointFor(role, id, "/reset-password"), { method: "POST" })
    revalidatePath("/dashboard/admin/users")
    return { success: true, passwordTemporaire: (res as any)?.password_temporaire }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erreur inconnue" }
  }
}

export async function deleteUser(id: string, role: "professor" | "student" | "partner"): Promise<ActionResult> {
  try {
    const adminId = await requireAdmin()
    if (adminId === id) {
      return { success: false, error: "Vous ne pouvez pas supprimer votre propre compte" }
    }

    await apiServer(endpointFor(role, id), { method: "DELETE" })

    revalidatePath("/dashboard/admin/users")
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erreur inconnue" }
  }
}

// --- Gestion du financement (spécifique aux partenaires) ---

export async function financerFormation(
  partenaireId: string,
  formationId: string,
  montant: number,
  date: string,
): Promise<ActionResult> {
  try {
    await requireAdmin()
    await apiServer(`/api/v1/partenaires/${partenaireId}/financer`, {
      method: "POST",
      body: JSON.stringify({ formation_id: formationId, montant_finance: montant, date_financement: date }),
    })
    revalidatePath("/dashboard/admin/users")
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erreur inconnue" }
  }
}

export async function retirerFinancement(partenaireId: string, formationId: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    await apiServer(`/api/v1/partenaires/${partenaireId}/financer/${formationId}`, { method: "DELETE" })
    revalidatePath("/dashboard/admin/users")
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erreur inconnue" }
  }
}
