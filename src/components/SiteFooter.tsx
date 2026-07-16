import { Link } from 'react-router-dom'
import { FooterContactForm } from './FooterContactForm'
import { pageWrapClass } from './SectionShell'
import { landingPages } from '../pages/landing/landingData'

const footerPrimaryLinks = [
  { to: '/', label: 'Home' },
  { to: '/club', label: 'Mastermind Club' },
  { to: '/about', label: 'About Mike' },
  { to: '/apply', label: 'Book a Call' },
  { to: '/faq', label: 'FAQ' },
] as const

export function SiteFooter() {
  return (
    <footer className="relative z-20 overflow-hidden border-t border-white/[0.06] bg-void py-12 md:py-14">
      {/* Dotted grid + drifting spotlight (Resend-style) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="footer-dot-grid absolute inset-[-22px] opacity-70" />
        <div className="footer-dot-spotlight absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-void/70" />
      </div>

      <div className={`relative ${pageWrapClass} max-md:px-0`}>
        <div className="grid gap-12 md:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] md:items-center md:gap-10 lg:gap-16">
          <div className="flex flex-col items-center text-center">
            <img
              src="/logo-dd-footer.png"
              alt=""
              width={200}
              height={200}
              className="h-36 w-36 mix-blend-lighten sm:h-40 sm:w-40 md:h-44 md:w-44"
              aria-hidden
            />
            <div className="mt-5 leading-none">
              <p className="font-bebas text-2xl tracking-[0.05em] text-mist md:text-[1.75rem]">
                Practical Drumming
                <br className="md:hidden" />
                <span className="mt-1 block font-bebas text-lg tracking-[0.08em] text-gold md:mt-0.5 md:text-xl">
                  mastermind club
                </span>
              </p>
            </div>
          </div>

          <div className="mx-5 w-auto min-w-0 rounded-2xl border border-white/[0.08] bg-void/55 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] ring-1 ring-white/[0.04] backdrop-blur-[2px] max-md:my-2 sm:mx-6 sm:p-8 md:mx-0 md:my-0 md:w-full md:p-10">
            <FooterContactForm />
          </div>
        </div>

        <nav
          className="mx-5 mt-10 px-8 py-6 md:mx-0 md:mt-12 md:px-8 md:py-8"
          aria-label="Footer"
        >
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-3">
            {footerPrimaryLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="font-garamond text-xs tracking-[0.16em] uppercase text-mist/70 transition hover:text-gold"
              >
                {label}
              </Link>
            ))}
          </div>
          <div
            className="mx-auto mt-8 h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent md:mt-10"
            aria-hidden
          />
          <div className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-3 md:mt-10">
            {landingPages.map((page) => (
              <Link
                key={page.slug}
                to={`/${page.slug}`}
                className="font-garamond text-[0.68rem] tracking-[0.14em] uppercase text-mist/45 transition hover:text-gold"
              >
                {page.eyebrow}
              </Link>
            ))}
          </div>
        </nav>

        <p className="mt-10 text-center font-garamond text-[0.65rem] uppercase tracking-[0.28em] text-mist/50 md:mt-12 md:text-xs">
          Copyright 2026 Mike Malinin.
          <br />
          All Rights Reserved.
        </p>
        <p className="mt-4 text-center font-garamond text-xs tracking-[0.14em] text-gold md:text-sm">
          eMastermind Solution by{' '}
          <a
            href="https://pixelpali.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline decoration-gold/35 underline-offset-2 transition hover:text-gold/80"
          >
            Pixel Palisade
          </a>
        </p>
      </div>
    </footer>
  )
}
