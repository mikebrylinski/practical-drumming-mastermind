import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
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
  createLocalTracks,
  DisconnectReason,
  MediaDeviceFailure,
  Room,
  RoomEvent,
  Track,
  type VideoCaptureOptions,
} from 'livekit-client'
import { adminRequestHeaders } from '../../lib/auth/accessToken'
import { useAuth } from '../../lib/auth/AuthProvider'
import {
  ConnectionStrengthMeter,
  StrengthMeterView,
} from '../../components/room/ConnectionStrengthMeter'
import { AdminRecordControl } from '../../components/room/AdminRecordControl'
import { RoomPreviewLobby } from '../../components/room/RoomPreviewLobby'

const DEFAULT_MAX_PARTICIPANTS = 12

type TokenState =
  | { status: 'loading' }
  | { status: 'mock' }
  | { status: 'error'; message: string }
  | { status: 'ready'; token: string; url: string; max: number; canRecord: boolean }

type RoomInfoState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | {
      status: 'ready'
      roomType: 'booking' | 'member'
      requiresAuth: boolean
      guestName: string | null
    }

function VideoStage() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: false },
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

const IOS_VIDEO_CONSTRAINTS: VideoCaptureOptions = {
  facingMode: 'user',
  resolution: { width: 640, height: 480 },
}

function permissionHelpMessage(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err)
  if (/not allowed by the user agent|NotAllowedError|permission/i.test(msg)) {
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
    if (isIOS) {
      const browser = /CriOS/i.test(navigator.userAgent) ? 'Chrome' : 'Safari'
      return `Permission blocked. On iPhone: Settings → ${browser} → Camera & Microphone → Allow, then reload and tap Join again.`
    }
    return 'Camera/microphone access is blocked. Allow access for this site in your browser settings, then reload and try again.'
  }
  if (/NotFoundError|device not found/i.test(msg)) {
    return 'No camera or microphone was found on this device.'
  }
  return msg || 'Could not join the room. Please try again.'
}

async function ensureMediaEnabled(room: Room, includeVideo: boolean) {
  const mic = room.localParticipant.getTrackPublication(Track.Source.Microphone)
  if (mic?.track && mic.isMuted) {
    await mic.unmute()
  }
  if (includeVideo) {
    const cam = room.localParticipant.getTrackPublication(Track.Source.Camera)
    if (cam?.track && cam.isMuted) {
      await cam.unmute()
    }
  }
}

function JoinedRoom({
  room,
  roomName,
  max,
  navigate,
  onLeave,
  canRecord,
}: {
  room: Room
  roomName: string
  max: number
  navigate: NavigateFunction
  onLeave: (message: string) => void
  canRecord: boolean
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
        <RoomTopBar roomName={roomName} max={max} navigate={navigate} canRecord={canRecord} />
        <div className="h-[calc(100svh-5rem)] p-4 pt-16">
          <VideoStage />
        </div>
        <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-3 p-3">
          <ControlBar variation="minimal" saveUserChoices={false} />
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
  canRecord,
}: {
  roomName: string
  max: number
  navigate: NavigateFunction
  canRecord: boolean
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
        {canRecord ? <AdminRecordControl roomName={roomName} /> : null}
      </div>
      <div className="pointer-events-auto">
        <ConnectionStrengthMeter />
      </div>
    </div>
  )
}

