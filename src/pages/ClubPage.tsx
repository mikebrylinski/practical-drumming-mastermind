import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ImagePlaceholder } from '../components/ImagePlaceholder'
import { Reveal } from '../components/Reveal'

const mastermindBullets = [
  'Geared towards adult drum set players mastering the art of performing in band situations using ideas focusing on musicality and confidence.',
  'Focuses on elements to help master performing on drum set instead of endless exercises focused solely on technique with no practical applications.',
  'Teaches methods on how to approach playing a song, composing parts, performing with others, and having confidence leading to full command of the instrument.',
  'Trains members to understand the mindset of great drummers who have had success playing in band situations and learning to apply that knowledge.',
  'Run by Mike Malinin, sharing knowledge gained from 30+ years of recording and touring the world with The Goo Goo Dolls, Tanya Tucker and others.',
  'Focuses on learning from other members who are on the same journey and growing together as drummers.',
  'A fun group of fellow drummers. No egos or attitudes. Just players helping each other improve and become experts at their craft.',
] as const

const phases = [
  {
    n: '1',
    title: 'Essential Basics',
    body: 'Understand the process of making musical decisions and actually function as a drummer, not just hit drums.',
  },
  {
    n: '2',
    title: 'Technique & Tone',
    body: 'Produce a controlled, professional sound without relying only on volume or force.',
  },
  {
    n: '3',
    title: 'Mental Confidence',
    body: 'Play with certainty, stay locked in, and stop second-guessing yourself.',
  },
  {
    n: '4',
    title: 'Objective Listening & Thinking',
    body: 'Identify what works, fix what doesn’t, and consistently improve with direction and clarity.',
  },
] as const

const mikeCredentials = [
  'Toured arenas worldwide',
  'Performed in front of millions',
  'Recorded platinum-selling music',
  'Worked inside the real music industry',
  'Spent decades developing practical drumming skills that actually matter on stage and in the studio',
] as const

const differentiators = [
  'Real mentorship',
  'Real accountability',
  'Real community',
  'Real musical growth',
] as const

const stopFeeling = [
  'overwhelmed',
  'inconsistent',
  'uninspired',
  'stuck in the same patterns',
] as const

const startFeeling = [
  'focused',
  'motivated',
  'creative',
  'confident behind the kit',
] as const

const insideClub = [
  {
    title: 'Weekly Mentorship & Coaching',
    body: 'Get ongoing guidance, mindset shifts, and practical drumming strategies directly from Mike.',
  },
  {
    title: 'Exclusive Training Content',
    body: 'Lessons focused on groove, musicality, creativity, performance, feel, and professional-level drumming concepts.',
  },
  {
    title: 'Community of Serious Drummers',
    body: 'Surround yourself with motivated drummers who actually want to improve and push each other forward.',
  },
  {
    title: 'Accountability & Growth',
    body: 'Stay consistent with a system designed to keep you progressing week after week.',
  },
] as const

const forYouIf = [
  'You feel stuck in your playing',
  'You’ve lost motivation practicing alone',
  'You want direction instead of random exercises',
  'You want mentorship from a top-level drummer',
  'You’re serious about improving',
  'You want to sound musical — not robotic',
  'You want to finally become confident behind the kit',
] as const

