import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  MOCK_TIME_SLOTS,
  WEEKDAY_LABELS,
  buildCalendarGrid,
  formatMonthYear,
  getMockMonthAnchor,
} from './mockSchedule'
import { CheckCircleIcon, ClockIcon, UsersIcon, VideoIcon } from './icons'

type MockSchedulerProps = {
  onConfirm: (booking: { dateLabel: string; time: string }) => void
}

const sidebarPoints = [
  {
    Icon: ClockIcon,
    title: '15–20 min private call',
    subtitle: 'With Mike Malinin',
  },
  {
    Icon: UsersIcon,
    title: 'Personal guidance',
    subtitle: 'About your drumming journey',
  },
  {
    Icon: VideoIcon,
    title: "See if we're a fit",
    subtitle: 'For the Mastermind',
  },
] as const

export function MockScheduler({ onConfirm }: MockSchedulerProps) {
  const viewMonth = useMemo(() => getMockMonthAnchor(), [])
  const grid = useMemo(() => buildCalendarGrid(viewMonth), [viewMonth])

  const [selectedDay, setSelectedDay] = useState<number | null>(() => {
    const first = grid.find((c) => c.available && c.day !== null)
    return first?.day ?? null
  })
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const monthLabel = formatMonthYear(viewMonth)
  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()

  function selectDay(day: number) {
    setSelectedDay(day)
    setSelectedTime(null)
  }

  function handleContinue() {
    if (!selectedDay || !selectedTime) return
    const date = new Date(year, month, selectedDay)
    const dateLabel = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    onConfirm({ dateLabel, time: selectedTime })
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-12">
      <aside className="flex flex-col">
        <CheckCircleIcon className="h-10 w-10 text-gold" />
        <h2 className="mt-5 font-bebas text-[clamp(1.75rem,4vw,2.5rem)] leading-tight tracking-wide text-mist">
          You&apos;re qualified to book a call. Select a time that works for you.
        </h2>
        <ul className="mt-8 space-y-6">
          {sidebarPoints.map(({ Icon, title, subtitle }) => (
            <li key={title} className="flex gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                <Icon className="size-8" />
              </span>
              <span className="min-w-0 pt-1">
                <span className="block font-garamond text-sm font-medium tracking-wide text-mist uppercase">
                  {title}
                </span>
                <span className="mt-0.5 block font-garamond text-sm leading-snug text-mist/55">
                  {subtitle}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </aside>

      <div className="rounded-xl border border-white/10 bg-charcoal/40 p-5 shadow-2xl md:p-6 lg:p-8">
        <div className="flex gap-5 border-b border-white/10 pb-6 md:gap-6">
          <img
            src="/about-mike.png"
            alt="Mike Malinin"
            className="h-24 w-24 shrink-0 rounded-full object-cover ring-2 ring-gold/35 md:h-28 md:w-28"
          />
          <div>
            <p className="font-garamond text-lg text-mist">Mike Malinin</p>
            <p className="font-bebas text-xl tracking-wide text-mist">15 Minute Call</p>
            <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 font-garamond text-xs text-mist/50">
              <span>15 min</span>
              <span aria-hidden>·</span>
              <span>Zoom</span>
            </p>
            <p className="mt-2 max-w-md font-garamond text-sm leading-relaxed text-mist/55">
              A short conversation to learn about your goals and see if the Mastermind is the right
              next step.
            </p>
          </div>
        </div>

        <p className="mt-6 font-garamond text-sm text-mist/70">
          Select a Date &amp; Time <span className="text-mist/40">({monthLabel})</span>
        </p>

        <div className="mt-4 grid gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {WEEKDAY_LABELS.map((d) => (
                <span
                  key={d}
                  className="py-1 font-garamond text-[0.65rem] tracking-wider text-mist/35 uppercase"
                >
                  {d}
                </span>
              ))}
              {grid.map((cell, i) => {
                if (cell.day === null) {
                  return <span key={`empty-${i}`} className="aspect-square" aria-hidden />
                }
                const selected = selectedDay === cell.day
                const disabled = !cell.available
                return (
                  <button
                    key={cell.day}
                    type="button"
                    disabled={disabled}
                    onClick={() => selectDay(cell.day!)}
                    className={`aspect-square rounded-full font-garamond text-sm transition ${
                      disabled
                        ? 'cursor-not-allowed text-mist/20'
                        : selected
                          ? 'bg-gold font-medium text-void'
                          : 'text-mist/80 hover:bg-white/10'
                    }`}
                  >
                    {cell.day}
                  </button>
                )
              })}
            </div>
            <label className="mt-5 block font-garamond text-xs text-mist/45">
              Time zone
              <select className="mt-1 w-full max-w-xs rounded-md border border-white/10 bg-void/80 px-3 py-2 text-sm text-mist outline-none focus:border-gold/40">
                <option>Eastern Time – US &amp; Canada</option>
                <option>Central Time – US &amp; Canada</option>
                <option>Pacific Time – US &amp; Canada</option>
              </select>
            </label>
          </div>

          <div className="min-w-[9.5rem] border-t border-white/10 pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-6">
            <p className="font-garamond text-xs tracking-wide text-mist/45 uppercase">
              {selectedDay
                ? new Date(year, month, selectedDay).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Pick a day'}
            </p>
            <ul className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
              {MOCK_TIME_SLOTS.map((time) => {
                const active = selectedTime === time
                return (
                  <li key={time}>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`min-w-0 flex-1 rounded-md border px-3 py-2.5 font-garamond text-sm transition ${
                          active
                            ? 'border-gold/50 bg-gold/10 text-gold'
                            : 'border-white/15 text-mist/80 hover:border-white/25'
                        }`}
                      >
                        {time}
                      </button>
                      <AnimatePresence>
                        {active ? (
                          <motion.button
                            type="button"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            onClick={handleContinue}
                            className="shrink-0 rounded-md bg-gold px-4 font-garamond text-xs tracking-[0.12em] uppercase text-void"
                          >
                            Continue
                          </motion.button>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <p className="mt-6 text-center font-garamond text-[0.65rem] tracking-wide text-mist/30 uppercase">
          Powered by Calendly
        </p>
      </div>
    </div>
  )
}
