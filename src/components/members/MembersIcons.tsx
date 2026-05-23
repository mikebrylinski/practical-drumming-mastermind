type IconProps = { className?: string }

export function MembersIcon({ name, className = 'size-5' }: IconProps & { name: string }) {
  switch (name) {
    case 'grid':
      return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
          <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.25" />
          <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.25" />
          <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.25" />
          <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      )
    case 'users':
      return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
          <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.25" />
          <path d="M2 16c0-2.5 2.2-4 5-4s5 1.5 5 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          <circle cx="14" cy="8" r="2" stroke="currentColor" strokeWidth="1.25" />
          <path d="M12 16c.3-1.8 1.6-3 3.5-3 2.2 0 3.5 1.4 3.5 3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      )
    case 'play':
      return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.25" />
          <path d="M9 7.5l4 2.5-4 2.5V7.5z" fill="currentColor" />
        </svg>
      )
    case 'message':
      return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M4 5h12v8H7l-3 3V5z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
        </svg>
      )
    case 'calendar':
      return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
          <rect x="4" y="5" width="12" height="11" rx="1" stroke="currentColor" strokeWidth="1.25" />
          <path d="M4 8h12M7 3v3M13 3v3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      )
    case 'feed':
      return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M4 6h12M4 10h8M4 14h10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      )
    case 'directory':
      return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
          <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.25" />
          <path d="M5 16c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      )
    case 'folder':
      return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M3 7h5l2 2h7v7H3V7z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
        </svg>
      )
    case 'trophy':
      return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M6 4h8v4a4 4 0 01-8 0V4zM8 12v2h4v-2M6 16h8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'settings':
      return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
          <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.25" />
          <path d="M10 3v2M10 15v2M3 10h2M15 10h2M5.05 5.05l1.41 1.41M13.54 13.54l1.41 1.41M5.05 14.95l1.41-1.41M13.54 6.46l1.41-1.41" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      )
    case 'bell':
      return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M10 4a4 4 0 014 4v3l2 2H4l2-2V8a4 4 0 014-4zM8 14a2 2 0 004 0" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'star':
      return (
        <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M10 3l2.2 4.5 4.9.7-3.5 3.4.8 4.9L10 14.2 5.6 16.5l.8-4.9-3.5-3.4 4.9-.7L10 3z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
        </svg>
      )
    case 'heart':
      return (
        <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M4 6.5c0-1.7 1.3-3 3-3 1 0 1.8.5 2.3 1.2.5-.7 1.3-1.2 2.3-1.2 1.7 0 3 1.3 3 3 0 3.5-5.3 6.3-5.3 6.3S4 10 4 6.5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
        </svg>
      )
    case 'comment':
      return (
        <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M3 4h10v6H6l-3 3V4z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
        </svg>
      )
    case 'mic':
    case 'video':
    case 'write':
    case 'play-sm':
    case 'zoom':
      return <span className={className} aria-hidden />
    default:
      return null
  }
}

export function BellIcon(props: IconProps) {
  return <MembersIcon name="bell" {...props} />
}

export function PlayIcon({ className = 'size-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M6 4.5l5 3.5-5 3.5V4.5z" fill="currentColor" />
    </svg>
  )
}
