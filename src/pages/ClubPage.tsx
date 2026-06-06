import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ClubAnimatedBackground } from '../components/club/ClubAnimatedBackground'
import { ClubBenefitsBackground } from '../components/club/ClubBenefitsBackground'
import { ClubCtaAnimation } from '../components/club/ClubCtaAnimation'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import { pageWrapClass, SectionShell } from '../components/SectionShell'

const clubBenefits: { title: string; body: ReactNode }[] = [
  {
    title: 'Weekly Live Mastermind Calls',
    body: 'Structured group sessions led by Mike (and guest pros) where members bring real questions—gig prep, technique roadblocks, career decisions, recording mindset, and band dynamics.',
  },
  {
    title: 'Video Feedback Channel',
    body: 'Post playing clips and get direct critique on groove, feel, dynamics, and musical choices—not generic “sounds good” comments from strangers.',
  },
  {
    title: 'Session Vault & Replays',
    body: 'Every call is recorded and archived so you can revisit breakdowns, guest interviews, and member discussions on your own schedule.',
  },
  {
    title: 'Private Member Community',
    body: 'A closed space for committed drummers only—no algorithm noise, no posturing. Share wins, ask for help, and stay accountable between live sessions.',
  },
  {
    title: 'Guest Pros & Deep Dives',
    body: 'Periodic sessions with touring and session players who share how they actually prepare, tour, record, and survive in the industry.',
  },
  {
    title: 'Ongoing Mentorship, Not a Course',
    body: 'Membership stays active as your goals change. You’re in the room week after week—not buying a module and moving on.',
  },
]

const sessionTopics = [
  'Groove, pocket, and feel in real band contexts',
  'Dynamics, tone, and musical decision-making behind the kit',
  'Preparing for gigs, auditions, and studio dates',
  'Touring, recording, and working with artists and producers',
  'Mindset, confidence, and performing under pressure',
  'Building a sustainable career as a working drummer',
] as const

const whoItsFor = [
  'You practice seriously but lack consistent feedback from players above your level',
  'You want honest critique—not another playlist of isolated licks',
  'You’re aiming at gigs, sessions, or a full-time music path and need industry reality, not hype',
  'You value showing up live, asking questions, and contributing—not binge-watching lessons alone',
] as const

const primaryBtnClass =
  'inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-7 font-garamond text-xs tracking-[0.18em] uppercase text-void transition hover:bg-gold/90'

const ghostBtnClass =
  'inline-flex min-h-11 items-center justify-center rounded-full px-6 font-garamond text-xs tracking-[0.16em] uppercase text-gold ring-1 ring-gold/30 transition hover:bg-gold/10 hover:text-mist'

const portraitSizeClass = 'mx-auto w-full max-w-[15rem] sm:max-w-[16rem] lg:max-w-[17rem]'

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
  align?: 'left' | 'center' | 'right'
}) {
  const alignClass =
    align === 'center'
      ? 'w-full text-center'
      : align === 'right'
        ? 'w-full text-center lg:text-right'
        : 'w-full text-center lg:text-left'

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

function BenefitCard({ title, body }: { title: string; body: ReactNode }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-charcoal/45 p-6 ring-1 ring-white/[0.04] backdrop-blur-md md:p-7">
      <h3 className="font-bebas text-xl tracking-wide text-gold md:text-2xl">{title}</h3>
      <p className="mt-2.5 font-garamond text-sm leading-relaxed text-mist/65 md:text-base">{body}</p>
    </div>
  )
}

