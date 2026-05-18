import { Link } from 'react-router-dom'

type TextLogoProps = {
  className?: string
}

/** Header wordmark — Bebas only */
export function TextLogo({ className = '' }: TextLogoProps) {
  return (
    <Link
      to="/"
      className={`group block text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-void ${className}`}
    >
      <span className="block whitespace-nowrap font-bebas text-xl leading-none tracking-[0.05em] text-mist transition-colors group-hover:text-gold/90 md:text-2xl">
        PRACTICAL DRUMMING
      </span>
    </Link>
  )
}
