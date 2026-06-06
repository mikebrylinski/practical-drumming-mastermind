import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { AppCard, AdminShell } from '../../components/app/AdminShell'
import { useAuth } from '../../lib/auth/AuthProvider'
import { ConfirmDialog, useConfirm } from '../../components/ui/ConfirmDialog'
import { TimePicker } from '../../components/ui/TimePicker'
import {
  MIKE_TIME_ZONE,
  formatInTimeZone,
  timeZoneLabel,
  zonedWallTimeToUtcISO,
} from '../../lib/datetime'
import { supabase } from '../../lib/supabase/client'
import {
  addSlots as addStoredSlots,
  loadSlots as loadStoredSlots,
  removeSlot as removeStoredSlot,
} from '../../lib/booking/slotStore'
import type { AvailabilitySlot } from '../../lib/supabase/types'

const inputClass =
  'rounded-lg border border-white/12 bg-charcoal/40 px-3 py-2 font-garamond text-sm text-mist outline-none focus:border-gold/45'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export function AdminAvailability() {
  const { useSeedData } = useAuth()
  const [slots, setSlots] = useState<AvailabilitySlot[]>(() =>
    useSeedData ? loadStoredSlots() : [],
  )
  const [loading, setLoading] = useState(!useSeedData)
  const [slug, setSlug] = useState('discovery-call')
  const [viewMonth, setViewMonth] = useState<Date>(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  })
  const [startTime, setStartTime] = useState('10:00')
  const [endTime, setEndTime] = useState('16:00')
  const [duration, setDuration] = useState(30)
  const [busy, setBusy] = useState(false)
  const { confirm, dialogProps } = useConfirm()

  const load = useCallback(() => {
    if (useSeedData || !supabase) {
      setSlots(loadStoredSlots())
      setLoading(false)
      return
    }
    setLoading(true)
    supabase
      .from('availability_slots')
      .select('*')
      .order('starts_at', { ascending: true })
      .then(({ data }) => {
        setSlots((data as AvailabilitySlot[]) ?? [])
        setLoading(false)
      })
  }, [useSeedData])

  useEffect(() => {
    load()
  }, [load])

  // Slots for the active event slug, grouped by day.
  const slotsByDay = useMemo(() => {
    const map = new Map<string, AvailabilitySlot[]>()
    for (const s of slots) {
      if (s.slug !== slug) continue
      const key = dayKey(new Date(s.starts_at))
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(s)
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.starts_at.localeCompare(b.starts_at))
    }
    return map
  }, [slots, slug])

  const calendarCells = useMemo(() => {
    const year = viewMonth.getFullYear()
    const month = viewMonth.getMonth()
    const startWeekday = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: (Date | null)[] = []
    for (let i = 0; i < startWeekday; i += 1) cells.push(null)
    for (let d = 1; d <= daysInMonth; d += 1) cells.push(new Date(year, month, d))
    return cells
  }, [viewMonth])

  const selectedKey = selectedDate ? dayKey(selectedDate) : null
  const daySlots = selectedKey ? (slotsByDay.get(selectedKey) ?? []) : []

  function changeMonth(delta: number) {
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1))
  }

  // Build discrete bookable slots across the [start, stop) window. The entered
  // start/stop times are interpreted as Central Time (Mike's zone), not the
  // admin's local zone, so availability is consistent wherever Mike logs in.
  function buildWindowSlots(): { starts_at: string; ends_at: string }[] {
    if (!selectedDate) return []
    const [sh, sm] = startTime.split(':').map(Number)
    const [eh, em] = endTime.split(':').map(Number)
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const day = selectedDate.getDate()
    const stepMin = Math.max(duration, 5)
    const startMin = sh * 60 + sm
    let endMin = eh * 60 + em
    // If stop is at or before start, create a single slot of `duration`.
    if (endMin <= startMin) endMin = startMin + stepMin
    const toIso = (totalMin: number) =>
      zonedWallTimeToUtcISO(
        year,
        month,
        day,
        Math.floor(totalMin / 60),
        totalMin % 60,
        MIKE_TIME_ZONE,
      )
    const out: { starts_at: string; ends_at: string }[] = []
    for (let cur = startMin; cur + stepMin <= endMin + 0.5; cur += stepMin) {
      out.push({ starts_at: toIso(cur), ends_at: toIso(cur + stepMin) })
    }
    return out
  }

  async function addSlot(e: FormEvent) {
    e.preventDefault()
    if (!selectedDate) return
    const windowSlots = buildWindowSlots()
    if (windowSlots.length === 0) return
    setBusy(true)
    try {
      if (supabase && !useSeedData) {
        await supabase
          .from('availability_slots')
          .insert(windowSlots.map((w) => ({ slug, ...w })))
        load()
      } else {
        const now = Date.now()
        setSlots(
          addStoredSlots(
            windowSlots.map((w, i) => ({
              id: `local-${now}-${i}`,
              slug,
              starts_at: w.starts_at,
              ends_at: w.ends_at,
              is_booked: false,
              created_by: null,
              created_at: new Date().toISOString(),
            })),
          ),
        )
      }
    } finally {
      setBusy(false)
    }
  }

  async function removeSlot(id: string) {
    const ok = await confirm({
      title: 'Remove this slot?',
      message: 'This time slot will no longer be bookable.',
      confirmLabel: 'Remove',
      danger: true,
    })
    if (!ok) return
    if (supabase && !useSeedData) {
      await supabase.from('availability_slots').delete().eq('id', id)
      load()
    } else {
      setSlots(removeStoredSlot(id))
    }
  }

  const todayKey = dayKey(new Date())

  return (
    <AdminShell
      eyebrow="Admin"
      title="Availability"
      subtitle="Click a day, then add the times Mike is open for booking."
      wide
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="font-garamond text-xs tracking-[0.12em] text-mist/55 uppercase">
          Event
        </label>
        <input
          className={inputClass}
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="discovery-call"
        />
        <span className="font-garamond text-xs text-mist/40">
          Front-end booking page: <code className="text-gold">/book/{slug}</code>
        </span>
      </div>

      {loading ? (
        <p className="font-garamond text-mist/40">Loading…</p>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          {/* Calendar */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-garamond text-base text-mist">
                {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => changeMonth(-1)}
                  aria-label="Previous month"
                  className="flex size-8 items-center justify-center rounded-full border border-white/12 font-garamond text-mist/60 transition hover:border-gold/40 hover:text-gold"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => changeMonth(1)}
                  aria-label="Next month"
                  className="flex size-8 items-center justify-center rounded-full border border-white/12 font-garamond text-mist/60 transition hover:border-gold/40 hover:text-gold"
                >
                  ›
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {WEEKDAYS.map((w, i) => (
                <div
                  key={i}
                  className="py-1 text-center font-garamond text-[0.7rem] tracking-[0.1em] text-mist/35 uppercase"
                >
                  {w}
                </div>
              ))}
              {calendarCells.map((cell, i) => {
                if (!cell) return <div key={`e${i}`} />
                const key = dayKey(cell)
                const count = slotsByDay.get(key)?.length ?? 0
                const openCount =
                  slotsByDay.get(key)?.filter((s) => !s.is_booked).length ?? 0
                const isSelected = key === selectedKey
                const isToday = key === todayKey
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedDate(cell)}
                    className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border font-garamond text-sm transition ${
                      isSelected
                        ? 'border-gold bg-gold/15 text-gold'
                        : 'border-white/8 bg-charcoal/30 text-mist/70 hover:border-gold/40'
                    }`}
                  >
                    <span className={isToday ? 'font-medium text-gold' : ''}>
                      {cell.getDate()}
                    </span>
                    {count > 0 ? (
                      <span
                        className={`rounded-full px-1.5 text-[0.6rem] tracking-[0.04em] ${
                          openCount > 0
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/15 text-amber-300'
                        }`}
                      >
                        {openCount > 0 ? `${openCount} open` : 'full'}
                      </span>
                    ) : (
                      <span className="size-1 rounded-full bg-transparent" aria-hidden />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Selected-day editor */}
          <AppCard className="h-fit">
            <h3 className="font-garamond text-lg text-mist">
              {selectedDate
                ? selectedDate.toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Select a day'}
            </h3>
            <p className="mt-1 font-garamond text-xs tracking-[0.1em] text-gold/70 uppercase">
              Times are Central Time ({timeZoneLabel(selectedDate ?? new Date(), MIKE_TIME_ZONE)} ·
              Mike&apos;s zone)
            </p>

            <form onSubmit={addSlot} className="mt-4 space-y-3">
              <div className="flex flex-wrap items-end gap-2">
                <label className="font-garamond text-xs text-mist/55">
                  Start
                  <TimePicker value={startTime} onChange={setStartTime} className="mt-1 w-28" />
                </label>
                <span className="pb-2 font-garamond text-mist/40">→</span>
                <label className="font-garamond text-xs text-mist/55">
                  Stop
                  <TimePicker value={endTime} onChange={setEndTime} className="mt-1 w-28" />
                </label>
                <label className="font-garamond text-xs text-mist/55">
                  Per slot (min)
                  <input
                    type="number"
                    min={5}
                    step={5}
                    className={`${inputClass} mt-1 block w-24`}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                  />
                </label>
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="font-garamond text-xs text-mist/40">
                  {selectedDate
                    ? `Creates ${buildWindowSlots().length} bookable slot${
                        buildWindowSlots().length === 1 ? '' : 's'
                      }`
                    : 'Pick a day first'}
                </p>
                <button
                  type="submit"
                  disabled={busy || !selectedDate}
                  className="flex min-h-10 items-center justify-center rounded-full bg-gold px-6 font-garamond text-sm tracking-[0.14em] text-void uppercase transition hover:bg-gold/90 disabled:opacity-50"
                >
                  {busy ? 'Adding…' : 'Add slots'}
                </button>
              </div>
            </form>

            <div className="mt-5 space-y-2">
              {daySlots.length === 0 ? (
                <p className="font-garamond text-sm text-mist/40">
                  No slots on this day yet. Add a time above.
                </p>
              ) : (
                daySlots.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-charcoal/50 px-4 py-2.5"
                  >
                    <span className="font-garamond text-sm text-mist">
                      {formatInTimeZone(s.starts_at, MIKE_TIME_ZONE)}
                    </span>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-garamond text-[0.65rem] tracking-[0.12em] uppercase ${
                          s.is_booked
                            ? 'bg-amber-500/15 text-amber-300'
                            : 'bg-emerald-500/15 text-emerald-300'
                        }`}
                      >
                        {s.is_booked ? 'Booked' : 'Open'}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSlot(s.id)}
                        className="font-garamond text-sm text-mist/50 transition hover:text-red-300"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </AppCard>
        </div>
      )}
      <ConfirmDialog {...dialogProps} />
    </AdminShell>
  )
}
