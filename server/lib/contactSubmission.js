import { getSupabaseAdmin } from './supabaseAdmin.js'
import { clientIpFromRequest } from './clientIp.js'
import { sendTemplatedEmail } from './sendEmail.js'

export function validateContactBody(body) {
  const name = String(body?.name ?? '').trim()
  const email = String(body?.email ?? '').trim()
  const message = String(body?.message ?? '').trim()

  if (!name || !email || !message) {
    const err = new Error('Name, email, and message are required')
    err.status = 400
    throw err
  }

  return { name, email, message }
}

export async function saveContactSubmission(body, req) {
  const { name, email, message } = validateContactBody(body)
  const ip_address = clientIpFromRequest(req)
  const admin = getSupabaseAdmin()

  if (!admin) {
    return { name, email, message, ip_address, mock: true }
  }

  const { data, error } = await admin
    .from('contact_submissions')
    .insert({ name, email, message, ip_address })
    .select('id, created_at')
    .single()

  if (error) {
    console.error('[contact_submissions insert]', error)
    throw new Error('Failed to save contact submission')
  }

  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM?.match(/<([^>]+)>/)?.[1]
  if (adminEmail) {
    await sendTemplatedEmail({
      template: 'contact_admin_notification',
      to: adminEmail,
      data: { name, email, message, ip_address },
    })
  }

  return { ...data, name, email, message, ip_address }
}
