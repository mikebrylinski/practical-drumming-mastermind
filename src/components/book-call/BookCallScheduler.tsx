import { BookingCalendarPicker } from '../booking/BookingCalendarPicker'
import { DEFAULT_SLUG } from '../../lib/booking/slotStore'
import type { AvailabilitySlot } from '../../lib/supabase/types'
import { CheckCircleIcon, ClockIcon, UsersIcon, VideoIcon } from './icons'

type BookCallSchedulerProps = {
  selectedSlot: AvailabilitySlot | null
  onSelectSlot: (slot: AvailabilitySlot) => void
  onBack?: () => void
  submitting?: boolean
}

const sidebarPoints = [
  { Icon: ClockIcon, title: '15–20 min private call', subtitle: 'With Mike Malinin' },
  { Icon: UsersIcon, title: 'Personal guidance', subtitle: 'About your drumming journey' },
  { Icon: VideoIcon, title: "See if we're a fit", subtitle: 'For the Mastermind' },
] as const

export function BookCallScheduler({
  selectedSlot,
  onSelectSlot,
  onBack,
  submitting = false,
}: BookCallSchedulerProps) {
  const dateLabel = selectedSlot
    ? new Date(selectedSlot.starts_at).toLocaleString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : null

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-1 sm:px-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-12">
      <aside className="flex flex-col">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="mb-4 self-start font-garamond text-xs tracking-[0.14em] text-mist/45 uppercase transition hover:text-gold"
          >
            ← Back
          </button>
        ) : null}
        <CheckCircleIcon className="h-10 w-10 text-gold" />
        <h2 className="mt-5 font-bebas text-[clamp(1.75rem,4vw,2.5rem)] leading-tight tracking-wide text-mist">
          Pick a time that works for you.
        </h2>
        <p className="mt-3 font-garamond text-base leading-relaxed text-mist/55">
          Thanks for sharing your answers. Choose from Mike&apos;s open slots to lock in your call.
        </p>
        {submitting ? (
          <p className="mt-4 font-garamond text-sm text-gold/90">Confirming your booking…</p>
        ) : null}
        {dateLabel ? (
          <p className="mt-4 rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 font-garamond text-sm text-gold">
            Selected: {dateLabel}
          </p>
        ) : null}
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
            <p className="font-bebas text-xl tracking-wide text-mist">Discovery Call</p>
            <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 font-garamond text-xs text-mist/50">
              <span>30 min</span>
              <span aria-hidden>·</span>
              <span>Video call</span>
            </p>
          </div>
        </div>

        <p className="mt-6 font-garamond text-sm text-mist/70">Select a date &amp; time</p>
        <div className={`mt-4 ${submitting ? 'pointer-events-none opacity-60' : ''}`}>
          <BookingCalendarPicker slug={DEFAULT_SLUG} onSelectSlot={onSelectSlot} />
        </div>
      </div>
    </div>
  )
}
