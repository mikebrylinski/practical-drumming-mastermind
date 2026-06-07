import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { NavigateFunction } from 'react-router-dom'
import '@livekit/components-styles'
import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  RoomContext,
  useParticipants,
  useSequentialRoomConnectDisconnect,
  useTracks,
} from '@livekit/components-react'
import {
  DisconnectReason,
  LocalAudioTrack,
  LocalTrack,
  LocalVideoTrack,
  MediaDeviceFailure,
  Room,
  RoomEvent,
  Track,
} from 'livekit-client'
import { useAuth } from '../../lib/auth/AuthProvider'
import {
  ConnectionStrengthMeter,
  StrengthMeterView,
} from '../../components/room/ConnectionStrengthMeter'

const DEFAULT_MAX_PARTICIPANTS = 12

type TokenState =
  | { status: 'loading' }
  | { status: 'mock' }
  | { status: 'error'; message: string }
  | { status: 'ready'; token: string; url: string; max: number }

function VideoStage() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  )
  return (
    <GridLayout tracks={tracks} style={{ height: '100%' }}>
      <ParticipantTile />
    </GridLayout>
  )
}

const dockButtonClass =
  'rounded-full border border-white/15 bg-black/60 px-4 py-2 font-garamond text-xs tracking-[0.14em] text-mist/80 uppercase backdrop-blur transition hover:border-gold/40'

const dockPanelClass =
  'absolute bottom-20 right-4 z-30 flex h-80 w-72 max-w-[calc(100vw-2rem)] flex-col rounded-xl border border-white/10 bg-charcoal/95 backdrop-blur'

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return
  } catch {
    // Fallback for browsers / contexts without the async clipboard API.
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
    } catch {
      /* no-op */
    }
    document.body.removeChild(ta)
  }
}

function InviteButton() {
  const [copied, setCopied] = useState(false)

  async function invite() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Join my video room', url })
        return
      } catch {
        // User dismissed the share sheet — fall through to copy.
      }
    }
    await copyToClipboard(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={invite}
      className="pointer-events-auto rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 font-garamond text-xs tracking-[0.14em] text-gold uppercase backdrop-blur transition hover:bg-gold/20"
    >
      {copied ? 'Link copied' : 'Invite'}
    </button>
  )
}

