import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../../lib/auth/AuthProvider'
import {
  fetchRoomRecordingStatus,
  startRoomRecording,
  stopRoomRecording,
} from '../../lib/recording/api'
import { formatRecordingDuration, isRecordingActive, type SessionRecording } from '../../lib/recording/types'

const recordBtnClass =
  'pointer-events-auto flex size-9 items-center justify-center rounded-full border backdrop-blur transition disabled:opacity-50 disabled:cursor-not-allowed'

function RecordIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
      <circle cx="12" cy="12" r="7" fill="currentColor" />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
      <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" className="animate-spin" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function AdminRecordControl({ roomName }: { roomName: string }) {
  const { session, isAdmin, mockMode, useSeedData } = useAuth()
  const demoAdmin = isAdmin && (useSeedData || mockMode)
  const [recording, setRecording] = useState<SessionRecording | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const auth = { session, demoAdmin }
  const pollRef = useRef<number | null>(null)

  const refresh = useCallback(async () => {
    const result = await fetchRoomRecordingStatus(roomName, auth)
    if (result.ok) {
      setRecording(result.recording)
      setError(null)
    } else if (result.error) {
      setError(result.error)
    }
  }, [roomName, session, demoAdmin])

  useEffect(() => {
    if (!session?.access_token && !demoAdmin) return
    void refresh()
  }, [refresh, session?.access_token, demoAdmin])

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
    if (!session?.access_token && !demoAdmin) {
      setError('Sign in again to start recording.')
      return
    }
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
    // Optimistically move to "processing" so the button can't be pressed again
    // and the UI never bounces back to the Stop state while egress winds down.
    if (result.recording) setRecording(result.recording)
    else if (recording) setRecording({ ...recording, status: 'processing' })
    else void refresh()
  }

  const status = recording?.status
  // Stop is only available once egress is truly active (it has an egress id).
  // While "starting" the button is shown but disabled to avoid a no-op press
  // that the server would reject (which is what caused "two presses to stop").
  const isActive = status === 'active'
  const isStarting = status === 'starting'
  const isProcessing = status === 'processing'
  const idle = !status || status === 'complete' || status === 'failed' || status === 'stopped'

  let label = 'Start recording'
  let icon = <RecordIcon />
  if (isActive) {
    label = 'Stop recording'
    icon = <StopIcon />
  } else if (isStarting) {
    label = 'Starting recording…'
    icon = <SpinnerIcon />
  } else if (isProcessing) {
    label = 'Saving recording…'
    icon = <SpinnerIcon />
  }

  const disabled = busy || isStarting || isProcessing

  return (
    <div className="pointer-events-auto flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={disabled}
        onClick={() => void (isActive ? stop() : idle ? start() : undefined)}
        aria-label={label}
        title={error || label}
        className={`${recordBtnClass} ${
          isActive
            ? 'border-red-400/60 bg-red-950/60 text-red-300 hover:border-red-300/80'
            : isStarting || isProcessing
              ? 'border-white/15 bg-black/60 text-mist/60'
              : 'border-white/15 bg-black/60 text-red-400 hover:border-red-400/50 hover:text-red-300'
        }`}
      >
        {busy ? <SpinnerIcon /> : icon}
      </button>
      {isActive && recording?.duration_seconds ? (
        <span className="font-garamond text-[0.65rem] text-red-300/90">
          {formatRecordingDuration(recording.duration_seconds)}
        </span>
      ) : null}
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
