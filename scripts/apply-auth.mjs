import { readFileSync } from 'node:fs'
import { run } from './db.mjs'

const sql = readFileSync(new URL('./auth-rls.sql', import.meta.url), 'utf8')

try {
  await run(sql)
  console.log('Auth + RLS applied successfully')
} catch (e) {
  console.error('FAILED:', e.message)
  process.exitCode = 1
}