/** Right-side dock: a People (participant list) panel and a local chat panel. */
function RoomDock() {
  const [panel, setPanel] = useState<'none' | 'people' | 'chat'>('none')
  const participants = useParticipants()
  const [messages, setMessages] = useState<{ id: number; text: string }[]>([])
  const [draft, setDraft] = useState('')

  function send(e: FormEvent) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setMessages((m) => [...m, { id: Date.now(), text }])
    setDraft('')
  }

  function toggle(next: 'people' | 'chat') {
    setPanel((cur) => (cur === next ? 'none' : next))
  }

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => toggle('people')} className={dockButtonClass}>
        People · {participants.length}
      </button>
      <button type="button" onClick={() => toggle('chat')} className={dockButtonClass}>
        {panel === 'chat' ? 'Hide chat' : 'Chat'}
      </button>

      {panel === 'people' ? (
        <div className={dockPanelClass}>
          <div className="hidden border-b border-white/10 px-4 py-2.5 font-garamond text-xs tracking-[0.16em] text-mist/60 uppercase sm:block">
            In this room
          </div>
          <ul className="flex-1 space-y-1 overflow-y-auto p-2">
            {participants.map((p) => (
              <li
                key={p.identity}
                className="flex items-center justify-between rounded-lg px-3 py-1.5"
              >
                <span className="truncate font-garamond text-sm text-mist/80">
                  {p.name || p.identity}
                  {p.isLocal ? ' (you)' : ''}
                </span>
                <span className="flex shrink-0 items-center gap-1.5">
                  <span
                    className={`size-1.5 rounded-full ${p.isMicrophoneEnabled ? 'bg-emerald-400' : 'bg-white/25'}`}
                    title={p.isMicrophoneEnabled ? 'Mic on' : 'Mic off'}
                    aria-hidden
                  />
                  <span
                    className={`size-1.5 rounded-full ${p.isCameraEnabled ? 'bg-emerald-400' : 'bg-white/25'}`}
                    title={p.isCameraEnabled ? 'Camera on' : 'Camera off'}
                    aria-hidden
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {panel === 'chat' ? (
        <div className={dockPanelClass}>
          <div className="hidden border-b border-white/10 px-4 py-2.5 font-garamond text-xs tracking-[0.16em] text-mist/60 uppercase sm:block">
            Room chat
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {messages.length === 0 ? (
              <p className="font-garamond text-sm text-mist/35">No messages yet.</p>
            ) : (
              messages.map((m) => (
                <p
                  key={m.id}
                  className="rounded-lg bg-white/5 px-3 py-1.5 font-garamond text-sm text-mist/80"
                >
                  {m.text}
                </p>
              ))
            )}
          </div>
          <form onSubmit={send} className="flex gap-2 border-t border-white/10 p-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Message…"
              className="flex-1 rounded-lg border border-white/12 bg-void/60 px-3 py-1.5 font-garamond text-sm text-mist outline-none focus:border-gold/40"
            />
            <button
              type="submit"
              className="rounded-lg bg-gold px-3 py-1.5 font-garamond text-xs uppercase text-void"
            >
              Send
            </button>
          </form>
        </div>
      ) : null}
    </div>
  )
}

function ParticipantCount({ max }: { max: number }) {
  const participants = useParticipants()
  const count = participants.length
  const nearFull = count >= max
  return (
    <span
      className={`flex items-center gap-1.5 font-garamond text-xs tracking-[0.14em] uppercase ${
        nearFull ? 'text-amber-300' : 'text-mist/70'
      }`}
      title={`${count} of ${max} participants`}
    >
      <span
        className={`size-1.5 rounded-full ${nearFull ? 'bg-amber-400' : 'bg-emerald-400'}`}
        aria-hidden
      />
      {count} / {max}
    </span>
  )
}

const IOS_VIDEO_CONSTRAINTS: MediaTrackConstraints = {
  facingMode: 'user',
  width: { ideal: 640 },
  height: { ideal: 480 },
}

function permissionHelpMessage(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err)
  if (/not allowed by the user agent|NotAllowedError|permission/i.test(msg)) {
    return 'Permission blocked. On iPhone: Settings → Chrome → Camera & Microphone → Allow, then reload this page and tap Join room again.'
  }
  if (/NotFoundError|device not found/i.test(msg)) {
    return 'No camera or microphone was found on this device.'
  }
  return msg || 'Could not join the room. Please try again.'
}

/** iOS Chrome often loses user-activation on React onClick — use native pointerdown. */
function GestureActionButton({
  onGesture,
  disabled,
  className,
  children,
}: {
  onGesture: () => void
  disabled?: boolean
  className?: string
  children: ReactNode
}) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const onGestureRef = useRef(onGesture)
  onGestureRef.current = onGesture

  useEffect(() => {
    const el = btnRef.current
    if (!el) return

    let handled = false
    const run = (event: Event) => {
      if (disabled || handled) return
      handled = true
      window.setTimeout(() => {
        handled = false
      }, 400)
      event.preventDefault()
      onGestureRef.current()
    }

    el.addEventListener('pointerdown', run, { passive: false })
    return () => el.removeEventListener('pointerdown', run)
  }, [disabled])

  return (
    <button ref={btnRef} type="button" disabled={disabled} className={className}>
      {children}
    </button>
  )
}

function mediaStreamToLocalTracks(stream: MediaStream): LocalTrack[] {
  const tracks: LocalTrack[] = []
  for (const mediaTrack of stream.getVideoTracks()) {
    tracks.push(new LocalVideoTrack(mediaTrack, undefined, true))
  }
  for (const mediaTrack of stream.getAudioTracks()) {
    tracks.push(new LocalAudioTrack(mediaTrack, undefined, true))
  }
  return tracks
}

function PreJoinLobby({
  roomName,
  joining,
  joinError,
  onJoinWithVideo,
  onJoinAudioOnly,
}: {
  roomName: string
  joining: boolean
  joinError: string | null
  onJoinWithVideo: () => void
  onJoinAudioOnly: () => void
}) {
  const goldBtn =
    'flex min-h-12 w-full items-center justify-center rounded-full bg-gold px-6 font-garamond text-sm tracking-[0.16em] uppercase text-void transition hover:bg-gold/90 disabled:opacity-50'
  const ghostBtn =
    'flex min-h-11 w-full items-center justify-center rounded-full border border-white/15 px-6 font-garamond text-xs tracking-[0.14em] text-mist/70 uppercase transition hover:border-gold/35 hover:text-gold disabled:opacity-50'

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-void px-6 text-center">
      <div className="max-w-md space-y-3">
        <p className="font-garamond text-xs tracking-[0.2em] text-gold uppercase">Video room</p>
        <h1 className="font-bebas text-4xl tracking-wide text-mist">{roomName}</h1>
        <p className="font-garamond text-sm leading-relaxed text-mist/60">
          Tap join — camera and microphone are requested once, then you&apos;re in.
        </p>
      </div>

      {joinError ? (
        <p className="max-w-md font-garamond text-sm text-red-400/90">{joinError}</p>
      ) : null}

      <div className="flex w-full max-w-sm flex-col gap-3">
        <GestureActionButton
          onGesture={onJoinWithVideo}
          disabled={joining}
          className={goldBtn}
        >
          {joining ? 'Joining room…' : 'Join room'}
        </GestureActionButton>
        <GestureActionButton
          onGesture={onJoinAudioOnly}
          disabled={joining}
          className={ghostBtn}
        >
          Join with audio only
        </GestureActionButton>
      </div>

      <Link
        to="/dashboard"
        className="font-garamond text-sm text-mist/45 underline transition hover:text-gold"
      >
        Back to dashboard
      </Link>
    </div>
  )
}

