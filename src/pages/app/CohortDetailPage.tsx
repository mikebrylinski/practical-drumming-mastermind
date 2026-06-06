import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AppCard, AppShell } from '../../components/app/AppShell'
import { useAuth } from '../../lib/auth/AuthProvider'
import { supabase } from '../../lib/supabase/client'
import { cohortRoomName } from '../../lib/slug'
import { formatDateTime } from '../../lib/datetime'
import {
  buildDemoRoster,
  demoSessionsForCohort,
  findDemoCohort,
  type RosterMember,
} from '../../lib/demo/cohorts'
import type { Cohort, Session } from '../../lib/supabase/types'

const LIVE_WINDOW_MS = 60 * 60 * 1000
const RSVP_KEY = 'pdm-rsvp'

function isLive(session: Session): boolean {
  if (!session.scheduled_at) return false
  const diff = new Date(session.scheduled_at).getTime() - Date.now()
  return diff <= LIVE_WINDOW_MS && diff >= -LIVE_WINDOW_MS
}

function loadRsvps(): Set<string> {
  try {
    const raw = localStorage.getItem(RSVP_KEY)
    return new Set<string>(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set<string>()
  }
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const levelTheme: Record<RosterMember['level'], string> = {
  Beginner: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  Intermediate: 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
  Advanced: 'bg-gold/15 text-gold ring-gold/30',
}

function formatWhen(iso: string | null): string {
  if (!iso) return 'TBA'
  return formatDateTime(iso, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function CohortDetailPage() {
  const { cohortId = '' } = useParams()
  const { useSeedData } = useAuth()
  const [cohort, setCohort] = useState<Cohort | undefined>(() =>
    useSeedData ? findDemoCohort(cohortId) : undefined,
  )
  const [sessions, setSessions] = useState<Session[]>(() =>
    useSeedData ? demoSessionsForCohort(cohortId) : [],
  )
  const [roster, setRoster] = useState<RosterMember[]>(() =>
    useSeedData ? buildDemoRoster(cohortId) : [],
  )
  const [loading, setLoading] = useState(!useSeedData)
  const [rsvps, setRsvps] = useState<Set<string>>(loadRsvps)

  useEffect(() => {
    if (useSeedData || !supabase) return
    const sb = supabase
    let active = true
    async function load() {
      const [{ data: c }, { data: s }, { data: m }] = await Promise.all([
        sb.from('cohorts').select('*').eq('id', cohortId).maybeSingle(),
        sb.from('sessions').select('*').eq('cohort_id', cohortId).order('scheduled_at', { ascending: true }),
        sb.from('cohort_members').select('id, joined_at, profiles(full_name, email)').eq('cohort_id', cohortId),
      ])
      if (!active) return
      if (c) setCohort(c as Cohort)
      if (s) setSessions(s as Session[])
      if (m) {
        type ProfileRef = { full_name: string | null; email: string | null }
        type MemberRow = {
          id: string
          joined_at: string
          profiles: ProfileRef | ProfileRef[] | null
        }
        setRoster(
          (m as unknown as MemberRow[]).map((row, i) => {
            const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles
            return {
              id: row.id,
              name: profile?.full_name || profile?.email || `Member ${i + 1}`,
              level: 'Intermediate' as const,
              joinedAt: row.joined_at,
            }
          }),
        )
      }
      setLoading(false)
    }
    void load()
    return () => {
      active = false
    }
  }, [cohortId, useSeedData])

  const toggleRsvp = useCallback((sessionId: string) => {
    setRsvps((prev) => {
      const next = new Set(prev)
      if (next.has(sessionId)) next.delete(sessionId)
      else next.add(sessionId)
      try {
        localStorage.setItem(RSVP_KEY, JSON.stringify([...next]))
      } catch {
        /* ignore storage failures */
      }
      return next
    })
  }, [])

  const { upcoming, past } = useMemo(() => {
    const now = Date.now() - LIVE_WINDOW_MS
    const sorted = [...sessions].sort((a, b) =>
      (a.scheduled_at ?? '').localeCompare(b.scheduled_at ?? ''),
    )
    return {
      upcoming: sorted.filter((s) => s.scheduled_at && new Date(s.scheduled_at).getTime() >= now),
      past: sorted
        .filter((s) => s.scheduled_at && new Date(s.scheduled_at).getTime() < now)
        .reverse(),
    }
  }, [sessions])

  const liveSession = useMemo(() => upcoming.find(isLive) ?? null, [upcoming])
  const room = cohort ? cohortRoomName(cohort) : ''

  if (loading) {
    return (
      <AppShell eyebrow="Cohort" title="Loading…" wide>
        <p className="font-garamond text-mist/40">Loading…</p>
      </AppShell>
    )
  }

  if (!cohort) {
    return (
      <AppShell eyebrow="Cohort" title="Not found" wide>
        <p className="font-garamond text-mist/50">
          This cohort doesn’t exist.{' '}
          <Link to="/cohorts" className="text-gold underline-offset-2 hover:underline">
            Back to cohorts
          </Link>
        </p>
      </AppShell>
    )
  }

  return (
    <AppShell
      eyebrow="Cohort"
      title={cohort.name}
      subtitle={cohort.description ?? undefined}
      wide
      actions={
        <Link
          to={`/room/${room}`}
          className={`flex min-h-10 items-center justify-center gap-2 rounded-full px-5 font-garamond text-sm tracking-[0.14em] uppercase transition ${
            liveSession
              ? 'bg-red-600 text-white hover:bg-red-600/90'
              : 'bg-gold text-void hover:bg-gold/90'
          }`}
        >
          {liveSession ? (
            <>
              <span className="size-2 animate-pulse rounded-full bg-white" aria-hidden />
              Join live now
            </>
          ) : (
            'Enter live room'
          )}
        </Link>
      }
    >
      <Link
        to="/cohorts"
        className="inline-flex items-center gap-1 font-garamond text-xs tracking-[0.14em] text-mist/45 uppercase transition hover:text-gold"
      >
        ← All cohorts
      </Link>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <section>
            <h2 className="font-garamond text-sm tracking-[0.16em] text-gold/80 uppercase">
              Upcoming sessions
            </h2>
            {upcoming.length === 0 ? (
              <p className="mt-3 font-garamond text-mist/45">No upcoming sessions scheduled.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {upcoming.map((s) => {
                  const live = isLive(s)
                  const going = rsvps.has(s.id)
                  return (
                    <AppCard key={s.id} className="flex flex-wrap items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-garamond text-xs tracking-[0.12em] text-mist/45 uppercase">
                            {formatWhen(s.scheduled_at)}
                          </p>
                          {live ? (
                            <span className="flex items-center gap-1 rounded-full bg-red-600/90 px-2 py-0.5 font-garamond text-[0.6rem] tracking-[0.14em] text-white uppercase">
                              <span className="size-1.5 animate-pulse rounded-full bg-white" aria-hidden />
                              Live
                            </span>
                          ) : null}
                        </div>
                        <h3 className="mt-1 truncate font-garamond text-lg font-medium text-mist">
                          {s.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleRsvp(s.id)}
                          aria-pressed={going}
                          className={`min-h-9 rounded-full px-4 font-garamond text-xs tracking-[0.12em] uppercase transition ${
                            going
                              ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40'
                              : 'border border-white/15 text-mist/55 hover:border-gold/40 hover:text-gold'
                          }`}
                        >
                          {going ? '✓ Going' : 'RSVP'}
                        </button>
                        {s.livekit_room_name ? (
                          <Link
                            to={`/room/${s.livekit_room_name}`}
                            className={`min-h-9 rounded-full px-4 font-garamond text-xs tracking-[0.12em] uppercase leading-9 transition ${
                              live
                                ? 'bg-red-600 text-white hover:bg-red-600/90'
                                : 'border border-gold/40 text-gold hover:bg-gold/10'
                            }`}
                          >
                            {live ? 'Join' : 'Room'}
                          </Link>
                        ) : null}
                      </div>
                    </AppCard>
                  )
                })}
              </div>
            )}
          </section>

          {past.length > 0 ? (
            <section>
              <h2 className="font-garamond text-sm tracking-[0.16em] text-mist/40 uppercase">
                Past sessions
              </h2>
              <div className="mt-3 space-y-2">
                {past.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-4 rounded-lg border border-white/[0.06] bg-charcoal/30 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="font-garamond text-xs text-mist/35">{formatWhen(s.scheduled_at)}</p>
                      <h3 className="truncate font-garamond text-sm text-mist/70">{s.title}</h3>
                    </div>
                    <span className="shrink-0 font-garamond text-[0.65rem] tracking-[0.14em] text-mist/30 uppercase">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside>
          <AppCard>
            <div className="flex items-center justify-between">
              <h2 className="font-garamond text-sm tracking-[0.16em] text-gold/80 uppercase">
                Roster
              </h2>
              <span className="font-garamond text-xs text-mist/40">{roster.length} members</span>
            </div>
            {roster.length === 0 ? (
              <p className="mt-3 font-garamond text-sm text-mist/45">No members yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {roster.map((m) => (
                  <li key={m.id} className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold/15 font-garamond text-xs font-medium text-gold">
                      {initials(m.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-garamond text-sm text-mist">{m.name}</p>
                      <p className="font-garamond text-[0.7rem] text-mist/35">
                        Joined {new Date(m.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 font-garamond text-[0.6rem] tracking-[0.1em] uppercase ring-1 ${levelTheme[m.level]}`}
                    >
                      {m.level}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </AppCard>
        </aside>
      </div>
    </AppShell>
  )
}
