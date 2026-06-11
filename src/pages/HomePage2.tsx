import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ClubCtaAnimation } from '../components/club/ClubCtaAnimation'
import { HeroVideoPopup } from '../components/hero/HeroVideoPopup'
import { JoinClubBackground } from '../components/JoinClubBackground'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import { pageWrapClass, SectionShell } from '../components/SectionShell'

const inlineLinkClass =
  'text-gold underline decoration-gold/35 underline-offset-2 transition hover:text-mist'

const memberFeatures: { title: string; body: ReactNode }[] = [
  {
    title: 'Live Weekly Mastermind Sessions',
    body: 'Join interactive group calls featuring deep dives into technique, touring, recording, mindset, creativity, career growth, and professional insight.',
  },
  {
    title: 'Direct Access To Legendary Players',
    body: (
      <>
        Learn directly from elite touring and recording drummers including{' '}
        <Link to="/about" className={inlineLinkClass}>
          Mike Malinin
        </Link>{' '}
        and other respected professionals.
      </>
    ),
  },
  {
    title: 'Real Feedback & Critique',
    body: 'Submit videos, ask questions, and receive honest feedback designed to accelerate growth.',
  },
  {
    title: 'Private Community',
    body: 'Surround yourself with committed drummers focused on improving together—not competing for attention online.',
  },
  {
    title: 'Session Replays & Archives',
    body: 'Access an expanding vault of conversations, breakdowns, lessons, and member discussions.',
  },
  {
    title: 'Career & Industry Insight',
    body: 'Learn the realities of touring, recording, networking, auditions, preparation, professionalism, and long-term growth from musicians who’ve lived it.',
  },
]

const primaryBtnClass =
  'inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-7 font-garamond text-xs tracking-[0.18em] uppercase text-void transition hover:bg-gold/90'

const ghostBtnClass =
  'inline-flex min-h-11 items-center justify-center rounded-full px-6 font-garamond text-xs tracking-[0.16em] uppercase text-gold ring-1 ring-gold/30 transition hover:bg-gold/10 hover:text-mist'

const heroBtnSize =
  'min-h-12 px-9 text-sm md:min-h-14 md:px-12 md:text-base'

const twoColClass =
  'flex flex-col items-center gap-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-10 xl:gap-12'

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

function FeatureCard({ title, body }: { title: string; body: ReactNode }) {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-charcoal/75 p-6 text-center ring-1 ring-white/[0.04] backdrop-blur-sm md:p-7">
      <h3 className="font-bebas text-xl tracking-wide text-gold md:text-2xl">{title}</h3>
      <p className="mt-2.5 font-garamond text-sm leading-relaxed text-mist/65 md:text-base">{body}</p>
    </div>
  )
}