function JoinedRoom({
  room,
  roomName,
  max,
  navigate,
  onLeave,
}: {
  room: Room
  roomName: string
  max: number
  navigate: NavigateFunction
  onLeave: (message: string) => void
}) {
  useEffect(() => {
    const handleDisconnected = (reason?: DisconnectReason) => {
      if (reason === DisconnectReason.CLIENT_INITIATED) return
      navigate('/dashboard', { replace: true })
    }
    const handleMediaDevicesError = (err: Error) => {
      const failure = MediaDeviceFailure.getFailure(err)
      onLeave(
        failure === MediaDeviceFailure.PermissionDenied
          ? 'Camera/microphone access is blocked. Enable it for this site in your browser settings, then tap Join again.'
          : 'Could not access your camera or microphone. Make sure no other app is using it, then try again.',
      )
    }

    room.on(RoomEvent.Disconnected, handleDisconnected)
    room.on(RoomEvent.MediaDevicesError, handleMediaDevicesError)
    return () => {
      room.off(RoomEvent.Disconnected, handleDisconnected)
      room.off(RoomEvent.MediaDevicesError, handleMediaDevicesError)
    }
  }, [room, navigate, onLeave])

  return (
    <RoomContext.Provider value={room}>
      <div className="relative min-h-svh bg-void" data-lk-theme="default" style={{ height: '100svh' }}>
        <RoomTopBar roomName={roomName} max={max} navigate={navigate} />
        <div className="h-[calc(100svh-5rem)] p-4 pt-16">
          <VideoStage />
        </div>
        <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-3 p-3">
          <ControlBar variation="minimal" />
          <RoomDock />
        </div>
        <RoomAudioRenderer />
      </div>
    </RoomContext.Provider>
  )
}

function BackButton({ navigate }: { navigate: NavigateFunction }) {
  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-4 py-1.5 font-garamond text-xs tracking-[0.16em] text-mist/80 uppercase backdrop-blur transition hover:border-gold/40 hover:text-gold"
    >
      ← Back
    </button>
  )
}

function RoomTopBar({
  roomName,
  max,
  navigate,
}: {
  roomName: string
  max: number
  navigate: NavigateFunction
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-4">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <BackButton navigate={navigate} />
        <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-black/60 px-4 py-1.5 backdrop-blur">
          <span className="hidden font-garamond text-xs tracking-[0.16em] text-mist/70 uppercase sm:inline">
            {roomName}
          </span>
          <span className="hidden h-3 w-px bg-white/15 sm:block" aria-hidden />
          <ParticipantCount max={max} />
        </div>
        <InviteButton />
      </div>
      <div className="pointer-events-auto">
        <ConnectionStrengthMeter />
      </div>
    </div>
  )
}

