"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

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

/** Ensure the current session belongs to an admin. Returns the admin id or throws. */
async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Non authentifié")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (!profile || profile.role !== "admin") {
    throw new Error("Accès réservé aux administrateurs")
  }
  return user.id
}

export async function listUsers(): Promise<ManagedUser[]> {
  await requireAdmin()
  const admin = createAdminClient()

  const { data: profiles, error } = await admin
    .from("profiles")
    .select("id, email, first_name, last_name, role, phone, is_active, created_at")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)

  // Get email confirmation status from auth
  const { data: authList } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
  const confirmedMap = new Map<string, boolean>()
  for (const u of authList?.users ?? []) {
    confirmedMap.set(u.id, Boolean(u.email_confirmed_at))
  }

  return (profiles ?? []).map((p) => ({
    id: p.id,
    email: p.email ?? "",
    firstName: p.first_name ?? "",
    lastName: p.last_name ?? "",
    role: p.role,
    phone: p.phone,
    isActive: p.is_active ?? true,
    createdAt: p.created_at,
    emailConfirmed: confirmedMap.get(p.id) ?? false,
  }))
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
    const admin = createAdminClient()

    const { data, error } = await admin.auth.admin.createUser({
      email: input.email.trim().toLowerCase(),
      password: input.password,
      email_confirm: true,
      user_metadata: {
        first_name: input.firstName,
        last_name: input.lastName,
        role: input.role,
      },
    })

    if (error) return { success: false, error: error.message }

    // The handle_new_user trigger creates the profile. Ensure fields are synced.
    if (data.user) {
      await admin
        .from("profiles")
        .update({
          first_name: input.firstName,
          last_name: input.lastName,
          role: input.role,
          phone: input.phone ?? null,
          email: input.email.trim().toLowerCase(),
          is_active: true,
        })
        .eq("id", data.user.id)
    }

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
    const admin = createAdminClient()

    const { error } = await admin
      .from("profiles")
      .update({
        first_name: input.firstName,
        last_name: input.lastName,
        role: input.role,
        phone: input.phone ?? null,
      })
      .eq("id", id)

    if (error) return { success: false, error: error.message }

    await admin.auth.admin.updateUserById(id, {
      user_metadata: { first_name: input.firstName, last_name: input.lastName, role: input.role },
    })

    revalidatePath("/dashboard/admin/users")
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erreur inconnue" }
  }
}

export async function setUserActive(id: string, isActive: boolean): Promise<ActionResult> {
  try {
    await requireAdmin()
    const admin = createAdminClient()

    const { error } = await admin.from("profiles").update({ is_active: isActive }).eq("id", id)
    if (error) return { success: false, error: error.message }

    // Banning blocks sign-in; "none" unblocks.
    await admin.auth.admin.updateUserById(id, {
      ban_duration: isActive ? "none" : "876000h",
    })

    revalidatePath("/dashboard/admin/users")
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erreur inconnue" }
  }
}

export async function resetUserPassword(id: string, password: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    const admin = createAdminClient()
    const { error } = await admin.auth.admin.updateUserById(id, { password })
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erreur inconnue" }
  }
}

export async function deleteUser(id: string): Promise<ActionResult> {
  try {
    const adminId = await requireAdmin()
    if (adminId === id) {
      return { success: false, error: "Vous ne pouvez pas supprimer votre propre compte" }
    }
    const admin = createAdminClient()
    const { error } = await admin.auth.admin.deleteUser(id)
    if (error) return { success: false, error: error.message }

    revalidatePath("/dashboard/admin/users")
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erreur inconnue" }
  }
}
