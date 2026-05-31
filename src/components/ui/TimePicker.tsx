import { useEffect, useRef, useState } from 'react'

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function timeLabel(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date()
  d.setHours(h || 0, m || 0, 0, 0)
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

const OPTIONS: string[] = []
for (let h = 0; h < 24; h += 1) {
  for (const m of [0, 15, 30, 45]) OPTIONS.push(`${pad(h)}:${pad(m)}`)
}

type Props = {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function TimePicker({ value, onChange, className = '' }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selectedRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    selectedRef.current?.scrollIntoView({ block: 'center' })
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border border-white/12 bg-charcoal/40 px-3 py-2 font-garamond text-sm text-mist outline-none transition focus:border-gold/45"
      >
        <span className={value ? 'text-mist' : 'text-mist/35'}>
          {value ? timeLabel(value) : '--:--'}
        </span>
        <span className="text-gold/70" aria-hidden>◷</span>
      </button>

      {open ? (
        <div className="absolute left-0 z-40 mt-2 max-h-60 w-36 overflow-y-auto rounded-xl border border-white/10 bg-charcoal/95 p-1 shadow-xl backdrop-blur">
          {OPTIONS.map((o) => {
            const isSelected = o === value
            return (
              <button
                key={o}
                ref={isSelected ? selectedRef : undefined}
                type="button"
                onClick={() => {
                  onChange(o)
                  setOpen(false)
                }}
                className={`block w-full rounded-lg px-3 py-1.5 text-left font-garamond text-sm transition ${
                  isSelected
                    ? 'bg-gold text-void'
                    : 'text-mist/70 hover:bg-gold/15 hover:text-gold'
                }`}
              >
                {timeLabel(o)}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