const primaryBtnClass =
  'inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-7 font-garamond text-xs tracking-[0.18em] uppercase text-void transition hover:bg-gold/90'

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
  title: ReactNode
  subtitle?: string
  align?: 'left' | 'center' | 'right'
}) {
  const alignClass =
    align === 'center'
      ? 'mx-auto max-w-3xl text-center'
      : align === 'right'
        ? 'text-center lg:ml-auto lg:max-w-2xl lg:text-right'
        : 'text-center lg:max-w-2xl lg:text-left'

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
    <ul className={`${compact ? 'space-y-2.5' : 'space-y-3'} ${centered ? 'mx-auto w-full max-w-sm' : ''}`}>
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

function HighlightBlock({
  title,
  body,
  subItems,
}: {
  title: string
  body: string
  subItems?: readonly string[]
}) {
  return (
    <div className="border-l border-gold/30 pl-6 md:pl-8">
      <h3 className="font-garamond text-lg text-gold md:text-xl">{title}</h3>
      <p className="mt-3 font-garamond text-base leading-relaxed text-mist/75 md:text-lg">{body}</p>
      {subItems ? (
        <ul className="mt-4 space-y-2 pl-1">
          {subItems.map((sub) => (
            <li key={sub} className="flex gap-3 font-garamond text-base text-mist/65 md:text-lg">
              <span className="text-gold/60">—</span>
              {sub}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export function ClubPage() {
  return (
    <article className="bg-void">

      {/* Mastermind + phases */}
      <SectionShell alt className="border-t-0 pt-16 md:pt-20 lg:pt-24">
        <Reveal className="mb-10 text-center md:mb-12 lg:text-left">
          <p className="font-garamond text-xs tracking-[0.35em] uppercase text-gold-dim">The Club</p>
          <h1 className="mt-4 font-bebas text-4xl leading-[0.95] tracking-wide text-mist md:text-5xl lg:text-6xl">
            Stop Practicing Alone.
            <br />
            <span className="text-gold">Start Playing Like a Real Drummer.</span>
          </h1>
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <Reveal className="h-full">
            <PosterPanel>
              <div className="space-y-6">
                <p className="font-bebas text-xl tracking-wide text-mist md:text-2xl">
                  Practical Drumming is a mastermind club that
                </p>
                <BulletList items={mastermindBullets} compact />
                <Prose className="text-mist/80">
                  Includes 2× weekly collaboration calls for feedback, clarity, and progress.
                </Prose>
              </div>
            </PosterPanel>
          </Reveal>
          <Reveal delay={0.06} className="h-full">
            <PosterPanel>
              <div className="space-y-5">
                <p className="font-bebas text-xl tracking-wide text-mist md:text-2xl">
                  The 4 phases of your development
                </p>
                <ol className="space-y-6">
                  {phases.map((p) => (
                    <li key={p.n} className="flex gap-4 border-b border-white/[0.06] pb-5 last:border-0 last:pb-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-gold/5 font-garamond text-lg text-gold">
                        {p.n}
                      </div>
                      <div>
                        <p className="font-bebas text-xl tracking-[0.08em] text-mist md:text-2xl">{p.title}</p>
                        <p className="mt-1.5 font-garamond text-sm leading-relaxed text-mist/70 md:text-base">
                          {p.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </PosterPanel>
          </Reveal>
        </div>
      </SectionShell>

      {/* Guidance */}
      <SectionShell>
        <Reveal className="mx-auto max-w-3xl text-center">
          <header className="space-y-4">
            <p className="font-bebas text-2xl tracking-wide text-mist md:text-3xl">
              The difference between drummers who stay stuck… and drummers who level up… is guidance.
            </p>
            <Prose>Most drummers spend years guessing.</Prose>
            <Prose className="text-mist/85">
              Inside The Club, you&apos;ll know exactly what to work on, why it matters, and how to
              improve faster.
            </Prose>
          </header>
        </Reveal>
      </SectionShell>

      {/* Image break */}
      <section className="border-t border-white/[0.06] px-5 py-10 md:px-8 md:py-14">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal>
            <ImagePlaceholder
              label=""
              aspect="wide"
              src="/about-mike-stage.png"
              alt="Mike Malinin on stage behind a drum kit"
              caption="Live mentorship from a touring professional"
            />
          </Reveal>
        </div>
      </section>

      {/* Mike */}
      <SectionShell alt>
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-14 xl:gap-20">
          <div>
            <SectionHeading
              eyebrow="Your mentor"
              title={
                <>
                  Learn From Someone Who&apos;s{' '}
                  <span className="text-gold">Actually Done It</span>
                </>
              }
            />
            <Reveal delay={0.06} className="mt-8 space-y-6">
              <Prose>
                When you join The Club, you&apos;re not learning from a random internet instructor.
              </Prose>
              <Prose>You&apos;re getting mentorship from a professional drummer who has:</Prose>
              <BulletList items={mikeCredentials} compact />
              <Prose>
                You&apos;ll gain insights most drummers never get access to — from groove, feel,
                dynamics, creativity, professionalism, touring, recording, mindset, and musical
                decision-making.
              </Prose>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="mt-10 flex justify-center lg:mt-0 lg:justify-end">
            <ImagePlaceholder
              label=""
              aspect="portrait"
              src="/about-mike-tanya.png"
              alt="Mike Malinin behind the drum kit for Tanya Tucker"
              caption="Mike Malinin — bandleader & mentor"
              className="w-full max-w-[16rem] sm:max-w-xs lg:max-w-sm"
            />
          </Reveal>
        </div>
      </SectionShell>

      {/* What makes different */}
      <SectionShell>
        <SectionHeading
          eyebrow="The difference"
          title="What Makes This Different?"
          subtitle="Most online drum programs give you information. The Club gives you transformation."
        />
        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-2 lg:gap-8">
          <Reveal delay={0.04}>
            <PosterPanel>
              <div className="space-y-5">
                <p className="font-bebas text-xl tracking-wide text-mist md:text-2xl">Built around:</p>
                <BulletList items={differentiators} compact />
                <Prose className="text-mist/80">
                  Instead of endlessly consuming videos and hoping you improve, you&apos;ll follow a
                  structured path designed to create measurable progress.
                </Prose>
              </div>
            </PosterPanel>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="grid h-full gap-6 sm:grid-cols-2 lg:grid-cols-1">
              <PosterPanel className="min-h-0">
                <div className="space-y-4">
                  <p className="font-bebas text-lg tracking-wide text-mist md:text-xl">Stop feeling:</p>
                  <BulletList items={stopFeeling} compact />
                </div>
              </PosterPanel>
              <PosterPanel className="min-h-0">
                <div className="space-y-4">
                  <p className="font-bebas text-lg tracking-wide text-gold md:text-xl">Start feeling:</p>
                  <BulletList items={startFeeling} compact />
                </div>
              </PosterPanel>
            </div>
          </Reveal>
        </div>
      </SectionShell>

      {/* Inside The Club */}
      <SectionShell alt>
        <SectionHeading
          eyebrow="Membership"
          title="Inside The Club"
          subtitle="Weekly coaching, exclusive content, and community."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-x-12 md:gap-y-10 lg:gap-x-16">
          {insideClub.map((item, i) => (
            <Reveal key={item.title} delay={0.04 + i * 0.04}>
              <HighlightBlock title={item.title} body={item.body} />
            </Reveal>
          ))}
        </div>
      </SectionShell>

      {/* For you if */}
      <SectionShell>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-14">
          <Reveal delay={0.06} className="order-2 lg:order-1">
            <BulletList items={forYouIf} />
          </Reveal>
          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="Is this for you?"
              title="This Is For You If…"
              align="right"
            />
          </div>
        </div>
      </SectionShell>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-gold/15 px-5 py-16 md:px-8 md:py-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/limited-seating-bg.png')" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-void/88" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-void/95 via-void/80 to-void/70" aria-hidden />

        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-8 px-2 text-center md:gap-10">
          <Reveal className="flex w-full flex-col items-center">
            <p className="font-garamond text-[0.7rem] tracking-[0.32em] uppercase text-gold/85 md:text-xs">
              Your next level
            </p>
            <h2 className="mt-2 font-bebas text-[clamp(2.25rem,5vw,3.5rem)] leading-[0.95] tracking-[0.03em] text-mist">
              Your Next Level Starts Here
            </h2>
            <div className="mt-6 space-y-5">
              <Prose className="text-mist/65">
                The fastest way to grow as a drummer is to learn from someone who&apos;s already walked
                the path.
              </Prose>
              <Prose className="text-mist/65">
                The Club gives you the structure, mentorship, accountability, and community to become
                the drummer you know you can be.
              </Prose>
              <p className="font-bebas text-lg tracking-wide text-gold md:text-xl">
                Join today — build real confidence, groove, and musicianship.
              </p>
            </div>
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
      </section>
    </article>
  )
}
