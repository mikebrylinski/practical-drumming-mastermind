import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HomeIconTile } from '../components/home/HomeIconTile'
import { Reveal } from '../components/Reveal'

const heroOutcomes = [
  'Develop better feel.',
  'Play with more confidence.',
  'Sound tighter live.',
  'Think like a professional musician.',
] as const

const lackingQualities = [
  'confidence',
  'consistency',
  'feel',
  'musical restraint',
  'professional instincts',
] as const

const mentorshipSkills = [
  'lock into a groove with authority',
  'simplify your playing without losing impact',
  'make smarter musical choices',
  'improve timing and consistency',
  'sound tighter in rehearsals and live settings',
  'approach songs like a professional drummer',
  'perform with more confidence under pressure',
  'build habits that create long-term growth',
] as const

const membersGain = [
  {
    title: 'Better Feel',
    body: 'Learn how professionals create depth, space, and movement in a groove — not just speed.',
  },
  {
    title: 'More Confidence Behind the Kit',
    body: 'Develop preparation habits and performance instincts that reduce hesitation and overplaying.',
  },
  {
    title: 'Stronger Live Performance',
    body: 'Improve consistency, timing, transitions, dynamics, and the ability to stay locked in under pressure.',
  },
  {
    title: 'Professional Musical Instincts',
    body: 'Understand how experienced touring drummers think through arrangements, energy, and serving the song.',
  },
  {
    title: 'Clear Direction',
    body: 'Stop jumping between random tutorials and start progressing with intention.',
  },
  {
    title: 'A Higher Standard',
    body: 'Surround yourself with serious musicians focused on growth, discipline, and mastery.',
  },
] as const

const experienceItems = [
  {
    title: 'Live Mentorship Sessions',
    body: 'Direct conversations, demonstrations, critiques, and Q&A with Mike Malinin.',
  },
  {
    title: 'Performance Reviews',
    body: 'Personalized feedback to improve timing, groove, consistency, musicality, and confidence.',
  },
  {
    title: 'Studio Notes',
    body: 'Lessons pulled directly from touring, recording, songwriting, rehearsals, and live performance.',
  },
  {
    title: 'The Inner Circle',
    body: 'A curated community of drummers committed to improving at a serious level.',
  },
] as const

const whoFor = [
  'want to sound more professional',
  'feel stuck despite years of practice',
  'want direct feedback from a proven touring drummer',
  'care about musicality more than flashy chops',
  'want to improve their live performance',
  'are serious about long-term growth',
] as const

const differencePoints = [
  'how to perform under arena-level pressure',
  'how to maintain consistency night after night',
  'how to make audiences feel something',
  'how to build a decades-long career in music',
] as const

const primaryBtnClass =
  'inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-7 font-garamond text-xs tracking-[0.18em] uppercase text-void transition hover:bg-gold/90'

const ghostBtnClass =
  'inline-flex min-h-11 items-center justify-center rounded-full px-6 font-garamond text-xs tracking-[0.16em] uppercase text-gold ring-1 ring-gold/30 transition hover:bg-gold/10 hover:text-mist'

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
}: {
  children: ReactNode
  className?: string
  alt?: boolean
}) {
  return (
    <section
      className={`border-t border-white/[0.06] px-5 py-14 md:px-8 md:py-16 lg:py-20 ${
        alt ? 'bg-charcoal/35' : 'bg-void'
      } ${className}`}
    >
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  )
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}) {
  const alignClass = align === 'center' ? 'mx-auto max-w-3xl text-center' : 'text-center lg:max-w-2xl lg:text-left'

  return (
    <Reveal className={alignClass}>
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
    </Reveal>
  )
}

function BulletList({ items, compact = false }: { items: readonly string[]; compact?: boolean }) {
  return (
    <ul className={compact ? 'space-y-2.5' : 'space-y-3'}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold/90" aria-hidden />
          <p className="font-garamond text-sm leading-relaxed text-mist/75 md:text-base">{item}</p>
        </li>
      ))}
    </ul>
  )
}

function PosterPanel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative flex h-full min-h-[16rem] flex-col justify-center overflow-hidden border border-gold/25 bg-charcoal/55 p-8 md:min-h-[18rem] md:p-10 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gold/[0.06] to-transparent"
        aria-hidden
      />
      <div className="relative">{children}</div>
    </div>
  )
}

