#!/usr/bin/env node
/**
 * Smoke-test Resend config. Sends a booking confirmation template to CHECK_EMAIL
 * (or ADMIN_EMAIL) without creating a booking.
 *
 * Usage:
 *   npm run check:resend
 *   CHECK_EMAIL=you@example.com npm run check:resend
 *
 * Room links always use the production site unless EMAIL_PUBLIC_BASE_URL is set.
 */
import { sendTemplatedEmail } from '../server/lib/sendEmail.js'
import { publicRoomUrl } from '../server/lib/publicUrl.js'

const to = process.env.CHECK_EMAIL || process.env.ADMIN_EMAIL
if (!to) {
  console.error('Set CHECK_EMAIL or ADMIN_EMAIL in .env')
  process.exit(1)
}

if (!process.env.RESEND_API_KEY) {
  console.error('RESEND_API_KEY is empty — emails will be skipped until you add your Resend API key.')
  process.exit(1)
}

const joinUrl = publicRoomUrl('call-test1234')
const result = await sendTemplatedEmail({
  template: 'booking_confirmation',
  to,
  data: {
    name: 'Test Guest',
    dateLabel: 'Monday, June 16, 2026 at 2:00 PM EDT',
    joinUrl,
    roomName: 'call-test1234',
  },
})

console.log(JSON.stringify({ to, joinUrl, ...result }, null, 2))
process.exit(result.ok ? 0 : 1)
