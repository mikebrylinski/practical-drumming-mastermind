import { getSupabaseAdmin } from '../../../server/lib/supabaseAdmin.js'
import { verifyAdminRequest } from '../../livekit/_lib.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Demo-Admin')
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const auth = await verifyAdminRequest(req)
    if (!auth.ok) {
      return res.status(auth.status).json({ ok: false, error: auth.error })
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const email = String(body.email ?? '').trim().toLowerCase()
    const fullName = String(body.full_name ?? body.fullName ?? '').trim()
    const role = 'member'

    if (!email) {
      return res.status(400).json({ ok: false, error: 'email is required' })
    }

    const admin = getSupabaseAdmin()
    if (!admin) {
      return res.status(503).json({ ok: false, error: 'Database not configured' })
    }

    const { data: inviteData, error: inviteError } = await admin.auth.admin.inviteUserByEmail(
      email,
      {
        data: { full_name: fullName },
      },
    )

    if (inviteError) {
      if (/already registered|already exists/i.test(inviteError.message)) {
        const { data: users } = await admin.auth.admin.listUsers()
        const existing = users?.users?.find((u) => u.email?.toLowerCase() === email)
        if (existing) {
          await admin.from('profiles').upsert({
            id: existing.id,
            email,
            full_name: fullName || existing.user_metadata?.full_name || '',
          })
          return res.status(200).json({ ok: true, userId: existing.id, existing: true })
        }
      }
      return res.status(400).json({ ok: false, error: inviteError.message })
    }

    const userId = inviteData.user?.id
    if (userId) {
      await admin.from('profiles').upsert({
        id: userId,
        email,
        full_name: fullName,
        role,
      })
    }

    return res.status(201).json({ ok: true, userId })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
