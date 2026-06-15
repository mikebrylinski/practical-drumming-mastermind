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
    const limit = Math.min(Math.max(Number(req.query?.limit) || 25, 1), 100)
    const offset = Math.max(Number(req.query?.offset) || 0, 0)
    const isAdminRequest = req.query?.admin === '1'

    const baseFields =
      'id, session_id, room_name, title, status, playback_url, duration_seconds, started_at, ended_at, created_at'
    const fieldsWithPublish = `${baseFields}, is_published`

    async function runQuery(includePublish) {
      let query = admin
        .from('session_recordings')
        .select(includePublish ? fieldsWithPublish : baseFields, { count: 'exact' })
        .order('started_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (includePublish && !isAdminRequest) {
        query = query.eq('is_published', true)
      }

      if (status !== 'all') {
        query = query.eq('status', status)
      }
      if (room) {
        query = query.eq('room_name', room)
      }

      return query
    }

    let schemaWarning = null
    let { data, error, count } = await runQuery(true)

    if (error?.message?.includes('is_published')) {
      schemaWarning =
        'Run supabase/migrations/20250614_platform_updates.sql (or add session_recordings.is_published) to enable vault publish controls.'
      ;({ data, error, count } = await runQuery(false))
    }

    if (error) {
      console.error('[recordings/list]', error)
      return res.status(500).json({
        ok: false,
        error: error.message || 'Could not load recordings',
      })
    }

    const recordings = await Promise.all(
      (data || []).map(async (row) => ({
        ...row,
        is_published: row.is_published ?? true,
        playback_url: await playbackUrlForRecording(row),
      })),
    )

    return res.status(200).json({
      ok: true,
      recordings,
      total: count ?? recordings.length,
      limit,
      offset,
      ...(schemaWarning ? { schemaWarning } : {}),
    })
  } catch (err) {
    console.error('[recordings/list]', err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
