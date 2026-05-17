import { Link } from 'react-router-dom'

type TextLogoProps = {
  className?: string
}

/** Wordmark styled like the home hero: Bebas + Garamond + gold rules */
export function TextLogo({ className = '' }: TextLogoProps) {
  return (
    <Link
      to="/"
      className={`group block text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-void ${className}`}
    >
      <span
        className="block whitespace-nowrap font-bebas text-[clamp(1.6rem,6.5vw,3.35rem)] leading-none tracking-[0.06em] text-mist transition-colors group-hover:text-mist lg:text-[3.5rem]"
        style={{ textShadow: '0 0 48px rgba(201,165,92,0.14)' }}
      >
        PRACTICAL DRUMMING
      </span>
      <div className="mt-2 flex items-center gap-2 sm:mt-2.5 sm:gap-3 md:mt-1 md:justify-center md:gap-4">
        <span className="h-px flex-1 max-w-[2rem] bg-gradient-to-r from-transparent via-gold/55 to-gold/25 sm:max-w-[2.75rem] md:max-w-[3.5rem]" />
        <span className="whitespace-nowrap font-garamond text-[0.7rem] uppercase tracking-[0.26em] text-gold/95 sm:text-xs sm:tracking-[0.28em] md:text-base">
          Mastermind Club
        </span>
        <span className="h-px flex-1 max-w-[2rem] bg-gradient-to-l from-transparent via-gold/55 to-gold/25 sm:max-w-[2.75rem] md:max-w-[3.5rem]" />
      </div>
    </Link>
  )
}
