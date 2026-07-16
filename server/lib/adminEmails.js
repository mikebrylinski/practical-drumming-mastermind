import { getSupabaseAdmin } from './supabaseAdmin.js'

/**
 * Addresses that must always be notified on new bookings / contact submissions,
 * no matter what Supabase or env vars say. Mike's inbox is guaranteed here.
 */
const ALWAYS_NOTIFY = ['m.malinin@gmail.com']

/** Single fallback admin address from env (ADMIN_EMAIL, else the EMAIL_FROM address). */
export function resolveFallbackAdminEmail() {
  const direct = process.env.ADMIN_EMAIL?.trim()
  if (direct) return direct
  const from = process.env.EMAIL_FROM || ''
  const match = from.match(/<([^>]+)>/)
  return match?.[1]?.trim() || null
}

/**
 * Every admin who should be notified (new booking, contact form, etc.). Always
 * includes the ALWAYS_NOTIFY addresses (e.g. Mike), plus any comma-separated
 * ADMIN_EMAIL values, plus all `profiles.role = 'admin'` accounts. De-duplicated.
 */
export async function resolveAdminEmails() {
  const emails = new Set()

  for (const addr of ALWAYS_NOTIFY) {
    if (addr) emails.add(addr.toLowerCase())
  }

  const adminEnv = process.env.ADMIN_EMAIL || ''
  for (const addr of adminEnv.split(',')) {
    const email = addr.trim()
    if (email) emails.add(email.toLowerCase())
  }

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

  return [...emails]
}
