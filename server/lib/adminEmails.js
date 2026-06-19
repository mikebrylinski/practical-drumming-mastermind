import { getSupabaseAdmin } from './supabaseAdmin.js'

/** Single fallback admin address from env (ADMIN_EMAIL, else the EMAIL_FROM address). */
export function resolveFallbackAdminEmail() {
  const direct = process.env.ADMIN_EMAIL?.trim()
  if (direct) return direct
  const from = process.env.EMAIL_FROM || ''
  const match = from.match(/<([^>]+)>/)
  return match?.[1]?.trim() || null
}

/**
 * Every admin who should be notified (new booking, contact form, etc.). Queries
 * all `profiles.role = 'admin'` accounts (de-duplicated), falling back to the
 * single ADMIN_EMAIL / EMAIL_FROM address when Supabase is unavailable or
 * returns no admins.
 */
export async function resolveAdminEmails() {
  const emails = new Set()
  try {
    const admin = getSupabaseAdmin()
    if (admin) {
      const { data } = await admin.from('profiles').select('email').eq('role', 'admin')
      for (const row of data || []) {
        const email = row?.email?.trim?.()
        if (email) emails.add(email.toLowerCase())
      }
    }
  } catch (err) {
    console.error('[adminEmails] could not load admin emails', err)
  }

  if (emails.size === 0) {
    const fallback = resolveFallbackAdminEmail()
    if (fallback) emails.add(fallback.toLowerCase())
  }

  return [...emails]
}
