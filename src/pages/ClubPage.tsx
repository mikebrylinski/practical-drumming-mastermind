import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
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

const designedToHelp = [
  'Play with more confidence and control',
  'Break through frustrating plateaus',
  'Build real musicality — not just chops',
  'Develop professional habits and mindset',
  'Learn how great drummers actually think',
  'Stay motivated and consistent',
  'Get feedback, direction, and support from a real mentor',
  'Become the drummer other musicians want to play with',
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
  {
    title: 'Real-World Drumming Knowledge',
    body: 'Learn the things most drum lessons never teach:',
    subItems: [
      'playing for the song',
      'musical maturity',
      'live performance mindset',
      'industry professionalism',
      'creative decision making',
    ],
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

function SectionHeading({
  eyebrow,
  title,
  className = '',
}: {
  eyebrow?: string
  title: string
  className?: string
}) {
  return (
    <div className={className}>
      {eyebrow ? (
        <p className="font-garamond text-xs tracking-[0.32em] uppercase text-gold-dim">{eyebrow}</p>
      ) : null}
      <h2
        className={`font-bebas text-3xl tracking-wide text-mist md:text-4xl ${eyebrow ? 'mt-3' : ''}`}
      >
        {title}
      </h2>
    </div>
  )
}

function BulletList({ items, className = '' }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={`space-y-4 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-4">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold/80" />
          <p className="font-garamond text-base leading-relaxed text-mist/75 md:text-lg">{item}</p>
        </li>
      ))}
    </ul>
  )
}

function Prose({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-garamond text-base leading-relaxed text-mist/75 md:text-lg ${className}`}>
      {children}
    </p>
  )
}

export function ClubPage() {
  return (
    <article className="relative bg-void">
      {/* Hero */}
      <section className="relative min-h-[32rem] overflow-hidden border-b border-white/[0.06] px-5 pb-16 pt-16 md:min-h-[38rem] md:px-8 md:pb-24 md:pt-24">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/club-hero-bg.png')" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-void/55" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-b from-void/90 via-void/65 to-void/88"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 75% at 50% 55%, rgba(5,5,5,0.25) 0%, rgba(5,5,5,0.72) 100%)',
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto w-full max-w-5xl">
          <Reveal>
            <p className="font-garamond text-xs tracking-[0.35em] uppercase text-gold">The Club</p>
            <h1 className="mt-4 font-bebas text-4xl leading-[0.95] tracking-wide text-mist md:text-5xl lg:text-6xl">
              Stop Practicing Alone.
              <br />
              Start Playing Like a Real Drummer.
            </h1>
          </Reveal>
          <Reveal delay={0.06} className="mt-10 space-y-6">
            <Prose className="text-mist/80">
              Join an elite drumming community built for drummers who want more than random YouTube
              lessons and scattered practice routines.
            </Prose>
            <Prose className="text-mist/80">
              Inside The Club, you&apos;ll get direct mentorship, real-world guidance, accountability,
              and a proven roadmap from a professional touring drummer who&apos;s performed on some of
              the biggest stages in the world.
            </Prose>
            <Prose className="text-mist/90">
              This isn&apos;t just another drum lesson membership.
            </Prose>
          </Reveal>
        </div>
      </section>

      {/* Designed to help */}
      <section className="border-b border-white/[0.06] bg-charcoal/40 px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto w-full max-w-5xl">
          <Reveal>
            <h2 className="font-bebas text-2xl tracking-wide text-mist md:text-3xl">
              It&apos;s a mentorship experience designed to help you:
            </h2>
          </Reveal>
          <Reveal delay={0.06} className="mt-10">
            <BulletList items={designedToHelp} />
          </Reveal>
        </div>
      </section>

      {/* Mastermind + phases */}
      <section className="border-b border-white/[0.06] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="relative overflow-hidden border border-gold/25 bg-charcoal/55 p-8">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gold/[0.06] to-transparent" />
              <p className="relative font-bebas text-lg leading-tight tracking-wide text-mist md:text-xl lg:text-2xl">
                Practical Drumming is a mastermind club that
              </p>
              <ul className="relative mt-8 space-y-5">
                {mastermindBullets.map((b) => (
                  <li key={b} className="flex gap-4">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold/80" />
                    <p className="font-garamond text-base leading-relaxed text-mist/75 md:text-lg">
                      {b}
                    </p>
                  </li>
                ))}
                <li className="flex gap-4">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold/80" />
                  <p className="font-garamond text-base leading-relaxed text-mist/75 md:text-lg">
                    Includes 2x weekly collaboration calls for feedback, clarity, and progress.
                  </p>
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="relative overflow-hidden border border-gold/25 bg-charcoal/55 p-8">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gold/[0.06] to-transparent" />
              <p className="relative font-bebas text-lg leading-tight tracking-wide text-mist md:text-xl lg:text-2xl">
                The 4 phases of your development
              </p>
              <ol className="relative mt-8 space-y-7">
                {phases.map((p) => (
                  <li key={p.n} className="flex gap-5">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-gold/5 font-garamond text-lg text-gold">
                      {p.n}
                    </div>
                    <div className="border-b border-white/[0.06] pb-6">
                      <p className="font-bebas text-2xl tracking-[0.12em] text-mist">{p.title}</p>
                      <p className="mt-2 font-garamond text-base leading-relaxed text-mist/70 md:text-lg">
                        {p.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Guidance */}
      <section className="border-b border-white/[0.06] bg-charcoal/40 px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto w-full max-w-5xl space-y-8">
          <Reveal>
            <Prose className="text-lg text-mist/85 md:text-xl">
              The difference between drummers who stay stuck… and drummers who level up… is guidance.
            </Prose>
          </Reveal>
          <Reveal delay={0.04}>
            <Prose>Most drummers spend years guessing.</Prose>
          </Reveal>
          <Reveal delay={0.08}>
            <Prose>
              Inside The Club, you&apos;ll know exactly what to work on, why it matters, and how to
              improve faster.
            </Prose>
          </Reveal>
        </div>
      </section>

      {/* Mike */}
      <section className="border-b border-white/[0.06] bg-charcoal/40 px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto w-full max-w-5xl">
          <Reveal>
            <SectionHeading title="Learn From Someone Who's Actually Done It" />
            <p className="mt-6 font-garamond text-xl tracking-[0.12em] text-gold md:text-2xl">
              Mike Malinin
            </p>
          </Reveal>
          <Reveal delay={0.06} className="mt-8 space-y-6">
            <Prose>
              When you join The Club, you&apos;re not learning from a random internet instructor.
            </Prose>
            <Prose>
              You&apos;re getting mentorship from a professional drummer who has:
            </Prose>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <BulletList items={mikeCredentials} />
          </Reveal>
          <Reveal delay={0.14} className="mt-8">
            <Prose>
              You&apos;ll gain insights most drummers never get access to — from groove, feel,
              dynamics, creativity, professionalism, touring, recording, mindset, and musical
              decision-making.
            </Prose>
          </Reveal>
        </div>
      </section>

      {/* What makes different */}
      <section className="border-b border-white/[0.06] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto w-full max-w-5xl">
          <Reveal>
            <SectionHeading title="What Makes This Different?" />
          </Reveal>
          <Reveal delay={0.06} className="mt-8 space-y-6">
            <Prose className="text-lg text-mist/85 md:text-xl">
              Most online drum programs give you information.
            </Prose>
            <Prose className="text-lg text-gold/90 md:text-xl">The Club gives you transformation.</Prose>
            <Prose>This is built around:</Prose>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <BulletList items={differentiators} />
          </Reveal>
          <Reveal delay={0.14} className="mt-10 space-y-6">
            <Prose>
              Instead of endlessly consuming videos and hoping you improve, you&apos;ll follow a
              structured path designed to create measurable progress.
            </Prose>
            <Prose>You&apos;ll finally stop feeling:</Prose>
          </Reveal>
          <Reveal delay={0.18} className="mt-6">
            <BulletList items={stopFeeling} />
          </Reveal>
          <Reveal delay={0.22} className="mt-8">
            <Prose>And start feeling:</Prose>
          </Reveal>
          <Reveal delay={0.26} className="mt-6">
            <BulletList items={startFeeling} />
          </Reveal>
        </div>
      </section>

      {/* Inside The Club */}
      <section className="border-b border-white/[0.06] bg-smoke/30 px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto w-full max-w-5xl">
          <Reveal>
            <SectionHeading title="Inside The Club" />
          </Reveal>
          <div className="mt-12 space-y-10">
            {insideClub.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.04}>
                <div className="border-l border-gold/35 pl-6 md:pl-8">
                  <h3 className="font-garamond text-lg text-gold md:text-xl">{item.title}</h3>
                  <p className="mt-3 font-garamond text-base leading-relaxed text-mist/70 md:text-lg">
                    {item.body}
                  </p>
                  {'subItems' in item && item.subItems ? (
                    <ul className="mt-4 space-y-2 pl-1">
                      {item.subItems.map((sub) => (
                        <li
                          key={sub}
                          className="flex gap-3 font-garamond text-base text-mist/65 md:text-lg"
                        >
                          <span className="text-gold/60">—</span>
                          {sub}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* For you if */}
      <section className="border-b border-white/[0.06] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto w-full max-w-5xl">
          <Reveal>
            <SectionHeading title="This Is For You If…" />
          </Reveal>
          <Reveal delay={0.06} className="mt-10">
            <BulletList items={forYouIf} />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto w-full max-w-5xl text-center">
          <Reveal>
            <SectionHeading title="Your Next Level Starts Here" className="text-center" />
            <div className="mt-8 space-y-6 text-left md:text-center">
              <Prose>
                The fastest way to grow as a drummer is to learn from someone who&apos;s already walked
                the path.
              </Prose>
              <Prose>
                The Club gives you the structure, mentorship, accountability, and community to become
                the drummer you know you can be.
              </Prose>
              <Prose className="text-mist/90">
                Join today and start building real confidence, real groove, and real musicianship.
              </Prose>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="mt-12 flex justify-center">
            <Link
              to="/apply"
              className="inline-flex min-h-12 items-center justify-center border border-gold/50 bg-gold/10 px-10 font-garamond text-xs tracking-[0.22em] uppercase text-gold transition hover:border-gold hover:bg-gold/20"
            >
              Apply for membership
            </Link>
          </Reveal>
        </div>
      </section>
    </article>
  )
}
