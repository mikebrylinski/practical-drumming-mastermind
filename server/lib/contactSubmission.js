import { getSupabaseAdmin } from './supabaseAdmin.js'
import { clientIpFromRequest } from './clientIp.js'
import { sendTemplatedEmail } from './sendEmail.js'
import { resolveAdminEmails } from './adminEmails.js'
import { recordContact } from './contacts.js'

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

  // Mirror into the contacts directory (de-duped by email).
  await recordContact({ name, email, type: 'Lead', notes: message }, admin)

  // Notify every admin of the new contact submission.
  const adminEmails = await resolveAdminEmails()
  await Promise.all(
    adminEmails.map((to) =>
      sendTemplatedEmail({
        template: 'contact_admin_notification',
        to,
        data: { name, email, message, ip_address },
      }),
    ),
  )

  return { ...data, name, email, message, ip_address }
}
