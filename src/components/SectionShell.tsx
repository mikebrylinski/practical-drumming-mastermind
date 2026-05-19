import type { ReactNode } from 'react'
import { SectionGridOverlay } from './SectionGridOverlay'

export const pageWrapClass = 'mx-auto w-full max-w-7xl px-5 md:px-8'

type SectionShellProps = {
  children: ReactNode
  className?: string
  alt?: boolean
  noBorder?: boolean
}

export function SectionShell({
  children,
  className = '',
  alt = false,
  noBorder = false,
}: SectionShellProps) {
  return (
    <section
      className={`relative overflow-hidden ${noBorder ? '' : 'border-t border-white/[0.06]'} py-14 md:py-16 lg:py-20 ${
        alt ? 'bg-charcoal/35' : 'bg-void'
      } ${className}`}
    >
      <SectionGridOverlay />
      <div className={`relative z-10 ${pageWrapClass}`}>{children}</div>
    </section>
  )
}
