import { getSupabaseAdmin } from '../supabaseAdmin.js'
import { verifyAdminRequest, handleOptions } from '../livekit/_lib.js'

const TYPES = ['Lead', 'Student', 'Prospect', 'Other']

function parseBody(req) {
  if (!req.body) return {}
  return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body
}

/** Admin contacts directory: GET (list), POST (create), DELETE (remove). */
export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  const auth = await verifyAdminRequest(req)
  if (!auth.ok) {
    return res.status(auth.status || 401).json({ ok: false, error: auth.error })
  }

  const admin = getSupabaseAdmin()
  // Demo / unconfigured: signal the client to use its local fallback store.
  if (!admin || auth.demo) {
    if (req.method === 'GET') return res.status(200).json({ ok: true, demo: true, contacts: [] })
    return res.status(200).json({ ok: true, demo: true })
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await admin
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return res.status(200).json({ ok: true, contacts: data ?? [] })
    }

    if (req.method === 'POST') {
      const body = parseBody(req)
      const name = String(body.name ?? '').trim()
      if (!name) return res.status(400).json({ ok: false, error: 'name is required' })
      const payload = {
        name,
        email: body.email ? String(body.email).trim() : null,
        phone: body.phone ? String(body.phone).trim() : null,
        type: TYPES.includes(body.type) ? body.type : 'Lead',
        notes: body.notes ? String(body.notes).trim() : null,
      }
      const { data, error } = await admin.from('contacts').insert(payload).select('*').single()
      if (error) throw error
      return res.status(201).json({ ok: true, contact: data })
    }

    if (req.method === 'DELETE') {
      const id = req.query?.id || parseBody(req).id
      if (!id) return res.status(400).json({ ok: false, error: 'id is required' })
      const { error } = await admin.from('contacts').delete().eq('id', id)
      if (error) throw error
      return res.status(200).json({ ok: true })
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  } catch (err) {
    console.error('[admin/contacts]', err)
    return res.status(500).json({ ok: false, error: err?.message || 'Server error' })
  }
}
