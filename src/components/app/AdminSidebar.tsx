import { Link, NavLink, useLocation } from 'react-router-dom'
import { MembersIcon } from '../members/MembersIcons'
import { adminNavLinks, TEST_ROOM_NAME } from './adminNav'

type AdminSidebarProps = {
  expanded: boolean
  onToggleExpanded: () => void
  mobileOpen?: boolean
  onClose?: () => void
}

export function AdminSidebar({
  expanded,
  onToggleExpanded,
  mobileOpen,
  onClose,
}: AdminSidebarProps) {
  const { pathname } = useLocation()
  const showLabels = expanded || Boolean(mobileOpen)

  const testVideoLinkClass =
    'flex items-center gap-3 rounded-lg bg-gold/10 px-3 py-2.5 font-garamond text-sm tracking-[0.12em] text-gold uppercase transition hover:bg-gold/20'

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
        className={`fixed top-[4.5rem] bottom-0 left-0 z-50 flex flex-col border-r border-white/10 bg-[#0a0908] transition-[width,transform] duration-300 md:top-[5rem] lg:static lg:top-auto lg:z-auto lg:shrink-0 lg:self-stretch lg:translate-x-0 ${
          expanded ? 'w-[min(88vw,17.5rem)] lg:w-56' : 'w-[min(72vw,4.25rem)] lg:w-[4.25rem]'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div
          className={`flex items-center border-b border-white/10 px-3 py-3 ${
            expanded ? 'justify-between' : 'justify-center'
          }`}
        >
          {expanded ? (
            <p className="font-garamond text-[0.65rem] tracking-[0.28em] text-gold/75 uppercase">
              Admin
            </p>
          ) : null}
          <button
            type="button"
            onClick={onToggleExpanded}
            className="hidden size-8 items-center justify-center rounded-lg border border-white/12 text-mist/60 transition hover:border-gold/35 hover:text-gold lg:flex"
            aria-label={expanded ? 'Collapse menu' : 'Expand menu'}
            aria-expanded={expanded}
          >
            {expanded ? '‹' : '›'}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 lg:pt-5" aria-label="Admin">
          <ul className="space-y-0.5">
            <li className="mb-2">
              <Link
                to={`/room/${TEST_ROOM_NAME}`}
                onClick={onClose}
                title={!showLabels ? 'Test video' : undefined}
                className={`${testVideoLinkClass} ${showLabels ? '' : 'justify-center px-2'}`}
              >
                <MembersIcon name="video" className="size-[1.125rem] shrink-0" />
                {showLabels ? <span className="truncate">Test video</span> : null}
              </Link>
            </li>
            {adminNavLinks.map((item) => {
              const { to, label, icon } = item
              const end = 'end' in item ? item.end : undefined
              const alsoActive = 'alsoActive' in item ? item.alsoActive : undefined
              return (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={onClose}
                  title={!showLabels ? label : undefined}
                  className={({ isActive }) => {
                    const active =
                      isActive || (alsoActive ? pathname.startsWith(alsoActive) : false)
                    return `flex items-center gap-3 rounded-lg px-3 py-2.5 font-garamond text-base transition ${
                      showLabels ? '' : 'justify-center px-2'
                    } ${
                      active
                        ? 'bg-gold/15 text-gold'
                        : 'text-mist/60 hover:bg-white/5 hover:text-mist'
                    }`
                  }}
                >
                  <MembersIcon name={icon} className="size-[1.125rem] shrink-0" />
                  {showLabels ? <span className="truncate">{label}</span> : null}
                </NavLink>
              </li>
            )})}
          </ul>
        </nav>
      </aside>
    </>
  )
}
