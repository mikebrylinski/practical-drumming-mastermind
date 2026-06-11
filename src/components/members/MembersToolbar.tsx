import { Link } from 'react-router-dom'
import { BellIcon, MembersIcon } from './MembersIcons'
import { useAuth } from '../../lib/auth/AuthProvider'

type MembersToolbarProps = {
  onOpenMenu: () => void
}

function initialsFromName(name: string, email: string): string {
  const source = name.trim() || email.trim()
  if (!source) return '?'
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

export function MembersToolbar({ onOpenMenu }: MembersToolbarProps) {
  const { profile } = useAuth()
  const avatar = profile?.avatar_url
  const initials = initialsFromName(profile?.full_name ?? '', profile?.email ?? '')

  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-charcoal/40 px-4 py-3 sm:px-5">
      <button
        type="button"
        className="flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-white/12 text-mist transition hover:border-gold/35 hover:text-gold lg:hidden"
        aria-label="Open members menu"
        onClick={onOpenMenu}
      >
        <MembersIcon name="grid" className="size-5" />
      </button>
      <p className="font-garamond text-base tracking-[0.14em] text-mist/55 uppercase lg:hidden">
        Members Area
      </p>
      <div className="hidden flex-1 lg:block" aria-hidden />
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-full border border-white/12 text-mist/70 transition hover:border-gold/30 hover:text-gold sm:size-10"
          aria-label="Notifications"
        >
          <BellIcon className="size-5" />
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-gold font-garamond text-[0.6rem] text-void">
            3
          </span>
        </button>
        {avatar ? (
          <Link to="/profile" aria-label="Your profile">
            <img
              src={avatar}
              alt=""
              className="size-9 rounded-full object-cover ring-2 ring-gold/30 sm:size-10"
            />
          </Link>
        ) : (
          <Link
            to="/profile"
            aria-label="Your profile"
            className="flex size-9 items-center justify-center rounded-full bg-gold/15 font-bebas text-sm text-gold ring-2 ring-gold/30 sm:size-10"
          >
            {initials}
          </Link>
        )}
      </div>
    </div>
  )
}
