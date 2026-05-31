import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../../components/app/AppShell'
import { supabase } from '../../lib/supabase/client'
import { cohortRoomName } from '../../lib/slug'
import { buildDemoCohorts, buildDemoSessions } from '../../lib/demo/cohorts'
import type { Cohort, Session } from '../../lib/supabase/types'

const LIVE_WINDOW_MS = 60 * 60 * 1000 // a session is "live" within an hour of start

function nextSessionFor(cohortId: string, sessions: Session[]): Session | null {
  const now = Date.now()
  const upcoming = sessions
    .filter((s) => s.cohort_id === cohortId && s.scheduled_at)
    .filter((s) => new Date(s.scheduled_at as string).getTime() > now - LIVE_WINDOW_MS)
    .sort((a, b) =>
      (a.scheduled_at as string).localeCompare(b.scheduled_at as string),
    )
  return upcoming[0] ?? null
}

function isLive(session: Session | null): boolean {
  if (!session?.scheduled_at) return false
  const diff = new Date(session.scheduled_at).getTime() - Date.now()
  return diff <= LIVE_WINDOW_MS && diff >= -LIVE_WINDOW_MS
}

function CohortCard({ cohort, sessions }: { cohort: Cohort; sessions: Session[] }) {
  const next = nextSessionFor(cohort.id, sessions)
  const live = isLive(next)
  const room = next?.livekit_room_name || cohortRoomName(cohort)

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-charcoal/60 transition hover:border-gold/30">
      <div className="relative h-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
          style={{ backgroundImage: "url('/hero-mike-live.png')" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" aria-hidden />
        {live ? (
          <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-red-600/90 px-2.5 py-1 font-garamond text-[0.65rem] tracking-[0.16em] text-white uppercase">
            <span className="size-1.5 animate-pulse rounded-full bg-white" aria-hidden />
            Live now
          </span>
        ) : null}
      </div>

      <div className="p-5">
        <Link
          to={`/cohorts/${cohort.id}`}
          className="font-garamond text-lg font-medium text-mist transition hover:text-gold"
        >
          {cohort.name}
        </Link>
        {cohort.description ? (
          <p className="mt-1.5 line-clamp-2 font-garamond text-sm leading-relaxed text-mist/55">
            {cohort.description}
          </p>
        ) : null}

        <dl className="mt-4 space-y-1.5 font-garamond text-sm">
          {cohort.starts_at ? (
            <div className="flex justify-between gap-3">
              <dt className="text-mist/40">Starts</dt>
              <dd className="text-mist/70">{new Date(cohort.starts_at).toLocaleDateString()}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-3">
            <dt className="text-mist/40">Next session</dt>
            <dd className="truncate text-mist/70">
              {next?.scheduled_at
                ? new Date(next.scheduled_at).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })
                : 'TBA'}
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex items-center gap-2">
          <Link
            to={`/room/${room}`}
            className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full font-garamond text-sm tracking-[0.14em] uppercase transition ${
              live
                ? 'bg-red-600 text-white hover:bg-red-600/90'
                : 'bg-gold text-void hover:bg-gold/90'
            }`}
          >
            {live ? 'Join live now' : 'Enter live room'}
          </Link>
          <Link
            to={`/cohorts/${cohort.id}`}
            className="flex min-h-10 items-center justify-center rounded-full border border-white/15 px-4 font-garamond text-sm tracking-[0.14em] text-mist/60 uppercase transition hover:border-gold/40 hover:text-gold"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export function CohortsPage() {
  const [cohorts, setCohorts] = useState<Cohort[]>(buildDemoCohorts)
  const [sessions, setSessions] = useState<Session[]>(buildDemoSessions)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) return
    let active = true
    async function load() {
      const [{ data: c }, { data: s }] = await Promise.all([
        supabase!.from('cohorts').select('*').order('starts_at', { ascending: true }),
        supabase!.from('sessions').select('*').order('scheduled_at', { ascending: true }),
      ])
      if (!active) return
      if (c) setCohorts(c as Cohort[])
      if (s) setSessions(s as Session[])
      setLoading(false)
    }
    void load()
    return () => {
      active = false
    }
  }, [])

  const liveCount = useMemo(
    () => cohorts.filter((c) => isLive(nextSessionFor(c.id, sessions))).length,
    [cohorts, sessions],
  )

  return (
    <AppShell
      eyebrow="Community"
      title="Cohorts"
      subtitle="Your live mentorship groups."
      actions={
        liveCount > 0 ? (
          <span className="flex items-center gap-2 rounded-full bg-red-600/15 px-3 py-1.5 font-garamond text-xs tracking-[0.14em] text-red-300 uppercase ring-1 ring-red-500/30">
            <span className="size-2 animate-pulse rounded-full bg-red-400" aria-hidden />
            {liveCount} live
          </span>
        ) : null
      }
    >
      {loading ? (
        <p className="font-garamond text-mist/40">Loading…</p>
      ) : cohorts.length === 0 ? (
        <p className="font-garamond text-mist/50">No cohorts yet.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cohorts.map((c) => (
            <CohortCard key={c.id} cohort={c} sessions={sessions} />
          ))}
        </div>
      )}
    </AppShell>
  )
}