export function RoomPage() {
  const { roomName = '' } = useParams()
  const { profile, session, isAdmin, isAuthed, useSeedData, mockMode, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [roomInfo, setRoomInfo] = useState<RoomInfoState>({ status: 'loading' })
  const [state, setState] = useState<TokenState>({ status: 'loading' })
  const [joined, setJoined] = useState(false)
  const [joining, setJoining] = useState(false)
  const [joinError, setJoinError] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState('')

  const room = useMemo(() => new Room(), [])
  const { connect, disconnect } = useSequentialRoomConnectDisconnect(room)

  const guestIdRef = useRef(`guest-${Math.random().toString(36).slice(2, 8)}`)
  const userId = session?.user?.id
  const identity =
    roomInfo.status === 'ready' && roomInfo.roomType === 'booking'
      ? guestIdRef.current
      : userId ?? guestIdRef.current
  const demoAdmin = isAdmin && (useSeedData || mockMode)
  const skipNamePrompt = isAuthed || useSeedData
  const resolvedDisplayName =
    displayName.trim() ||
    profile?.full_name?.trim() ||
    profile?.email?.split('@')[0] ||
    ''

  useEffect(() => {
    if (authLoading) return
    let active = true
    async function loadRoomInfo() {
      try {
        const headers = await adminRequestHeaders(session, demoAdmin)
        const res = await fetch(`/api/livekit/room-info?room=${encodeURIComponent(roomName)}`, {
          headers,
        })
        const json = await res.json().catch(() => null)
        if (!active) return
        if (!res.ok || !json?.ok) {
          setRoomInfo({
            status: 'error',
            message: json?.error || 'This room is not available.',
          })
          return
        }
        setRoomInfo({
          status: 'ready',
          roomType: json.roomType,
          requiresAuth: json.requiresAuth,
          guestName: json.guestName,
        })
        const defaultName =
          json.guestName ||
          profile?.full_name ||
          profile?.email?.split('@')[0] ||
          ''
        setDisplayName(defaultName)
      } catch {
        if (active) {
          setRoomInfo({ status: 'error', message: 'Could not load room information.' })
        }
      }
    }
    void loadRoomInfo()
    return () => {
      active = false
    }
  }, [roomName, session, demoAdmin, authLoading, profile?.full_name, profile?.email])

  useEffect(() => {
    if (authLoading || roomInfo.status !== 'ready') return
    if (roomInfo.requiresAuth && !isAuthed && !useSeedData) return

    let active = true
    async function getToken() {
      let res: Response
      const headers = await adminRequestHeaders(session, demoAdmin)
      try {
        res = await fetch('/api/livekit/token', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            room: roomName,
            identity,
            name: resolvedDisplayName || 'Guest',
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

      let json: {
        token?: string
        url?: string
        mock?: boolean
        error?: string
        maxParticipants?: number
        isAdmin?: boolean
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
        canRecord: json.isAdmin === true || isAdmin,
      })
    }
    void getToken()
    return () => {
      active = false
    }
  }, [
    roomName,
    identity,
    resolvedDisplayName,
    session,
    demoAdmin,
    isAdmin,
    authLoading,
    roomInfo,
    isAuthed,
    useSeedData,
  ])

  useEffect(() => {
    return () => {
      void disconnect?.()
    }
  }, [disconnect])

  async function joinWithMedia(includeVideo: boolean) {
    if (state.status !== 'ready' || joining || joined || !connect) return
    if (!skipNamePrompt && !resolvedDisplayName) {
      setJoinError('Please enter your name before joining.')
      return
    }

    setJoining(true)
    setJoinError(null)
    try {
      const tracks = await createLocalTracks({
        audio: true,
        video: includeVideo ? IOS_VIDEO_CONSTRAINTS : false,
      })
      await connect(state.url, state.token)
      await Promise.all(tracks.map((track) => room.localParticipant.publishTrack(track)))
      await ensureMediaEnabled(room, includeVideo)
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

  if (authLoading || roomInfo.status === 'loading') {
    return (
      <div className="flex min-h-svh items-center justify-center bg-void">
        <span className="font-garamond text-sm tracking-[0.2em] text-mist/40 uppercase">
          Loading room…
        </span>
      </div>
    )
  }

  if (roomInfo.status === 'error') {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-void px-6 text-center">
        <p className="font-garamond text-mist/70">{roomInfo.message}</p>
        <Link to="/" className="font-garamond text-sm text-gold underline">
          Back to home
        </Link>
      </div>
    )
  }

  if (roomInfo.requiresAuth && !isAuthed && !useSeedData) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `/room/${roomName}`, seedRole: 'member' }}
      />
    )
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
    const backTo = roomInfo.roomType === 'booking' ? '/' : '/dashboard'
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-void">
        <p className="font-garamond text-mist/70">{state.message}</p>
        <Link to={backTo} className="font-garamond text-sm text-gold underline">
          Go back
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
    const backLink =
      roomInfo.roomType === 'booking'
        ? { to: '/', label: 'Back to home' }
        : { to: '/dashboard', label: 'Back to dashboard' }

    return (
      <RoomPreviewLobby
        roomName={roomName}
        roomType={roomInfo.roomType}
        displayName={resolvedDisplayName}
        onDisplayNameChange={setDisplayName}
        hideNameField={skipNamePrompt}
        joining={joining}
        joinError={joinError}
        onJoinWithVideo={() => void joinWithMedia(true)}
        onJoinAudioOnly={() => void joinWithMedia(false)}
        backLink={backLink}
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
      canRecord={(state.canRecord || isAdmin) && Boolean(session?.access_token || demoAdmin)}
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
