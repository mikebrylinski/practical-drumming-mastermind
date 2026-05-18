import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'

const careerHighlights = [
  {
    title: 'The Pulse of a Diamond Hit',
    body: 'Malinin laid down the iconic 6/8 time signature groove for the 1998 hit “Iris.” His work on this single propelled it to an official RIAA Diamond certification (over 10 million units) and a global footprint nearing 5 billion streams across digital platforms.',
  },
  {
    title: 'Radio History Maker',
    body: 'Malinin’s drumming backed “Iris” during its historic run on the airwaves, holding the Billboard Hot 100 Airplay #1 spot for an astonishing 18 weeks—a record that stood unbroken for over two decades.',
  },
  {
    title: 'An Anchor for Multi-Platinum Eras',
    body: 'Beyond “Iris,” Malinin’s distinctive pop-rock drive powered the 5× Multi-Platinum album Dizzy Up The Girl and consecutive chart-topping alternative rock staples including “Slide” (3× Platinum) and “Black Balloon” (Platinum).',
  },
] as const

const arenaHighlights = [
  {
    title: 'Olympic Performances & Global Audiences',
    body: 'Malinin anchored massive international arena and stadium tours throughout the late ’90s and 2000s. He brought his powerful percussion directly to the global stage during the 2002 Winter Olympics in Salt Lake City, where the Goo Goo Dolls headlined a massive concert series celebrating the games.',
  },
  {
    title: 'USO Tours & Military Events',
    body: 'Malinin frequently used his platform to perform for military service members, most notably headlining a massive USO Concert for thousands of troops at the Ramstein Air Base in Germany.',
  },
  {
    title: 'Iconic Venues',
    body: 'His powerful live percussion is immortalized in several high-profile live releases, most notably the Goo Goo Dolls: Live at Red Rocks concert film filmed at the world-famous Colorado amphitheater.',
  },
] as const

const screenHighlights = [
  {
    title: 'Movie Soundtracks & Transformers',
    body: 'His drumming on “Iris” was originally commissioned for the multi-platinum movie soundtrack of the 1998 romantic drama City of Angels. Years later, Malinin provided the driving percussion for the 2007 blockbuster Transformers, recording the hit song “Before It’s Too Late (Sam and Mikaela’s Theme)” specifically as the lead emotional theme for the film’s main characters.',
  },
  {
    title: 'Late-Night & Daytime TV',
    body: 'To support major soundtrack releases like Transformers, he made dozens of television appearances performing live on foundational programs like The Tonight Show with Jay Leno, Late Show with David Letterman, and ABC’s Good Morning America in Central Park.',
  },
  {
    title: 'Pop Culture Cameos',
    body: 'Demonstrating the band’s massive household-name status during his era, Malinin also made a notable television guest appearance on Sesame Street.',
  },
] as const

const tanyaHighlights = [
  {
    title: 'The Grammy-Winning Resurgence',
    body: 'Malinin anchored the live band during Tucker’s historic 2019 career resurgence driven by the critically acclaimed album While I’m Livin’. During his tenure, Tanya Tucker won her first-ever Grammy Awards at the 2020 ceremony, taking home trophies for Best Country Album and Best Country Song (“Bring My Flowers Now”).',
  },
  {
    title: 'Historic Venues',
    body: 'As her bandleader, Malinin guided the live shows through highly celebrated performances at legendary, bucket-list venues. This included a historic, standing-room-only performance at West Hollywood’s iconic The Troubadour (which was captured for a live album release) and a highly revered taping for Austin City Limits.',
  },
] as const

const primaryBtnClass =
  'inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-7 font-garamond text-xs tracking-[0.18em] uppercase text-void transition hover:bg-gold/90'

type PlaceholderAspect = 'landscape' | 'portrait'

const portraitFrameClass =
  'rounded-[1.75rem] border border-white/10 bg-charcoal/80 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10 backdrop-blur-[2px]'
const landscapeFrameClass =
  'rounded-2xl border border-white/10 bg-charcoal/80 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)] ring-1 ring-gold/15'

const twoColClass =
  'mt-8 flex flex-col items-center gap-8 text-center lg:grid lg:grid-cols-2 lg:items-center lg:gap-10 lg:text-left xl:gap-12'

const colClass = 'flex w-full flex-col items-center justify-center text-center lg:items-start lg:justify-center lg:text-left'

const portraitSizeClass = 'mx-auto w-full max-w-[13rem] sm:max-w-[14rem] lg:max-w-[15rem]'

const pageWrapClass = 'mx-auto w-full max-w-7xl px-5 md:px-8'

