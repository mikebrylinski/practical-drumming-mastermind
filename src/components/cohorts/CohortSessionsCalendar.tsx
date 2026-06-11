import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MONTH_NAMES,
  WEEKDAYS,
  buildCohortColorMap,
  buildMonthGrid,
  calendarDayKey,
  cohortDotsForDay,
  groupSessionsByDay,
  sessionDayKey,
} from '../../lib/cohorts/calendar'
import { cohortRoomName } from '../../lib/slug'
import { formatDateTime, formatTime } from '../../lib/datetime'
import type { Cohort, Session } from '../../lib/supabase/types'

const LIVE_WINDOW_MS = 60 * 60 * 1000

function isLive(session: Session): boolean {
  if (!session.scheduled_at) return false
  const diff = new Date(session.scheduled_at).getTime() - Date.now()
  return diff <= LIVE_WINDOW_MS && diff >= -LIVE_WINDOW_MS
}

type CohortSessionsCalendarProps = {
  sessions: Session[]
  cohorts: Cohort[]
}

export function CohortSessionsCalendar({ sessions, cohorts }: CohortSessionsCalendarProps) {
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [selectedKey, setSelectedKey] = useState<string | null>(() => calendarDayKey(new Date()))
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)

  const cohortById = useMemo(() => new Map(cohorts.map((c) => [c.id, c])), [cohorts])
  const colorMap = useMemo(() => buildCohortColorMap(cohorts), [cohorts])
  const byDay = useMemo(() => groupSessionsByDay(sessions), [sessions])
  const cells = useMemo(() => buildMonthGrid(viewMonth), [viewMonth])

  const daySessions = selectedKey ? (byDay.get(selectedKey) ?? []) : []
  const focusedSession =
    daySessions.find((s) => s.id === selectedSessionId) ?? daySessions[0] ?? null
  const focusedCohort = focusedSession?.cohort_id
    ? cohortById.get(focusedSession.cohort_id)
    : null

  function changeMonth(delta: number) {
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1))
  }

  function selectDay(key: string) {
    setSelectedKey(key)
    setSelectedSessionId(null)
  }

  function selectSession(session: Session) {
    setSelectedSessionId(session.id)
    if (session.scheduled_at) {
      setSelectedKey(sessionDayKey(session.scheduled_at))
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="rounded-xl border border-white/10 bg-charcoal/40 p-4">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="rounded-lg px-2 py-1 font-garamond text-sm text-mist/50 transition hover:bg-white/5 hover:text-mist"
              aria-label="Previous month"
            >
              ←
            </button>
            <h2 className="font-garamond text-sm tracking-[0.14em] text-mist uppercase">
              {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
            </h2>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="rounded-lg px-2 py-1 font-garamond text-sm text-mist/50 transition hover:bg-white/5 hover:text-mist"
              aria-label="Next month"
            >
              →
            </button>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((d, i) => (
              <span key={`${d}-${i}`} className="font-garamond text-[0.65rem] text-mist/35">
                {d}
              </span>
            ))}
            {cells.map((day, i) => {
              if (!day) return <span key={`empty-${i}`} />
              const key = calendarDayKey(day)
              const dayList = byDay.get(key) ?? []
              const dots = cohortDotsForDay(dayList, colorMap)
              const selected = key === selectedKey
              const today = calendarDayKey(new Date()) === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectDay(key)}
                  className={`relative flex aspect-square flex-col items-center justify-center rounded-lg font-garamond text-sm transition ${
                    selected
                      ? 'bg-gold/20 text-gold ring-1 ring-gold/40'
                      : dots.length > 0
                        ? 'bg-white/[0.06] text-mist hover:bg-white/10'
                        : 'text-mist/45 hover:bg-white/[0.04]'
                  } ${today && !selected ? 'ring-1 ring-white/15' : ''}`}
                >
                  {day.getDate()}
                  {dots.length > 0 ? (
                    <span className="absolute bottom-1 flex gap-0.5">
                      {dots.slice(0, 4).map((cls, j) => (
                        <span key={j} className={`size-1 rounded-full ${cls}`} aria-hidden />
                      ))}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>

        {cohorts.length > 0 ? (
          <ul className="flex flex-wrap gap-x-4 gap-y-2 rounded-xl border border-white/10 bg-charcoal/30 px-4 py-3">
            {cohorts.map((c) => (
              <li key={c.id} className="flex items-center gap-2">
                <span
                  className={`size-2 rounded-full ${colorMap.get(c.id) ?? 'bg-gold'}`}
                  aria-hidden
                />
                <Link
                  to={`/cohorts/${c.id}`}
                  className="font-garamond text-xs text-mist/60 transition hover:text-gold"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="font-garamond text-sm tracking-[0.16em] text-gold/80 uppercase">
            {selectedKey ? 'Sessions this day' : 'Select a day'}
          </h2>
          {daySessions.length === 0 ? (
            <p className="mt-3 font-garamond text-mist/45">No cohort sessions on this day.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {daySessions.map((s) => {
                const cohort = s.cohort_id ? cohortById.get(s.cohort_id) : null
                const active = focusedSession?.id === s.id
                const live = isLive(s)
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => selectSession(s)}
                      className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${
                        active
                          ? 'border-gold/40 bg-gold/10'
                          : 'border-white/10 bg-charcoal/40 hover:border-white/20'
                      }`}
                    >
                      <span
                        className={`mt-1.5 size-2 shrink-0 rounded-full ${s.cohort_id ? (colorMap.get(s.cohort_id) ?? 'bg-gold') : 'bg-gold'}`}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-garamond text-xs tracking-[0.12em] text-mist/45 uppercase">
                            {s.scheduled_at ? formatTime(s.scheduled_at) : 'TBA'}
                          </span>
                          {live ? (
                            <span className="rounded-full bg-red-600/90 px-2 py-0.5 font-garamond text-[0.6rem] tracking-[0.12em] text-white uppercase">
                              Live
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-0.5 block font-garamond text-base text-mist">
                          {cohort?.name ?? s.title}
                        </span>
                        {cohort ? (
                          <span className="mt-0.5 block truncate font-garamond text-sm text-mist/50">
                            {s.title}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {focusedSession && focusedCohort ? (
          <div className="rounded-xl border border-gold/25 bg-charcoal/50 p-5">
            <div className="flex items-start gap-3">
              <span
                className={`mt-1 size-2.5 shrink-0 rounded-full ${colorMap.get(focusedCohort.id) ?? 'bg-gold'}`}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="font-garamond text-xs tracking-[0.16em] text-gold/80 uppercase">
                  Cohort details
                </p>
                <h3 className="mt-1 font-garamond text-xl font-medium text-mist">
                  {focusedCohort.name}
                </h3>
                {focusedCohort.description ? (
                  <p className="mt-2 font-garamond text-sm leading-relaxed text-mist/60">
                    {focusedCohort.description}
                  </p>
                ) : null}
                {focusedSession.scheduled_at ? (
                  <p className="mt-3 font-garamond text-sm text-mist/50">
                    {formatDateTime(focusedSession.scheduled_at)}
                  </p>
                ) : null}
                <p className="mt-1 font-garamond text-sm text-mist/70">{focusedSession.title}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                to={`/cohorts/${focusedCohort.id}`}
                className="flex min-h-9 items-center justify-center rounded-full bg-gold px-5 font-garamond text-xs tracking-[0.14em] text-void uppercase transition hover:bg-gold/90"
              >
                View cohort
              </Link>
              <Link
                to={`/room/${focusedSession.livekit_room_name || cohortRoomName(focusedCohort)}`}
                className={`flex min-h-9 items-center justify-center rounded-full border px-5 font-garamond text-xs tracking-[0.14em] uppercase transition ${
                  isLive(focusedSession)
                    ? 'border-red-400/50 bg-red-600 text-white hover:bg-red-600/90'
                    : 'border-gold/40 text-gold hover:bg-gold/10'
                }`}
              >
                {isLive(focusedSession) ? 'Join live' : 'Join room'}
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
