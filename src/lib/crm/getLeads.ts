import { supabase } from '../supabase/client'
import type {
  Application,
  Booking,
  LeadEvent,
  Profile,
} from '../supabase/types'
import { computeIntentScore, computeStage } from './scoring'
import type { CRMLead } from './types'

function blankLead(
  key: string,
  partial: Partial<CRMLead> = {},
): CRMLead {
  return {
    userId: key,
    name: 'Anonymous visitor',
    email: '',
    role: 'member',
    isAnonymous: true,
    visitorId: null,
    intentScore: 0,
    stage: 'cold',
    lastActivity: new Date(0).toISOString(),
    events: [],
    ...partial,
  }
}

/**
 * CRM data layer (Chunk 1). Aggregates profiles + lead_events + bookings +
 * applications into derived CRMLead objects. Computes intentScore, stage and
 * lastActivity. Falls back to mock data when Supabase is unconfigured.
 */
export async function getLeads(opts?: { useSeedData?: boolean }): Promise<CRMLead[]> {
  if (!supabase || opts?.useSeedData) return mockLeads()

  const [profilesRes, eventsRes, bookingsRes, applicationsRes] = await Promise.all([
    supabase.from('profiles').select('*'),
    supabase.from('lead_events').select('*').order('created_at', { ascending: true }),
    supabase.from('bookings').select('*'),
    supabase.from('applications').select('*'),
  ])

  const profiles = (profilesRes.data as Profile[]) ?? []
  const events = (eventsRes.data as LeadEvent[]) ?? []
  const bookings = (bookingsRes.data as Booking[]) ?? []
  const applications = (applicationsRes.data as Application[]) ?? []

  const leads = new Map<string, CRMLead>()
  const emailIndex = new Map<string, string>() // email -> lead key

  for (const p of profiles) {
    const key = p.id
    leads.set(key, {
      userId: key,
      name: p.full_name || p.email || 'Member',
      email: p.email || '',
      role: p.role,
      isAnonymous: false,
      visitorId: null,
      intentScore: 0,
      stage: 'cold',
      lastActivity: p.created_at ?? new Date(0).toISOString(),
      events: [],
    })
    if (p.email) emailIndex.set(p.email.toLowerCase(), key)
  }

  function resolveKey(opts: { userId?: string | null; visitorId?: string | null; email?: string | null }) {
    if (opts.userId && leads.has(opts.userId)) return opts.userId
    if (opts.userId) return opts.userId
    if (opts.email) {
      const found = emailIndex.get(opts.email.toLowerCase())
      if (found) return found
    }
    if (opts.visitorId) return `visitor:${opts.visitorId}`
    if (opts.email) return `email:${opts.email.toLowerCase()}`
    return null
  }

  for (const ev of events) {
    const key = resolveKey({ userId: ev.user_id, visitorId: ev.visitor_id })
    if (!key) continue
    if (!leads.has(key)) {
      leads.set(
        key,
        blankLead(key, { visitorId: ev.visitor_id, name: 'Anonymous visitor' }),
      )
    }
    leads.get(key)!.events.push(ev)
  }

  for (const b of bookings) {
    const key = resolveKey({ userId: b.user_id, email: b.email })
    if (!key) continue
    if (!leads.has(key)) {
      leads.set(
        key,
        blankLead(key, { name: b.name || b.email || 'Lead', email: b.email || '' }),
      )
      if (b.email) emailIndex.set(b.email.toLowerCase(), key)
    }
    const lead = leads.get(key)!
    // Prefer an active booking status.
    if (b.status === 'confirmed' || b.status === 'completed' || !lead.bookingStatus) {
      lead.bookingStatus = b.status
    }
    if (b.email && !lead.email) lead.email = b.email
  }

  for (const a of applications) {
    const key = resolveKey({ userId: a.user_id, email: a.email })
    if (!key) continue
    if (!leads.has(key)) {
      leads.set(
        key,
        blankLead(key, { name: a.full_name || a.email || 'Lead', email: a.email || '' }),
      )
      if (a.email) emailIndex.set(a.email.toLowerCase(), key)
    }
    const lead = leads.get(key)!
    lead.applicationStatus = a.status
    lead.note = a.notes ?? lead.note
    if (a.email && !lead.email) lead.email = a.email
    if ((a.full_name && lead.name === 'Anonymous visitor') || (a.full_name && !lead.name)) {
      lead.name = a.full_name
    }
  }

  const result: CRMLead[] = []
  for (const lead of leads.values()) {
    lead.events.sort((x, y) => x.created_at.localeCompare(y.created_at))
    lead.intentScore = computeIntentScore(lead.events)
    const hasBooking =
      lead.bookingStatus === 'confirmed' || lead.bookingStatus === 'completed'
    lead.stage = computeStage(lead.intentScore, {
      hasBooking,
      applicationStatus: lead.applicationStatus ?? null,
    })
    lead.contacted =
      lead.applicationStatus === 'contacted' ||
      lead.events.some((e) => e.type === 'contacted')

    const times = [
      lead.lastActivity,
      ...lead.events.map((e) => e.created_at),
    ].filter(Boolean)
    lead.lastActivity = times.sort().at(-1) ?? lead.lastActivity

    // Skip empty profile rows with zero signal to keep the funnel meaningful,
    // but always keep anyone with any activity, booking, or application.
    const hasSignal =
      lead.events.length > 0 || lead.bookingStatus || lead.applicationStatus
    if (lead.isAnonymous && !hasSignal) continue
    result.push(lead)
  }

  result.sort((a, b) => b.intentScore - a.intentScore)
  return result
}

