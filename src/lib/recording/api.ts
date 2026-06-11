import type { Session } from '@supabase/supabase-js'
import { adminRequestHeaders } from '../auth/accessToken'
import type { SessionRecording } from './types'

type AuthOpts = {
  session: Session | null
  demoAdmin?: boolean
}

async function parseJson(res: Response) {
  try {
    return await res.json()
  } catch {
    return null
  }
}

export async function startRoomRecording(
  room: string,
  auth: AuthOpts,
  title?: string,
): Promise<{ ok: boolean; recording?: SessionRecording; error?: string; mock?: boolean }> {
  const res = await fetch('/api/livekit/egress/start', {
    method: 'POST',
    headers: await adminRequestHeaders(auth.session, auth.demoAdmin),
    body: JSON.stringify({ room, title }),
  })
  const json = await parseJson(res)
  if (!res.ok || !json?.ok) {
    return { ok: false, error: json?.error || `Request failed (${res.status})` }
  }
  return { ok: true, recording: json.recording, mock: json.mock }
}

export async function stopRoomRecording(
  room: string,
  auth: AuthOpts,
  recordingId?: string,
): Promise<{ ok: boolean; recording?: SessionRecording; error?: string; mock?: boolean }> {
  const res = await fetch('/api/livekit/egress/stop', {
    method: 'POST',
    headers: await adminRequestHeaders(auth.session, auth.demoAdmin),
    body: JSON.stringify({ room, recordingId }),
  })
  const json = await parseJson(res)
  if (!res.ok || !json?.ok) {
    return { ok: false, error: json?.error || `Request failed (${res.status})` }
  }
  return { ok: true, recording: json.recording, mock: json.mock }
}

export async function fetchRoomRecordingStatus(
  room: string,
  auth: AuthOpts,
): Promise<{ ok: boolean; recording: SessionRecording | null; error?: string; mock?: boolean }> {
  const params = new URLSearchParams({ room })
  const res = await fetch(`/api/livekit/egress/status?${params}`, {
    headers: await adminRequestHeaders(auth.session, auth.demoAdmin),
  })
  const json = await parseJson(res)
  if (!res.ok || !json?.ok) {
    return {
      ok: false,
      recording: null,
      error: json?.error || `Request failed (${res.status})`,
    }
  }
  return { ok: true, recording: json.recording ?? null, mock: json.mock }
}

export async function fetchSavedRecordings(limit = 50): Promise<SessionRecording[]> {
  const params = new URLSearchParams({ status: 'complete', limit: String(limit) })
  const res = await fetch(`/api/recordings/list?${params}`)
  const json = await parseJson(res)
  if (!res.ok || !json?.ok) return []
  return (json.recordings || []) as SessionRecording[]
}
