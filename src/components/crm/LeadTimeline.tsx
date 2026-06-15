import type { LeadEvent } from '../../lib/supabase/types'

const EVENT_META: Record<string, { label: string; dot: string }> = {
  page_visit: { label: 'Page visit', dot: 'bg-mist/40' },
  booking_click: { label: 'Booking click', dot: 'bg-orange-400' },
  form_submit: { label: 'Form submit', dot: 'bg-blue-400' },
  booking_created: { label: 'Booking created', dot: 'bg-emerald-400' },
  application_update: { label: 'Application update', dot: 'bg-amber-400' },
  contacted: { label: 'Marked contacted', dot: 'bg-gold' },
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  return `${days}d ago`
}

function metaSummary(metadata: Record<string, unknown>) {
  const entries = Object.entries(metadata || {}).filter(
    ([k]) => !['repeat', 'visitCount'].includes(k),
  )
  if (entries.length === 0) return null
  return entries
    .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`)
    .join(' · ')
}

export function LeadTimeline({ events, limit }: { events: LeadEvent[]; limit?: number }) {
  if (events.length === 0) {
    return <p className="font-garamond text-sm text-mist/40">No events recorded.</p>
  }
  const ordered = [...events].sort((a, b) => b.created_at.localeCompare(a.created_at))
  const visible = limit ? ordered.slice(0, limit) : ordered
  return (
    <ol className="relative space-y-4 border-l border-white/10 pl-5">
      {visible.map((e) => {
        const meta = EVENT_META[e.type] ?? { label: e.type, dot: 'bg-mist/40' }
        const summary = metaSummary(e.metadata)
        return (
          <li key={e.id} className="relative">
            <span
              className={`absolute -left-[1.42rem] top-1.5 size-2.5 rounded-full ring-2 ring-void ${meta.dot}`}
              aria-hidden
            />
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-garamond text-sm text-mist">{meta.label}</p>
              <span className="shrink-0 font-garamond text-xs text-mist/40">
                {relativeTime(e.created_at)}
              </span>
            </div>
            {e.path ? (
              <p className="font-garamond text-xs text-mist/45">{e.path}</p>
            ) : null}
            {e.ip_address ? (
              <p className="font-garamond text-xs text-mist/35">IP: {e.ip_address}</p>
            ) : null}
            {summary ? (
              <p className="mt-0.5 font-garamond text-xs text-mist/35">{summary}</p>
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
