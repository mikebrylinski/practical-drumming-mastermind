import { Link } from 'react-router-dom'
import { memberNavItems, memberNavRoutes } from './mockData'
import { MembersIcon } from './MembersIcons'

type MembersMobileNavProps = {
  activeId?: string
  onSelect?: () => void
}

/** Quick-scroll member nav for small screens (sidebar stays in drawer). */
export function MembersMobileNav({ activeId = 'dashboard', onSelect }: MembersMobileNavProps) {
  return (
    <nav
      className="border-b border-white/10 bg-void/50 px-4 py-2.5 lg:hidden"
      aria-label="Members sections"
    >
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {memberNavItems.map(({ id, label, icon }) => {
          const active = id === activeId
          const route = memberNavRoutes[id]
          const cls = `flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2.5 font-garamond text-sm transition ${
            active
              ? 'bg-gold/20 text-gold ring-1 ring-gold/35'
              : 'bg-white/5 text-mist/60 hover:text-mist'
          }`
          return (
            <li key={id} className="shrink-0">
              {route ? (
                <Link to={route} onClick={onSelect} className={cls}>
                  <MembersIcon name={icon} className="size-3.5 shrink-0" />
                  {label}
                </Link>
              ) : (
                <button type="button" onClick={onSelect} className={cls}>
                  <MembersIcon name={icon} className="size-3.5 shrink-0" />
                  {label}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
