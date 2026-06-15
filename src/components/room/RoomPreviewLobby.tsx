import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

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

export type RoomPreviewLobbyProps = {
  roomName: string
  roomType: 'booking' | 'member'
  displayName: string
  onDisplayNameChange: (name: string) => void
  hideNameField?: boolean
  joining: boolean
  joinError: string | null
  onJoinWithVideo: () => void
  onJoinAudioOnly: () => void
  backLink?: { to: string; label: string }
}

export function RoomPreviewLobby({
  roomName,
  roomType,
  displayName,
  onDisplayNameChange,
  hideNameField = false,
  joining,
  joinError,
  onJoinWithVideo,
  onJoinAudioOnly,
  backLink = { to: '/dashboard', label: 'Back to dashboard' },
}: RoomPreviewLobbyProps) {
  const goldBtn =
    'flex min-h-12 w-full items-center justify-center rounded-full bg-gold px-6 font-garamond text-sm tracking-[0.16em] uppercase text-void transition hover:bg-gold/90 disabled:opacity-50'
  const ghostBtn =
    'flex min-h-11 w-full items-center justify-center rounded-full border border-white/15 px-6 font-garamond text-xs tracking-[0.14em] text-mist/70 uppercase transition hover:border-gold/35 hover:text-gold disabled:opacity-50'

  const nameValid = hideNameField
    ? displayName.trim().length > 0
    : displayName.trim().length >= 2

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-void px-6 py-10">
      <div className="w-full max-w-lg space-y-2 text-center">
        <p className="font-garamond text-xs tracking-[0.2em] text-gold uppercase">
          {roomType === 'booking' ? 'Discovery call' : 'Live session'}
        </p>
        <h1 className="font-bebas text-4xl tracking-wide text-mist">{roomName}</h1>
        <p className="font-garamond text-sm leading-relaxed text-mist/60">
          {hideNameField
            ? 'Join when you\u2019re ready. Your browser will ask for camera and microphone access.'
            : 'Enter your name and join when you\u2019re ready. Your browser will ask for camera and microphone access.'}
        </p>
      </div>

      <div className="w-full max-w-lg space-y-4">
        {!hideNameField ? (
          <label className="block text-left">
            <span className="font-garamond text-xs tracking-[0.14em] text-mist/50 uppercase">
              Your name
            </span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => onDisplayNameChange(e.target.value)}
              placeholder="How others will see you"
              className="mt-1.5 w-full rounded-lg border border-white/12 bg-charcoal/40 px-4 py-2.5 font-garamond text-sm text-mist outline-none focus:border-gold/45"
              maxLength={80}
            />
          </label>
        ) : null}

        {joinError ? (
          <p className="font-garamond text-sm text-red-400/90">{joinError}</p>
        ) : null}

        <div className="flex flex-col gap-3">
          <GestureActionButton
            onGesture={onJoinWithVideo}
            disabled={joining || !nameValid}
            className={goldBtn}
          >
            {joining ? 'Joining room…' : 'Join with video'}
          </GestureActionButton>
          <GestureActionButton
            onGesture={onJoinAudioOnly}
            disabled={joining || !nameValid}
            className={ghostBtn}
          >
            Join with audio only
          </GestureActionButton>
        </div>
      </div>

      <Link
        to={backLink.to}
        className="font-garamond text-sm text-mist/45 underline transition hover:text-gold"
      >
        {backLink.label}
      </Link>
    </div>
  )
}
