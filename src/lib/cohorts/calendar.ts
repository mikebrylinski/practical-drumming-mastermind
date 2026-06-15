import type { Cohort, Session } from '../supabase/types'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** Distinct dot colors for cohort legend / calendar markers. */
export const COHORT_DOT_CLASSES = [
  'bg-gold',
  'bg-sky-400',
  'bg-emerald-400',
  'bg-fuchsia-400',
  'bg-orange-400',
  'bg-violet-400',
] as const

export function sessionDayKey(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export function calendarDayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export function buildMonthGrid(viewMonth: Date): (Date | null)[] {
  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const startWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (Date | null)[] = []
  for (let i = 0; i < startWeekday; i += 1) cells.push(null)
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(new Date(year, month, d))
  return cells
}

export function groupSessionsByDay(sessions: Session[]): Map<string, Session[]> {
  const map = new Map<string, Session[]>()
  for (const s of sessions) {
    if (!s.scheduled_at) continue
    const key = sessionDayKey(s.scheduled_at)
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(s)
  }
  for (const list of map.values()) {
    list.sort((a, b) => (a.scheduled_at ?? '').localeCompare(b.scheduled_at ?? ''))
  }
  return map
}

export function buildCohortColorMap(cohorts: Cohort[]): Map<string, string> {
  const map = new Map<string, string>()
  cohorts.forEach((c, i) => {
    map.set(c.id, COHORT_DOT_CLASSES[i % COHORT_DOT_CLASSES.length])
  })
  return map
}

export function cohortDotsForDay(
  daySessions: Session[],
  colorMap: Map<string, string>,
): string[] {
  const seen = new Set<string>()
  const dots: string[] = []
  for (const s of daySessions) {
    if (!s.cohort_id || seen.has(s.cohort_id)) continue
    seen.add(s.cohort_id)
    dots.push(colorMap.get(s.cohort_id) ?? 'bg-gold')
  }
  return dots
}

/** First session day from today onward — prefers today if it has sessions. */
export function findFirstSessionFromToday(sessions: Session[]): {
  dayKey: string
  sessionId: string
  viewMonth: Date
} | null {
  const todayKey = calendarDayKey(new Date())
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const scheduled = sessions
    .filter((s) => s.scheduled_at)
    .sort((a, b) => (a.scheduled_at ?? '').localeCompare(b.scheduled_at ?? ''))

  if (scheduled.length === 0) return null

  const todaySessions = scheduled.filter((s) => sessionDayKey(s.scheduled_at!) === todayKey)
  const pick = todaySessions[0] ?? scheduled.find((s) => new Date(s.scheduled_at!).getTime() >= todayStart.getTime())

  if (!pick?.scheduled_at) return null

  const when = new Date(pick.scheduled_at)
  return {
    dayKey: sessionDayKey(pick.scheduled_at),
    sessionId: pick.id,
    viewMonth: new Date(when.getFullYear(), when.getMonth(), 1),
  }
}

export { WEEKDAYS, MONTH_NAMES }