export function HomePage2() {
  return (
    <div className="bg-void">
      <Seo
        title="Drumming Mastermind with Mike Malinin"
        description="Practical Drumming Mastermind Club — live weekly mentorship with Mike Malinin, former Goo Goo Dolls drummer. Technique, touring, recording, and career growth for serious drummers."
        canonicalPath="/"
      />
      {/* Hero — two-column, matches Home */}
      <section className="relative flex min-h-[calc(100svh-4.5rem)] flex-col overflow-hidden border-b border-white/[0.06] bg-void md:min-h-[calc(100svh-5rem)]">
        <div
          className="absolute inset-0 bg-cover bg-center hero-kenburns"
          style={{ backgroundImage: "url('/home2-hero-bg.png')" }}
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

        <div
          className={`relative z-10 ${pageWrapClass} flex flex-1 flex-col justify-center py-12 pb-16 max-md:px-6 md:py-12 lg:py-14`}
        >
          <div className="grid w-full items-center gap-12 max-lg:gap-y-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-12 xl:gap-16">
            <motion.div
              initial={{ opacity: 1, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative order-2 px-1 pt-2 text-center sm:px-2 lg:order-1 lg:px-0 lg:pt-0 lg:text-left"
            >
              <img
                src="/logo-dd-footer.png"
                alt=""
                width={320}
                height={320}
                className="pointer-events-none absolute left-1/2 top-[42%] z-0 h-56 w-56 -translate-x-1/2 -translate-y-1/2 opacity-10 mix-blend-lighten sm:h-64 sm:w-64 lg:left-[18%] lg:top-1/2 lg:h-72 lg:w-72 lg:translate-x-0"
                aria-hidden
              />
              <div className="relative z-10">
              <h1 className="font-bebas text-[clamp(2.5rem,6.5vw,4.25rem)] leading-[0.95] tracking-[0.04em] text-mist">
                Where Serious Drummers{' '}
                <span className="text-gold">Level Up Together.</span>
              </h1>

              <p className="mx-auto mt-5 max-w-2xl font-garamond text-lg leading-snug text-mist/75 md:text-xl lg:mx-0">
                Practical Drumming is a private mastermind club where aspiring and professional drummers
                connect directly with legendary players for live mentorship, feedback, and unfiltered industry
                insight.
              </p>

              <div className="mx-auto mt-8 max-w-xl space-y-4 text-center sm:max-w-2xl lg:mx-0 lg:text-left">
                <Prose className="text-mist/65">
                  Doctors have residencies.
                  <br />
                  Executives have masterminds.
                  <br />
                  Elite musicians need communities like this.
                </Prose>
                <p className="font-bebas text-xl leading-tight tracking-wide text-gold sm:text-2xl md:text-3xl">
                  The goal isn&apos;t more information.
                  <br />
                  <span className="text-mist">It&apos;s transformation through proximity.</span>
                </p>
              </div>

              <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
                <Link to="/apply" className={`${primaryBtnClass} ${heroBtnSize}`}>
                  Book a Call
                </Link>
                <Link to="/club" className={`${ghostBtnClass} ${heroBtnSize}`}>
                  Explore Membership
                </Link>
              </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 1, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="order-1 lg:order-2"
            >
              <HeroVideoPopup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* What this really is */}
      <SectionShell className="lg:pt-28 lg:pb-40 xl:pt-32 xl:pb-48">
        <div className={twoColClass}>
          <Reveal
            delay={0.1}
            className="order-2 flex w-full max-w-lg justify-center lg:order-1 lg:max-w-none lg:justify-start"
          >
            <figure className="w-full">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-void shadow-[0_24px_80px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
                <img
                  src="/home2-mastermind-zoom.png"
                  alt="Live mastermind video session with drummers on a group call"
                  className="aspect-[4/3] w-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/30 via-transparent to-transparent"
                  aria-hidden
                />
              </div>
              <figcaption className="mt-4 text-center font-garamond text-xs tracking-[0.22em] uppercase text-mist/50 lg:text-left">
                Live weekly sessions
              </figcaption>
            </figure>
          </Reveal>
          <div className="order-1 w-full lg:order-2">
            <SectionHeading
              eyebrow="What this really is"
              title={
                <>
                  <span className="text-mist">More Than Lessons.</span>
                  <br />
                  <span className="text-gold">A Professional Growth Community.</span>
                </>
              }
            />
            <Reveal delay={0.06} className="mt-8 space-y-5 text-center lg:mt-10 lg:text-left">
              <Prose>Most online drum education stops at technique.</Prose>
              <p className="font-bebas text-xl tracking-wide text-gold md:text-2xl">
                Practical Drumming goes deeper.
              </p>
              <Prose>
                This mastermind club was built to give serious drummers access to the conversations,
                mentorship, critiques, mindset shifts, and professional experiences that normally stay hidden
                behind years of touring and industry relationships.
              </Prose>
              <Prose className="text-mist/80">
                Members don&apos;t just watch content.
                <br />
                They participate.
              </Prose>
              <Prose>
                Weekly live sessions create an environment where players can ask questions, share challenges,
                receive feedback, and learn directly from professionals who&apos;ve spent decades performing,
                recording, teaching, and navigating the music industry.
              </Prose>
              <p className="font-garamond text-base italic text-mist/80 md:text-lg">
                This is about becoming the kind of musician people want to work with.
              </p>
              <p className="pt-2">
                <Link
                  to="/club"
                  className="inline-flex font-garamond text-xs tracking-[0.22em] uppercase text-gold underline decoration-gold/35 underline-offset-4 transition hover:text-mist"
                >
                  Learn more
                </Link>
              </p>
            </Reveal>
          </div>
        </div>
      </SectionShell>

      {/* Feature grid */}
      <section className="relative overflow-hidden border-t border-white/[0.06]">
        <div
          className="absolute inset-0 bg-cover bg-[center_35%] bg-no-repeat"
          style={{ backgroundImage: "url('/home2-membership-bg.png')" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-void/45" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-void/75 via-void/55 to-void/35" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-void/35 via-void/15 to-void/55" aria-hidden />

        <div className={`relative z-10 ${pageWrapClass} py-14 md:py-16 lg:py-20`}>
          <Reveal className="w-full text-center">
            <p className="font-garamond text-[0.7rem] tracking-[0.32em] uppercase text-gold/75 md:text-xs">
              Membership
            </p>
            <h2 className="mt-2 font-bebas text-[clamp(2.35rem,6.5vw,3.25rem)] leading-[0.95] tracking-[0.03em] text-mist">
              What Members Get Access To
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5">
            {memberFeatures.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.04}>
                <FeatureCard title={item.title} body={item.body} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why this works */}
      <SectionShell alt className="lg:py-28 xl:py-32">
        <div className={twoColClass}>
          <div className="w-full">
            <SectionHeading
              eyebrow="Why this works"
              title="Why Most Drummers Stay Stuck"
            />
            <Reveal delay={0.06} className="mt-8 space-y-5 text-center lg:mt-10 lg:text-left">
              <Prose>
                The internet gives drummers unlimited information.
                <br />
                But very little guidance.
              </Prose>
              <Prose>
                Most players spend years bouncing between random tutorials, social media clips, and
                disconnected advice without ever developing real mentorship, accountability, or professional
                perspective.
              </Prose>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="flex w-full flex-col items-center space-y-6 text-center">
            <figure className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-void shadow-[0_16px_48px_-16px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
                <img
                  src="/home2-hero-bg.png"
                  alt=""
                  className="aspect-[4/3] w-full object-cover object-center sm:aspect-[16/10]"
                  loading="lazy"
                  decoding="async"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/40 via-transparent to-void/10"
                  aria-hidden
                />
              </div>
            </figure>
            <p className="font-bebas text-xl tracking-wide text-gold md:text-2xl">
              Growth accelerates when you consistently put yourself around people operating at a{' '}
              <span className="text-mist">higher level</span>.
            </p>
            <p className="font-garamond text-base italic leading-relaxed text-mist/80 md:text-lg">
              That&apos;s what Practical Drumming was built to create.
            </p>
            <p className="font-bebas text-lg tracking-wide text-mist md:text-xl">
              Not passive content consumption.
              <br />
              <span className="text-gold">A high-level environment.</span>
            </p>
          </Reveal>
        </div>
      </SectionShell>

      {/* Community / culture */}
      <SectionShell className="overflow-hidden py-16 pb-20 md:py-20 md:pb-24 lg:py-32 xl:py-36">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,rgba(201,165,92,0.14),transparent_65%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <img
            src="/logo-dd-footer.png"
            alt=""
            width={320}
            height={320}
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-56 w-56 -translate-x-1/2 -translate-y-1/2 opacity-10 mix-blend-lighten sm:h-64 sm:w-64 md:h-72 md:w-72"
            aria-hidden
          />
          <div className="relative z-10">
            <SectionHeading
              eyebrow="Community"
              title={
                <>
                  Built Around Community, <span className="text-gold">Not Ego.</span>
                </>
              }
              align="center"
            />
            <Reveal delay={0.06} className="mt-10 space-y-5 lg:mt-12">
              <p className="font-bebas text-xl tracking-wide text-gold md:text-2xl">
                The best musicians never stop learning.
              </p>
              <Prose>
                Inside Practical Drumming, members share ideas, ask questions, support each other, and gain
                insight from players with real-world experience across touring, recording, live performance,
                and professional music careers.
              </Prose>
              <p className="font-garamond text-base italic tracking-wide text-mist md:text-lg">
                {['Collaborative.', 'Focused.', 'Honest.'].map((word, i) => (
                  <span key={word}>
                    {i > 0 ? ' ' : null}
                    {word}
                  </span>
                ))}
              </p>
            </Reveal>
          </div>
        </div>
      </SectionShell>

      {/* Final CTA */}
      <section className="relative overflow-hidden border-t border-gold/15 bg-void py-32 pb-36 md:py-44 md:pb-48 lg:py-52 lg:pb-56 xl:py-60 xl:pb-64">
        <JoinClubBackground />
        <div className={`relative z-10 ${pageWrapClass}`}>
          <div className={twoColClass}>
            <Reveal delay={0.1} className="order-1 flex w-full items-center justify-center lg:order-1">
              <ClubCtaAnimation />
            </Reveal>
            <div className="order-2 w-full lg:order-2">
              <SectionHeading
                eyebrow="Join the club"
                title="Get In The Right Environment."
              />
              <Reveal delay={0.06} className="mt-8 space-y-5 text-center lg:mt-10 lg:text-left">
                <Prose>
                  The fastest growth happens when you consistently surround yourself with serious people,
                  honest feedback, and experienced mentorship.
                </Prose>
                <Prose>Practical Drumming was built to create that environment.</Prose>
                <Prose className="text-mist/65">
                  Membership is intentionally limited to maintain the quality of discussion, interaction, and
                  community.
                </Prose>
              </Reveal>
              <Reveal delay={0.1} className="mt-10 flex flex-col items-center gap-5 lg:items-start">
                <Link
                  to="/apply"
                  className={`${primaryBtnClass} min-h-14 px-10 text-sm md:min-h-16 md:px-14 md:text-base`}
                >
                  Book a Call
                </Link>
                <p className="text-center font-garamond text-sm italic text-mist/50 md:text-base lg:text-left">
                  See if Practical Drumming is the right fit for your goals.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
