import { handleOptions, verifyAdminRequest } from '../livekit/_lib.js'
import { getSupabaseAdmin } from '../supabaseAdmin.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return
  if (req.method !== 'PATCH') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const auth = await verifyAdminRequest(req)
    if (!auth.ok) {
      return res.status(auth.status || 403).json({ ok: false, error: auth.error })
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const { id, hidden } = body

    if (!id) {
      return res.status(400).json({ ok: false, error: 'id is required' })
    }
    if (typeof hidden !== 'boolean') {
      return res.status(400).json({ ok: false, error: 'hidden must be a boolean' })
    }

    const admin = getSupabaseAdmin()
    if (!admin) {
      return res.status(503).json({ ok: false, error: 'Database not configured' })
    }

    const { data, error } = await admin
      .from('bookings')
      .update({ hidden })
      .eq('id', id)
      .select('*')
      .maybeSingle()

    if (error) {
      console.error('[admin/bookings/update]', error)
      return res.status(500).json({ ok: false, error: error.message || 'Update failed' })
    }
    if (!data) {
      return res.status(404).json({ ok: false, error: 'Booking not found' })
    }

    return res.status(200).json({ ok: true, booking: data })
  } catch (err) {
    console.error('[admin/bookings/update]', err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
