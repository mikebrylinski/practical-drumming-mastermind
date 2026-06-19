import { sendTemplatedEmail } from './sendEmail.js'
import { resolveAdminEmails } from './adminEmails.js'
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

  const adminEmails = await resolveAdminEmails()
  const adminData = {
    name: name?.trim() || 'Guest',
    email,
    dateLabel,
    joinUrl,
    adminBookingsUrl: publicPath('/admin/bookings'),
    hasBaseUrl: Boolean(base),
  }
  const adminResults = await Promise.all(
    adminEmails.map((to) =>
      sendTemplatedEmail({ template: 'booking_admin_notification', to, data: adminData }),
    ),
  )

  // Keep `admin` for backward compatibility (first recipient's result).
  return { guest, admin: adminResults[0] ?? null, admins: adminResults }
}
