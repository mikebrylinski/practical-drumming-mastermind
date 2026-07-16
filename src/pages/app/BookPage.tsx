import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AppShell } from '../../components/app/AppShell'
import { useScrollToTop } from '../../hooks/useScrollToTop'
import { supabase } from '../../lib/supabase/client'
import { useAuth } from '../../lib/auth/AuthProvider'
import { trackLeadEvent } from '../../lib/leads/track'
import { formatDateTime, timeZoneLabel } from '../../lib/datetime'
import { loadSlots as loadStoredSlots, markSlotBooked } from '../../lib/booking/slotStore'
import type { AvailabilitySlot } from '../../lib/supabase/types'

const HOST_NAME = 'Mike Malinin'
const HOST_AVATAR = '/about-mike.png'

const inputClass =
  'w-full rounded-lg border border-white/12 bg-charcoal/40 px-4 py-2.5 font-garamond text-mist placeholder:text-mist/35 outline-none transition focus:border-gold/45'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function eventTitle(slug: string): string {
  const known: Record<string, string> = {
    'discovery-call': 'Fit Call',
    'strategy-session': '1:1 Strategy Session',
  }
  if (known[slug]) return known[slug]
  return slug
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
}

function HostCard({
  title,
  durationMin,
  selectedSlot,
}: {
  title: string
  durationMin: number
  selectedSlot: AvailabilitySlot | null
}) {
  return (
    <div className="lg:border-r lg:border-white/10 lg:pr-8">
      <img
        src={HOST_AVATAR}
        alt={HOST_NAME}
        className="size-14 rounded-full object-cover ring-1 ring-white/15"
      />
      <p className="mt-4 font-garamond text-sm text-mist/55">{HOST_NAME}</p>
      <h2 className="mt-1 font-bebas text-2xl tracking-wide text-mist">{title}</h2>

      <ul className="mt-5 space-y-2.5 font-garamond text-sm text-mist/65">
        <li className="flex items-center gap-2.5">
          <span className="text-gold/80" aria-hidden>◷</span>
          {durationMin} min
        </li>
        <li className="flex items-center gap-2.5">
          <span className="text-gold/80" aria-hidden>◉</span>
          LiveKit video call
        </li>
        {selectedSlot ? (
          <li className="flex items-start gap-2.5 text-gold">
            <span aria-hidden>▦</span>
            {formatDateTime(selectedSlot.starts_at)}
          </li>
        ) : null}
      </ul>

      <p className="mt-5 font-garamond text-sm leading-relaxed text-mist/45">
        A focused one-on-one session with Mike to map out your next steps behind the kit.
      </p>
    </div>
  )
}

