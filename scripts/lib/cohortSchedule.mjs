/** Shared cohort + weekly session schedule (used by seed script). Times are Central. */
export const MIKE_TIME_ZONE = 'America/Chicago'

/** @typedef {{ name: string, description: string, room: string, weekday: number, hour: number, minute: number, startsDaysAgo: number, titles: string[] }} CohortDef */

/** @type {CohortDef[]} */
export const COHORT_DEFINITIONS = [
  {
    name: 'Spring Mastermind',
    description: 'Twelve-week flagship mentorship cohort with weekly live coaching.',
    room: 'cohort-spring-mastermind',
    weekday: 3, // Wednesday
    hour: 19,
    minute: 0,
    startsDaysAgo: 21,
    titles: [
      'Building Confidence Behind the Kit',
      'Dynamics & Ghost Notes',
      'Linear Phrasing in 4/4',
      'Playing in the Pocket to a Click',
      'Song Breakdown Lab',
      'Fills That Serve the Music',
    ],
  },
  {
    name: 'Foundations Circle',
    description: 'Entry cohort for new members building core technique.',
    room: 'cohort-foundations-circle',
    weekday: 1, // Monday
    hour: 18,
    minute: 0,
    startsDaysAgo: 7,
    titles: [
      'Grip, Stroke & Posture',
      'Single & Double Stroke Rolls',
      'Counting Eighths & Sixteenths',
      'Your First Groove',
      'Reading Basic Notation',
      'Coordination Warm-ups',
    ],
  },
  {
    name: 'Groove & Pocket Lab',
    description: 'Weekly feel-focused workshop on time and subdivision.',
    room: 'cohort-groove-pocket-lab',
    weekday: 4, // Thursday
    hour: 19,
    minute: 0,
    startsDaysAgo: 3,
    titles: [
      'Where the Pocket Lives',
      'Pushing & Pulling Time',
      'Hi-Hat Subdivisions',
      'Half-Time Feels',
      'Shuffle & Swing',
      'Playing Less, Saying More',
    ],
  },
  {
    name: 'Advanced Independence',
    description: 'Four-way coordination, odd meters, and improvisation.',
    room: 'cohort-advanced-independence',
    weekday: 6, // Saturday
    hour: 11,
    minute: 0,
    startsDaysAgo: -7,
    titles: [
      'Four-Way Coordination Systems',
      'Ostinato Soloing',
      'Odd Meters: 5/4 & 7/8',
      'Polyrhythms 3:4 & 4:5',
      'Trading Fours',
      'Open-Ended Improvisation',
    ],
  },
]

function timeZoneOffsetMs(date, timeZone) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const parts = dtf.formatToParts(date).reduce((acc, p) => {
    acc[p.type] = p.value
    return acc
  }, {})
  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  )
  return asUTC - date.getTime()
}

export function zonedWallTimeToUtcISO(year, month, day, hour, minute, timeZone) {
  const guess = Date.UTC(year, month, day, hour, minute, 0, 0)
  const offset = timeZoneOffsetMs(new Date(guess), timeZone)
  return new Date(guess - offset).toISOString()
}

function weekdayInTimeZone(date, timeZone) {
  const wd = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short' }).format(date)
  const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  return map[wd]
}

function datePartsInTimeZone(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date)
  return {
    year: Number(parts.find((p) => p.type === 'year')?.value),
    month: Number(parts.find((p) => p.type === 'month')?.value) - 1,
    day: Number(parts.find((p) => p.type === 'day')?.value),
  }
}

/** Next occurrence of weekday (0=Sun) at hour:minute in timeZone. */
export function nextWeeklyOccurrence(weekday, hour, minute, timeZone, from = new Date()) {
  for (let i = 0; i < 14; i += 1) {
    const probe = new Date(from.getTime() + i * 864e5)
    const { year, month, day } = datePartsInTimeZone(probe, timeZone)
    const wall = new Date(zonedWallTimeToUtcISO(year, month, day, hour, minute, timeZone))
    if (weekdayInTimeZone(wall, timeZone) === weekday && wall.getTime() >= from.getTime() - 60_000) {
      return wall
    }
  }
  throw new Error('Could not find next weekly occurrence')
}

/** @param {number} weeks number of upcoming weekly sessions (e.g. 6) */
export function buildUpcomingWeeklySessions(def, weeks, from = new Date()) {
  const anchor = nextWeeklyOccurrence(def.weekday, def.hour, def.minute, MIKE_TIME_ZONE, from)
  const rows = []
  for (let w = 0; w < weeks; w += 1) {
    const when = new Date(anchor.getTime() + w * 7 * 864e5)
    const title = `${def.name}: ${def.titles[w % def.titles.length]}`
    rows.push({
      title,
      scheduled_at: when.toISOString(),
      livekit_room_name: def.room,
    })
  }
  return rows
}
