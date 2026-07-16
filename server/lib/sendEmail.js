import { Resend } from 'resend'
import { getSupabaseAdmin } from './supabaseAdmin.js'
import { renderEmail } from './emailTemplates.js'

/** Branded sender. All transactional mail goes out as admin@pracdrum.com. */
export const DEFAULT_EMAIL_FROM = 'Practical Drumming <admin@pracdrum.com>'

/**
 * Resolve the "from" header. Uses EMAIL_FROM only when it points at a real
 * (non-sandbox) domain; otherwise always falls back to the branded
 * admin@pracdrum.com so we never send from Resend's onboarding@resend.dev.
 */
export function resolveEmailFrom() {
  const configured = process.env.EMAIL_FROM?.trim()
  if (configured && !/resend\.dev/i.test(configured)) return configured
  return DEFAULT_EMAIL_FROM
}

/**
 * Core email send + audit log. Reusable by serverless functions directly
 * (e.g. booking flow) without an extra HTTP hop.
 *
 * Always logs to email_logs (status: sent | skipped | error). When
 * RESEND_API_KEY is absent it no-ops with status "skipped".
 */
export async function sendTemplatedEmail({ template, to, data = {}, subject }) {
  if (!template || !to) {
    return { ok: false, error: 'template and to are required', status: 400 }
  }

  const rendered = renderEmail(template, data)
  if (!rendered) {
    return { ok: false, error: `Unknown template: ${template}`, status: 400 }
  }

  const finalSubject = subject || rendered.subject
  const apiKey = process.env.RESEND_API_KEY
  const from = resolveEmailFrom()

  let status = 'sent'
  let providerId = null
  let errorMessage = null

  if (!apiKey) {
    status = 'skipped'
  } else {
    try {
      const resend = new Resend(apiKey)
      const { data: sent, error } = await resend.emails.send({
        from,
        to,
        subject: finalSubject,
        html: rendered.html,
      })
      if (error) {
        status = 'error'
        errorMessage = error.message || String(error)
      } else {
        providerId = sent?.id ?? null
      }
    } catch (err) {
      status = 'error'
      errorMessage = err?.message || String(err)
    }
  }

  // Audit log — every send attempt is recorded.
  const admin = getSupabaseAdmin()
  if (admin) {
    await admin
      .from('email_logs')
      .insert({
        template,
        to_email: to,
        subject: finalSubject,
        status,
        provider_id: providerId,
        error: errorMessage,
        metadata: data,
      })
      .then(({ error }) => {
        if (error) console.error('[email_logs insert]', error)
      })
  } else {
    console.log('[email] (mock log)', { template, to, status, subject: finalSubject })
  }

  return {
    ok: status !== 'error',
    status,
    id: providerId,
    error: errorMessage,
    httpStatus: status === 'error' ? 502 : 200,
  }
}
