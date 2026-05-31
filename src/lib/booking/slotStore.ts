import type { AvailabilitySlot } from '../supabase/types'

// Shared availability store for mock mode (no Supabase). Persists to
// localStorage so the admin availability page and the public booking page
// read/write the same slots. When Supabase is configured, the DB is the
// source of truth and this store is unused.

const KEY = 'pdm-availability-slots'

export const DEFAULT_SLUG = 'discovery-call'

/** Seed a realistic set of weekday slots (~2 weeks, several times/day). */
export function defaultMockSlots(slug: string = DEFAULT_SLUG): AvailabilitySlot[] {
  const out: AvailabilitySlot[] = []
  const base = new Date()
  base.setHours(0, 0, 0, 0)
  for (let d = 1; d <= 12; d += 1) {
    const day = new Date(base)
    day.setDate(base.getDate() + d)
    const weekday = day.getDay()
    if (weekday === 0 || weekday === 6) continue
    for (const h of [10, 11, 13, 14, 15, 16]) {
      const start = new Date(day)
      start.setHours(h, 0, 0, 0)
      out.push({
        id: `seed-${d}-${h}`,
        slug,
        starts_at: start.toISOString(),
        ends_at: new Date(start.getTime() + 30 * 60000).toISOString(),
        is_booked: false,
        created_by: null,
        created_at: new Date().toISOString(),
      })
    }
  }
  return out
}

export function loadSlots(): AvailabilitySlot[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as AvailabilitySlot[]
  } catch {
    /* ignore parse/storage errors */
  }
  const seeded = defaultMockSlots()
  saveSlots(seeded)
  return seeded
}

export function saveSlots(slots: AvailabilitySlot[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(slots))
  } catch {
    /* ignore storage errors */
  }
}

export function addSlot(slot: AvailabilitySlot): AvailabilitySlot[] {
  return addSlots([slot])
}

export function addSlots(newSlots: AvailabilitySlot[]): AvailabilitySlot[] {
  const next = [...loadSlots(), ...newSlots].sort((a, b) =>
    a.starts_at.localeCompare(b.starts_at),
  )
  saveSlots(next)
  return next
}

export function removeSlot(id: string): AvailabilitySlot[] {
  const next = loadSlots().filter((s) => s.id !== id)
  saveSlots(next)
  return next
}

export function markSlotBooked(id: string): AvailabilitySlot[] {
  const next = loadSlots().map((s) => (s.id === id ? { ...s, is_booked: true } : s))
  saveSlots(next)
  return next
}
