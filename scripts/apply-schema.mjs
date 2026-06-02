import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { withClient } from "./db.mjs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const sql = readFileSync(join(__dirname, "schema.sql"), "utf8")

await withClient(async (c) => {
  await c.query(sql)
  const { rows } = await c.query(
    "select table_name from information_schema.tables where table_schema='public' order by table_name",
  )
  console.log(
    "TABLES:",
    rows.map((r) => r.table_name).join(", "),
  )
})
console.log("SCHEMA APPLIED OK")
