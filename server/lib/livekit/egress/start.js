import { getSupabaseAdmin } from '../../supabaseAdmin.js'
import {
  buildRecordingFileOutput,
  findActiveRecording,
  getEgressClient,
  getLiveKitCredentials,
  handleOptions,
  isEgressStorageConfigured,
  newRecordingId,
  parseBody,
  verifyAdminRequest,
} from '../../../../api/livekit/_lib.js'

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
    const title = body.title || `Recording — ${room}`

    if (!room) {
      return res.status(400).json({ ok: false, error: 'room is required' })
    }

    const creds = getLiveKitCredentials()
    if (!creds) {
      return res.status(200).json({
        ok: true,
        mock: true,
        message: 'LiveKit is not configured. Recording was not started.',
      })
    }

    if (!isEgressStorageConfigured()) {
      return res.status(503).json({
        ok: false,
        error:
          'Recording storage is not configured. Set LIVEKIT_EGRESS_S3_* vars or LIVEKIT_EGRESS_USE_CLOUD_STORAGE=true (with default bucket in LiveKit Cloud).',
      })
    }

    const admin = getSupabaseAdmin()
    const egressClient = getEgressClient()

    if (auth.demo || !admin) {
      return res.status(200).json({
        ok: true,
        mock: true,
        recording: {
          id: newRecordingId(),
          room_name: room,
          title,
          status: 'active',
          egress_id: `mock-${Date.now()}`,
        },
      })
    }

    const existing = await findActiveRecording(admin, room)
    if (existing) {
      return res.status(409).json({
        ok: false,
        error: 'A recording is already in progress for this room.',
        recording: existing,
      })
    }

    const recordingId = newRecordingId()
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filepath = `recordings/${room}/${stamp}-${recordingId.slice(0, 8)}.mp4`
    const fileOutput = buildRecordingFileOutput(room, recordingId)

    const { data: recording, error: insertErr } = await admin
      .from('session_recordings')
      .insert({
        id: recordingId,
        room_name: room,
        title,
        status: 'starting',
        filepath,
        started_by: auth.userId,
      })
      .select('*')
      .single()

    if (insertErr || !recording) {
      console.error('[egress/start] insert failed', insertErr)
      return res.status(500).json({ ok: false, error: 'Could not create recording record' })
    }

    try {
      const info = await egressClient.startRoomCompositeEgress(room, { file: fileOutput })
      const { data: updated } = await admin
        .from('session_recordings')
        .update({
          egress_id: info.egressId,
          status: 'active',
        })
        .eq('id', recordingId)
        .select('*')
        .single()

      return res.status(200).json({ ok: true, recording: updated || recording })
    } catch (egressErr) {
      console.error('[egress/start] LiveKit error', egressErr)
      await admin
        .from('session_recordings')
        .update({
          status: 'failed',
          error_message: egressErr?.message || 'Failed to start recording',
          ended_at: new Date().toISOString(),
        })
        .eq('id', recordingId)
      return res.status(502).json({
        ok: false,
        error: egressErr?.message || 'Failed to start LiveKit recording',
      })
    }
  } catch (err) {
    console.error('[egress/start]', err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
