import { getSupabaseAdmin } from './supabaseAdmin.js'

const TYPES = ['Lead', 'Student', 'Prospect', 'Other']

/**
 * Adds (or enriches) a row in the contacts directory. De-duplicates by email so
 * repeat form submissions / bookings don't create duplicate cards. Never throws
 * — failures here must not break the originating flow (contact form, booking).
 */
export async function recordContact(
  { name, email, phone = null, type = 'Lead', notes = null } = {},
  adminClient,
) {
  const admin = adminClient || getSupabaseAdmin()
  if (!admin) return { ok: false, skipped: true }

  const cleanEmail = email ? String(email).trim() : null
  const cleanType = TYPES.includes(type) ? type : 'Lead'

  try {
    if (cleanEmail) {
      const { data: rows } = await admin
        .from('contacts')
        .select('id, name, phone, notes')
        .ilike('email', cleanEmail)
        .limit(1)
      const existing = rows?.[0]
      if (existing) {
        // Backfill missing fields without overwriting existing data.
        const patch = {}
        if (!existing.name && name) patch.name = String(name).trim()
        if (!existing.phone && phone) patch.phone = String(phone).trim()
        if (!existing.notes && notes) patch.notes = String(notes).trim()
        if (Object.keys(patch).length) {
          await admin.from('contacts').update(patch).eq('id', existing.id)
        }
        return { ok: true, existing: true, id: existing.id }
      }
    }

    const { data, error } = await admin
      .from('contacts')
      .insert({
        name: (name && String(name).trim()) || cleanEmail || 'Unknown',
        email: cleanEmail,
        phone: phone ? String(phone).trim() : null,
        type: cleanType,
        notes: notes ? String(notes).trim() : null,
      })
      .select('id')
      .single()
    if (error) throw error
    return { ok: true, id: data.id }
  } catch (err) {
    console.error('[recordContact]', err?.message || err)
    return { ok: false, error: err?.message || 'failed' }
  }
}
