import { WebhookReceiver, EgressStatus } from 'livekit-server-sdk'
import { getSupabaseAdmin } from '../../../server/lib/supabaseAdmin.js'
import {
  durationFromEgress,
  filepathFromEgress,
  getLiveKitCredentials,
  playbackUrlFromEgress,
} from '../_lib.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const creds = getLiveKitCredentials()
    if (!creds) {
      return res.status(200).json({ ok: true, mock: true })
    }

    const admin = getSupabaseAdmin()
    if (!admin) {
      return res.status(200).json({ ok: true, skipped: true })
    }

    const receiver = new WebhookReceiver(creds.apiKey, creds.apiSecret)
    const authHeader = req.headers.authorization || req.headers.Authorization || ''
    const rawBody =
      typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {})

    let event
    try {
      event = await receiver.receive(rawBody, authHeader)
    } catch (verifyErr) {
      console.warn('[egress/webhook] signature verification failed', verifyErr?.message)
      return res.status(401).json({ ok: false, error: 'Invalid webhook signature' })
    }

    if (event.event !== 'egress_ended' || !event.egressInfo) {
      return res.status(200).json({ ok: true, ignored: true })
    }

    const info = event.egressInfo
    const egressId = info.egressId
    if (!egressId) {
      return res.status(200).json({ ok: true, ignored: true })
    }

    const { data: recording } = await admin
      .from('session_recordings')
      .select('*')
      .eq('egress_id', egressId)
      .maybeSingle()

    if (!recording) {
      return res.status(200).json({ ok: true, ignored: true })
    }

    const failed =
      info.status === EgressStatus.EGRESS_FAILED ||
      info.status === EgressStatus.EGRESS_ABORTED
    const patch = {
      ended_at: new Date().toISOString(),
      status: failed ? 'failed' : 'complete',
      playback_url: failed ? null : playbackUrlFromEgress(info),
      filepath: filepathFromEgress(info) || recording.filepath,
      duration_seconds: durationFromEgress(info),
      error_message: failed ? info.error || 'Recording failed' : null,
    }

    await admin.from('session_recordings').update(patch).eq('id', recording.id)

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[egress/webhook]', err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
