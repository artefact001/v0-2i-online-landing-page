import { Client } from "pg"

// Strip sslmode from the connection string and force non-verified SSL,
// since Supabase uses a self-signed cert in the chain.
const raw = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || ""
const connectionString = raw.replace(/[?&]sslmode=[^&]*/i, "")

export async function withClient(fn) {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  })
  await client.connect()
  try {
    return await fn(client)
  } finally {
    await client.end()
  }
}

export async function run(sql, params) {
  return withClient((c) => c.query(sql, params))
}