// ---------------------------------------------------------------------------
// Mock data (demo mode)
// ---------------------------------------------------------------------------

function ev(
  type: LeadEvent['type'],
  minsAgo: number,
  metadata: Record<string, unknown> = {},
): LeadEvent {
  return {
    id: `${type}-${minsAgo}-${Math.random().toString(36).slice(2, 6)}`,
    user_id: null,
    visitor_id: 'mock',
    type,
    path: '/',
    metadata,
    score_delta: 0,
    created_at: new Date(Date.now() - minsAgo * 60000).toISOString(),
  }
}

export function mockLeads(): CRMLead[] {
  const raw: Omit<CRMLead, 'intentScore' | 'stage' | 'lastActivity'>[] = [
    {
      userId: 'lead-1',
      name: 'Jordan Vega',
      email: 'jordan@example.com',
      role: 'member',
      isAnonymous: false,
      events: [
        ev('page_visit', 600, { path: '/' }),
        ev('page_visit', 540, { path: '/club' }),
        ev('booking_click', 520),
        ev('page_visit', 500, { path: '/apply' }),
        ev('form_submit', 480, { type: 'book-a-call' }),
        ev('booking_created', 60),
      ],
      bookingStatus: 'confirmed',
      applicationStatus: 'contacted',
      contacted: true,
      note: 'Very engaged — toured pricing twice.',
    },
    {
      userId: 'lead-2',
      name: 'Sasha Lin',
      email: 'sasha@example.com',
      role: 'member',
      isAnonymous: false,
      events: [
        ev('page_visit', 4000, { path: '/' }),
        ev('page_visit', 3990, { path: '/about' }),
        ev('booking_click', 3980),
        ev('form_submit', 3970, { type: 'contact' }),
      ],
      applicationStatus: 'new',
    },
    {
      userId: 'visitor:abc',
      name: 'Anonymous visitor',
      email: '',
      role: 'member',
      isAnonymous: true,
      visitorId: 'abc',
      events: [
        ev('page_visit', 120, { path: '/' }),
        ev('page_visit', 118, { path: '/club' }),
        ev('booking_click', 115),
      ],
    },
    {
      userId: 'lead-3',
      name: 'Mateo Cruz',
      email: 'mateo@example.com',
      role: 'member',
      isAnonymous: false,
      events: [ev('page_visit', 10080, { path: '/' })],
    },
  ]

  return raw
    .map((r) => {
      const intentScore = computeIntentScore(r.events)
      const hasBooking = r.bookingStatus === 'confirmed' || r.bookingStatus === 'completed'
      const lastActivity =
        r.events.map((e) => e.created_at).sort().at(-1) ?? new Date().toISOString()
      return {
        ...r,
        intentScore,
        stage: computeStage(intentScore, {
          hasBooking,
          applicationStatus: r.applicationStatus ?? null,
        }),
        lastActivity,
      } as CRMLead
    })
    .sort((a, b) => b.intentScore - a.intentScore)
}
