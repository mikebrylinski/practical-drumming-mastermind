import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppCard, AdminShell } from '../../components/app/AdminShell'
import { useAuth } from '../../lib/auth/AuthProvider'
import { supabase } from '../../lib/supabase/client'
import type { Booking } from '../../lib/supabase/types'

type Counts = { members: number; emails: number }

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
    starts_at: new Date(Date.now() + 4 * 864e5).toISOString(),
    created_at: new Date(Date.now() - 9e6).toISOString(),
  },
]

function Kpi({
  label,
  value,
  sub,
  to,
  accent = 'text-gold',
}: {
  label: string
  value: string | number
  sub?: string
  to: string
  accent?: string
}) {
  return (
    <Link to={to}>
      <AppCard className="h-full transition hover:border-gold/30">
        <p className="font-garamond text-xs tracking-[0.2em] text-mist/45 uppercase">{label}</p>
        <p className={`mt-2 font-bebas text-4xl leading-none ${accent}`}>{value}</p>
        {sub ? <p className="mt-2 font-garamond text-sm text-mist/45">{sub}</p> : null}
      </AppCard>
    </Link>
  )
}

export function AdminHome() {
  const { useSeedData } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [counts, setCounts] = useState<Counts>({ members: 0, emails: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      if (supabase && !useSeedData) {
        const [members, emails, recentBookings] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('email_logs').select('id', { count: 'exact', head: true }),
          supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5),
        ])
        if (!active) return
        setCounts({ members: members.count ?? 0, emails: emails.count ?? 0 })
        setBookings((recentBookings.data as Booking[]) ?? [])
      } else {
        if (!active) return
        setCounts({ members: 128, emails: 96 })
        setBookings(MOCK_BOOKINGS)
      }
      setLoading(false)
    }
    void load()
    return () => {
      active = false
    }
  }, [useSeedData])

  return (
    <AdminShell
      eyebrow="Admin"
      title="Command center"
      subtitle="Your platform at a glance."
      wide
      actions={
        <Link
          to="/admin/contacts"
          className="rounded-full bg-gold px-5 py-2.5 font-garamond text-sm tracking-[0.16em] text-void uppercase transition hover:bg-gold/90"
        >
          Open Contacts
        </Link>
      }
    >
      {loading ? (
        <p className="font-garamond text-mist/40">Loading dashboard…</p>
      ) : (
        <div className="space-y-6">
          {/* KPI row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label="Members" value={counts.members} sub="profiles" to="/admin/members" />
            <Kpi
              label="Bookings"
              value={bookings.length >= 5 ? '5+' : bookings.length}
              sub="recent"
              to="/admin/bookings"
            />
            <Kpi label="Emails logged" value={counts.emails} sub="transactional" to="/admin/bookings" />
            <Kpi label="Calendar" value="View" sub="all cohorts & calls" to="/admin/calendar" />
          </div>

          {/* Recent bookings */}
          <div className="grid gap-6 lg:grid-cols-2">
            <AppCard>
              <div className="flex items-center justify-between">
                <h3 className="font-garamond text-base text-mist/80">Recent bookings</h3>
                <Link
                  to="/admin/bookings"
                  className="font-garamond text-xs tracking-[0.14em] text-gold/80 uppercase hover:text-gold"
                >
                  All
                </Link>
              </div>
              <ul className="mt-3 space-y-3">
                {bookings.length === 0 ? (
                  <li className="font-garamond text-sm text-mist/40">No bookings yet.</li>
                ) : (
                  bookings.map((b) => (
                    <li key={b.id} className="flex items-baseline justify-between gap-3">
                      <span className="min-w-0 truncate font-garamond text-sm text-mist/70">
                        {b.name || b.email || 'Guest'}
                      </span>
                      <span className="shrink-0 font-garamond text-xs text-mist/35">
                        {b.starts_at ? new Date(b.starts_at).toLocaleDateString() : '—'}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </AppCard>

            <AppCard>
              <h3 className="font-garamond text-base text-mist/80">Quick links</h3>
              <div className="mt-3 grid gap-2">
                <Link
                  to="/admin/analytics"
                  className="rounded-lg px-3 py-2 font-garamond text-sm text-mist/70 transition hover:bg-white/[0.04] hover:text-mist"
                >
                  Analytics — traffic & search
                </Link>
                <Link
                  to="/admin/contacts"
                  className="rounded-lg px-3 py-2 font-garamond text-sm text-mist/70 transition hover:bg-white/[0.04] hover:text-mist"
                >
                  Contacts — leads & students
                </Link>
                <Link
                  to="/admin/calendar"
                  className="rounded-lg px-3 py-2 font-garamond text-sm text-mist/70 transition hover:bg-white/[0.04] hover:text-mist"
                >
                  Master calendar
                </Link>
                <Link
                  to="/admin/cohorts"
                  className="rounded-lg px-3 py-2 font-garamond text-sm text-mist/70 transition hover:bg-white/[0.04] hover:text-mist"
                >
                  Cohorts & sessions
                </Link>
                <Link
                  to="/admin/members"
                  className="rounded-lg px-3 py-2 font-garamond text-sm text-mist/70 transition hover:bg-white/[0.04] hover:text-mist"
                >
                  Members
                </Link>
              </div>
            </AppCard>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