function BulletList({
  items,
  compact = false,
}: {
  items: readonly string[]
  compact?: boolean
}) {
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

export function ClubPage() {
  return (
    <article className="bg-void">
      <Seo
        title="The Mastermind Club"
        description="Inside the Practical Drumming Mastermind Club: weekly live calls, video feedback, a private community, and direct mentorship from Mike Malinin."
        canonicalPath="/club"
      />
      {/* Hero — club-specific, not home repeat */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div
          className="absolute inset-0 bg-cover bg-[center_45%] bg-no-repeat hero-kenburns"
          style={{ backgroundImage: "url('/club-hero-field.png')" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-void/40" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-void/75 via-void/45 to-void/80" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-void/55 via-void/35 to-void/65" aria-hidden />
        <div className="pointer-events-none absolute inset-0 grain opacity-15" aria-hidden />

        <div className={`relative z-10 ${pageWrapClass} pb-16 pt-16 md:pb-20 md:pt-20 lg:pb-24 lg:pt-24`}>
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="font-garamond text-[0.7rem] tracking-[0.32em] uppercase text-gold/75 md:text-xs">
              Membership
            </p>
            <h1 className="mt-4 font-bebas text-[clamp(2.25rem,6vw,4rem)] leading-[0.95] tracking-[0.04em] text-mist">
              Inside the{' '}
              <span className="text-gold">Mastermind Club</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl font-garamond text-lg leading-relaxed text-mist/75 md:text-xl">
              Practical Drumming is a private mastermind led by{' '}
              <Link to="/about" className="text-gold underline decoration-gold/35 underline-offset-2 transition hover:text-mist">
                Mike Malinin
              </Link>
              —a live weekly room where serious drummers get mentorship, honest critique, and professional
              conversation you won&apos;t find on YouTube.
            </p>
            <p className="mx-auto mt-5 max-w-xl font-garamond text-base leading-relaxed text-mist/60 md:text-lg">
              Mike facilitates every mastermind session, bringing decades of touring, recording, and industry
              experience into a membership built for drummers who show up ready to grow.
            </p>
            <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
              <Link to="/apply" className={`${primaryBtnClass} min-h-12 px-9 text-sm md:min-h-14 md:px-12`}>
                Book a Call
              </Link>
              <Link to="/about" className={`${ghostBtnClass} min-h-12 px-8 text-sm md:px-10`}>
                About Mike
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What is a mastermind club */}
      <section className="relative overflow-hidden border-t border-white/[0.06] bg-void py-14 md:py-16 lg:pb-28 lg:pt-20">
        <ClubAnimatedBackground density="light" />
        <div className={`relative z-10 ${pageWrapClass}`}>
        <div className={twoColClass}>
          <div className="w-full">
            <SectionHeading
              eyebrow="The model"
              title={
                <>
                  What Is a <span className="text-gold">Mastermind Club?</span>
                </>
              }
              subtitle="A small group of peers learning together—with a leader who’s already walked the path."
            />
            <Reveal delay={0.06} className="mt-8 space-y-5 text-center lg:mt-10 lg:text-left">
              <Prose>
                In business, a mastermind is a curated group that meets regularly so members can share
                challenges, get perspective, and grow faster than they would alone. The facilitator keeps the
                room focused and brings experience the group can lean on.
              </Prose>
              <Prose>
                The Practical Drumming Mastermind Club applies that same idea to drumming: a limited membership,
                live weekly calls, honest feedback, and access to professionals who&apos;ve toured, recorded,
                and built real careers—not just taught online.
              </Prose>
              <p className="font-bebas text-xl tracking-wide text-gold md:text-2xl">
                It&apos;s not a video library.
                <br />
                <span className="text-mist">It&apos;s a room you show up to.</span>
              </p>
              <Prose>
                Courses deliver content once. A mastermind stays with you as your playing, gigs, and goals
                evolve—because the conversation continues every week.
              </Prose>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="flex w-full justify-center">
            <figure className="w-full max-w-lg">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-void shadow-[0_16px_48px_-16px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
                <img
                  src="/home2-mastermind-zoom.png"
                  alt="Live mastermind video call with drummers"
                  className="aspect-[4/3] w-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/40 via-transparent to-void/10"
                  aria-hidden
                />
              </div>
              <figcaption className="mt-4 text-center font-garamond text-xs tracking-[0.22em] uppercase text-mist/50 lg:text-left">
                Live group calls · Open Q&amp;A · Member participation
              </figcaption>
            </figure>
          </Reveal>
        </div>
        </div>
      </section>

      {/* How the club runs */}
      <SectionShell alt>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <Reveal className="h-full">
            <div className="flex h-full flex-col justify-center rounded-2xl border border-gold/25 bg-charcoal/55 p-8 md:p-10">
              <SectionHeading eyebrow="How it works" title="What Membership Looks Like Week to Week" />
              <div className="mt-6 space-y-5">
                <Prose>
                  <strong className="font-medium text-mist/85">Live call.</strong> Members join a weekly
                  mastermind session—camera optional, questions encouraged. Mike leads deep dives, answers
                  member submissions, and hosts guest pros when scheduled.
                </Prose>
                <Prose>
                  <strong className="font-medium text-mist/85">Between sessions.</strong> Use the private
                  community to share clips, get feedback, and stay connected with players who are working at
                  a high level—not chasing likes.
                </Prose>
                <Prose>
                  <strong className="font-medium text-mist/85">Anytime access.</strong> Replays and past
                  sessions live in the member vault so you can catch up or review a topic when it matters to
                  your playing right now.
                </Prose>
                <Prose className="text-mist/65">
                  New members are welcomed on a short onboarding call so you know how to participate from day
                  one. Membership stays active month to month while you&apos;re in the club.
                </Prose>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.06} className="h-full">
            <div className="flex h-full flex-col justify-center rounded-2xl border border-white/10 bg-charcoal/40 p-8 md:p-10">
              <p className="font-bebas text-xl tracking-wide text-mist md:text-2xl">Topics we dig into together</p>
              <p className="mt-2 font-garamond text-sm text-mist/55 md:text-base">
                Sessions follow what members need—not a fixed syllabus that ignores your real life behind the
                kit.
              </p>
              <div className="mt-6">
                <BulletList items={sessionTopics} />
              </div>
            </div>
          </Reveal>
        </div>
      </SectionShell>

      {/* Member benefits — club-specific detail */}
      <section className="relative overflow-hidden border-t border-white/[0.06] bg-void">
        <ClubBenefitsBackground />

        <div className={`relative z-10 ${pageWrapClass} py-14 md:py-16 lg:py-20`}>
          <SectionHeading
            eyebrow="Member benefits"
            title="What You Get as a Member"
            subtitle="Concrete access—not a vague promise to “level up.”"
            align="center"
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:gap-5">
            {clubBenefits.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.04}>
                <BenefitCard title={item.title} body={item.body} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for + club photo */}
      <SectionShell>
        <div className={twoColClass}>
          <Reveal delay={0.1} className="order-2 flex w-full justify-center lg:order-1">
            <figure className="w-full max-w-lg">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-void shadow-[0_16px_48px_-16px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
                <img
                  src="/club-inside-membership.png"
                  alt="Drummers in a live mastermind session"
                  className="aspect-[4/3] w-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/40 via-transparent to-void/10"
                  aria-hidden
                />
              </div>
            </figure>
          </Reveal>
          <div className="order-1 w-full lg:order-2">
            <SectionHeading
              eyebrow="Fit"
              title="Who the Club Is Built For"
              subtitle="Membership is selective so the room stays serious and useful for everyone in it."
            />
            <Reveal delay={0.06} className="mt-8 lg:mt-10">
              <BulletList items={whoItsFor} />
              <Prose className="mt-6">
                If you&apos;re looking for a cheap library of random lessons, this isn&apos;t it. If you want a
                consistent place to improve with direct access to pros and peers who care about your
                progress—that&apos;s the club.
              </Prose>
            </Reveal>
          </div>
        </div>
      </SectionShell>

      {/* Mike as club leader — brief, links to about */}
      <SectionShell alt>
        <div className={twoColClass}>
          <div className="w-full">
            <SectionHeading
              eyebrow="Your host"
              title={
                <>
                  Led by <span className="text-gold">Mike Malinin</span>
                </>
              }
              subtitle="Mike facilitates every mastermind session and sets the tone for the room."
            />
            <Reveal delay={0.06} className="mt-8 space-y-5 text-center lg:mt-10 lg:text-left">
              <Prose>
                Members work directly with Mike on weekly calls—bringing real playing, real questions, and real
                career goals. He draws on decades of arena touring, platinum records, studio work, and teaching
                to give feedback that holds up on stage and in the booth.
              </Prose>
              <Prose>
                Guest drummers join when the group needs a specific perspective (touring, sessions, genres,
                business). The club is built around Mike&apos;s network and standards—not a rotating cast of
                anonymous instructors.
              </Prose>
              <p className="pt-1">
                <Link
                  to="/about"
                  className="inline-flex font-garamond text-xs tracking-[0.22em] uppercase text-gold underline decoration-gold/35 underline-offset-4 transition hover:text-mist"
                >
                  Full bio &amp; background
                </Link>
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="flex w-full justify-center">
            <figure className={portraitSizeClass}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/10 bg-charcoal/80 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10 backdrop-blur-sm">
                <img
                  src="/about-mike-tanya.png"
                  alt="Mike Malinin behind the drum kit for Tanya Tucker"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/50 via-transparent to-void/10"
                  aria-hidden
                />
              </div>
            </figure>
          </Reveal>
        </div>
      </SectionShell>

      {/* Culture in the room — unique to club page */}
      <SectionShell className="overflow-hidden py-16 md:py-20 lg:py-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,rgba(201,165,92,0.14),transparent_65%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <SectionHeading
            eyebrow="The room"
            title="How We Show Up Together"
            align="center"
          />
          <Reveal delay={0.06} className="mt-10 space-y-5 lg:mt-12">
            <Prose>
              Masterminds only work when people participate honestly. In this club, that means asking the
              question you&apos;d hesitate to post publicly, sharing a take that isn&apos;t perfect yet, and
              giving peers the same respect you want back.
            </Prose>
            <Prose>
              Mike keeps sessions focused and constructive—no dunking, no guru worship, no pretending everyone
              is already a pro. The standard is simple: show up prepared to learn and help others improve.
            </Prose>
            <p className="font-garamond text-base italic tracking-wide text-mist md:text-lg">
              Small enough to know names. Serious enough to change how you play.
            </p>
          </Reveal>
        </div>
      </SectionShell>

      {/* CTA — club-specific */}
      <section className="relative overflow-hidden border-t border-gold/15 bg-void py-32 pb-36 md:py-44 md:pb-48 lg:py-52 lg:pb-56">
        <div className={`relative z-10 ${pageWrapClass}`}>
          <div className={twoColClass}>
            <Reveal delay={0.1} className="order-2 flex w-full items-center justify-center lg:order-1">
              <ClubCtaAnimation />
            </Reveal>

            <div className="order-1 w-full lg:order-2">
              <SectionHeading
                eyebrow="Next step"
                title="See If the Club Is Right for You"
              />
              <Reveal delay={0.06} className="mt-8 space-y-5 text-center lg:mt-10 lg:text-left">
                <Prose>
                  We keep membership capped so live sessions stay interactive and the community stays tight.
                  Book a short call to talk through your goals, how the mastermind runs, and whether this is
                  the right fit before you join.
                </Prose>
                <Prose className="text-mist/65">
                  No pressure to enroll on the spot—the call is to make sure you&apos;re stepping into the
                  right room.
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
                  Limited membership · Application required
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}
