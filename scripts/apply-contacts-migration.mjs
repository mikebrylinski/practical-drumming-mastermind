#!/usr/bin/env node
/**
 * Apply the contacts directory migration (public.contacts table + RLS).
 *
 * Usage:
 *   SUPABASE_DB_URL="postgresql://..." npm run setup:contacts
 *
 * Get the URI from Supabase Dashboard → Connect → Postgres connection string.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'

const { Client } = pg
const root = dirname(fileURLToPath(import.meta.url))
const sqlPath = join(root, '../supabase/migrations/contacts.sql')
const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL

if (!dbUrl) {
  console.error('Missing SUPABASE_DB_URL or DATABASE_URL.')
  console.error('Supabase Dashboard → Connect → copy the Postgres URI, then run:')
  console.error('  SUPABASE_DB_URL="postgresql://..." npm run setup:contacts')
  process.exit(1)
}

const sql = readFileSync(sqlPath, 'utf8')
const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } })

try {
  await client.connect()
  await client.query(sql)
  console.log('✓ Contacts migration applied (public.contacts table + RLS)')
} catch (err) {
  console.error('Migration failed:', err.message)
  process.exit(1)
} finally {
  await client.end()
}
