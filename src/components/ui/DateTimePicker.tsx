import { useEffect, useMemo, useRef, useState } from 'react'
import { TimePicker } from './TimePicker'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** Format a Date as a local 'YYYY-MM-DDTHH:mm' string (datetime-local compatible). */
function toLocalValue(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  required?: boolean
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = 'Select date & time',
  className = '',
}: Props) {
  const parsed = value ? new Date(value) : null
  const valid = parsed && !Number.isNaN(parsed.getTime()) ? parsed : null

  const [open, setOpen] = useState(false)
  const [viewMonth, setViewMonth] = useState<Date>(() => {
    const d = valid ?? new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [time, setTime] = useState<string>(valid ? `${pad(valid.getHours())}:${pad(valid.getMinutes())}` : '10:00')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

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

  function pick(day: Date) {
    const [h, m] = time.split(':').map(Number)
    const next = new Date(day)
    next.setHours(h || 0, m || 0, 0, 0)
    onChange(toLocalValue(next))
  }

  function changeTime(t: string) {
    setTime(t)
    if (valid) {
      const [h, m] = t.split(':').map(Number)
      const next = new Date(valid)
      next.setHours(h || 0, m || 0, 0, 0)
      onChange(toLocalValue(next))
    }
  }

  const selectedKey = valid ? dayKey(valid) : null
  const todayKey = dayKey(new Date())

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border border-white/12 bg-charcoal/40 px-3 py-2 font-garamond text-sm text-mist outline-none transition focus:border-gold/45"
      >
        <span className={valid ? 'text-mist' : 'text-mist/35'}>
          {valid
            ? valid.toLocaleString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })
            : placeholder}
        </span>
        <span className="text-gold/70" aria-hidden>▦</span>
      </button>

      {open ? (
        <div className="absolute left-0 z-40 mt-2 w-72 rounded-xl border border-white/10 bg-charcoal/95 p-4 shadow-xl backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-garamond text-sm text-mist">
              {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
            </h4>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                aria-label="Previous month"
                className="flex size-7 items-center justify-center rounded-full border border-white/12 text-mist/60 transition hover:border-gold/40 hover:text-gold"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                aria-label="Next month"
                className="flex size-7 items-center justify-center rounded-full border border-white/12 text-mist/60 transition hover:border-gold/40 hover:text-gold"
              >
                ›
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((w, i) => (
              <div key={i} className="py-1 font-garamond text-[0.65rem] text-mist/35 uppercase">
                {w}
              </div>
            ))}
            {calendarCells.map((cell, i) => {
              if (!cell) return <div key={`e${i}`} />
              const key = dayKey(cell)
              const isSelected = key === selectedKey
              const isToday = key === todayKey
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => pick(cell)}
                  className={`mx-auto flex size-8 items-center justify-center rounded-full font-garamond text-xs transition ${
                    isSelected
                      ? 'bg-gold text-void'
                      : 'text-mist/70 hover:bg-gold/15 hover:text-gold'
                  } ${isToday && !isSelected ? 'ring-1 ring-gold/40' : ''}`}
                >
                  {cell.getDate()}
                </button>
              )
            })}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
            <label className="font-garamond text-xs text-mist/55">Time</label>
            <TimePicker value={time} onChange={changeTime} className="w-28" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full bg-gold px-4 py-1 font-garamond text-xs tracking-[0.12em] text-void uppercase transition hover:bg-gold/90"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
