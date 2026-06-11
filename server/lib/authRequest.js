import { getSupabaseAdmin } from './supabaseAdmin.js'

function supabaseUrl() {
  return process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
}

function supabaseAnonKey() {
  return (
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    ''
  )
}

function authHeaderFromRequest(req) {
  const raw = req.headers.authorization || req.headers.Authorization
  if (!raw || !String(raw).startsWith('Bearer ')) return null
  const token = String(raw).slice(7).trim()
  if (!token) return null
  return `Bearer ${token}`
}

/**
 * Resolve the signed-in user from an incoming API request.
 * Uses the Auth API (publishable/anon key + bearer header) first, then
 * falls back to service-role JWT verification for legacy tokens.
 */
export async function resolveUserFromRequest(req) {
  const authorization = authHeaderFromRequest(req)
  if (!authorization) {
    return { user: null, error: 'Missing authorization token' }
  }

  const url = supabaseUrl()
  const anonKey = supabaseAnonKey()

  if (url && anonKey) {
    try {
      const res = await fetch(`${url.replace(/\/$/, '')}/auth/v1/user`, {
        headers: {
          Authorization: authorization,
          apikey: anonKey,
        },
      })
      if (res.ok) {
        const user = await res.json()
        if (user?.id) return { user, error: null }
      } else {
        const body = await res.json().catch(() => ({}))
        console.warn('[auth] bearer /auth/v1/user failed:', body.msg || body.message || res.status)
      }
    } catch (err) {
      console.warn('[auth] bearer /auth/v1/user error:', err?.message || err)
    }
  }

  const admin = getSupabaseAdmin()
  const token = authorization.slice(7)
  if (!admin) {
    return { user: null, error: 'Auth not configured' }
  }

  const { data, error } = await admin.auth.getUser(token)
  if (error || !data.user) {
    return { user: null, error: error?.message || 'Invalid or expired session' }
  }
  return { user: data.user, error: null }
}

export async function resolveAdminFromRequest(req) {
  const { user, error } = await resolveUserFromRequest(req)
  if (!user) return { ok: false, user: null, error: error || 'Unauthorized' }

  const admin = getSupabaseAdmin()
  if (!admin) {
    return req.headers['x-demo-admin'] === 'true'
      ? { ok: true, user: { id: 'demo-admin' }, error: null }
      : { ok: false, user: null, error: 'Auth not configured' }
  }

  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'admin') {
    return { ok: false, user, error: 'Admin access required' }
  }

  return { ok: true, user, error: null }
}
