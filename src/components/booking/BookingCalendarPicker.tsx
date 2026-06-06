import { useEffect, useMemo, useState } from 'react'
import { dayKey, useAvailabilitySlots } from '../../lib/booking/useAvailabilitySlots'
import { timeZoneLabel } from '../../lib/datetime'
import type { AvailabilitySlot } from '../../lib/supabase/types'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

type BookingCalendarPickerProps = {
  slug: string
  onSelectSlot: (slot: AvailabilitySlot) => void
}

export function BookingCalendarPicker({ slug, onSelectSlot }: BookingCalendarPickerProps) {
  const { slots, slotsByDay, loading } = useAvailabilitySlots(slug)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [viewMonth, setViewMonth] = useState<Date>(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })

  useEffect(() => {
    if (selectedDay || slots.length === 0) return
    const first = new Date(slots[0].starts_at)
    setSelectedDay(dayKey(first))
    setViewMonth(new Date(first.getFullYear(), first.getMonth(), 1))
  }, [slots, selectedDay])

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

  const daySlots = selectedDay ? (slotsByDay.get(selectedDay) ?? []) : []

  function changeMonth(delta: number) {
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1))
  }

  if (loading) {
    return <p className="font-garamond text-mist/40">Loading availability…</p>
  }

  if (slots.length === 0) {
    return (
      <p className="font-garamond text-base text-mist/50">
        No open times right now. Please check back soon.
      </p>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_11rem] lg:grid-cols-[minmax(0,1fr)_12.5rem]">
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

        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((w, i) => (
            <div
              key={i}
              className="py-1 font-garamond text-[0.7rem] tracking-[0.1em] text-mist/35 uppercase"
            >
              {w}
            </div>
          ))}
          {calendarCells.map((cell, i) => {
            if (!cell) return <div key={`e${i}`} />
            const key = dayKey(cell)
            const hasSlots = slotsByDay.has(key)
            const isSelected = key === selectedDay
            const isToday = key === dayKey(new Date())
            return (
              <button
                key={key}
                type="button"
                disabled={!hasSlots}
                onClick={() => setSelectedDay(key)}
                className={`relative mx-auto flex size-10 items-center justify-center rounded-full font-garamond text-sm transition ${
                  isSelected
                    ? 'bg-gold text-void'
                    : hasSlots
                      ? 'bg-gold/10 text-gold hover:bg-gold/20'
                      : 'text-mist/25'
                } ${!hasSlots ? 'cursor-default' : ''}`}
              >
                {cell.getDate()}
                {isToday && !isSelected ? (
                  <span className="absolute bottom-1 size-1 rounded-full bg-gold" aria-hidden />
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      <div className="border-t border-white/10 pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-6">
        <h3 className="mb-1 font-garamond text-sm tracking-[0.14em] text-mist/60 uppercase">
          {selectedDay
            ? new Date(daySlots[0]?.starts_at ?? Date.now()).toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })
            : 'Select a day'}
        </h3>
        {selectedDay && daySlots.length > 0 && timeZoneLabel() ? (
          <p className="mb-3 font-garamond text-xs tracking-[0.08em] text-gold/70">
            Shown in your local time zone ({timeZoneLabel()})
          </p>
        ) : (
          <div className="mb-3" />
        )}
        <div className="flex max-h-[22rem] flex-col gap-2 overflow-y-auto pr-1">
          {daySlots.length === 0 ? (
            <p className="font-garamond text-sm text-mist/40">No times on this day.</p>
          ) : (
            daySlots.map((s) => {
              const time = new Date(s.starts_at).toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: '2-digit',
              })
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelectSlot(s)}
                  className="min-h-11 rounded-lg border border-gold/30 bg-charcoal/30 px-4 font-garamond text-sm text-mist transition hover:border-gold hover:bg-gold/10"
                >
                  {time}
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
