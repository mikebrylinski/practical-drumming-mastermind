import type { ReactNode } from 'react'
import { SectionGridOverlay } from '../SectionGridOverlay'
import { pageWrapClass } from '../SectionShell'

type AppShellProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
  wide?: boolean
}

export function AppShell({ eyebrow, title, subtitle, actions, children, wide }: AppShellProps) {
  return (
    <section className="relative min-h-[calc(100svh-9rem)] border-t border-white/[0.06] bg-void">
      <SectionGridOverlay />
      <div
        className={`relative z-10 ${wide ? 'mx-auto w-full max-w-[100rem] px-5 md:px-8' : pageWrapClass} py-5 sm:py-6 md:py-8`}
      >
        <div className="overflow-hidden rounded-xl border border-white/10 bg-charcoal/25 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
          <div className="p-5 sm:p-6 md:p-8">
            <header className="flex flex-col gap-4 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                {eyebrow ? (
                  <p className="font-garamond text-xs tracking-[0.28em] text-gold uppercase">
                    {eyebrow}
                  </p>
                ) : null}
                <h1 className="mt-1 font-bebas text-3xl tracking-wide text-mist md:text-4xl">
                  {title}
                </h1>
                {subtitle ? (
                  <p className="mt-2 max-w-2xl font-garamond text-base text-mist/55">{subtitle}</p>
                ) : null}
              </div>
              {actions ? (
                <div className="flex shrink-0 items-center gap-3">{actions}</div>
              ) : null}
            </header>
            <div className="mt-7">{children}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function AppCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-charcoal/60 p-5 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  )
}
