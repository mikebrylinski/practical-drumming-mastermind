#!/usr/bin/env node
/**
 * Quick Supabase connectivity check for local dev / CI.
 * Usage: node --env-file-if-exists=.env scripts/check-supabase.mjs
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const anonKey = process.env.VITE_SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const missing = []
if (!url) missing.push('VITE_SUPABASE_URL (or SUPABASE_URL)')
if (!anonKey) missing.push('VITE_SUPABASE_ANON_KEY')
if (!serviceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY')

if (missing.length) {
  console.error('Missing env vars:\n  - ' + missing.join('\n  - '))
  console.error('\nSee supabase/SETUP.md and .env.example')
  process.exit(1)
}

const anon = createClient(url, anonKey)
const admin = createClient(url, serviceKey)

console.log('Checking Supabase at', url)

const { error: profilesError } = await anon.from('profiles').select('id', { count: 'exact', head: true })
if (profilesError) {
  console.error('profiles table check failed:', profilesError.message)
  console.error('Run supabase/schema.sql in the SQL editor.')
  process.exit(1)
}
console.log('✓ profiles table reachable (anon)')

const { data: users, error: usersError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1 })
if (usersError) {
  console.error('Auth admin check failed:', usersError.message)
  process.exit(1)
}
console.log('✓ service role key works')
console.log(`  ${users?.users?.length ? 'At least one auth user exists' : 'No auth users yet — sign up at /login'}`)

console.log('\nNext: promote your admin account in SQL (see supabase/SETUP.md §3)')
