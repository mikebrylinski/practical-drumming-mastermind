import type { ApplicationStatus, LeadEvent } from '../supabase/types'

/** Base intent weight for each tracked event type. */
export const SCORE_WEIGHTS: Record<string, number> = {
  page_visit: 10,
  booking_click: 40,
  form_submit: 60,
  booking_created: 60,
  application_update: 0,
  contacted: 0,
}

export function scoreForEvent(type: string): number {
  return SCORE_WEIGHTS[type] ?? 0
}

/**
 * Compute a 0-100 intent score from a lead's events. Repeated actions of the
 * same type apply an escalating (capped) multiplier — repeat engagement signals
 * stronger intent.
 */
export function computeIntentScore(events: Pick<LeadEvent, 'type'>[]): number {
  const counts: Record<string, number> = {}
  let raw = 0
  for (const event of events) {
    const weight = scoreForEvent(event.type)
    counts[event.type] = (counts[event.type] ?? 0) + 1
    const repeat = counts[event.type]
    const multiplier = 1 + Math.min(repeat - 1, 4) * 0.15
    raw += weight * multiplier
  }
  return Math.max(0, Math.min(100, Math.round(raw)))
}

export type Stage = 'cold' | 'warm' | 'hot' | 'converted'

export function computeStage(
  score: number,
  opts: { hasBooking?: boolean; applicationStatus?: ApplicationStatus | null } = {},
): Stage {
  if (opts.hasBooking || opts.applicationStatus === 'accepted') return 'converted'
  if (score >= 51) return 'hot'
  if (score >= 26) return 'warm'
  return 'cold'
}

export type HeatBand = 'cold' | 'warm' | 'hot' | 'urgent'

export function heatBand(score: number): HeatBand {
  if (score >= 76) return 'urgent'
  if (score >= 51) return 'hot'
  if (score >= 26) return 'warm'
  return 'cold'
}

type HeatTheme = { label: string; text: string; bar: string; ring: string; glow: string }

export const HEAT_THEME: Record<HeatBand, HeatTheme> = {
  cold: {
    label: 'Cold',
    text: 'text-mist/55',
    bar: 'bg-mist/30',
    ring: 'ring-white/10',
    glow: '',
  },
  warm: {
    label: 'Warm',
    text: 'text-blue-300',
    bar: 'bg-blue-400',
    ring: 'ring-blue-400/30',
    glow: '',
  },
  hot: {
    label: 'Hot',
    text: 'text-orange-300',
    bar: 'bg-orange-400',
    ring: 'ring-orange-400/40',
    glow: 'shadow-[0_0_24px_-4px_rgba(251,146,60,0.55)]',
  },
  urgent: {
    label: 'Urgent',
    text: 'text-red-300',
    bar: 'bg-red-500',
    ring: 'ring-red-500/50',
    glow: 'crm-hot-glow',
  },
}

export const STAGE_THEME: Record<Stage, { label: string; className: string }> = {
  cold: { label: 'Cold', className: 'bg-white/8 text-mist/55 ring-white/10' },
  warm: { label: 'Warm', className: 'bg-blue-500/15 text-blue-300 ring-blue-400/30' },
  hot: { label: 'Hot', className: 'bg-orange-500/15 text-orange-300 ring-orange-400/40' },
  converted: {
    label: 'Converted',
    className: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/40',
  },
}
