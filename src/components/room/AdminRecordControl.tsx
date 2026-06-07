import { useCallback, useEffect, useRef, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import {
  fetchRoomRecordingStatus,
  startRoomRecording,
  stopRoomRecording,
} from '../../lib/recording/api'
import { formatRecordingDuration, isRecordingActive, type SessionRecording } from '../../lib/recording/types'

const recordBtnClass =
  'pointer-events-auto flex items-center gap-2 rounded-full border px-4 py-1.5 font-garamond text-xs tracking-[0.14em] uppercase backdrop-blur transition disabled:opacity-50'

export function AdminRecordControl({
  roomName,
  session,
  demoAdmin,
}: {
  roomName: string
  session: Session | null
  demoAdmin: boolean
}) {
  const [recording, setRecording] = useState<SessionRecording | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const auth = { session, demoAdmin }
  const pollRef = useRef<number | null>(null)

  const refresh = useCallback(async () => {
    const result = await fetchRoomRecordingStatus(roomName, auth)
    if (result.ok) setRecording(result.recording)
  }, [roomName, session, demoAdmin])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    const shouldPoll =
      recording && (isRecordingActive(recording.status) || recording.status === 'processing')
    if (!shouldPoll) {
      if (pollRef.current) window.clearInterval(pollRef.current)
      pollRef.current = null
      return
    }
    pollRef.current = window.setInterval(() => {
      void refresh()
    }, 5000)
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current)
    }
  }, [recording?.status, recording?.id, refresh])

  async function start() {
    setBusy(true)
    setError(null)
    const result = await startRoomRecording(roomName, auth, `Session — ${roomName}`)
    setBusy(false)
    if (!result.ok) {
      setError(result.error || 'Could not start recording')
      return
    }
    if (result.recording) setRecording(result.recording)
  }

  async function stop() {
    setBusy(true)
    setError(null)
    const result = await stopRoomRecording(roomName, auth, recording?.id)
    setBusy(false)
    if (!result.ok) {
      setError(result.error || 'Could not stop recording')
      return
    }
    if (result.recording) setRecording(result.recording)
    else void refresh()
  }

  const active = isRecordingActive(recording?.status)
  const processing = recording?.status === 'processing'

  let label = 'Record'
  if (active) label = 'Stop recording'
  else if (processing) label = 'Saving…'
  else if (recording?.status === 'complete') label = 'Record again'

  return (
    <div className="pointer-events-auto flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={busy || processing}
        onClick={() => void (active ? stop() : start())}
        className={`${recordBtnClass} ${
          active
            ? 'border-red-400/50 bg-red-950/60 text-red-200 hover:border-red-300/70'
            : 'border-white/15 bg-black/60 text-mist/80 hover:border-gold/40 hover:text-gold'
        }`}
        title={error || undefined}
      >
        <span
          className={`size-2 rounded-full ${active ? 'animate-pulse bg-red-400' : 'bg-white/35'}`}
          aria-hidden
        />
        {busy ? 'Working…' : label}
        {active && recording?.duration_seconds
          ? ` · ${formatRecordingDuration(recording.duration_seconds)}`
          : null}
      </button>
      {error ? (
        <span className="max-w-xs text-right font-garamond text-[0.65rem] leading-snug text-red-400/90">
          {error}
        </span>
      ) : null}
      {recording?.status === 'complete' && recording.playback_url ? (
        <a
          href={recording.playback_url}
          target="_blank"
          rel="noreferrer"
          className="font-garamond text-[0.65rem] text-gold underline"
        >
          Open saved recording
        </a>
      ) : null}
    </div>
  )
}
