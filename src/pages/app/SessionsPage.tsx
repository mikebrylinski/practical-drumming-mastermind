import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppCard, AppShell } from '../../components/app/AppShell'
import { CohortSessionsCalendar } from '../../components/cohorts/CohortSessionsCalendar'
import { useAuth } from '../../lib/auth/AuthProvider'
import { supabase } from '../../lib/supabase/client'
import { formatDateTime } from '../../lib/datetime'
import { buildDemoCohorts, buildUpcomingDemoSessions } from '../../lib/demo/cohorts'
import type { Cohort, Session } from '../../lib/supabase/types'

const LIVE_WINDOW_MS = 60 * 60 * 1000

function isUpcoming(session: Session): boolean {
  if (!session.scheduled_at) return false
  return new Date(session.scheduled_at).getTime() >= Date.now() - LIVE_WINDOW_MS
}

export function SessionsPage() {
  const { useSeedData } = useAuth()
  const [sessions, setSessions] = useState<Session[]>(buildUpcomingDemoSessions)
  const [cohorts, setCohorts] = useState<Cohort[]>(buildDemoCohorts)
  const [loading, setLoading] = useState(!useSeedData)

  useEffect(() => {
    if (useSeedData || !supabase) return
    let active = true
    Promise.all([
      supabase.from('sessions').select('*').order('scheduled_at', { ascending: true }),
      supabase.from('cohorts').select('*').order('starts_at', { ascending: true }),
    ]).then(([{ data: s }, { data: c }]) => {
      if (!active) return
      if (s) setSessions(s as Session[])
      if (c) setCohorts(c ?? [])
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [useSeedData])

  const upcoming = useMemo(
    () => sessions.filter(isUpcoming).sort((a, b) => (a.scheduled_at ?? '').localeCompare(b.scheduled_at ?? '')),
    [sessions],
  )

  return (
    <AppShell
      eyebrow="Live"
      title="Sessions"
      subtitle="Weekly cohort calls for the next six weeks."
      wide
    >
      {loading ? (
        <p className="font-garamond text-mist/40">Loading…</p>
      ) : upcoming.length === 0 ? (
        <p className="font-garamond text-mist/50">No scheduled sessions.</p>
      ) : (
        <div className="space-y-8">
          <CohortSessionsCalendar sessions={upcoming} cohorts={cohorts} />

          <section>
            <h2 className="font-garamond text-sm tracking-[0.16em] text-gold/80 uppercase">
              All upcoming
            </h2>
            <div className="mt-3 space-y-3">
              {upcoming.map((s) => (
                <AppCard key={s.id} className="flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-garamond text-lg font-medium text-mist">{s.title}</h3>
                    {s.scheduled_at ? (
                      <p className="mt-1 font-garamond text-sm text-mist/50">
                        {formatDateTime(s.scheduled_at)}
                      </p>
                    ) : null}
                  </div>
                  {s.livekit_room_name ? (
                    <Link
                      to={`/room/${s.livekit_room_name}`}
                      className="rounded-full bg-gold px-5 py-2 font-garamond text-sm tracking-[0.14em] text-void uppercase transition hover:bg-gold/90"
                    >
                      Join room
                    </Link>
                  ) : null}
                </AppCard>
              ))}
            </div>
          </section>
        </div>
      )}
    </AppShell>
  )
}
