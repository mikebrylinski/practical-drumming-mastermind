import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CredibilityIconRow } from '../components/home/CredibilityIconRow'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import { SectionGridOverlay } from '../components/SectionGridOverlay'
import { pageWrapClass, SectionShell } from '../components/SectionShell'

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

function Prose({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-garamond text-base leading-relaxed text-mist/70 md:text-[1.05rem] ${className}`}>
      {children}
    </p>
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
      <Seo
        title="About Mike Malinin"
        description="Mike Malinin — former Goo Goo Dolls and Tanya Tucker drummer behind the Diamond-certified hit 'Iris,' a Modern Drummer cover feature, and a Guitar Center RockWalk honoree. The story behind Practical Drumming."
        image="/about-mike-practical.png"
        canonicalPath="/about"
        type="profile"
      />
      {/* Hero — credibility from original home */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/credibility-bg.png')" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-void/45" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-void/75 via-void/50 to-void/25" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-void/25 via-transparent to-void/55" aria-hidden />

        <div className={`relative z-10 ${pageWrapClass} py-14 md:py-16 lg:py-20`}>
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:items-center lg:gap-12 xl:gap-16">
            <div className="flex w-full flex-col justify-center text-center lg:self-center lg:text-left">
              <h1 className="font-bebas text-[clamp(2.75rem,7vw,4.5rem)] leading-[0.92] tracking-[0.03em] text-mist">
                About <span className="text-gold">Mike Malinin</span>
              </h1>
              <p className="mt-3 font-bebas text-[clamp(1.4rem,3.4vw,2.1rem)] leading-tight tracking-[0.02em] text-mist/90">
                5 billion streams. Diamond &amp; platinum records. The world&apos;s biggest stages.
              </p>
              <p className="mt-3 font-garamond text-lg leading-snug text-mist/65 md:text-xl">
                Former Goo Goo Dolls / Tanya Tucker drummer — anchoring some of the most dominant
                records and live spectacles in modern rock.
              </p>
            </div>
            <CredibilityIconRow />
          </div>
        </div>
      </section>

      <SectionShell alt>
        <Reveal delay={0.05} className={twoColClass}>
          <div className="flex w-full flex-col items-center justify-center text-center">
            <AboutFigure
              aspect="landscape"
              src="/about-mike-practical.png"
              alt="Mike Malinin behind the drum kit"
              caption="Mike Malinin — Practical Drumming"
              captionCenter
              className="w-full max-w-md lg:max-w-none"
            />
          </div>
          <div className={`${colClass} space-y-5`}>
            <SectionHeading title="Mike Malinin" />
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
              history. He was also featured on the cover of{' '}
              <em className="text-mist/85">Modern Drummer</em> magazine — recognition reserved for
              drummers whose impact on the instrument reaches far beyond the stage.
            </Prose>
          </div>
        </Reveal>

        <HighlightGrid items={careerHighlights} delayStart={0.08} />
      </SectionShell>

      <SectionShell>
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

      <SectionShell alt>
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

      <SectionShell>
        <Reveal className="w-full text-center lg:text-left">
          <SectionHeading
            eyebrow="Honors & Recognition"
            title="Modern Drummer Cover & the Guitar Center RockWalk"
          />
          <Prose className="mt-5 lg:max-w-3xl">
            Beyond the records and the stages, Mike Malinin&apos;s impact on the drumming world has
            been recognized by the institutions that define the craft — from the pages of the
            instrument&apos;s most respected magazine to a permanent place among rock&apos;s greats in
            Hollywood.
          </Prose>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <Reveal>
            <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:gap-7">
              <figure className="mx-auto w-full max-w-[12rem] shrink-0 sm:max-w-[13rem]">
                <div className={`relative overflow-hidden ${portraitFrameClass} aspect-[3/4] w-full`}>
                  <img
                    src="/about-modern-drummer.png"
                    alt="Mike Malinin featured on the cover of Modern Drummer magazine"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = '/about-mike-practical.png'
                    }}
                  />
                </div>
                <figcaption className="mt-3 text-center font-garamond text-xs tracking-[0.22em] uppercase text-mist/50">
                  Modern Drummer — cover feature
                </figcaption>
              </figure>
              <div className="text-center lg:text-left">
                <h3 className="font-bebas text-xl tracking-wide text-gold md:text-2xl">
                  On the Cover of Modern Drummer
                </h3>
                <p className="mt-2.5 font-garamond text-sm leading-relaxed text-mist/65 md:text-base">
                  <em className="text-mist/85">Modern Drummer</em> is the definitive global
                  publication for the instrument, and a cover feature is one of the highest honors a
                  player can receive. Mike earned that spotlight not for flash, but for feel — the
                  pocket, dynamics, and song-first musicality that turned tracks like
                  &ldquo;Iris&rdquo; into generational hits.
                </p>
                <p className="mt-2.5 font-garamond text-sm leading-relaxed text-mist/65 md:text-base">
                  The feature placed him among the elite drummers whose approach shapes how the next
                  generation thinks about playing for the music — exactly the philosophy at the core
                  of Practical Drumming.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:gap-7">
              <figure className="mx-auto w-full max-w-[12rem] shrink-0 sm:max-w-[13rem]">
                <div className={`relative overflow-hidden ${portraitFrameClass} aspect-[3/4] w-full`}>
                  <img
                    src="/about-cta-rockwalk.png"
                    alt="Mike Malinin at his Guitar Center RockWalk induction beside his handprint plaque in Hollywood"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption className="mt-3 text-center font-garamond text-xs tracking-[0.22em] uppercase text-mist/50">
                  Guitar Center RockWalk — Hollywood
                </figcaption>
              </figure>
              <div className="text-center lg:text-left">
                <h3 className="font-bebas text-xl tracking-wide text-gold md:text-2xl">
                  Guitar Center RockWalk Honoree
                </h3>
                <p className="mt-2.5 font-garamond text-sm leading-relaxed text-mist/65 md:text-base">
                  The Guitar Center RockWalk of Fame in Hollywood immortalizes the musicians who have
                  shaped popular music, capturing their handprints alongside legends like Jimi
                  Hendrix, Eddie Van Halen, and Stevie Wonder. As part of the Goo Goo Dolls, Mike was
                  inducted with his bandmates — his handprints set in stone on the world&apos;s most
                  famous music boulevard.
                </p>
                <p className="mt-2.5 font-garamond text-sm leading-relaxed text-mist/65 md:text-base">
                  It&apos;s the kind of recognition reserved for artists whose work defines an era —
                  and a testament to the rock-solid drumming that powered five billion streams.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </SectionShell>

      <section className="relative overflow-hidden border-t border-gold/15 bg-charcoal/25 py-14 md:py-16 lg:py-20">
        <SectionGridOverlay />
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
                  src="/about-hero-crowd.png"
                  alt="Mike Malinin performing for a packed crowd"
                  caption="From the world's biggest stages to your kit"
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
                    Today, Mike runs Practical Drumming full time — building the mastermind community
                    where serious drummers get live mentorship, honest feedback, and direct access to
                    someone who&apos;s lived it at the highest level.
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