function FeatureCard({
  title,
  body,
  className = '',
  bebasTitle = false,
}: {
  title: string
  body: string
  className?: string
  bebasTitle?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-charcoal/40 p-6 ring-1 ring-white/[0.04] md:p-7 ${className}`}
    >
      <h3
        className={
          bebasTitle
            ? 'font-bebas text-xl tracking-wide text-gold md:text-2xl'
            : 'font-garamond text-lg text-mist md:text-xl'
        }
      >
        {title}
      </h3>
      <p className="mt-2.5 font-garamond text-sm leading-relaxed text-mist/65 md:text-base">{body}</p>
    </div>
  )
}

export function HomePage() {
  return (
    <div className="bg-void">
      {/* Hero */}
      <section className="relative flex min-h-[calc(100svh-4.5rem)] flex-col overflow-hidden border-b border-white/[0.06] bg-void md:min-h-[calc(100svh-5rem)]">
        <div
          className="absolute inset-0 bg-cover bg-center hero-kenburns"
          style={{ backgroundImage: "url('/hero-arena.png')" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-void/92 via-void/75 to-void/40 lg:via-void/65 lg:to-void/30" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-void/60 via-void/20 to-void/88" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_15%_40%,rgba(201,165,92,0.12),transparent_60%)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 grain opacity-25" aria-hidden />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 py-10 md:px-8 md:py-12 lg:py-14">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-12 xl:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="order-2 text-center lg:order-1 lg:text-left"
            >
              <p className="font-garamond text-[0.7rem] tracking-[0.32em] uppercase text-gold/80 md:text-xs">
                Mentorship with Mike Malinin
              </p>
              <h1 className="mt-3 font-bebas text-[clamp(2.75rem,7vw,4.5rem)] leading-[0.95] tracking-[0.04em] text-mist">
                Practical Drumming
              </h1>
              <p className="mx-auto mt-4 max-w-md font-garamond text-lg leading-snug text-mist/70 md:text-xl lg:mx-0 lg:max-w-lg">
                Built for drummers who want more than chops — and ready to perform at a higher level.
              </p>

              <ul className="mx-auto mt-8 grid max-w-sm grid-cols-1 gap-x-3 gap-y-3 text-left sm:max-w-lg sm:grid-cols-2 lg:mx-0 lg:max-w-xl">
                {heroOutcomes.map((line) => (
                  <li
                    key={line}
                    className="flex items-center gap-2.5 font-garamond text-base text-mist/75 md:text-lg"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold/90" aria-hidden />
                    {line}
                  </li>
                ))}
              </ul>

              <p className="mt-6 font-bebas text-lg tracking-wide text-gold md:text-xl">
                Twenty members · Direct access · Real-world musicianship
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link to="/apply" className={primaryBtnClass}>
                  Apply for Membership
                </Link>
                <Link to="/club" className={ghostBtnClass}>
                  Explore the Club
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="order-1 lg:order-2"
            >
              <div className="hero-visual relative mx-auto w-full max-w-sm lg:ml-auto lg:max-w-md">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-charcoal/80 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10 backdrop-blur-[2px] sm:aspect-[5/6]">
                  <img
                    src="/about-mike.png"
                    alt="Mike Malinin performing live on drums"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    fetchPriority="high"
                    decoding="async"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/50 via-transparent to-void/10"
                    aria-hidden
                  />
                </div>
                <p className="mt-4 text-center font-garamond text-xs tracking-[0.22em] uppercase text-mist/50 lg:text-right">
                  Mike Malinin
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Credibility */}
      <section className="relative overflow-hidden border-t border-white/[0.06]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/credibility-bg.png')" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-void/45" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-void/75 via-void/50 to-void/25" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-void/25 via-transparent to-void/55" aria-hidden />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24 lg:py-28">
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:items-start lg:gap-12 xl:gap-16">
            <SectionHeading
              eyebrow="Credibility"
              title="5 billion streams. Diamond & platinum records. Arena stages."
              subtitle="Former Goo Goo Dolls drummer — now mentoring a private group of twenty committed drummers."
            />
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6 lg:mt-0 lg:gap-8 xl:gap-10">
              <Reveal delay={0.05} className="min-w-0">
                <HomeIconTile
                  large
                  fill
                  icon="streams"
                  label="Nearly 5 billion streams across the catalog"
                />
              </Reveal>
              <Reveal delay={0.08} className="min-w-0">
                <HomeIconTile
                  large
                  fill
                  icon="records"
                  label="Diamond and multi-platinum recordings"
                />
              </Reveal>
              <Reveal delay={0.11} className="min-w-0">
                <HomeIconTile
                  large
                  fill
                  icon="arena"
                  label="Decades of arena and festival touring"
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Transformation */}
      <SectionShell>
        <Reveal className="text-center lg:max-w-none lg:text-left">
          <h2 className="font-bebas text-[clamp(1.5rem,4.2vw,3.25rem)] leading-none tracking-[0.03em] text-mist whitespace-nowrap">
            Stop sounding like you&apos;re practicing.
          </h2>
          <p className="mt-3 font-bebas text-2xl tracking-wide text-gold md:text-3xl">
            Start sounding intentional.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-2 lg:items-center lg:gap-8 xl:gap-10">
          <Reveal delay={0.04} className="h-full">
            <PosterPanel>
              <div className="space-y-6">
                <Prose>Most drummers collect techniques for years without developing:</Prose>
                <BulletList items={lackingQualities} />
                <Prose className="text-mist/80">
                  Practical Drumming builds the qualities that make people want to play with you.
                </Prose>
              </div>
            </PosterPanel>
          </Reveal>
          <Reveal delay={0.08} className="mt-0 h-full">
            <PosterPanel>
              <div className="space-y-5">
                <p className="font-bebas text-xl tracking-wide text-mist md:text-2xl">
                  Inside the mentorship
                </p>
                <BulletList items={mentorshipSkills} compact />
              </div>
            </PosterPanel>
          </Reveal>
        </div>
      </SectionShell>

      {/* What members gain */}
      <section className="relative overflow-hidden border-t border-white/[0.06]">
        <div
          className="absolute inset-0 bg-cover bg-[center_35%] bg-no-repeat"
          style={{ backgroundImage: "url('/members-gain-bg.png')" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-void/70" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-void/95 via-void/85 to-void/60" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-void/55 via-void/30 to-void/85" aria-hidden />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24 lg:py-28">
          <Reveal className="text-center lg:max-w-none lg:text-left">
            <p className="font-garamond text-[0.7rem] tracking-[0.32em] uppercase text-gold/75 md:text-xs">
              What members gain
            </p>
            <h2 className="mt-2 font-bebas text-[clamp(1.5rem,4.2vw,3.25rem)] leading-none tracking-[0.03em] text-mist">
              The difference
            </h2>
            <p className="mt-3 font-bebas text-2xl tracking-wide text-gold md:text-3xl">people hear immediately.</p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:gap-5">
            {membersGain.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.04}>
                <FeatureCard
                  title={item.title}
                  body={item.body}
                  bebasTitle
                  className="border-white/10 bg-charcoal/75 backdrop-blur-sm"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <SectionShell>
        <SectionHeading
          eyebrow="The experience"
          title="A private mentorship experience."
          subtitle="Live sessions, performance reviews, and studio insight — not passive content."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:gap-5">
          {experienceItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.04}>
              <FeatureCard title={item.title} body={item.body} bebasTitle />
            </Reveal>
          ))}
        </div>
      </SectionShell>

      {/* Who this is for */}
      <SectionShell alt>
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-14 xl:gap-20">
          <div>
            <SectionHeading eyebrow="Who this is for" title="Built for drummers ready to level up." />
            <Reveal delay={0.06} className="mt-8 space-y-6">
              <Prose>This mentorship is for musicians who:</Prose>
              <BulletList items={whoFor} />
            </Reveal>
          </div>
          <Reveal delay={0.1} className="mt-10 lg:mt-0">
            <PosterPanel>
              <div className="space-y-5">
                <p className="font-garamond text-[0.7rem] tracking-[0.32em] uppercase text-gold/75 md:text-xs">
                  The difference
                </p>
                <h3 className="font-bebas text-2xl leading-[0.95] tracking-[0.03em] text-mist md:text-3xl">
                  Information is everywhere.
                </h3>
                <p className="font-bebas text-xl tracking-wide text-gold md:text-2xl">Experience is not.</p>
                <Prose>You can learn rudiments anywhere. Very few drummers can teach:</Prose>
                <BulletList items={differencePoints} />
                <p className="font-garamond text-base italic text-mist/80 md:text-lg">
                  That level of perspective changes how you play forever.
                </p>
              </div>
            </PosterPanel>
          </Reveal>
        </div>
      </SectionShell>

      {/* Limited membership */}
      <section className="relative overflow-hidden border-t border-gold/15 px-5 py-16 md:px-8 md:py-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/limited-seating-bg.png')" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-void/88" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-void/95 via-void/80 to-void/70" aria-hidden />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="font-garamond text-[0.7rem] tracking-[0.32em] uppercase text-gold/85 md:text-xs">
              Limited membership
            </p>
            <h2 className="mt-2 font-bebas text-[clamp(2.25rem,5vw,3.5rem)] leading-[0.95] tracking-[0.03em] text-mist">
              Only 20 memberships available.
            </h2>
            <p className="mt-4 font-bebas text-lg tracking-wide text-gold md:text-xl">
              Small by design · Personal · Focused
            </p>
            <Prose className="mt-6 max-w-md text-mist/65">
              Applications are reviewed carefully to preserve the quality of the mentorship experience.
            </Prose>
          </Reveal>
          <Reveal delay={0.08} className="flex items-center justify-center">
            <Link
              to="/apply"
              className={`${primaryBtnClass} min-h-14 px-10 text-sm md:min-h-16 md:px-14 md:text-base`}
            >
              Apply for Membership
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
