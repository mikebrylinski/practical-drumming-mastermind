import { getSupabaseAdmin } from '../supabaseAdmin.js'
import { sendTemplatedEmail } from '../sendEmail.js'
import { publicPath } from '../publicUrl.js'
import { formatBookingDateLabel } from '../bookingEmail.js'

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
    const { bookingId } = body
    if (!bookingId) {
      return res.status(400).json({ ok: false, error: 'bookingId is required' })
    }

    const admin = getSupabaseAdmin()
    if (!admin) return res.status(200).json({ ok: true, mock: true })

    const { data: booking } = await admin
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .maybeSingle()

    if (!booking) return res.status(404).json({ ok: false, error: 'Booking not found' })

    await admin.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId)
    if (booking.slot_id) {
      await admin.from('availability_slots').update({ is_booked: false }).eq('id', booking.slot_id)
    }

    if (booking.email) {
      const dateLabel = formatBookingDateLabel(booking.starts_at)
      await sendTemplatedEmail({
        template: 'booking_cancelled',
        to: booking.email,
        data: { dateLabel, bookUrl: publicPath('/book/discovery-call') },
      })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
