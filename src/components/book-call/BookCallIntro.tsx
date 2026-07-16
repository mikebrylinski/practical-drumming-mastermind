import { ArrowRightIcon } from './icons'

type BookCallIntroProps = {
  onStart: () => void
}

export function BookCallIntro({ onStart }: BookCallIntroProps) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center px-2 text-center sm:px-4">
      <p className="font-garamond text-[0.7rem] tracking-[0.28em] uppercase text-gold/75">
        Private fit call · 45 minutes with Mike
      </p>
      <h1 className="mt-4 font-bebas text-[clamp(2rem,5vw,2.75rem)] leading-[1.05] tracking-[0.03em] text-mist">
        Book a private fit call with Mike
      </h1>
      <p className="mt-5 font-garamond text-base leading-relaxed text-mist/60 md:text-lg">
        Forty-five minutes to talk about where you are as a player, what you want next, and whether the
        Mastermind is the right room — no pressure to join on the call.
      </p>
      <p className="mt-3 font-garamond text-sm leading-relaxed text-mist/45 md:text-base">
        A short application, then pick a time from Mike&apos;s calendar.
      </p>

      <button
        type="button"
        onClick={onStart}
        className="mt-12 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-10 font-garamond text-xs tracking-[0.22em] uppercase text-void transition hover:bg-gold/90"
      >
        Start application
        <ArrowRightIcon />
      </button>
    </div>
  )
}
