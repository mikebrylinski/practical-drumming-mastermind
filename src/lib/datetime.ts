/**
 * Date/time helpers. The browser already renders `toLocale*` output in the
 * viewer's local timezone (auto-detected); these helpers make that explicit by
 * appending a short timezone label (e.g. "EDT") so users always know which zone
 * a time is shown in.
 */

type DateInput = string | number | Date

function toDate(value: DateInput): Date {
  return value instanceof Date ? value : new Date(value)
}

/** Mike's home timezone. Availability times are authored in this zone. */
export const MIKE_TIME_ZONE = 'America/Chicago'

/** The viewer's IANA timezone, e.g. "America/New_York". */
export function getUserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return 'UTC'
  }
}

/** Short timezone label, e.g. "EDT", "PST", "CST". Defaults to the viewer's zone. */
export function timeZoneLabel(date: DateInput = new Date(), timeZone?: string): string {
  try {
    const parts = new Intl.DateTimeFormat(undefined, {
      timeZone,
      timeZoneName: 'short',
    }).formatToParts(toDate(date))
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? ''
  } catch {
    return ''
  }
}

/** Milliseconds that `timeZone` is ahead of UTC at the given instant. */
function timeZoneOffsetMs(date: Date, timeZone: string): number {
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
  const parts = dtf.formatToParts(date).reduce<Record<string, string>>((acc, p) => {
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

/**
 * Converts a wall-clock time in a specific timezone to a UTC ISO string.
 * e.g. zonedWallTimeToUtcISO(2026, 5, 6, 10, 0, 'America/Chicago') → the UTC
 * instant for 10:00 AM Central on that day. Used so Mike's availability is
 * authored in Central Time regardless of the admin's browser timezone.
 */
export function zonedWallTimeToUtcISO(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): string {
  const guess = Date.UTC(year, month, day, hour, minute, 0, 0)
  const offset = timeZoneOffsetMs(new Date(guess), timeZone)
  return new Date(guess - offset).toISOString()
}

/** Time/date formatted in a specific timezone, with a short zone label. */
export function formatInTimeZone(
  value: DateInput,
  timeZone: string,
  options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' },
): string {
  return toDate(value).toLocaleString(undefined, { ...options, timeZone, timeZoneName: 'short' })
}

const DEFAULT_DATETIME: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
}

/** Date + time including a short timezone label. */
export function formatDateTime(
  value: DateInput,
  options: Intl.DateTimeFormatOptions = DEFAULT_DATETIME,
): string {
  return toDate(value).toLocaleString(undefined, { ...options, timeZoneName: 'short' })
}

/** Time only, including a short timezone label. */
export function formatTime(
  value: DateInput,
  options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' },
): string {
  return toDate(value).toLocaleTimeString(undefined, { ...options, timeZoneName: 'short' })
}

/** Date only (no timezone label, since there is no time component). */
export function formatDate(
  value: DateInput,
  options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' },
): string {
  return toDate(value).toLocaleDateString(undefined, options)
}
