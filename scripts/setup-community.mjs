#!/usr/bin/env node
/**
 * Apply community forum tables to Supabase.
 * Usage: node --env-file-if-exists=.env scripts/setup-community.mjs
 *
 * Requires SUPABASE_DB_URL (Dashboard → Connect → URI) or DATABASE_URL.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'

const { Client } = pg
const root = dirname(fileURLToPath(import.meta.url))
const sqlPath = join(root, '../supabase/migrations/community_forum.sql')
const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL

if (!dbUrl) {
  console.error('Missing SUPABASE_DB_URL or DATABASE_URL.')
  console.error('Supabase Dashboard → Connect → copy the Postgres URI, then run:')
  console.error('  SUPABASE_DB_URL="postgresql://..." node --env-file-if-exists=.env scripts/setup-community.mjs')
  process.exit(1)
}

const sql = readFileSync(sqlPath, 'utf8')
const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } })

try {
  await client.connect()
  await client.query(sql)
  console.log('✓ Community forum tables applied')
} catch (err) {
  console.error('Migration failed:', err.message)
  process.exit(1)
} finally {
  await client.end()
}