export function RoomPage() {
  const { roomName = '' } = useParams()
  const { profile, session } = useAuth()
  const navigate = useNavigate()
  const [state, setState] = useState<TokenState>({ status: 'loading' })
  const [joined, setJoined] = useState(false)
  const [joining, setJoining] = useState(false)
  const [joinError, setJoinError] = useState<string | null>(null)

  const room = useMemo(() => new Room(), [])
  const { connect, disconnect } = useSequentialRoomConnectDisconnect(room)

  const userId = session?.user?.id
  const guestIdRef = useRef(`guest-${Math.random().toString(36).slice(2, 8)}`)
  const identity = userId ?? guestIdRef.current
  const displayName = profile?.full_name || profile?.email || 'Guest'

  useEffect(() => {
    let active = true
    async function getToken() {
      let res: Response
      try {
        res = await fetch('/api/livekit/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            room: roomName,
            identity,
            name: displayName,
          }),
        })
      } catch {
        if (active)
          setState({
            status: 'error',
            message:
              'Token API unreachable. Start the local API server with "npm run dev" (it runs Vite + the API together).',
          })
        return
      }

      // The token endpoint returns JSON; HTML/empty means the API route is missing.
      let json: {
        token?: string
        url?: string
        mock?: boolean
        error?: string
        maxParticipants?: number
      } | null = null
      try {
        json = await res.json()
      } catch {
        json = null
      }

      if (!active) return

      if (!res.ok || !json) {
        setState({
          status: 'error',
          message: json?.error
            ? `Token error: ${json.error}`
            : `Token API returned ${res.status}. Make sure the API server is running.`,
        })
        return
      }

      if (json.mock || !json.token || !json.url) {
        setState({ status: 'mock' })
        return
      }
      setState({
        status: 'ready',
        token: json.token,
        url: json.url,
        max: json.maxParticipants || DEFAULT_MAX_PARTICIPANTS,
      })
    }
    void getToken()
    return () => {
      active = false
    }
  }, [roomName, identity, displayName])

  useEffect(() => {
    return () => {
      void disconnect?.()
    }
  }, [disconnect])

  async function joinWithMedia(includeVideo: boolean) {
    if (state.status !== 'ready' || joining || joined || !connect) return
    if (!navigator.mediaDevices?.getUserMedia) {
      setJoinError('Camera/microphone is not available in this browser. Use HTTPS and a current browser.')
      return
    }

    setJoining(true)
    setJoinError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: includeVideo ? IOS_VIDEO_CONSTRAINTS : false,
      })
      const tracks = mediaStreamToLocalTracks(stream)
      await connect(state.url, state.token)
      await Promise.all(tracks.map((track) => room.localParticipant.publishTrack(track)))
      setJoined(true)
    } catch (err) {
      try {
        await disconnect?.()
      } catch {
        /* no-op */
      }
      const msg = err instanceof Error ? err.message : String(err)
      const full = /full|exceed|maximum|capacity/i.test(msg)
      setJoinError(
        full
          ? `This room is full (max ${state.max} people). Try again once someone leaves.`
          : permissionHelpMessage(err),
      )
    } finally {
      setJoining(false)
    }
  }

  function leaveRoom(message: string) {
    void disconnect?.()
    setJoined(false)
    setJoinError(message)
  }

  if (state.status === 'loading') {
    return (
      <div className="flex min-h-svh items-center justify-center bg-void">
        <span className="font-garamond text-sm tracking-[0.2em] text-mist/40 uppercase">
          Connecting…
        </span>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-void">
        <p className="font-garamond text-mist/70">{state.message}</p>
        <Link to="/dashboard" className="font-garamond text-sm text-gold underline">
          Back to dashboard
        </Link>
      </div>
    )
  }

  if (state.status === 'mock') {
    return (
      <div className="relative min-h-svh bg-void">
        <RoomTopBarMock roomName={roomName} navigate={navigate} />
        <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="grid w-full max-w-3xl grid-cols-2 gap-3">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="flex aspect-video items-center justify-center rounded-xl border border-white/10 bg-charcoal/40"
              >
                <span className="font-bebas text-2xl text-mist/30">CAMERA {i + 1}</span>
              </div>
            ))}
          </div>
          <p className="max-w-md font-garamond text-sm text-mist/55">
            LiveKit credentials are not configured. Add{' '}
            <code className="text-gold">LIVEKIT_API_KEY</code>,{' '}
            <code className="text-gold">LIVEKIT_API_SECRET</code> and{' '}
            <code className="text-gold">VITE_LIVEKIT_URL</code> to enable live video.
          </p>
          <Link
            to="/dashboard"
            className="rounded-full border border-white/15 px-5 py-2 font-garamond text-sm tracking-[0.14em] text-mist/70 uppercase transition hover:text-mist"
          >
            Leave room
          </Link>
        </div>
      </div>
    )
  }

  if (!joined) {
    return (
      <PreJoinLobby
        roomName={roomName}
        joining={joining}
        joinError={joinError}
        onJoinWithVideo={() => void joinWithMedia(true)}
        onJoinAudioOnly={() => void joinWithMedia(false)}
      />
    )
  }

  return (
    <JoinedRoom
      room={room}
      roomName={roomName}
      max={state.max}
      navigate={navigate}
      onLeave={leaveRoom}
    />
  )
}

function RoomTopBarMock({
  roomName,
  navigate,
}: {
  roomName: string
  navigate: NavigateFunction
}) {
  return (
    <div className="absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-4">
      <div className="flex items-center gap-3">
        <BackButton navigate={navigate} />
        <div className="hidden rounded-full border border-white/10 bg-black/60 px-4 py-1.5 backdrop-blur sm:block">
          <span className="font-garamond text-xs tracking-[0.16em] text-mist/70 uppercase">
            {roomName}
          </span>
        </div>
      </div>
      <StrengthMeterView strength="good" />
    </div>
  )
}
