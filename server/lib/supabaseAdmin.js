import { createClient } from '@supabase/supabase-js'

let cached = null

function resolveUrl() {
  return process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
}

export function isSupabaseAdminConfigured() {
  return Boolean(resolveUrl() && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

/**
 * Service-role Supabase client for serverless functions. Bypasses RLS, so it
 * must only ever be used server-side. Returns null when env is not configured
 * (callers should degrade gracefully).
 */
export function getSupabaseAdmin() {
  if (!isSupabaseAdminConfigured()) return null
  if (!cached) {
    cached = createClient(resolveUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return cached
}
