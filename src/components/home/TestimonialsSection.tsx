import { Reveal } from '../Reveal'
import { pageWrapClass, SectionShell } from '../SectionShell'
import { peerTestimonials } from './testimonials'

export function TestimonialsSection() {
  return (
    <SectionShell alt className="border-t border-white/[0.06] lg:py-24">
      <Reveal className="w-full text-center">
        <p className="font-garamond text-[0.7rem] tracking-[0.32em] uppercase text-gold/75 md:text-xs">
          From the community
        </p>
        <h2 className="mt-2 font-bebas text-[clamp(2rem,5vw,3rem)] leading-[0.95] tracking-[0.03em] text-mist">
          What People Are Saying
        </h2>
      </Reveal>
      <div
        className={`${pageWrapClass} mt-10 grid gap-5 md:grid-cols-2 lg:mt-12 lg:grid-cols-3`}
      >
        {peerTestimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.05}>
            <blockquote className="flex h-full flex-col rounded-2xl border border-white/10 bg-charcoal/60 p-6 ring-1 ring-white/[0.04]">
              <p className="flex-1 font-garamond text-base leading-relaxed text-mist/70">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-5 border-t border-white/10 pt-4">
                <p className="font-bebas text-xl tracking-[0.04em] text-mist md:text-2xl">{t.name}</p>
                <p className="mt-1 font-garamond text-sm leading-snug text-gold md:text-base">{t.role}</p>
              </footer>
            </blockquote>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  )
}
