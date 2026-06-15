import { sendTemplatedEmail } from './sendEmail.js'
import { getPublicBaseUrl, publicPath, publicRoomUrl } from './publicUrl.js'

export function formatBookingDateLabel(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    })
  } catch {
    return String(iso)
  }
}

function resolveAdminEmail() {
  const direct = process.env.ADMIN_EMAIL?.trim()
  if (direct) return direct
  const from = process.env.EMAIL_FROM || ''
  const match = from.match(/<([^>]+)>/)
  return match?.[1]?.trim() || null
}

/** Sends guest confirmation (+ optional admin alert) with the LiveKit room link. */
export async function sendBookingConfirmationEmails({ name, email, startsAt, roomName }) {
  if (!email) {
    return {
      guest: { ok: false, status: 'error', error: 'Guest email is required' },
      admin: null,
    }
  }

  const joinUrl = publicRoomUrl(roomName)
  const dateLabel = formatBookingDateLabel(startsAt)
  const base = getPublicBaseUrl()

  const guest = await sendTemplatedEmail({
    template: 'booking_confirmation',
    to: email,
    data: {
      name: name?.trim() || null,
      dateLabel,
      joinUrl,
      roomName,
    },
  })

  const adminEmail = resolveAdminEmail()
  let admin = null
  if (adminEmail) {
    admin = await sendTemplatedEmail({
      template: 'booking_admin_notification',
      to: adminEmail,
      data: {
        name: name?.trim() || 'Guest',
        email,
        dateLabel,
        joinUrl,
        adminBookingsUrl: publicPath('/admin/bookings'),
        hasBaseUrl: Boolean(base),
      },
    })
  }

  return { guest, admin }
}
