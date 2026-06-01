import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("[v0] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const accounts = [
  {
    email: "admin@2ionline.com",
    password: "Admin2024!",
    first_name: "Admin",
    last_name: "2I Online",
    role: "admin",
  },
  {
    email: "professeur@2ionline.com",
    password: "Prof2024!",
    first_name: "Chef",
    last_name: "Diallo",
    role: "professor",
  },
  {
    email: "etudiant@2ionline.com",
    password: "Eleve2024!",
    first_name: "Moussa",
    last_name: "Ndiaye",
    role: "student",
  },
]

async function run() {
  // List existing users
  const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const existing = new Map((list?.users || []).map((u) => [u.email, u]))

  for (const acc of accounts) {
    let userId

    if (existing.has(acc.email)) {
      const u = existing.get(acc.email)
      userId = u.id
      // Update password + confirm email
      await admin.auth.admin.updateUserById(userId, {
        password: acc.password,
        email_confirm: true,
        user_metadata: {
          first_name: acc.first_name,
          last_name: acc.last_name,
          role: acc.role,
        },
      })
      console.log(`[v0] Updated existing user: ${acc.email}`)
    } else {
      const { data, error } = await admin.auth.admin.createUser({
        email: acc.email,
        password: acc.password,
        email_confirm: true,
        user_metadata: {
          first_name: acc.first_name,
          last_name: acc.last_name,
          role: acc.role,
        },
      })
      if (error) {
        console.error(`[v0] Error creating ${acc.email}:`, error.message)
        continue
      }
      userId = data.user.id
      console.log(`[v0] Created user: ${acc.email}`)
    }

    // Upsert profile with correct role
    const { error: profileError } = await admin
      .from("profiles")
      .upsert(
        {
          id: userId,
          email: acc.email,
          first_name: acc.first_name,
          last_name: acc.last_name,
          role: acc.role,
          is_active: true,
        },
        { onConflict: "id" },
      )

    if (profileError) {
      console.error(`[v0] Error upserting profile for ${acc.email}:`, profileError.message)
    } else {
      console.log(`[v0] Profile set for ${acc.email} -> role: ${acc.role}`)
    }
  }

  console.log("[v0] Done.")
}

run().catch((e) => {
  console.error("[v0] Fatal:", e)
  process.exit(1)
})
