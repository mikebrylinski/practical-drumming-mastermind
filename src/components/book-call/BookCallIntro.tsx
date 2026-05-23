import { ArrowRightIcon } from './icons'

type BookCallIntroProps = {
  onStart: () => void
}

export function BookCallIntro({ onStart }: BookCallIntroProps) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center text-center">
      <div className="flex items-center gap-2.5">
        <img src="/logo-dd.png" alt="" width={40} height={40} className="h-10 w-10" aria-hidden />
        <span className="font-bebas text-xl tracking-[0.06em] text-mist md:text-2xl">
          PRACTICAL DRUMMING MASTERMIND
        </span>
      </div>

      <h1 className="mt-10 font-bebas text-[clamp(2rem,5vw,2.75rem)] leading-[1.05] tracking-[0.03em] text-mist">
        Let&apos;s see if the Mastermind is the right fit for you.
      </h1>
      <p className="mt-5 font-garamond text-base leading-relaxed text-mist/60 md:text-lg">
        Share a little about yourself and your goals so we can make the most of our time together.
      </p>

      <button
        type="button"
        onClick={onStart}
        className="mt-12 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-10 font-garamond text-xs tracking-[0.22em] uppercase text-void transition hover:bg-gold/90"
      >
        Start
        <ArrowRightIcon />
      </button>
    </div>
  )
}
