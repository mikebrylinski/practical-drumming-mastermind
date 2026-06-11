/** When true, /login shows the seed-data dashboard chooser even if Supabase is configured. */
export const isDemoLoginEnabled =
  import.meta.env.VITE_DEMO_LOGIN === 'true' || import.meta.env.VITE_DEMO_LOGIN === '1'

export const SEED_DATA_SESSION_KEY = 'pdm-seed-data-role'

/** True when Supabase keys exist and demo login is off — the normal production mode. */
export function isRealSupabaseAuthEnabled(isSupabaseConfigured: boolean): boolean {
  return isSupabaseConfigured && !isDemoLoginEnabled
}

/** Demo build: seed login always grants admin (Member/Admin only picks the landing page). */
export function seedSignInAsAdmin(mockMode: boolean): boolean {
  return mockMode || isDemoLoginEnabled
}

export function clearStoredSeedSession() {
  try {
    sessionStorage.removeItem(SEED_DATA_SESSION_KEY)
  } catch {
    /* no-op */
  }
}
