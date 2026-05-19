import type { ReactNode } from 'react'
import { sectionGridPatternStyle } from '../SectionGridOverlay'
import { HomeIcon, type HomeIconName } from './HomeIcons'

type HomeTileIcon = Exclude<HomeIconName, 'groove' | 'session' | 'touring'>

type HomeIconTileProps = {
  label: string
  className?: string
  /** Fills grid cell width (use in multi-column icon rows). */
  fill?: boolean
  /** Larger centered icon for highlight rows (e.g. credibility). */
  large?: boolean
} & (
  | { icon: HomeTileIcon; imageSrc?: never }
  | { imageSrc: string; icon?: never }
)

export function HomeIconTile({
  icon,
  imageSrc,
  label,
  className = '',
  fill = false,
  large = false,
}: HomeIconTileProps) {
  const tileSize = fill || large ? 'w-full max-w-none' : 'mx-auto w-full max-w-[7rem]'
  const tileShape = large ? 'aspect-[4/5] min-h-[14rem] sm:min-h-[15rem]' : 'aspect-square'
  const iconPx = large ? 72 : 44
  const iconClass = large
    ? 'h-[4.25rem] w-[4.25rem] sm:h-[4.75rem] sm:w-[4.75rem] md:h-20 md:w-20 drop-shadow-[0_0_20px_rgba(201,165,92,0.45)]'
    : 'h-11 w-11 drop-shadow-[0_0_12px_rgba(201,165,92,0.35)]'
  const labelClass = large
    ? 'font-garamond text-sm leading-relaxed text-mist/85 sm:text-[0.95rem] md:text-base'
    : 'font-garamond text-[0.6rem] leading-tight tracking-[0.22em] uppercase text-mist/50 md:text-[0.65rem]'
  const innerPad = large ? 'gap-4 p-5 sm:gap-5 sm:p-6' : 'gap-3 p-4 md:gap-4 md:p-5'

  return (
    <figure className={className}>
      <div
        className={`group relative overflow-hidden border border-white/[0.1] bg-charcoal shadow-[inset_0_1px_0_rgba(201,165,92,0.12)] transition-colors duration-300 hover:border-gold/30 ${tileShape} ${tileSize}`}
      >
        <div className="absolute inset-0 opacity-40" style={sectionGridPatternStyle} aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(201,165,92,0.2),transparent_65%)]"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-void/15 to-transparent" aria-hidden />
        <div
          className={`relative flex h-full flex-col items-center justify-between text-center ${innerPad}`}
        >
          <div className="flex flex-1 items-center justify-center pt-1 transition-transform duration-300 group-hover:scale-105">
            {imageSrc ? (
              <img src={imageSrc} alt="" className={`${iconClass} object-contain`} />
            ) : (
              <HomeIcon name={icon!} size={iconPx} className={iconClass} />
            )}
          </div>
          <span
            className={`w-full shrink-0 px-0.5 transition-colors group-hover:text-gold/90 ${labelClass}`}
          >
            {label}
          </span>
        </div>
      </div>
    </figure>
  )
}

type HomeIconBannerProps = {
  icon: Extract<HomeIconName, 'groove' | 'session' | 'touring'>
  label: string
  caption?: string
  aspect?: 'wide' | 'landscape'
  className?: string
}

const aspectClasses = {
  wide: 'aspect-[21/9]',
  landscape: 'aspect-[16/10]',
}

export function HomeIconBanner({
  icon,
  label,
  caption,
  aspect = 'wide',
  className = '',
}: HomeIconBannerProps) {
  const iconClass = aspect === 'wide' ? 'h-10 w-auto max-w-[85%] md:h-12' : 'h-12 w-auto max-w-[80%] md:h-14'

  return (
    <figure className={className}>
      <BannerShell aspect={aspect}>
        <HomeIcon name={icon} className={`${iconClass} drop-shadow-[0_0_16px_rgba(201,165,92,0.3)]`} />
        <span className="mt-3 font-garamond text-[0.65rem] tracking-[0.28em] uppercase text-mist/45 md:text-xs">
          {label}
        </span>
      </BannerShell>
      {caption ? (
        <figcaption className="mt-3 text-center font-garamond text-sm italic text-mist/40">{caption}</figcaption>
      ) : null}
    </figure>
  )
}

function BannerShell({
  aspect,
  children,
}: {
  aspect: 'wide' | 'landscape'
  children: ReactNode
}) {
  return (
    <div
      className={`group relative w-full overflow-hidden border border-white/[0.08] bg-charcoal shadow-[inset_0_1px_0_rgba(201,165,92,0.1)] transition-colors hover:border-gold/25 ${aspectClasses[aspect]}`}
    >
      <div className="absolute inset-0 opacity-35" style={sectionGridPatternStyle} aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(201,165,92,0.14),transparent)]"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-void/75 via-void/20 to-void/40" aria-hidden />
      <div className="relative flex h-full flex-col items-center justify-center px-6 py-8 md:px-10">
        {children}
      </div>
    </div>
  )
}
