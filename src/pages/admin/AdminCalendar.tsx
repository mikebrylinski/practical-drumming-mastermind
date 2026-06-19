import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppCard, AdminShell } from '../../components/app/AdminShell'
import { useAuth } from '../../lib/auth/AuthProvider'
import { supabase } from '../../lib/supabase/client'
import { buildMonthGrid, calendarDayKey, MONTH_NAMES, WEEKDAYS } from '../../lib/cohorts/calendar'
import { buildDemoCohorts, buildDemoSessions } from '../../lib/demo/cohorts'
import { formatDateTime } from '../../lib/datetime'
import type { Booking, Cohort, Session } from '../../lib/supabase/types'

type CalEventType = 'booking' | 'session' | 'cohort'

type CalEvent = {
  id: string
  type: CalEventType
  title: string
  at: string
  to: string
}

const TYPE_META: Record<CalEventType, { label: string; dot: string; text: string }> = {
  cohort: { label: 'Cohort start', dot: 'bg-emerald-400', text: 'text-emerald-300' },
  session: { label: 'Live session', dot: 'bg-gold', text: 'text-gold' },
  booking: { label: 'Discovery call', dot: 'bg-sky-400', text: 'text-sky-300' },
}

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    slot_id: null,
    user_id: null,
    name: 'Jordan Vega',
    email: 'jordan@example.com',
    livekit_room_name: 'call-ab12cd34',
    status: 'confirmed',
    starts_at: new Date(Date.now() + 2 * 864e5).toISOString(),
    created_at: new Date(Date.now() - 36e5).toISOString(),
  },
  {
    id: 'b2',
    slot_id: null,
    user_id: null,
    name: 'Priya N.',
    email: 'priya@example.com',
    livekit_room_name: 'call-ef56gh78',
    status: 'confirmed',
    starts_at: new Date(Date.now() + 5 * 864e5).toISOString(),
    created_at: new Date(Date.now() - 9e6).toISOString(),
  },
]

function eventDayKey(iso: string): string {
  return calendarDayKey(new Date(iso))
}

