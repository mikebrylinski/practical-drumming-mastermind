type PlaceholderAspect = 'landscape' | 'portrait' | 'wide' | 'icon'

type ImagePlaceholderProps = {
  label: string
  caption?: string
  aspect?: PlaceholderAspect
  className?: string
  src?: string
  alt?: string
}

const aspectClasses: Record<PlaceholderAspect, string> = {
  icon: 'aspect-square w-full max-w-[7rem] mx-auto',
  portrait: 'aspect-[4/5] w-full max-w-xs mx-auto',
  wide: 'aspect-[21/9] w-full',
  landscape: 'aspect-[16/10] w-full',
}

const gridPattern = {
  backgroundImage:
    'linear-gradient(rgba(201,165,92,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,165,92,0.06) 1px, transparent 1px)',
  backgroundSize: '32px 32px',
}

function PlaceholderIcon({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg
      className={`text-gold/35 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  )
}

export function ImagePlaceholder({
  label,
  caption,
  aspect = 'landscape',
  className = '',
  src,
  alt,
}: ImagePlaceholderProps) {
  const iconSize = aspect === 'icon' ? 'h-8 w-8 md:h-9 md:w-9' : 'h-10 w-10 md:h-12 md:w-12'

  return (
    <figure className={className}>
      <div
        className={`relative overflow-hidden border border-white/[0.08] bg-charcoal shadow-[inset_0_1px_0_rgba(201,165,92,0.08)] ${aspectClasses[aspect]}`}
      >
        {src ? (
          <>
            <img
              src={src}
              alt={alt ?? ''}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/55 via-void/10 to-transparent"
              aria-hidden
            />
          </>
        ) : (
          <>
            <div className="absolute inset-0 opacity-[0.35]" style={gridPattern} aria-hidden />
            <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-void/30" aria-hidden />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center md:gap-4 md:p-8">
              <PlaceholderIcon className={iconSize} />
              <span className="font-garamond text-[0.65rem] tracking-[0.28em] uppercase text-mist/45 md:text-xs">
                {label}
              </span>
            </div>
          </>
        )}
      </div>
      {caption ? (
        <figcaption className="mt-3 text-center font-garamond text-sm italic text-mist/45">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
