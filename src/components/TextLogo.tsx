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
        className="font-bebas text-[1.65rem] leading-[0.88] tracking-[0.02em] text-mist transition-colors group-hover:text-mist sm:text-3xl md:text-[2rem]"
        style={{ textShadow: '0 0 48px rgba(201,165,92,0.14)' }}
      >
        PRACTICAL
        <br />
        DRUMMING
      </span>
      <div className="mt-1.5 flex items-center gap-2 sm:mt-2 sm:gap-3">
        <span className="h-px flex-1 max-w-[1.75rem] bg-gradient-to-r from-transparent via-gold/55 to-gold/25 sm:max-w-[2.25rem]" />
        <span className="whitespace-nowrap font-garamond text-[0.5625rem] uppercase tracking-[0.26em] text-gold/95 sm:text-[0.625rem] sm:tracking-[0.28em] md:text-[0.6875rem]">
          Mastermind Club
        </span>
        <span className="h-px flex-1 max-w-[1.75rem] bg-gradient-to-l from-transparent via-gold/55 to-gold/25 sm:max-w-[2.25rem]" />
      </div>
    </Link>
  )
}
