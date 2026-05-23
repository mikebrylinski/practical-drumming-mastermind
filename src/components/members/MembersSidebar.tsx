import { memberNavItems } from './mockData'
import { MembersIcon } from './MembersIcons'

type MembersSidebarProps = {
  activeId?: string
  mobileOpen?: boolean
  onClose?: () => void
}

export function MembersSidebar({ activeId = 'dashboard', mobileOpen, onClose }: MembersSidebarProps) {
  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-x-0 top-[4.5rem] bottom-0 z-40 bg-void/80 md:top-[5rem] lg:hidden"
          aria-label="Close menu"
          onClick={onClose}
        />
      ) : null}
      <aside
        className={`fixed top-[4.5rem] bottom-0 left-0 z-50 flex w-[min(88vw,17.5rem)] flex-col border-r border-white/10 bg-[#0a0908] transition-transform duration-300 md:top-[5rem] lg:static lg:top-auto lg:z-auto lg:w-56 lg:shrink-0 lg:self-stretch lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <nav className="flex-1 overflow-y-auto px-3 py-4 lg:pt-5" aria-label="Members">
          <ul className="space-y-0.5">
            {memberNavItems.map(({ id, label, icon }) => {
              const active = id === activeId
              return (
                <li key={id}>
                  <button
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left font-garamond text-base transition ${
                      active
                        ? 'bg-gold/15 text-gold'
                        : 'text-mist/60 hover:bg-white/5 hover:text-mist'
                    }`}
                  >
                    <MembersIcon name={icon} className="size-[1.125rem] shrink-0" />
                    {label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-xl border border-gold/25 bg-gold/5 p-4">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
                <MembersIcon name="star" className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="font-garamond text-xs tracking-[0.2em] text-mist/45 uppercase">
                  Member Tier
                </p>
                <p className="font-garamond text-base font-medium text-mist">Backstage Access</p>
                <button type="button" className="mt-2 font-garamond text-sm text-gold underline decoration-gold/40 underline-offset-2">
                  View Benefits
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
