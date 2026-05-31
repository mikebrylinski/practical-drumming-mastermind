import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { TextLogo } from './TextLogo'
import { PersonIcon } from './PersonIcon'
import { SiteFooter } from './SiteFooter'
import { membersPath, siteNav } from '../nav'
import { useLeadTracking } from '../lib/leads/useLeadTracking'
import { trackLeadEvent } from '../lib/leads/track'
import { useAuth } from '../lib/auth/AuthProvider'

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-5 w-6" aria-hidden>
      <motion.span
        className="absolute left-0 top-0 block h-0.5 w-full rounded-full bg-mist/85"
        animate={open ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.span
        className="absolute left-0 top-[9px] block h-0.5 w-full rounded-full bg-mist/85"
        animate={open ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.18 }}
      />
      <motion.span
        className="absolute left-0 top-[18px] block h-0.5 w-full rounded-full bg-mist/85"
        animate={open ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      />
    </span>
  )
}

export function SiteLayout() {
  const { pathname } = useLocation()
  const isMembersArea = pathname.startsWith(membersPath)
  const [menuOpen, setMenuOpen] = useState(false)
  useLeadTracking()
  const { isAuthed, isAdmin } = useAuth()
  const accountPath = isAuthed ? '/dashboard' : '/login'

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <div className="relative flex min-h-svh flex-col bg-void">
      {!isMembersArea ? (
        <>
          <div
            className="pointer-events-none fixed inset-0 z-[1] opacity-[0.07] grain"
            aria-hidden
          />
          <div
            className="pointer-events-none fixed -top-40 left-1/2 z-0 h-[50vh] w-[120vw] -translate-x-1/2 rounded-full bg-gold/15 blur-[120px] hero-glow-pulse"
            aria-hidden
          />
        </>
      ) : null}

      <header
        className={`relative border-b border-white/[0.06] bg-black ${
          menuOpen ? 'z-[110]' : 'z-20'
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 md:gap-6 md:px-8 md:py-5">
          <TextLogo className="mr-auto min-w-0 shrink-0" />

          <nav
            className="hidden items-center gap-x-6 md:flex lg:gap-x-7"
            aria-label="Main"
          >
            {siteNav.map(({ to, label }) => {
              const active = pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => {
                    if (to === '/apply') trackLeadEvent('booking_click', { source: 'nav' })
                  }}
                  className={`relative font-garamond text-sm uppercase tracking-[0.2em] text-mist/55 transition-colors hover:text-gold ${
                    active ? 'text-gold' : ''
                  }`}
                >
                  {label}
                  {active ? (
                    <motion.span
                      layoutId="navline"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-gold/70"
                    />
                  ) : null}
                </Link>
              )
            })}
            {isAdmin ? (
              <Link
                to="/admin"
                className={`relative font-garamond text-sm uppercase tracking-[0.2em] transition-colors hover:text-gold ${
                  pathname.startsWith('/admin') ? 'text-gold' : 'text-mist/55'
                }`}
              >
                Admin
              </Link>
            ) : null}
            <Link
              to={accountPath}
              aria-label={isAuthed ? 'Member dashboard' : 'Members sign in'}
              aria-current={pathname === accountPath ? 'page' : undefined}
              className={`ml-1 flex min-h-10 min-w-10 items-center justify-center rounded-full border transition ${
                pathname === accountPath
                  ? 'border-gold/50 bg-gold/15 text-gold'
                  : 'border-white/12 bg-charcoal/40 text-mist/70 hover:border-gold/35 hover:bg-charcoal/70 hover:text-gold'
              }`}
            >
              <PersonIcon className="size-5" />
            </Link>
          </nav>

          <button
            type="button"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-md border border-white/12 bg-charcoal/40 text-mist transition hover:border-gold/35 hover:bg-charcoal/70 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex flex-col bg-void/97 px-6 pb-10 pt-24 backdrop-blur-md md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <nav className="flex flex-1 flex-col gap-1" aria-label="Main mobile">
              {siteNav.map(({ to, label }, i) => {
                const active = pathname === to
                return (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + i * 0.04, duration: 0.28 }}
                  >
                    <Link
                      to={to}
                      onClick={() => {
                        if (to === '/apply') trackLeadEvent('booking_click', { source: 'nav-mobile' })
                        setMenuOpen(false)
                      }}
                      className={`block border-b border-white/[0.06] py-4 text-center font-garamond text-lg uppercase tracking-[0.22em] transition-colors ${
                        active ? 'text-gold' : 'text-mist/75 hover:text-gold'
                      }`}
                    >
                      {label}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.28 }}
              className="mt-auto flex flex-col gap-3 pt-6"
            >
              {isAdmin ? (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className={`flex min-h-12 w-full items-center justify-center rounded-full border font-garamond text-sm tracking-[0.2em] uppercase transition ${
                    pathname.startsWith('/admin')
                      ? 'border-gold/50 bg-gold/15 text-gold'
                      : 'border-gold/40 text-gold hover:bg-gold/10'
                  }`}
                >
                  Admin
                </Link>
              ) : null}
              <Link
                to={accountPath}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-gold font-garamond text-sm tracking-[0.2em] uppercase text-void transition hover:bg-gold/90"
              >
                <PersonIcon className="size-5" />
                {isAuthed ? 'Dashboard' : 'Members'}
              </Link>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <main className={`relative flex-1 ${isMembersArea ? 'min-h-0' : 'z-10'}`}>
        <Outlet />
      </main>

      <SiteFooter />
    </div>
  )
}
