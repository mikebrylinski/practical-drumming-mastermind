import { MembersIcon } from '../members/MembersIcons'

type AdminToolbarProps = {
  onOpenMenu: () => void
}

export function AdminToolbar({ onOpenMenu }: AdminToolbarProps) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-charcoal/40 px-4 py-3 sm:px-5">
      <button
        type="button"
        className="flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-white/12 text-mist transition hover:border-gold/35 hover:text-gold lg:hidden"
        aria-label="Open admin menu"
        onClick={onOpenMenu}
      >
        <MembersIcon name="grid" className="size-5" />
      </button>
      <p className="font-garamond text-base tracking-[0.14em] text-mist/55 uppercase lg:hidden">
        Admin
      </p>
      <div className="hidden flex-1 lg:block" aria-hidden />
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <img
          src="/about-mike.png"
          alt="Admin profile"
          className="size-9 rounded-full object-cover ring-2 ring-gold/30 sm:size-10"
        />
      </div>
    </div>
  )
}
