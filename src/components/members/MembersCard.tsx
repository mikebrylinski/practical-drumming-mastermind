import type { ReactNode } from 'react'

type MembersCardProps = {
  children: ReactNode
  className?: string
  title?: string
  action?: ReactNode
}

export function MembersCard({ children, className = '', title, action }: MembersCardProps) {
  return (
    <section
      className={`min-w-0 max-w-full rounded-xl border border-white/10 bg-charcoal/60 p-4 backdrop-blur-sm md:p-5 ${className}`}
    >
      {title || action ? (
        <div className="mb-4 flex items-start justify-between gap-3">
          {title ? (
            <h2 className="font-garamond text-base font-medium tracking-wide text-mist uppercase">
              {title}
            </h2>
          ) : (
            <span />
          )}
          {action}
        </div>
      ) : null}
      {children}
    </section>
  )
}
