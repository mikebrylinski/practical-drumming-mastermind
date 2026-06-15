import { getRoomInfo } from '../roomAuth.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return res.status(204).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const room = req.query?.room
    if (!room) {
      return res.status(400).json({ ok: false, error: 'room is required' })
    }

    const info = await getRoomInfo(req, String(room))
    if (!info.ok) {
      return res.status(info.status || 403).json({ ok: false, error: info.error })
    }

    return res.status(200).json({
      ok: true,
      roomType: info.roomType,
      requiresAuth: info.requiresAuth,
      guestName: info.guestName,
      guestEmail: info.guestEmail,
      mock: info.mock || false,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
