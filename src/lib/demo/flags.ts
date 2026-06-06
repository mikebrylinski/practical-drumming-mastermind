/** When true, /login shows the seed-data dashboard chooser even if Supabase is configured. */
export const isDemoLoginEnabled =
  import.meta.env.VITE_DEMO_LOGIN === 'true' || import.meta.env.VITE_DEMO_LOGIN === '1'

export const SEED_DATA_SESSION_KEY = 'pdm-seed-data-role'

/** Demo build: seed login always grants admin (Member/Admin only picks the landing page). */
export function seedSignInAsAdmin(mockMode: boolean): boolean {
  return mockMode || isDemoLoginEnabled
}
