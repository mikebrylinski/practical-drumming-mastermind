import { ArrowRightIcon } from './icons'

type BookCallIntroProps = {
  onStart: () => void
}

export function BookCallIntro({ onStart }: BookCallIntroProps) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center px-2 text-center sm:px-4">
      <h1 className="font-bebas text-[clamp(2rem,5vw,2.75rem)] leading-[1.05] tracking-[0.03em] text-mist">
        Let&apos;s see if the Mastermind is the right fit for you.
      </h1>
      <p className="mt-5 font-garamond text-base leading-relaxed text-mist/60 md:text-lg">
        Answer a few quick questions, then pick a time from Mike&apos;s open calendar.
      </p>

      <button
        type="button"
        onClick={onStart}
        className="mt-12 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-10 font-garamond text-xs tracking-[0.22em] uppercase text-void transition hover:bg-gold/90"
      >
        Get started
        <ArrowRightIcon />
      </button>
    </div>
  )
}
