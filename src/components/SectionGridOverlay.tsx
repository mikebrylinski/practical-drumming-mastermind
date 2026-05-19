import type { CSSProperties } from 'react'

/** Gold grid used on icon tiles and plain page sections */
export const sectionGridPatternStyle: CSSProperties = {
  backgroundImage:
    'linear-gradient(rgba(201,165,92,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(201,165,92,0.07) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
}

type SectionGridOverlayProps = {
  className?: string
}

export function SectionGridOverlay({ className = 'opacity-30' }: SectionGridOverlayProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={sectionGridPatternStyle}
      aria-hidden
    />
  )
}
