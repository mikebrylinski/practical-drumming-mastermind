import { getSupabaseAdmin } from '../../supabaseAdmin.js'
import {
  findActiveRecording,
  getEgressClient,
  getLiveKitCredentials,
  handleOptions,
  syncRecordingFromEgress,
  verifyAdminRequest,
} from '../_lib.js'

export default async function handler(req, res) {
  if (handleOptions(req, res)) return
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const auth = await verifyAdminRequest(req)
    if (!auth.ok) {
      return res.status(auth.status).json({ ok: false, error: auth.error })
    }

    const room = req.query?.room
    if (!room) {
      return res.status(400).json({ ok: false, error: 'room is required' })
    }

    if (!getLiveKitCredentials()) {
      return res.status(200).json({ ok: true, mock: true, recording: null })
    }

    const admin = getSupabaseAdmin()
    if (auth.demo || !admin) {
      return res.status(200).json({ ok: true, mock: true, recording: null })
    }

    let recording = await findActiveRecording(admin, room)
    if (!recording) {
      const { data: latest } = await admin
        .from('session_recordings')
        .select('*')
        .eq('room_name', room)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      recording = latest
    }

    if (recording && ['processing', 'active', 'starting'].includes(recording.status)) {
      const egressClient = getEgressClient()
      recording = await syncRecordingFromEgress(admin, egressClient, recording)
    }

    return res.status(200).json({ ok: true, recording })
  } catch (err) {
    console.error('[egress/status]', err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
