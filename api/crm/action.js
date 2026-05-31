import { getSupabaseAdmin } from '../../server/lib/supabaseAdmin.js'

async function updateApplications(admin, { userId, email }, patch) {
  let query = admin.from('applications').update({ ...patch, updated_at: new Date().toISOString() })
  if (userId && email) {
    query = query.or(`user_id.eq.${userId},email.eq.${email}`)
  } else if (userId) {
    query = query.eq('user_id', userId)
  } else if (email) {
    query = query.eq('email', email)
  } else {
    return { count: 0 }
  }
  const { data, error } = await query.select('id')
  if (error) throw error
  return { count: data?.length ?? 0 }
}

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
    const { action, userId, email, applicationStatus, note } = body

    if (!action) return res.status(400).json({ ok: false, error: 'action is required' })

    const admin = getSupabaseAdmin()
    if (!admin) {
      console.log('[POST /api/crm/action] (mock)', action)
      return res.status(202).json({ ok: true, mock: true })
    }

    const realUserId = userId && !String(userId).startsWith('visitor:') ? userId : null

    switch (action) {
      case 'contacted': {
        await admin.from('lead_events').insert({
          user_id: realUserId,
          type: 'contacted',
          path: '/admin/leads',
          metadata: { by: 'admin', email: email || null },
          score_delta: 0,
        })
        await updateApplications(admin, { userId: realUserId, email }, { status: 'contacted' })
        break
      }
      case 'note': {
        const { count } = await updateApplications(admin, { userId: realUserId, email }, { notes: note ?? '' })
        if (count === 0) {
          await admin.from('lead_events').insert({
            user_id: realUserId,
            type: 'application_update',
            path: '/admin/leads',
            metadata: { note: note ?? '', email: email || null },
            score_delta: 0,
          })
        }
        break
      }
      case 'application_status': {
        await updateApplications(admin, { userId: realUserId, email }, { status: applicationStatus })
        await admin.from('lead_events').insert({
          user_id: realUserId,
          type: 'application_update',
          path: '/admin/leads',
          metadata: { status: applicationStatus, email: email || null },
          score_delta: 0,
        })
        break
      }
      default:
        return res.status(400).json({ ok: false, error: `Unknown action: ${action}` })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
