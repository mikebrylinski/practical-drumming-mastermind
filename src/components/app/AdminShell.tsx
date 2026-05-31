import { useEffect, useState, type ReactNode } from 'react'
import { SectionGridOverlay } from '../SectionGridOverlay'
import { pageWrapClass } from '../SectionShell'
import { AdminSidebar } from './AdminSidebar'
import { AdminToolbar } from './AdminToolbar'
import { AppCard } from './AppShell'

const SIDEBAR_KEY = 'pdm-admin-sidebar-expanded'

type AdminShellProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
  /** @deprecated Ignored — admin uses the same max-w-7xl box as the member dashboard. */
  wide?: boolean
}

/** Admin pages: left sidebar nav (expand/collapse) + boxed content — mirrors member dashboard chrome. */
export function AdminShell({
  eyebrow,
  title,
  subtitle,
  actions,
  children,
}: AdminShellProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [expanded, setExpanded] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_KEY) !== '0'
    } catch {
      return true
    }
  })

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  function toggleExpanded() {
    setExpanded((v) => {
      const next = !v
      try {
        localStorage.setItem(SIDEBAR_KEY, next ? '1' : '0')
      } catch {
        /* ignore */
      }
      return next
    })
  }

  return (
    <section className="relative border-t border-white/[0.06] bg-void">
      <SectionGridOverlay />
      <div className={`relative z-10 ${pageWrapClass} py-5 sm:py-6 md:py-8`}>
        <div className="overflow-hidden rounded-xl border border-white/10 bg-charcoal/25 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
          <div className="flex min-h-[min(70vh,720px)] flex-col lg:min-h-[640px] lg:flex-row">
            <AdminSidebar
              expanded={expanded || menuOpen}
              onToggleExpanded={toggleExpanded}
              mobileOpen={menuOpen}
              onClose={() => setMenuOpen(false)}
            />

            <div className="flex min-w-0 flex-1 flex-col">
              <AdminToolbar onOpenMenu={() => setMenuOpen(true)} />

              <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
                <div className="min-w-0 space-y-4 p-4 sm:space-y-5 sm:p-5 md:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
                        <p className="mt-1 max-w-2xl font-garamond text-base text-mist/55">
                          {subtitle}
                        </p>
                      ) : null}
                    </div>
                    {actions ? (
                      <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>
                    ) : null}
                  </div>
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { AppCard }
