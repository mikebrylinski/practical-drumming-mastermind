export type RecordingStatus =
  | 'starting'
  | 'active'
  | 'processing'
  | 'complete'
  | 'failed'
  | 'stopped'

export type SessionRecording = {
  id: string
  session_id: string | null
  room_name: string
  title: string | null
  egress_id: string | null
  status: RecordingStatus
  filepath: string | null
  playback_url: string | null
  duration_seconds: number | null
  started_by: string | null
  started_at: string
  ended_at: string | null
  error_message: string | null
  is_published?: boolean
  created_at: string
}

export function isRecordingActive(status: RecordingStatus | null | undefined) {
  return status === 'starting' || status === 'active'
}

export function formatRecordingDuration(seconds: number | null | undefined) {
  if (!seconds || seconds <= 0) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
