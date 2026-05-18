import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { TextLogo } from './TextLogo'

const nav = [
  { to: '/', label: 'Home' },
  { to: '/club', label: 'The Club' },
  { to: '/about', label: 'About Mike' },
  { to: '/faq', label: 'FAQ' },
  { to: '/apply', label: 'Apply' },
]

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
  const [menuOpen, setMenuOpen] = useState(false)

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
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.07] grain"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -top-40 left-1/2 z-0 h-[50vh] w-[120vw] -translate-x-1/2 rounded-full bg-gold/15 blur-[120px] hero-glow-pulse"
        aria-hidden
      />

      <header
        className={`relative border-b border-white/[0.06] bg-black ${
          menuOpen ? 'z-[110]' : 'z-20'
        }`}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 md:gap-6 md:px-8 md:py-5">
          <TextLogo className="mr-auto min-w-0 shrink-0" />

          <nav
            className="hidden items-center gap-x-6 md:flex lg:gap-x-7"
            aria-label="Main"
          >
            {nav.map(({ to, label }) => {
              const active = pathname === to
              return (
                <Link
                  key={to}
                  to={to}
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
              {nav.map(({ to, label }, i) => {
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
                      onClick={() => setMenuOpen(false)}
                      className={`block border-b border-white/[0.06] py-4 font-garamond text-lg uppercase tracking-[0.22em] transition-colors ${
                        active ? 'text-gold' : 'text-mist/75 hover:text-gold'
                      }`}
                    >
                      {label}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>
            <p className="mt-auto text-center font-garamond text-xs tracking-[0.2em] text-mist/35">
              Practical Drumming
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <main className="relative z-10 flex-1">
        <Outlet />
      </main>

      <footer className="relative z-20 border-t border-white/[0.06] bg-charcoal/80 px-5 py-12 text-center md:px-8">
        <p className="font-garamond text-xs tracking-[0.28em] uppercase text-mist/40">
          Practical Drumming · Mastermind Club
        </p>
        <p className="mt-3 font-garamond text-[0.65rem] uppercase tracking-[0.28em] text-mist/60 md:text-xs">
          Copyright 2026 Mike Malinin. All Rights Reserved.
        </p>
      </footer>
    </div>
  )
}