export function BookPage() {
  const { slug = 'discovery-call' } = useParams()
  const { session, profile } = useAuth()
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<AvailabilitySlot | null>(null)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [viewMonth, setViewMonth] = useState<Date>(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [name, setName] = useState(profile?.full_name ?? '')
  const [email, setEmail] = useState(profile?.email ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState<{ dateLabel: string; roomName: string | null } | null>(
    null,
  )
  const [copied, setCopied] = useState(false)

  const title = eventTitle(slug)

  useScrollToTop(slug, selected?.id ?? null, confirmed?.dateLabel ?? null)

  useEffect(() => {
    trackLeadEvent('booking_click', { source: 'book-page', slug })
  }, [slug])

  useEffect(() => {
    let active = true
    async function load() {
      if (!supabase) {
        if (active) {
          const now = Date.now()
          setSlots(
            loadStoredSlots().filter(
              (s) =>
                s.slug === slug &&
                !s.is_booked &&
                new Date(s.starts_at).getTime() >= now,
            ),
          )
          setLoading(false)
        }
        return
      }
      const { data } = await supabase
        .from('availability_slots')
        .select('*')
        .eq('slug', slug)
        .eq('is_booked', false)
        .gte('starts_at', new Date().toISOString())
        .order('starts_at', { ascending: true })
      if (!active) return
      setSlots((data as AvailabilitySlot[]) ?? [])
      setLoading(false)
    }
    void load()
    return () => {
      active = false
    }
  }, [slug])

  // Slots grouped by local day, plus the set of days that have availability.
  const slotsByDay = useMemo(() => {
    const map = new Map<string, AvailabilitySlot[]>()
    for (const s of slots) {
      const key = dayKey(new Date(s.starts_at))
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(s)
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.starts_at.localeCompare(b.starts_at))
    }
    return map
  }, [slots])

  const durationMin = useMemo(() => {
    const s = selected ?? slots[0]
    if (!s) return 30
    const mins = Math.round(
      (new Date(s.ends_at).getTime() - new Date(s.starts_at).getTime()) / 60000,
    )
    return mins > 0 ? mins : 30
  }, [selected, slots])

  // Default to the first available day and its month once slots load.
  useEffect(() => {
    if (selectedDay || slots.length === 0) return
    const first = new Date(slots[0].starts_at)
    setSelectedDay(dayKey(first))
    setViewMonth(new Date(first.getFullYear(), first.getMonth(), 1))
  }, [slots, selectedDay])

  const calendarCells = useMemo(() => {
    const year = viewMonth.getFullYear()
    const month = viewMonth.getMonth()
    const startWeekday = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: (Date | null)[] = []
    for (let i = 0; i < startWeekday; i += 1) cells.push(null)
    for (let d = 1; d <= daysInMonth; d += 1) cells.push(new Date(year, month, d))
    return cells
  }, [viewMonth])

  const daySlots = selectedDay ? (slotsByDay.get(selectedDay) ?? []) : []

  function changeMonth(delta: number) {
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1))
  }

  async function copyRoomLink(roomName: string) {
    const link = `${window.location.origin}/room/${roomName}`
    try {
      await navigator.clipboard.writeText(link)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = link
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function confirm(e: FormEvent) {
    e.preventDefault()
    if (!selected) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: selected.id,
          name,
          email,
          userId: session?.user?.id ?? null,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || 'Booking failed')
      // In mock mode, persist the booked state so the slot disappears from
      // the booking page and shows as "Booked" in admin availability.
      if (!supabase) markSlotBooked(selected.id)
      setConfirmed({
        dateLabel: formatDateTime(selected.starts_at),
        roomName: json.booking?.livekit_room_name ?? null,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmed) {
    return (
      <AppShell eyebrow="Booking" title="You're booked.">
        <div className="mx-auto max-w-lg rounded-xl border border-gold/30 bg-gold/5 p-8 text-center">
          <p className="font-garamond text-xs tracking-[0.3em] text-gold uppercase">Confirmed</p>
          <h2 className="mt-3 font-bebas text-3xl text-mist">{confirmed.dateLabel}</h2>
          <p className="mt-2 font-garamond text-sm text-mist/55">
            with {HOST_NAME} · {title}
          </p>
          <p className="mt-3 font-garamond text-base text-mist/65">
            A confirmation email is on its way.
          </p>
          {confirmed.roomName ? (
            <>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to={`/room/${confirmed.roomName}`}
                  className="inline-flex min-h-11 items-center rounded-full bg-gold px-6 font-garamond text-sm tracking-[0.16em] text-void uppercase transition hover:bg-gold/90"
                >
                  Join the room
                </Link>
                <button
                  type="button"
                  onClick={() => copyRoomLink(confirmed.roomName as string)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/40 px-6 font-garamond text-sm tracking-[0.16em] text-gold uppercase transition hover:bg-gold/10"
                >
                  {copied ? '✓ Copied' : 'Copy room link'}
                </button>
              </div>
              <p className="mt-3 break-all font-garamond text-xs text-mist/40">
                {`${window.location.origin}/room/${confirmed.roomName}`}
              </p>
            </>
          ) : null}
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell eyebrow="Scheduling" title="Book a call" subtitle={`Pick a time with ${HOST_NAME}.`}>
      {loading ? (
        <p className="font-garamond text-mist/40">Loading availability…</p>
      ) : slots.length === 0 ? (
        <p className="font-garamond text-mist/50">No open slots right now. Please check back soon.</p>
      ) : selected ? (
        // Step 2 — details / confirm
        <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <HostCard title={title} durationMin={durationMin} selectedSlot={selected} />
          <div className="max-w-md">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="font-garamond text-xs tracking-[0.14em] text-mist/45 uppercase transition hover:text-gold"
            >
              ← Back
            </button>
            <h3 className="mt-3 font-garamond text-lg text-mist">Enter details</h3>
            <form onSubmit={confirm} className="mt-4 space-y-3">
              <input
                className={inputClass}
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
              <input
                className={inputClass}
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              {error ? <p className="font-garamond text-sm text-red-400/90">{error}</p> : null}
              <button
                type="submit"
                disabled={submitting}
                className="flex min-h-11 w-full items-center justify-center rounded-full bg-gold px-5 font-garamond text-sm tracking-[0.16em] text-void uppercase transition hover:bg-gold/90 disabled:opacity-50"
              >
                {submitting ? 'Scheduling…' : 'Schedule event'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        // Step 1 — pick a date + time
        <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)_14rem]">
          <HostCard title={title} durationMin={durationMin} selectedSlot={null} />

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-garamond text-base text-mist">
                {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => changeMonth(-1)}
                  aria-label="Previous month"
                  className="flex size-8 items-center justify-center rounded-full border border-white/12 font-garamond text-mist/60 transition hover:border-gold/40 hover:text-gold"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => changeMonth(1)}
                  aria-label="Next month"
                  className="flex size-8 items-center justify-center rounded-full border border-white/12 font-garamond text-mist/60 transition hover:border-gold/40 hover:text-gold"
                >
                  ›
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS.map((w, i) => (
                <div
                  key={i}
                  className="py-1 font-garamond text-[0.7rem] tracking-[0.1em] text-mist/35 uppercase"
                >
                  {w}
                </div>
              ))}
              {calendarCells.map((cell, i) => {
                if (!cell) return <div key={`e${i}`} />
                const key = dayKey(cell)
                const hasSlots = slotsByDay.has(key)
                const isSelected = key === selectedDay
                const isToday = key === dayKey(new Date())
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={!hasSlots}
                    onClick={() => setSelectedDay(key)}
                    className={`relative mx-auto flex size-10 items-center justify-center rounded-full font-garamond text-sm transition ${
                      isSelected
                        ? 'bg-gold text-void'
                        : hasSlots
                          ? 'bg-gold/10 text-gold hover:bg-gold/20'
                          : 'text-mist/25'
                    } ${!hasSlots ? 'cursor-default' : ''}`}
                  >
                    {cell.getDate()}
                    {isToday && !isSelected ? (
                      <span className="absolute bottom-1 size-1 rounded-full bg-gold" aria-hidden />
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="lg:border-l lg:border-white/10 lg:pl-6">
            <h3 className="mb-1 font-garamond text-sm tracking-[0.14em] text-mist/60 uppercase">
              {selectedDay
                ? new Date(daySlots[0]?.starts_at ?? Date.now()).toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Select a day'}
            </h3>
            {selectedDay && daySlots.length > 0 && timeZoneLabel() ? (
              <p className="mb-3 font-garamond text-xs tracking-[0.08em] text-gold/70">
                Shown in your local time zone ({timeZoneLabel()})
              </p>
            ) : (
              <div className="mb-3" />
            )}
            <div className="flex max-h-[24rem] flex-col gap-2 overflow-y-auto pr-1">
              {daySlots.length === 0 ? (
                <p className="font-garamond text-sm text-mist/40">No times on this day.</p>
              ) : (
                daySlots.map((s) => {
                  const time = new Date(s.starts_at).toLocaleTimeString(undefined, {
                    hour: 'numeric',
                    minute: '2-digit',
                  })
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelected(s)}
                      className="min-h-11 rounded-lg border border-gold/30 bg-charcoal/30 px-4 font-garamond text-sm text-mist transition hover:border-gold hover:bg-gold/10"
                    >
                      {time}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}
