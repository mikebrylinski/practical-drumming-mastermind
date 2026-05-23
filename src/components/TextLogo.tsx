import { Link } from 'react-router-dom'

type TextLogoProps = {
  className?: string
}

/** Header wordmark — DD icon + Bebas */
export function TextLogo({ className = '' }: TextLogoProps) {
  return (
    <Link
      to="/"
      className={`group flex min-w-0 items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-void md:gap-3 ${className}`}
    >
      <img
        src="/logo-dd.png"
        alt=""
        width={36}
        height={36}
        className="h-8 w-8 shrink-0 md:h-9 md:w-9"
        aria-hidden
      />
      <span className="block whitespace-nowrap font-bebas text-2xl leading-none tracking-[0.05em] text-mist transition-colors group-hover:text-gold/90 md:text-[1.75rem]">
        PRACTICAL DRUMMING
      </span>
    </Link>
  )
}
