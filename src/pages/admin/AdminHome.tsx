import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppCard, AdminShell } from '../../components/app/AdminShell'
import { useAuth } from '../../lib/auth/AuthProvider'
import { supabase } from '../../lib/supabase/client'
import { getLeads } from '../../lib/crm/getLeads'
import { HEAT_THEME, STAGE_THEME, heatBand, type Stage } from '../../lib/crm/scoring'
import type { CRMLead } from '../../lib/crm/types'
import type { Application, Booking } from '../../lib/supabase/types'

type Counts = { members: number; emails: number }

const EVENT_LABEL: Record<string, string> = {
  page_visit: 'visited a page',
  booking_click: 'clicked Book a Call',
  form_submit: 'submitted a form',
  booking_created: 'booked a call',
  application_update: 'application updated',
  contacted: 'was marked contacted',
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
    starts_at: new Date(Date.now() + 4 * 864e5).toISOString(),
    created_at: new Date(Date.now() - 9e6).toISOString(),
  },
]

const MOCK_APPS: Application[] = [
  {
    id: 'a1',
    user_id: null,
    email: 'jordan@example.com',
    full_name: 'Jordan Vega',
    type: 'book-a-call',
    answers: {},
    status: 'contacted',
    notes: null,
    created_at: new Date(Date.now() - 6e6).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'a2',
    user_id: null,
    email: 'sasha@example.com',
    full_name: 'Sasha Lin',
    type: 'apply',
    answers: {},
    status: 'new',
    notes: null,
    created_at: new Date(Date.now() - 18e6).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.round(hrs / 24)}d ago`
}

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

const STAGE_ORDER: Stage[] = ['cold', 'warm', 'hot', 'converted']

export function AdminHome() {
  const { useSeedData } = useAuth()
  const [leads, setLeads] = useState<CRMLead[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [counts, setCounts] = useState<Counts>({ members: 0, emails: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      const leadData = await getLeads({ useSeedData })
      if (!active) return
      setLeads(leadData)

      if (supabase && !useSeedData) {
        const [members, emails, recentBookings, recentApps] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('email_logs').select('id', { count: 'exact', head: true }),
          supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('applications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5),
        ])
        if (!active) return
        setCounts({ members: members.count ?? 0, emails: emails.count ?? 0 })
        setBookings((recentBookings.data as Booking[]) ?? [])
        setApplications((recentApps.data as Application[]) ?? [])
      } else {
        setCounts({
          members: leadData.filter((l) => !l.isAnonymous).length || 128,
          emails: 96,
        })
        setBookings(MOCK_BOOKINGS)
        setApplications(MOCK_APPS)
      }
      setLoading(false)
    }
    void load()
    return () => {
      active = false
    }
  }, [useSeedData])

  const metrics = useMemo(() => {
    const stageCounts: Record<Stage, number> = { cold: 0, warm: 0, hot: 0, converted: 0 }
    let eventCount = 0
    for (const l of leads) {
      stageCounts[l.stage] += 1
      eventCount += l.events.length
    }
    const hot = leads.filter((l) => {
      const b = heatBand(l.intentScore)
      return b === 'hot' || b === 'urgent'
    }).length
    const total = leads.length || 1
    const conversion = Math.round((stageCounts.converted / total) * 100)
    const topLeads = [...leads].sort((a, b) => b.intentScore - a.intentScore).slice(0, 5)
    const recentEvents = leads
      .flatMap((l) =>
        l.events.map((e) => ({ lead: l, type: e.type, at: e.created_at })),
      )
      .sort((a, b) => b.at.localeCompare(a.at))
      .slice(0, 8)
    return { stageCounts, hot, conversion, topLeads, recentEvents, eventCount }
  }, [leads])

  const maxStage = Math.max(1, ...STAGE_ORDER.map((s) => metrics.stageCounts[s]))

  return (
    <AdminShell
      eyebrow="Admin"
      title="Command center"
      subtitle="Funnel intelligence at a glance."
      wide
      actions={
        <Link
          to="/admin/leads"
          className="rounded-full bg-gold px-5 py-2.5 font-garamond text-sm tracking-[0.16em] text-void uppercase transition hover:bg-gold/90"
        >
          Open CRM
        </Link>
      }
    >

      {loading ? (
        <p className="font-garamond text-mist/40">Loading dashboard…</p>
      ) : (
        <div className="space-y-6">
          {/* KPI row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi
              label="Tracked leads"
              value={leads.length}
              sub={`${metrics.eventCount} lead events`}
              to="/admin/leads"
            />
            <Kpi
              label="Hot leads"
              value={metrics.hot}
              sub="score 51+"
              accent="text-orange-300"
              to="/admin/leads"
            />
            <Kpi
              label="Bookings"
              value={bookings.length >= 5 ? '5+' : bookings.length}
              sub="recent"
              to="/admin/bookings"
            />
            <Kpi
              label="Conversion"
              value={`${metrics.conversion}%`}
              sub={`${metrics.stageCounts.converted} converted`}
              accent="text-emerald-300"
              to="/admin/leads"
            />
          </div>

          {/* Funnel + top leads */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
            <AppCard>
              <h3 className="font-garamond text-base text-mist/80">Pipeline by stage</h3>
              <div className="mt-4 space-y-3">
                {STAGE_ORDER.map((s) => {
                  const count = metrics.stageCounts[s]
                  const theme = STAGE_THEME[s]
                  return (
                    <div key={s}>
                      <div className="flex items-center justify-between font-garamond text-sm">
                        <span className="capitalize text-mist/70">{theme.label}</span>
                        <span className="text-mist/50">{count}</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/8">
                        <div
                          className={`h-full rounded-full ${
                            s === 'converted'
                              ? 'bg-emerald-400'
                              : s === 'hot'
                                ? 'bg-orange-400'
                                : s === 'warm'
                                  ? 'bg-blue-400'
                                  : 'bg-mist/40'
                          }`}
                          style={{ width: `${(count / maxStage) * 100}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="mt-5 font-garamond text-xs text-mist/40">
                {counts.members} members · {counts.emails} emails logged
              </p>
            </AppCard>

            <AppCard>
              <div className="flex items-center justify-between">
                <h3 className="font-garamond text-base text-mist/80">Top intent leads</h3>
                <Link
                  to="/admin/leads"
                  className="font-garamond text-xs tracking-[0.14em] text-gold/80 uppercase hover:text-gold"
                >
                  View all
                </Link>
              </div>
              <div className="mt-3 space-y-1">
                {metrics.topLeads.length === 0 ? (
                  <p className="font-garamond text-sm text-mist/40">No leads yet.</p>
                ) : (
                  metrics.topLeads.map((l) => {
                    const theme = HEAT_THEME[heatBand(l.intentScore)]
                    return (
                      <Link
                        key={l.userId}
                        to="/admin/leads"
                        className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-white/[0.04]"
                      >
                        <span className={`h-8 w-1 shrink-0 rounded-full ${theme.bar}`} aria-hidden />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-garamond text-sm text-mist">{l.name}</p>
                          <p className="truncate font-garamond text-xs text-mist/40">
                            {l.email || 'anonymous'}
                          </p>
                        </div>
                        <span className={`font-bebas text-xl ${theme.text}`}>{l.intentScore}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.1em] ring-1 ${STAGE_THEME[l.stage].className}`}
                        >
                          {STAGE_THEME[l.stage].label}
                        </span>
                      </Link>
                    )
                  })
                )}
              </div>
            </AppCard>
          </div>

          {/* Activity + bookings + applications */}
          <div className="grid gap-6 lg:grid-cols-3">
            <AppCard>
              <h3 className="font-garamond text-base text-mist/80">Recent activity</h3>
              <ul className="mt-3 space-y-3">
                {metrics.recentEvents.length === 0 ? (
                  <li className="font-garamond text-sm text-mist/40">No activity yet.</li>
                ) : (
                  metrics.recentEvents.map((e, i) => (
                    <li key={i} className="flex items-baseline justify-between gap-3">
                      <span className="min-w-0 font-garamond text-sm text-mist/70">
                        <span className="text-mist">{e.lead.name}</span>{' '}
                        {EVENT_LABEL[e.type] ?? e.type}
                      </span>
                      <span className="shrink-0 font-garamond text-xs text-mist/35">
                        {relativeTime(e.at)}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </AppCard>

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
              <div className="flex items-center justify-between">
                <h3 className="font-garamond text-base text-mist/80">Recent applications</h3>
                <Link
                  to="/admin/applications"
                  className="font-garamond text-xs tracking-[0.14em] text-gold/80 uppercase hover:text-gold"
                >
                  All
                </Link>
              </div>
              <ul className="mt-3 space-y-3">
                {applications.length === 0 ? (
                  <li className="font-garamond text-sm text-mist/40">No applications yet.</li>
                ) : (
                  applications.map((a) => (
                    <li key={a.id} className="flex items-baseline justify-between gap-3">
                      <span className="min-w-0 truncate font-garamond text-sm text-mist/70">
                        {a.full_name || a.email || 'Applicant'}
                      </span>
                      <span className="shrink-0 font-garamond text-xs uppercase tracking-[0.1em] text-mist/40">
                        {a.status}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </AppCard>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
