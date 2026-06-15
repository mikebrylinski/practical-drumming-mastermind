import { getSupabaseAdmin } from '../supabaseAdmin.js'
import { handleOptions, verifyAdminRequest } from '../livekit/_lib.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  if (req.method !== 'PATCH') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const auth = await verifyAdminRequest(req)
    if (!auth.ok) {
      return res.status(auth.status).json({ ok: false, error: auth.error })
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const { id, is_published, title } = body

    if (!id) {
      return res.status(400).json({ ok: false, error: 'id is required' })
    }

    const admin = getSupabaseAdmin()
    if (!admin) {
      return res.status(503).json({ ok: false, error: 'Database not configured' })
    }

    const patch = {}
    if (typeof is_published === 'boolean') patch.is_published = is_published
    if (typeof title === 'string') patch.title = title.trim() || null

    if (Object.keys(patch).length === 0) {
      return res.status(400).json({ ok: false, error: 'Nothing to update' })
    }

    const { data, error } = await admin
      .from('session_recordings')
      .update(patch)
      .eq('id', id)
      .select('*')
      .maybeSingle()

    if (error) {
      console.error('[recordings/update]', error)
      const message = error.message?.includes('is_published')
        ? 'Vault publish column missing — run supabase/migrations/20250614_platform_updates.sql'
        : error.message || 'Update failed'
      return res.status(500).json({ ok: false, error: message })
    }

    return res.status(200).json({ ok: true, recording: data })
  } catch (err) {
    console.error('[recordings/update]', err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
