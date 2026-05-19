import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CredibilityIconRow } from '../components/home/CredibilityIconRow'
import { Reveal } from '../components/Reveal'
import { SectionGridOverlay } from '../components/SectionGridOverlay'
import { pageWrapClass, SectionShell } from '../components/SectionShell'

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

const twoColClass =
  'flex flex-col items-center gap-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-10 xl:gap-12'

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
  align = 'left',
}: {
  eyebrow?: string
  title: ReactNode
  subtitle?: string
  align?: 'left' | 'center'
}) {
  const alignClass = align === 'center' ? 'w-full text-center' : 'w-full text-center lg:text-left'

  return (
    <Reveal className={alignClass}>
      {eyebrow ? (
        <p className="font-garamond text-[0.7rem] tracking-[0.32em] uppercase text-gold/75 md:text-xs">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`font-bebas text-[clamp(2rem,5vw,3.25rem)] leading-[0.95] tracking-[0.03em] ${
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

function BulletList({
  items,
  compact = false,
  centered = false,
}: {
  items: readonly string[]
  compact?: boolean
  centered?: boolean
}) {
  return (
    <ul
      className={`${compact ? 'space-y-2.5' : 'space-y-3'} ${centered ? 'mx-auto w-full max-w-sm' : ''}`}
    >
      {items.map((item) => (
        <li
          key={item}
          className={
            centered
              ? 'flex max-w-xs flex-col items-center gap-2 text-center'
              : 'flex items-start gap-3'
          }
        >
          <span
            className={`shrink-0 rounded-full bg-gold/90 ${centered ? 'h-1.5 w-1.5' : 'mt-2 h-1 w-1'}`}
            aria-hidden
          />
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
        <div className="absolute inset-0 bg-void/35" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-void/95 via-void/88 to-void/60 lg:via-void/80 lg:to-void/50" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-void/75 via-void/40 to-void/95" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_15%_40%,rgba(201,165,92,0.12),transparent_60%)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 grain opacity-25" aria-hidden />

        <div className={`relative z-10 ${pageWrapClass} flex flex-1 flex-col justify-center py-10 md:py-12 lg:py-14`}>
          <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-12 xl:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="order-2 text-center lg:order-1 lg:text-left"
            >
              <p className="font-garamond text-sm tracking-[0.26em] uppercase text-gold/85 sm:text-base md:text-lg">
                Mentorship with Mike Malinin
              </p>
              <h1 className="mt-3 font-bebas text-[clamp(2.75rem,7vw,4.5rem)] leading-[0.95] tracking-[0.04em] text-mist">
                Practical Drumming
              </h1>
              <p className="mx-auto mt-4 max-w-md font-garamond text-lg leading-snug text-mist/70 md:text-xl lg:mx-0 lg:max-w-lg">
                Built for drummers who want more than chops — and ready to perform at a higher level.
              </p>

              <ul className="mx-auto mt-8 grid max-w-sm grid-cols-1 gap-x-3 gap-y-3 sm:max-w-lg sm:grid-cols-2 lg:mx-0 lg:max-w-xl">
                {heroOutcomes.map((line) => (
                  <li
                    key={line}
                    className="flex items-center justify-center gap-2.5 font-garamond text-base text-mist/75 sm:justify-start md:text-lg lg:justify-start"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold/90" aria-hidden />
                    {line}
                  </li>
                ))}
              </ul>

              <p className="mt-6 font-bebas text-lg tracking-wide text-gold md:text-xl">
                Direct access · Real-world musicianship
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
                    src="/hero-mike-live.png"
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

        <div className={`relative z-10 ${pageWrapClass} py-14 md:py-16 lg:py-20`}>
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:items-center lg:gap-12 xl:gap-16">
            <div className="flex w-full flex-col justify-center lg:self-center">
              <SectionHeading
                eyebrow="Credibility"
                title={
                  <>
                    5 billion streams. Diamond &amp; platinum records.{' '}
                    <span className="text-gold">The world&apos;s biggest stages.</span>
                  </>
                }
                subtitle="Former Goo Goo Dolls / Tanya Tucker drummer — now mentoring a private group of committed drummers."
              />
            </div>
            <CredibilityIconRow />
          </div>
        </div>
      </section>

      {/* Transformation */}
      <SectionShell>
        <Reveal className="flex w-full flex-col items-center">
          <header className="flex w-full flex-col items-center text-center">
            <h2 className="w-full text-balance font-bebas text-[clamp(2.35rem,6.5vw,3.25rem)] leading-[0.95] tracking-[0.03em]">
              <span className="block text-mist">Stop sounding like you&apos;re practicing.</span>
              <span className="mt-0.5 block text-gold">Start sounding intentional.</span>
            </h2>
          </header>
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
        <div className="absolute inset-0 bg-void/45" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-void/75 via-void/55 to-void/35" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-void/35 via-void/15 to-void/55" aria-hidden />

        <div className={`relative z-10 ${pageWrapClass} py-14 md:py-16 lg:py-20`}>
          <Reveal className="w-full text-center lg:text-left">
            <p className="font-garamond text-[0.7rem] tracking-[0.32em] uppercase text-gold/75 md:text-xs">
              What members gain
            </p>
            <h2 className="mt-2 font-bebas text-[clamp(2.35rem,6.5vw,3.25rem)] leading-[0.95] tracking-[0.03em]">
              <span className="text-mist">The difference </span>
              <span className="text-gold">people hear immediately.</span>
            </h2>
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
          title={
            <>
              <span className="text-mist">A private </span>
              <span className="text-gold">mentorship</span>
              <span className="text-mist">.</span>
            </>
          }
          subtitle="Live sessions, performance reviews, and studio insight — not passive content."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:gap-5">
          {experienceItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.04}>
              <FeatureCard title={item.title} body={item.body} bebasTitle />
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.12} className="mt-12 lg:mt-14">
          <figure>
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] shadow-[inset_0_1px_0_rgba(201,165,92,0.08)] ring-1 ring-white/[0.04]">
              <img
                src="/mentorship-session.png"
                alt="Mike Malinin mentoring a drummer one-on-one in the studio"
                className="aspect-[16/10] w-full object-cover object-center sm:aspect-[2/1]"
                loading="lazy"
                decoding="async"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/45 via-transparent to-void/10"
                aria-hidden
              />
            </div>
            <figcaption className="mt-3 text-center font-garamond text-sm italic text-mist/45">
              One-on-one mentorship in the studio
            </figcaption>
          </figure>
        </Reveal>
      </SectionShell>

      {/* Who this is for */}
      <SectionShell alt>
        <div className={twoColClass}>
          <div className="w-full">
            <SectionHeading
              eyebrow="Who this is for"
              title={
                <>
                  Built for drummers ready to <span className="text-gold">level up.</span>
                </>
              }
            />
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
                <p className="font-bebas text-2xl leading-[0.95] tracking-[0.03em] text-mist md:text-3xl">
                  Information is everywhere.
                </p>
                <p className="font-bebas text-2xl leading-[0.95] tracking-[0.03em] text-gold md:text-3xl">
                  Experience is not.
                </p>
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
      <section className="relative overflow-hidden border-t border-gold/15 bg-charcoal/25 py-14 md:py-16 lg:py-20">
        <SectionGridOverlay />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_50%,rgba(201,165,92,0.08),transparent_65%)]"
          aria-hidden
        />
        <div className={`relative z-10 ${pageWrapClass}`}>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
            <Reveal className="order-2 lg:order-1">
              <figure className="mx-auto w-full">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)] ring-1 ring-gold/15">
                  <img
                    src="/cta-poster.png"
                    alt="Practical Drumming poster in a backstage hallway leading to the arena"
                    className="aspect-[4/3] w-full object-cover object-[center_42%] sm:aspect-[5/4]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/40 via-transparent to-void/15"
                    aria-hidden
                  />
                </div>
                <figcaption className="mt-4 text-center font-garamond text-xs tracking-[0.22em] uppercase text-mist/45">
                  Practical. Playable. Real-world drumming.
                </figcaption>
              </figure>
            </Reveal>

            <div className="order-1 flex flex-col items-center gap-8 text-center lg:order-2 lg:items-start lg:text-left">
              <Reveal className="flex w-full flex-col items-center lg:items-start">
                <p className="font-garamond text-[0.7rem] tracking-[0.32em] uppercase text-gold/85 md:text-xs">
                  Limited membership
                </p>
                <h2 className="mt-2 font-bebas text-[clamp(2.25rem,5vw,3.5rem)] leading-[0.95] tracking-[0.03em] text-mist">
                  Limited mentorships available.
                </h2>
                <p className="mt-4 font-bebas text-lg tracking-wide text-gold md:text-xl">
                  Small by design · Personal · Focused
                </p>
                <Prose className="mt-6 text-mist/65">
                  Applications are reviewed carefully to preserve the quality of the mentorship
                  experience.
                </Prose>
              </Reveal>
              <Reveal delay={0.08}>
                <Link
                  to="/apply"
                  className={`${primaryBtnClass} min-h-14 px-10 text-sm md:min-h-16 md:px-14 md:text-base`}
                >
                  Apply for Membership
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
