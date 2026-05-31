import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppCard, AppShell } from '../../components/app/AppShell'
import { supabase } from '../../lib/supabase/client'
import { buildUpcomingDemoSessions } from '../../lib/demo/cohorts'
import type { Session } from '../../lib/supabase/types'

export function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>(buildUpcomingDemoSessions)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase
      .from('sessions')
      .select('*')
      .order('scheduled_at', { ascending: true })
      .then(({ data }) => {
        if (!active) return
        if (data) setSessions(data as Session[])
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <AppShell eyebrow="Live" title="Sessions" subtitle="Upcoming live classroom sessions.">
      {loading ? (
        <p className="font-garamond text-mist/40">Loading…</p>
      ) : sessions.length === 0 ? (
        <p className="font-garamond text-mist/50">No scheduled sessions.</p>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <AppCard key={s.id} className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-garamond text-lg font-medium text-mist">{s.title}</h3>
                {s.scheduled_at ? (
                  <p className="mt-1 font-garamond text-sm text-mist/50">
                    {new Date(s.scheduled_at).toLocaleString()}
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
      )}
    </AppShell>
  )
}
