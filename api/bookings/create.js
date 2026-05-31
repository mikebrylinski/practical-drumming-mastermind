import { randomUUID } from 'node:crypto'
import { getSupabaseAdmin } from '../../server/lib/supabaseAdmin.js'
import { sendTemplatedEmail } from '../../server/lib/sendEmail.js'

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
    const { slotId, name, email, userId } = body

    if (!slotId || !email) {
      return res.status(400).json({ ok: false, error: 'slotId and email are required' })
    }

    const roomName = `call-${randomUUID().slice(0, 8)}`
    const base = process.env.PUBLIC_BASE_URL || ''
    const admin = getSupabaseAdmin()

    if (!admin) {
      // Mock mode: pretend the booking succeeded.
      await sendTemplatedEmail({
        template: 'booking_confirmation',
        to: email,
        data: { joinUrl: base ? `${base}/room/${roomName}` : `/room/${roomName}` },
      })
      return res.status(201).json({
        ok: true,
        mock: true,
        booking: { id: 'mock-booking', livekit_room_name: roomName, status: 'confirmed' },
      })
    }

    const { data: slot } = await admin
      .from('availability_slots')
      .select('*')
      .eq('id', slotId)
      .maybeSingle()

    if (!slot) return res.status(404).json({ ok: false, error: 'Slot not found' })
    if (slot.is_booked) return res.status(409).json({ ok: false, error: 'Slot already booked' })

    // Lock the slot atomically (only succeeds if still unbooked).
    const { data: locked, error: lockErr } = await admin
      .from('availability_slots')
      .update({ is_booked: true })
      .eq('id', slotId)
      .eq('is_booked', false)
      .select()

    if (lockErr) {
      console.error('[bookings/create lock]', lockErr)
      return res.status(500).json({ ok: false, error: 'Could not reserve slot' })
    }
    if (!locked || locked.length === 0) {
      return res.status(409).json({ ok: false, error: 'Slot already booked' })
    }

    const { data: booking, error } = await admin
      .from('bookings')
      .insert({
        slot_id: slotId,
        user_id: userId || null,
        name: name || null,
        email,
        livekit_room_name: roomName,
        status: 'confirmed',
        starts_at: slot.starts_at,
      })
      .select()
      .single()

    if (error) {
      // Roll back the slot lock on failure.
      await admin.from('availability_slots').update({ is_booked: false }).eq('id', slotId)
      console.error('[bookings/create insert]', error)
      return res.status(500).json({ ok: false, error: 'Could not create booking' })
    }

    // CRM signal: a booking is a strong intent event.
    await admin.from('lead_events').insert({
      user_id: userId || null,
      type: 'booking_created',
      path: '/book',
      metadata: { bookingId: booking.id, email },
      score_delta: 60,
    })

    const dateLabel = slot.starts_at ? new Date(slot.starts_at).toLocaleString() : ''
    await sendTemplatedEmail({
      template: 'booking_confirmation',
      to: email,
      data: {
        dateLabel,
        joinUrl: base ? `${base}/room/${roomName}` : `/room/${roomName}`,
      },
    })

    return res.status(201).json({ ok: true, booking })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
