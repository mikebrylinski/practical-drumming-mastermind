import type { Cohort, Session } from '../supabase/types'

// Shared demo dataset used when Supabase is not configured (mock mode), so the
// member + admin views are populated with realistic recurring weekly cohorts.

const WEEK_MS = 7 * 864e5
const MIN_MS = 60_000
const LIVE_WINDOW_MS = 60 * 60 * 1000

type CohortSeed = {
  id: string
  name: string
  description: string
  room: string
  startsInDays: number
  /** Minutes-from-now of the next (most imminent upcoming) weekly session. */
  nextSessionInMin: number
  /** Past + upcoming weekly sessions to generate around the next one. */
  pastSessions: number
  upcomingSessions: number
  titles: string[]
}

const SEEDS: CohortSeed[] = [
  {
    id: 'demo-spring',
    name: 'Spring Mastermind',
    description:
      'Twelve-week flagship mentorship cohort with Mike — weekly live coaching, song breakdowns, and accountability.',
    room: 'cohort-spring-mastermind',
    startsInDays: -56,
    nextSessionInMin: 12, // within the live window → shows "Live now"
    pastSessions: 8,
    upcomingSessions: 8,
    titles: [
      'Building Confidence Behind the Kit',
      'Dynamics & Ghost Notes',
      'Linear Phrasing in 4/4',
      'Playing in the Pocket to a Click',
      'Song Breakdown Lab',
      'Fills That Serve the Music',
      'Touring Mindset & Stage Craft',
      'Recording-Ready Drum Takes',
      'Building Your Practice Routine',
      'Member Video Critique Night',
    ],
  },
  {
    id: 'demo-foundations',
    name: 'Foundations Circle',
    description: 'Entry cohort for new members building core technique, timing, and reading.',
    room: 'cohort-foundations-circle',
    startsInDays: -28,
    nextSessionInMin: 2 * 24 * 60, // ~2 days out
    pastSessions: 4,
    upcomingSessions: 8,
    titles: [
      'Grip, Stroke & Posture',
      'Single & Double Stroke Rolls',
      'Counting Eighths & Sixteenths',
      'Your First Groove',
      'Reading Basic Notation',
      'Coordination Warm-ups',
      'Paradiddles in Practice',
      'Building Speed Cleanly',
      'Foot Technique Fundamentals',
      'Putting It All Together',
    ],
  },
  {
    id: 'demo-groove',
    name: 'Groove & Pocket Lab',
    description: 'Weekly feel-focused workshop on time, subdivision, and making any groove breathe.',
    room: 'cohort-groove-pocket-lab',
    startsInDays: -35,
    nextSessionInMin: 4 * 24 * 60, // ~4 days out
    pastSessions: 5,
    upcomingSessions: 8,
    titles: [
      'Where the Pocket Lives',
      'Pushing & Pulling Time',
      'Hi-Hat Subdivisions',
      'Half-Time Feels',
      'Shuffle & Swing',
      'Playing Less, Saying More',
      'Funk & Sixteenth-Note Grooves',
      'Backbeat Placement',
      'Grooving with a Bass Player',
      'Feel Across Genres',
    ],
  },
  {
    id: 'demo-advanced',
    name: 'Advanced Independence',
    description: 'For experienced players — four-way coordination, odd meters, and improvisation.',
    room: 'cohort-advanced-independence',
    startsInDays: 7,
    nextSessionInMin: 6 * 24 * 60, // ~6 days out
    pastSessions: 0,
    upcomingSessions: 8,
    titles: [
      'Four-Way Coordination Systems',
      'Ostinato Soloing',
      'Odd Meters: 5/4 & 7/8',
      'Polyrhythms 3:4 & 4:5',
      'Trading Fours',
      'Open-Ended Improvisation',
      'Metric Modulation',
      'Linear Drumming Concepts',
      'Brushes & Texture',
      'Composing Drum Parts',
    ],
  },
]

export function buildDemoCohorts(): Cohort[] {
  const createdAt = new Date().toISOString()
  return SEEDS.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    starts_at: new Date(Date.now() + s.startsInDays * 864e5).toISOString(),
    livekit_room_name: s.room,
    created_at: createdAt,
  }))
}

export function buildDemoSessions(): Session[] {
  const createdAt = new Date().toISOString()
  const sessions: Session[] = []
  for (const s of SEEDS) {
    const base = Date.now() + s.nextSessionInMin * MIN_MS
    for (let i = -s.pastSessions; i < s.upcomingSessions; i += 1) {
      const when = base + i * WEEK_MS
      const titleIdx = ((i % s.titles.length) + s.titles.length) % s.titles.length
      sessions.push({
        id: `${s.id}-s${i + s.pastSessions}`,
        cohort_id: s.id,
        title: `${s.name}: ${s.titles[titleIdx]}`,
        scheduled_at: new Date(when).toISOString(),
        livekit_room_name: s.room,
        created_at: createdAt,
      })
    }
  }
  return sessions.sort((a, b) =>
    (a.scheduled_at ?? '').localeCompare(b.scheduled_at ?? ''),
  )
}

/** Upcoming-only sessions (within the live window or in the future), soonest first. */
export function buildUpcomingDemoSessions(): Session[] {
  const cutoff = Date.now() - LIVE_WINDOW_MS
  return buildDemoSessions().filter(
    (s) => s.scheduled_at && new Date(s.scheduled_at).getTime() >= cutoff,
  )
}

export function findDemoCohort(id: string): Cohort | undefined {
  return buildDemoCohorts().find((c) => c.id === id)
}

export function demoSessionsForCohort(cohortId: string): Session[] {
  return buildDemoSessions().filter((s) => s.cohort_id === cohortId)
}

export type RosterMember = {
  id: string
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  joinedAt: string
}

const NAME_POOL = [
  'Ava Thompson', 'Liam Carter', 'Noah Bennett', 'Maya Russell', 'Ethan Brooks',
  'Sofia Reyes', 'Lucas Hayes', 'Isla Morgan', 'Mason Cole', 'Chloe Adams',
  'Oliver Grant', 'Harper Quinn', 'Elias Ward', 'Nora Patel', 'Felix Dunn',
  'Ruby Sanders', 'Theo Marsh', 'Lena Fischer', 'Caleb Stone', 'Mia Donovan',
  'Jonah Pierce', 'Talia Burke', 'Owen Fletcher', 'Priya Nair',
]

const LEVELS: RosterMember['level'][] = ['Beginner', 'Intermediate', 'Advanced']

function hashString(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Deterministic mock roster for a cohort (stable across reloads). */
export function buildDemoRoster(cohortId: string): RosterMember[] {
  const seed = hashString(cohortId)
  const count = 6 + (seed % 7) // 6–12 members
  const members: RosterMember[] = []
  for (let i = 0; i < count; i += 1) {
    const name = NAME_POOL[(seed + i * 7) % NAME_POOL.length]
    members.push({
      id: `${cohortId}-m${i}`,
      name,
      level: LEVELS[(seed + i) % LEVELS.length],
      joinedAt: new Date(Date.now() - ((seed + i * 13) % 120) * 864e5).toISOString(),
    })
  }
  return members.filter((m, i, arr) => arr.findIndex((x) => x.name === m.name) === i)
}
