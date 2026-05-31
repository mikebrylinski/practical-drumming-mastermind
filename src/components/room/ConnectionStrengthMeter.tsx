import {
  useConnectionQualityIndicator,
  useConnectionState,
  useLocalParticipant,
} from '@livekit/components-react'
import { ConnectionQuality, ConnectionState } from 'livekit-client'

export type Strength = 'excellent' | 'good' | 'poor' | 'lost'

const STRENGTH_META: Record<
  Strength,
  { label: string; dot: string; bar: string; bars: number }
> = {
  excellent: { label: 'Excellent', dot: 'bg-emerald-400', bar: 'bg-emerald-400', bars: 4 },
  good: { label: 'Good', dot: 'bg-yellow-400', bar: 'bg-yellow-400', bars: 3 },
  poor: { label: 'Poor', dot: 'bg-orange-400', bar: 'bg-orange-400', bars: 2 },
  lost: { label: 'Lost', dot: 'bg-red-500', bar: 'bg-red-500', bars: 1 },
}

/** Presentational meter — reused for live and mock contexts. */
export function StrengthMeterView({ strength }: { strength: Strength }) {
  const meta = STRENGTH_META[strength]
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur">
      <span
        className={`size-2 rounded-full ${meta.dot} ${strength === 'lost' ? 'animate-pulse' : ''}`}
        aria-hidden
      />
      <div className="flex items-end gap-0.5" aria-hidden>
        {[1, 2, 3, 4].map((n) => (
          <span
            key={n}
            className={`w-1 rounded-sm transition-colors ${
              n <= meta.bars ? meta.bar : 'bg-white/15'
            }`}
            style={{ height: `${4 + n * 3}px` }}
          />
        ))}
      </div>
      <span className="font-garamond text-xs tracking-[0.14em] text-mist/75 uppercase">
        {meta.label}
      </span>
    </div>
  )
}

function deriveStrength(state: ConnectionState, quality: ConnectionQuality): Strength {
  if (state === ConnectionState.Disconnected) return 'lost'
  if (state === ConnectionState.Connecting || state === ConnectionState.Reconnecting) return 'poor'
  switch (quality) {
    case ConnectionQuality.Excellent:
      return 'excellent'
    case ConnectionQuality.Good:
      return 'good'
    case ConnectionQuality.Poor:
      return 'poor'
    case ConnectionQuality.Lost:
      return 'lost'
    default:
      return 'good'
  }
}

/**
 * Live connection strength meter. Reads the room connection state and the local
 * participant network quality; both hooks are reactive, so it updates in real
 * time. Must be rendered inside a LiveKitRoom context.
 */
export function ConnectionStrengthMeter() {
  const state = useConnectionState()
  const { localParticipant } = useLocalParticipant()
  const { quality } = useConnectionQualityIndicator({ participant: localParticipant })
  return <StrengthMeterView strength={deriveStrength(state, quality)} />
}
