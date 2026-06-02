import { readFileSync } from "node:fs"
import { run } from "./db.mjs"

const sql = readFileSync(new URL("./seed-content.sql", import.meta.url), "utf8")
try {
  await run(sql)
  console.log("Content seed applied successfully")
} catch (e) {
  console.error("CONTENT SEED ERROR:", e.message)
  process.exitCode = 1
}
