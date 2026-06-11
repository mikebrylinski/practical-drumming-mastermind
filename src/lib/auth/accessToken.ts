import type { Session } from '@supabase/supabase-js'
import { supabase } from '../supabase/client'

/** Latest session mirrored from Supabase auth events (always in sync with storage). */
let latestSession: Session | null = null

if (supabase) {
  void supabase.auth.getSession().then(({ data }) => {
    latestSession = data.session
  })
  supabase.auth.onAuthStateChange((_event, session) => {
    latestSession = session
  })
}

function sessionExpired(session: Session | null | undefined): boolean {
  if (!session?.expires_at) return false
  // Refresh one minute before expiry.
  return session.expires_at * 1000 <= Date.now() + 60_000
}

function pickSession(session?: Session | null): Session | null {
  if (session?.access_token) return session
  if (latestSession?.access_token) return latestSession
  return session ?? latestSession ?? null
}

/** Fresh access token for server admin API routes (egress, etc.). */
export async function getAccessToken(session?: Session | null): Promise<string | null> {
  if (!supabase) return session?.access_token ?? null

  let active = pickSession(session)

  if (active?.access_token && !sessionExpired(active)) {
    return active.access_token
  }

  const { data: stored } = await supabase.auth.getSession()
  if (stored.session?.access_token) {
    active = stored.session
    latestSession = stored.session
    if (!sessionExpired(active)) {
      return active.access_token
    }
  }

  const refreshToken = active?.refresh_token
  if (refreshToken) {
    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    })
    if (refreshed.session?.access_token) {
      latestSession = refreshed.session
      return refreshed.session.access_token
    }
    if (refreshError) {
      console.warn('[auth] refreshSession failed:', refreshError.message)
    }
  } else {
    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession()
    if (refreshed.session?.access_token) {
      latestSession = refreshed.session
      return refreshed.session.access_token
    }
    if (refreshError) {
      console.warn('[auth] refreshSession failed:', refreshError.message)
    }
  }

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) {
    console.warn('[auth] getUser failed:', userError.message)
  } else if (userData.user) {
    const { data: afterUser } = await supabase.auth.getSession()
    if (afterUser.session?.access_token) {
      latestSession = afterUser.session
      return afterUser.session.access_token
    }
  }

  return null
}

export async function adminRequestHeaders(
  session?: Session | null,
  demoAdmin?: boolean,
): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = await getAccessToken(session)
  if (token) {
    headers.Authorization = `Bearer ${token}`
  } else if (demoAdmin) {
    headers['X-Demo-Admin'] = 'true'
  }
  return headers
}
