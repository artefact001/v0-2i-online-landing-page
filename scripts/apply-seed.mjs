import { readFileSync } from "node:fs"
import { run, end } from "./db.mjs"

const sql = readFileSync(new URL("./seed.sql", import.meta.url), "utf8")
try {
  await run(sql)
  console.log("Seed (test accounts) applied successfully")
} catch (e) {
  console.error("SEED ERROR:", e.message)
  process.exitCode = 1
} finally {
  await end()
}