export function AdminCalendar() {
  const { useSeedData } = useAuth()
  const [cohorts, setCohorts] = useState<Cohort[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [selectedKey, setSelectedKey] = useState<string>(() => calendarDayKey(new Date()))

  useEffect(() => {
    let active = true
    async function load() {
      if (supabase && !useSeedData) {
        const [cohortRes, sessRes, bookingRes] = await Promise.all([
          supabase.from('cohorts').select('*').order('starts_at', { ascending: true }),
          supabase.from('sessions').select('*').order('scheduled_at', { ascending: true }),
          supabase
            .from('bookings')
            .select('*')
            .neq('status', 'cancelled')
            .order('starts_at', { ascending: true }),
        ])
        if (!active) return
        setCohorts((cohortRes.data as Cohort[]) ?? [])
        setSessions((sessRes.data as Session[]) ?? [])
        setBookings((bookingRes.data as Booking[]) ?? [])
      } else {
        if (!active) return
        setCohorts(buildDemoCohorts())
        setSessions(buildDemoSessions())
        setBookings(MOCK_BOOKINGS)
      }
      setLoading(false)
    }
    void load()
    return () => {
      active = false
    }
  }, [useSeedData])

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalEvent[]>()
    const push = (e: CalEvent) => {
      const key = eventDayKey(e.at)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(e)
    }
    for (const c of cohorts) {
      if (c.starts_at) {
        push({ id: `cohort-${c.id}`, type: 'cohort', title: `${c.name} starts`, at: c.starts_at, to: '/admin/cohorts' })
      }
    }
    for (const s of sessions) {
      if (s.scheduled_at) {
        push({ id: `session-${s.id}`, type: 'session', title: s.title, at: s.scheduled_at, to: '/admin/cohorts' })
      }
    }
    for (const b of bookings) {
      if (b.starts_at) {
        push({
          id: `booking-${b.id}`,
          type: 'booking',
          title: `Call · ${b.name || b.email || 'Guest'}`,
          at: b.starts_at,
          to: '/admin/bookings',
        })
      }
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.at.localeCompare(b.at))
    }
    return map
  }, [cohorts, sessions, bookings])

  const grid = useMemo(() => buildMonthGrid(viewMonth), [viewMonth])
  const todayKey = calendarDayKey(new Date())
  const selectedEvents = eventsByDay.get(selectedKey) ?? []

  function shiftMonth(delta: number) {
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1))
  }

  return (
    <AdminShell
      eyebrow="Admin"
      title="Master calendar"
      subtitle="All cohorts, sessions, and discovery calls on one calendar."
      wide
    >
      {loading ? (
        <p className="font-garamond text-mist/40">Loading calendar…</p>
      ) : (
        <div className="space-y-5">
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4">
            {(Object.keys(TYPE_META) as CalEventType[]).map((t) => (
              <span key={t} className="flex items-center gap-2 font-garamond text-xs text-mist/55">
                <span className={`size-2.5 rounded-full ${TYPE_META[t].dot}`} aria-hidden />
                {TYPE_META[t].label}
              </span>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <AppCard>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-garamond text-base text-mist">
                  {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => shiftMonth(-1)}
                    aria-label="Previous month"
                    className="flex size-8 items-center justify-center rounded-full border border-white/12 text-mist/70 transition hover:border-gold/40 hover:text-gold"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date()
                      setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1))
                      setSelectedKey(calendarDayKey(d))
                    }}
                    className="rounded-full border border-white/12 px-3 py-1 font-garamond text-xs tracking-[0.12em] text-mist/70 uppercase transition hover:border-gold/40 hover:text-gold"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => shiftMonth(1)}
                    aria-label="Next month"
                    className="flex size-8 items-center justify-center rounded-full border border-white/12 text-mist/70 transition hover:border-gold/40 hover:text-gold"
                  >
                    ›
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {WEEKDAYS.map((d, i) => (
                  <span key={i} className="py-1 font-garamond text-[0.65rem] tracking-[0.12em] text-mist/35 uppercase">
                    {d}
                  </span>
                ))}
                {grid.map((cell, i) => {
                  if (!cell) return <span key={`empty-${i}`} />
                  const key = calendarDayKey(cell)
                  const dayEvents = eventsByDay.get(key) ?? []
                  const isSelected = key === selectedKey
                  const isToday = key === todayKey
                  const dots = Array.from(new Set(dayEvents.map((e) => e.type)))
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedKey(key)}
                      className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border text-sm transition ${
                        isSelected
                          ? 'border-gold/60 bg-gold/10 text-mist'
                          : 'border-white/[0.06] text-mist/70 hover:border-white/20'
                      } ${isToday && !isSelected ? 'ring-1 ring-gold/30' : ''}`}
                    >
                      <span className="font-garamond">{cell.getDate()}</span>
                      <span className="flex h-1.5 items-center gap-0.5">
                        {dots.map((t) => (
                          <span key={t} className={`size-1.5 rounded-full ${TYPE_META[t].dot}`} aria-hidden />
                        ))}
                      </span>
                    </button>
                  )
                })}
              </div>
            </AppCard>

            <AppCard>
              <h3 className="font-garamond text-base text-mist">
                {(() => {
                  const [y, m, d] = selectedKey.split('-').map(Number)
                  return new Date(y, m, d).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })
                })()}
              </h3>
              {selectedEvents.length === 0 ? (
                <p className="mt-4 font-garamond text-sm text-mist/40">Nothing scheduled this day.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {selectedEvents.map((e) => {
                    const meta = TYPE_META[e.type]
                    return (
                      <li key={e.id}>
                        <Link
                          to={e.to}
                          className="flex items-start gap-3 rounded-lg px-2 py-2 transition hover:bg-white/[0.04]"
                        >
                          <span className={`mt-1.5 size-2 shrink-0 rounded-full ${meta.dot}`} aria-hidden />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-garamond text-sm text-mist">{e.title}</p>
                            <p className="font-garamond text-xs text-mist/45">
                              {formatDateTime(e.at, { hour: 'numeric', minute: '2-digit' })}
                              <span className={`ml-2 ${meta.text}`}>{meta.label}</span>
                            </p>
                          </div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </AppCard>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
