import { randomUUID } from 'node:crypto'
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk'

const MAX_PARTICIPANTS = Number(process.env.LIVEKIT_MAX_PARTICIPANTS) || 12

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(204).end()
  }

  try {
    const body =
      typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const query = req.query || {}
    const room = body.room || query.room
    const identity = body.identity || query.identity || `guest-${randomUUID().slice(0, 8)}`
    const name = body.name || query.name || identity

    if (!room) {
      return res.status(400).json({ ok: false, error: 'room is required' })
    }

    const apiKey = process.env.LIVEKIT_API_KEY
    const apiSecret = process.env.LIVEKIT_API_SECRET
    const url = process.env.VITE_LIVEKIT_URL || process.env.LIVEKIT_URL || null

    if (!apiKey || !apiSecret) {
      // Mock mode: no LiveKit credentials. Room page shows a graceful notice.
      return res.status(200).json({ ok: true, mock: true, token: null, url })
    }

    // Ensure the room exists with a capacity cap (2–12 people). createRoom is
    // idempotent — if the room already exists its config is returned as-is.
    if (url) {
      try {
        const httpUrl = url.replace(/^ws/, 'http')
        const svc = new RoomServiceClient(httpUrl, apiKey, apiSecret)
        await svc.createRoom({
          name: room,
          maxParticipants: MAX_PARTICIPANTS,
          emptyTimeout: 10 * 60, // close 10 min after the last person leaves
        })
      } catch (roomErr) {
        // Non-fatal: the room may already exist or the service call failed.
        console.warn('[livekit] createRoom skipped:', roomErr?.message || roomErr)
      }
    }

    const at = new AccessToken(apiKey, apiSecret, { identity, name, ttl: '2h' })
    at.addGrant({
      roomJoin: true,
      room,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    })

    const token = await at.toJwt()
    return res.status(200).json({ ok: true, token, url, maxParticipants: MAX_PARTICIPANTS })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
