/** Mock Calendly-style availability for the booking step. */

export const MOCK_TIME_SLOTS = [
  '10:00am',
  '10:30am',
  '11:00am',
  '11:30am',
  '1:00pm',
  '1:30pm',
  '2:00pm',
  '2:30pm',
  '3:00pm',
] as const

const MOCK_AVAILABLE_DAYS = new Set([3, 5, 8, 12, 15, 19, 22, 26, 28])

export function getMockMonthAnchor(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function formatMonthYear(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function isMockAvailableDay(year: number, month: number, day: number) {
  const d = new Date(year, month, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (d < today) return false
  if (d.getDay() === 0 || d.getDay() === 6) return false
  return MOCK_AVAILABLE_DAYS.has(day)
}

export function buildCalendarGrid(viewMonth: Date) {
  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: Array<{ day: number | null; available: boolean }> = []
  for (let i = 0; i < firstWeekday; i++) {
    cells.push({ day: null, available: false })
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      day,
      available: isMockAvailableDay(year, month, day),
    })
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: null, available: false })
  }
  return cells
}

export const WEEKDAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const
