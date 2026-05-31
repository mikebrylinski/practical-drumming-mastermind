import { useEffect, useState, type ReactNode } from 'react'
import { SectionGridOverlay } from '../SectionGridOverlay'
import { pageWrapClass } from '../SectionShell'
import { MembersSidebar } from './MembersSidebar'
import { MembersToolbar } from './MembersToolbar'
import { MembersMobileNav } from './MembersMobileNav'

type MembersLayoutProps = {
  activeId: string
  children: ReactNode
}

/** Shared chrome (sidebar + toolbar + mobile nav) for all member-area screens. */
export function MembersLayout({ activeId, children }: MembersLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <section className="relative border-t border-white/[0.06] bg-void">
      <SectionGridOverlay />
      <div className={`relative z-10 ${pageWrapClass} py-5 sm:py-6 md:py-8`}>
        <div className="overflow-hidden rounded-xl border border-white/10 bg-charcoal/25 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
          <div className="flex min-h-[min(70vh,720px)] flex-col lg:min-h-[640px] lg:flex-row">
            <MembersSidebar
              activeId={activeId}
              mobileOpen={menuOpen}
              onClose={() => setMenuOpen(false)}
            />

            <div className="flex min-w-0 flex-1 flex-col">
              <MembersToolbar onOpenMenu={() => setMenuOpen(true)} />
              <MembersMobileNav activeId={activeId} onSelect={() => setMenuOpen(false)} />

              <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
                <div className="min-w-0 space-y-4 p-4 sm:space-y-5 sm:p-5 md:p-6">
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
