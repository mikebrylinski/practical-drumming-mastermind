import { persistApplication } from '../server/lib/persistApplication.js'
import { getSupabaseAdmin } from '../server/lib/supabaseAdmin.js'
import { sendTemplatedEmail } from '../server/lib/sendEmail.js'

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

    // Always persist to the local JSON store (dev parity / fallback).
    const application = persistApplication(body)
    console.log('[POST /api/apply]', JSON.stringify(application, null, 2))

    const email = String(body.email || '').trim()
    const fullName = String(body.fullName || body.name || '').trim()

    // Mirror into Supabase applications table when configured (feeds the CRM).
    const admin = getSupabaseAdmin()
    if (admin) {
      const { error } = await admin.from('applications').insert({
        email: email || null,
        full_name: fullName || null,
        type: body.type || 'apply',
        answers: body,
        status: 'new',
      })
      if (error) console.error('[apply -> applications]', error)
    }

    // Fire the confirmation email (logged; no-op if Resend unconfigured).
    if (email) {
      await sendTemplatedEmail({
        template: 'application_received',
        to: email,
        data: { name: fullName },
      })
    }

    return res.status(201).json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
