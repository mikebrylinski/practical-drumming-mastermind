import { getSupabaseAdmin } from '../../../../server/lib/supabaseAdmin.js'
import {
  findActiveRecording,
  getEgressClient,
  getLiveKitCredentials,
  handleOptions,
  parseBody,
  syncRecordingFromEgress,
  verifyAdminRequest,
} from '../../_lib.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const auth = await verifyAdminRequest(req)
    if (!auth.ok) {
      return res.status(auth.status).json({ ok: false, error: auth.error })
    }

    const body = parseBody(req)
    const room = body.room
    const recordingId = body.recordingId

    if (!room && !recordingId) {
      return res.status(400).json({ ok: false, error: 'room or recordingId is required' })
    }

    const creds = getLiveKitCredentials()
    if (!creds) {
      return res.status(200).json({ ok: true, mock: true, message: 'LiveKit is not configured.' })
    }

    const admin = getSupabaseAdmin()
    const egressClient = getEgressClient()

    if (auth.demo || !admin) {
      return res.status(200).json({
        ok: true,
        mock: true,
        recording: { status: 'complete', room_name: room, playback_url: null },
      })
    }

    let recording = null
    if (recordingId) {
      const { data } = await admin
        .from('session_recordings')
        .select('*')
        .eq('id', recordingId)
        .maybeSingle()
      recording = data
    } else {
      recording = await findActiveRecording(admin, room)
    }

    if (!recording) {
      return res.status(404).json({ ok: false, error: 'No active recording found for this room.' })
    }

    if (!recording.egress_id) {
      return res.status(400).json({ ok: false, error: 'Recording has no egress id.' })
    }

    await egressClient.stopEgress(recording.egress_id)

    const { data: processing } = await admin
      .from('session_recordings')
      .update({ status: 'processing' })
      .eq('id', recording.id)
      .select('*')
      .single()

    const synced = await syncRecordingFromEgress(admin, egressClient, processing || recording)

    return res.status(200).json({ ok: true, recording: synced })
  } catch (err) {
    console.error('[egress/stop]', err)
    return res.status(500).json({ ok: false, error: err?.message || 'Server error' })
  }
}
