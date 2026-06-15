import { getSupabaseAdmin } from './supabaseAdmin.js'
import { resolveUserFromRequest } from './authRequest.js'

/** @typedef {'booking' | 'member'} RoomType */

/**
 * @param {string} roomName
 * @returns {RoomType}
 */
export function classifyRoom(roomName) {
  if (roomName.startsWith('call-')) return 'booking'
  return 'member'
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} admin
 * @param {string} roomName
 */
async function findBookingForRoom(admin, roomName) {
  const { data } = await admin
    .from('bookings')
    .select('id, name, email, status')
    .eq('livekit_room_name', roomName)
    .eq('status', 'confirmed')
    .maybeSingle()
  return data
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} admin
 * @param {string} userId
 * @param {string} roomName
 */
async function userCanAccessMemberRoom(admin, userId, roomName) {
  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle()

  if (profile?.role === 'admin') return true

  const { data: cohort } = await admin
    .from('cohorts')
    .select('id')
    .eq('livekit_room_name', roomName)
    .maybeSingle()

  if (cohort) {
    const { data: member } = await admin
      .from('cohort_members')
      .select('id')
      .eq('cohort_id', cohort.id)
      .eq('user_id', userId)
      .maybeSingle()
    if (member) return true
  }

  const { data: session } = await admin
    .from('sessions')
    .select('id, cohort_id')
    .eq('livekit_room_name', roomName)
    .maybeSingle()

  if (session?.cohort_id) {
    const { data: member } = await admin
      .from('cohort_members')
      .select('id')
      .eq('cohort_id', session.cohort_id)
      .eq('user_id', userId)
      .maybeSingle()
    if (member) return true
  }

  // Allow any authenticated member if room matches a known session/cohort pattern
  // but no strict membership found — admins already passed above.
  if (session) return true
  if (cohort) return false

  // Unknown member room — deny unless admin (handled above).
  return false
}

/**
 * Public room metadata for the preview lobby.
 * @param {import('http').IncomingMessage} req
 * @param {string} roomName
 */
export async function getRoomInfo(req, roomName) {
  const roomType = classifyRoom(roomName)
  const admin = getSupabaseAdmin()

  if (!admin) {
    return {
      ok: true,
      mock: true,
      roomType,
      requiresAuth: roomType === 'member',
      guestName: null,
      guestEmail: null,
    }
  }

  if (roomType === 'booking') {
    const booking = await findBookingForRoom(admin, roomName)
    if (!booking) {
      return { ok: false, status: 404, error: 'This room link is invalid or the call was cancelled.' }
    }
    return {
      ok: true,
      roomType,
      requiresAuth: false,
      guestName: booking.name || null,
      guestEmail: booking.email || null,
    }
  }

  const { user } = await resolveUserFromRequest(req)
  if (!user) {
    return {
      ok: true,
      roomType,
      requiresAuth: true,
      guestName: null,
      guestEmail: null,
    }
  }

  const allowed = await userCanAccessMemberRoom(admin, user.id, roomName)
  if (!allowed) {
    return { ok: false, status: 403, error: 'You do not have access to this room.' }
  }

  return {
    ok: true,
    roomType,
    requiresAuth: true,
    guestName: null,
    guestEmail: null,
  }
}

/**
 * Authorize token issuance for a room.
 * @param {import('http').IncomingMessage} req
 * @param {string} roomName
 */
export async function authorizeRoomToken(req, roomName) {
  const roomType = classifyRoom(roomName)
  const admin = getSupabaseAdmin()

  if (!admin) {
    return { ok: true, mock: true }
  }

  if (roomType === 'booking') {
    const booking = await findBookingForRoom(admin, roomName)
    if (!booking) {
      return { ok: false, status: 403, error: 'Invalid or expired call room.' }
    }
    return { ok: true, roomType }
  }

  const { user, error } = await resolveUserFromRequest(req)
  if (!user) {
    return { ok: false, status: 401, error: error || 'Sign in required for this room.' }
  }

  const allowed = await userCanAccessMemberRoom(admin, user.id, roomName)
  if (!allowed) {
    return { ok: false, status: 403, error: 'You do not have access to this room.' }
  }

  return { ok: true, roomType, userId: user.id }
}
