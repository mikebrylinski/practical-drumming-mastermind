import { getSupabaseAdmin } from '../../server/lib/supabaseAdmin.js'
import { handleOptions } from '../livekit/_lib.js'
import { createSignedStorageUrl, publicStorageObjectUrl, isStoragePublic } from '../../server/lib/recordingStorage.js'

async function playbackUrlForRecording(recording) {
  if (recording.playback_url) return recording.playback_url
  if (!recording.filepath) return null
  if (isStoragePublic()) return publicStorageObjectUrl(recording.filepath)
  return createSignedStorageUrl(recording.filepath)
}

export default async function handler(req, res) {
  if (handleOptions(req, res)) return
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const admin = getSupabaseAdmin()
    if (!admin) {
      return res.status(200).json({ ok: true, mock: true, recordings: [] })
    }

    const room = req.query?.room
    const status = req.query?.status || 'complete'
    const limit = Math.min(Number(req.query?.limit) || 50, 100)

    let query = admin
      .from('session_recordings')
      .select(
        'id, session_id, room_name, title, status, playback_url, duration_seconds, started_at, ended_at, created_at',
      )
      .order('started_at', { ascending: false })
      .limit(limit)

    if (status !== 'all') {
      query = query.eq('status', status)
    }
    if (room) {
      query = query.eq('room_name', room)
    }

    const { data, error } = await query
    if (error) {
      console.error('[recordings/list]', error)
      return res.status(500).json({ ok: false, error: 'Could not load recordings' })
    }

    const recordings = await Promise.all(
      (data || []).map(async (row) => ({
        ...row,
        playback_url: await playbackUrlForRecording(row),
      })),
    )

    return res.status(200).json({ ok: true, recordings })
  } catch (err) {
    console.error('[recordings/list]', err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