function Prose({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-garamond text-base leading-relaxed text-mist/70 md:text-[1.05rem] ${className}`}>
      {children}
    </p>
  )
}

function SectionShell({
  children,
  className = '',
  alt = false,
  noBorder = false,
}: {
  children: ReactNode
  className?: string
  alt?: boolean
  noBorder?: boolean
}) {
  return (
    <section
      className={`${noBorder ? '' : 'border-t border-white/[0.06]'} py-14 md:py-16 lg:py-20 ${
        alt ? 'bg-charcoal/35' : 'bg-void'
      } ${className}`}
    >
      <div className={pageWrapClass}>{children}</div>
    </section>
  )
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string
  title: ReactNode
  subtitle?: string
}) {
  return (
    <div className="w-full text-center lg:text-left">
      {eyebrow ? (
        <p className="font-garamond text-[0.7rem] tracking-[0.32em] uppercase text-gold/75 md:text-xs">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`font-bebas text-[clamp(2rem,5vw,3.25rem)] leading-[0.95] tracking-[0.03em] text-mist ${
          eyebrow ? 'mt-2' : ''
        }`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 font-garamond text-lg leading-snug text-mist/65 md:text-xl">{subtitle}</p>
      ) : null}
    </div>
  )
}

function AboutFigure({
  caption,
  aspect = 'landscape',
  className = '',
  captionCenter = false,
  src,
  alt,
}: {
  caption?: string
  aspect?: PlaceholderAspect
  className?: string
  captionCenter?: boolean
  src: string
  alt: string
}) {
  const isPortrait = aspect === 'portrait'
  const frameClass = isPortrait ? portraitFrameClass : landscapeFrameClass
  const aspectClass =
    aspect === 'portrait' ? 'aspect-[4/5] w-full' : 'aspect-[16/10] w-full sm:aspect-[2/1]'

  return (
    <figure className={className}>
      <div className={`relative overflow-hidden ${frameClass} ${aspectClass}`}>
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/50 via-transparent to-void/10"
          aria-hidden
        />
      </div>
      {caption ? (
        <figcaption
          className={`mt-3 text-center font-garamond text-xs tracking-[0.22em] uppercase text-mist/50 ${captionCenter ? '' : 'lg:text-left'}`}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-charcoal/75 p-6 ring-1 ring-white/[0.04] backdrop-blur-sm md:p-7">
      <h3 className="font-bebas text-xl tracking-wide text-gold md:text-2xl">{title}</h3>
      <p className="mt-2.5 font-garamond text-sm leading-relaxed text-mist/65 md:text-base">{body}</p>
    </div>
  )
}

function HighlightGrid({
  items,
  delayStart = 0.04,
}: {
  items: readonly { title: string; body: string }[]
  delayStart?: number
}) {
  const gridCols =
    items.length === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2'

  return (
    <div className={`mt-8 grid gap-4 lg:mt-10 lg:gap-5 ${gridCols}`}>
      {items.map((item, i) => (
        <Reveal key={item.title} delay={delayStart + i * 0.04}>
          <FeatureCard title={item.title} body={item.body} />
        </Reveal>
      ))}
    </div>
  )
}

export function AboutPage() {
  return (
    <article className="bg-void">
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div
          className="absolute inset-0 bg-cover bg-[center_40%] bg-no-repeat"
          style={{ backgroundImage: "url('/about-hero-crowd.png')" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-void/50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-void/80 via-void/55 to-void/90" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-void/75 via-void/45 to-void/60" aria-hidden />
        <div className="pointer-events-none absolute inset-0 grain opacity-20" aria-hidden />

        <div className={`relative z-10 ${pageWrapClass} py-14 md:py-16 lg:py-20`}>
        <Reveal delay={0.05} className={twoColClass}>
          <div className="flex w-full flex-col items-center justify-center text-center">
            <AboutFigure
              aspect="portrait"
              src="/about-mike.png"
              alt="Mike Malinin speaking at an event"
              caption="Mike Malinin — Practical Drumming"
              captionCenter
              className={portraitSizeClass}
            />
          </div>
          <div className={`${colClass} space-y-5`}>
            <div className="w-full text-center">
              <p className="font-garamond text-[0.7rem] tracking-[0.32em] uppercase text-gold/90 md:text-xs">
                About
              </p>
              <h1 className="mt-2 font-bebas text-[clamp(2.5rem,6vw,4rem)] leading-[0.95] tracking-[0.03em] text-mist">
                Mike Malinin
              </h1>
            </div>
            <Prose>
              Mike Malinin is an American rock drummer best known for anchoring the rhythm section of
              the alternative rock band Goo Goo Dolls during their most commercially successful era.
              Joining the group in January 1995, Malinin’s precise, hard-hitting style provided the
              backbone for the band’s transition from gritty punk-rockers to global, multi-platinum
              superstars.
            </Prose>
            <Prose>
              His career is defined by driving the percussion on some of the most statistically dominant
              records, iconic live spectacles, and prestigious award-winning projects in modern music
              history.
            </Prose>
          </div>
        </Reveal>

        <HighlightGrid items={careerHighlights} delayStart={0.08} />
        </div>
      </section>

      <SectionShell alt>
        <Reveal delay={0.04} className={twoColClass}>
          <div className={colClass}>
            <SectionHeading title="Massive Shows and Arena Footprint" />
            <Prose className="mt-5">
              During his 19-year tenure, Malinin transitioned from playing localized indie clubs to
              commanding some of the world&apos;s most legendary music stages.
            </Prose>
          </div>
          <div className={colClass}>
            <AboutFigure
              aspect="landscape"
              src="/about-mike-live.png"
              alt="Mike Malinin performing live on drums"
              caption="Goo Goo Dolls era — stadium & festival performances"
              className="w-full"
            />
          </div>
        </Reveal>
        <HighlightGrid items={arenaHighlights} />
      </SectionShell>

      <SectionShell>
        <Reveal delay={0.04} className={twoColClass}>
          <div className={`${colClass} lg:order-1`}>
            <AboutFigure
              aspect="landscape"
              src="/about-mike-stage.png"
              alt="Mike Malinin behind a TAMA drum kit on stage"
              caption="Live on stage — Goo Goo Dolls era"
              className="w-full"
            />
          </div>
          <div className={`${colClass} lg:order-2`}>
            <SectionHeading title="TV and Movie Features" />
            <Prose className="mt-5">
              Malinin&apos;s work with the band heavily crossed over into mainstream television and
              cinematic pop culture.
            </Prose>
          </div>
        </Reveal>
        <HighlightGrid items={screenHighlights} />
      </SectionShell>

      <SectionShell alt>
        <Reveal delay={0.04} className={twoColClass}>
          <div className={colClass}>
            <SectionHeading
              eyebrow="Nashville"
              title="Country Reinvention & Grammy Success with Tanya Tucker"
            />
            <Prose className="mt-5">
              Following his departure from the Goo Goo Dolls, Malinin relocated to Nashville and spent
              nearly seven years (2016–2022) as drummer and bandleader for country legend Tanya Tucker —
              finding &ldquo;intensity without volume&rdquo; to support her immense vocal presence.
            </Prose>
          </div>
          <div className="flex w-full flex-col items-center justify-center text-center">
            <AboutFigure
              aspect="portrait"
              src="/about-mike-tanya.png"
              alt="Mike Malinin behind the drum kit for Tanya Tucker"
              caption="Bandleader for Tanya Tucker — Nashville"
              captionCenter
              className={portraitSizeClass}
            />
          </div>
        </Reveal>
        <HighlightGrid items={tanyaHighlights} />
      </SectionShell>

      <section className="relative overflow-hidden border-t border-gold/15 bg-charcoal/25 py-14 md:py-16 lg:py-20">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_50%,rgba(201,165,92,0.08),transparent_65%)]"
          aria-hidden
        />
        <div className={`relative z-10 ${pageWrapClass}`}>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
            <Reveal className="order-2 lg:order-1">
              <div className="flex w-full flex-col items-center justify-center text-center">
                <AboutFigure
                  aspect="portrait"
                  src="/about-cta-rockwalk.png"
                  alt="Mike Malinin at Guitar Center RockWalk induction with handprint plaque"
                  caption="Guitar Center RockWalk — Hollywood"
                  captionCenter
                  className={portraitSizeClass}
                />
              </div>
            </Reveal>

            <div className="order-1 flex flex-col items-center gap-8 text-center lg:order-2 lg:items-start lg:text-left">
              <Reveal className="w-full">
                <SectionHeading
                  title={
                    <>
                      <span className="text-mist">Learn From a </span>
                      <span className="text-gold">Diamond-Certified Legend</span>
                    </>
                  }
                />
                <div className="mt-6 space-y-5">
                  <Prose>
                    Learn directly from an industry veteran who has conquered alternative rock radio
                    and Grammy-winning country charts alike.
                  </Prose>
                  <Prose>
                    Mike offers exclusive mentorship to exactly 20 dedicated students — whether you
                    want intricate rock rhythms, stadium-ready endurance, or your unique studio pocket.
                  </Prose>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <Link to="/apply" className={`${primaryBtnClass} min-h-14 px-10 md:min-h-16 md:px-14`}>
                  Apply for Membership
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}
