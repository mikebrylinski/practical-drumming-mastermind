import { FooterContactForm } from './FooterContactForm'
import { pageWrapClass } from './SectionShell'

export function SiteFooter() {
  return (
    <footer className="relative z-20 border-t border-white/[0.06] bg-charcoal/80 py-12 md:py-14">
      <div className={`${pageWrapClass} max-md:px-0`}>
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

          <div className="mx-5 w-auto min-w-0 rounded-2xl border border-white/[0.08] bg-void/40 p-6 ring-1 ring-white/[0.04] max-md:my-2 sm:mx-6 sm:p-8 md:mx-0 md:my-0 md:w-full md:p-10">
            <FooterContactForm />
          </div>
        </div>

        <div
          className="mx-auto mt-10 h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent md:mt-12"
          aria-hidden
        />
        <p className="mt-8 text-center font-garamond text-[0.65rem] uppercase tracking-[0.28em] text-mist/50 md:text-xs">
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
