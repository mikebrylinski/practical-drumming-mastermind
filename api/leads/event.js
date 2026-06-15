import { getSupabaseAdmin } from '../../server/lib/supabaseAdmin.js'
import { scoreForEvent } from '../../server/lib/leadScoring.js'
import { clientIpFromRequest } from '../../server/lib/clientIp.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(204).end()
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const { type, path, metadata, visitorId, userId } = body

    if (!type) {
      return res.status(400).json({ ok: false, error: 'type is required' })
    }

    const scoreDelta = scoreForEvent(type)
    const admin = getSupabaseAdmin()

    if (!admin) {
      // Mock mode: no DB configured. Acknowledge so the UI keeps working.
      console.log('[POST /api/leads/event] (mock)', type, path ?? '')
      return res.status(202).json({ ok: true, mock: true })
    }

    const { error } = await admin.from('lead_events').insert({
      user_id: userId || null,
      visitor_id: visitorId || null,
      type,
      path: path || null,
      metadata: metadata || {},
      score_delta: scoreDelta,
      ip_address: clientIpFromRequest(req),
    })

    if (error) {
      console.error('[POST /api/leads/event]', error)
      return res.status(500).json({ ok: false, error: 'Insert failed' })
    }

    return res.status(201).json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
