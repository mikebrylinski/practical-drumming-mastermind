import { randomUUID } from 'node:crypto'
import { handleOptions, verifyAdminRequest } from '../../livekit/_lib.js'
import { getSupabaseAdmin } from '../../../server/lib/supabaseAdmin.js'
import { sendBookingConfirmationEmails } from '../../../server/lib/bookingEmail.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const auth = await verifyAdminRequest(req)
    if (!auth.ok) {
      return res.status(auth.status || 403).json({ ok: false, error: auth.error })
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const email = String(body.email || '').trim()
    const name = String(body.name || '').trim()
    const startsAt = body.startsAt ? new Date(body.startsAt).toISOString() : null

    if (!email || !startsAt || Number.isNaN(new Date(startsAt).getTime())) {
      return res.status(400).json({ ok: false, error: 'email and startsAt are required' })
    }

    const roomName = `call-${randomUUID().slice(0, 8)}`
    const admin = getSupabaseAdmin()

    if (!admin) {
      const emailResult = await sendBookingConfirmationEmails({
        name,
        email,
        startsAt,
        roomName,
      })
      return res.status(201).json({
        ok: true,
        mock: true,
        booking: {
          id: 'mock-booking',
          livekit_room_name: roomName,
          status: 'confirmed',
          email,
          name,
          starts_at: startsAt,
        },
        email: {
          guest: emailResult.guest.status,
          error: emailResult.guest.error,
        },
      })
    }

    const { data: booking, error } = await admin
      .from('bookings')
      .insert({
        name: name || null,
        email,
        starts_at: startsAt,
        status: 'confirmed',
        livekit_room_name: roomName,
      })
      .select()
      .single()

    if (error) {
      console.error('[admin/bookings/create]', error)
      return res.status(500).json({ ok: false, error: 'Could not create booking' })
    }

    const emailResult = await sendBookingConfirmationEmails({
      name,
      email,
      startsAt,
      roomName,
    })

    return res.status(201).json({
      ok: true,
      booking,
      email: {
        guest: emailResult.guest.status,
        error: emailResult.guest.error,
      },
    })
  } catch (err) {
    console.error('[admin/bookings/create]', err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
