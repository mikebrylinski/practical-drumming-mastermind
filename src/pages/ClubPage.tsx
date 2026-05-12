import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'

const pillars = [
  {
    title: 'Band-ready musicianship',
    body: 'Geared toward adult drum set players mastering the art of performing in band situations—ideas that focus on musicality and confidence, not isolation exercises.',
  },
  {
    title: 'Performance over drill fatigue',
    body: 'Focuses on what helps you master performing on drum set instead of endless technique-only work with no practical application.',
  },
  {
    title: 'Songs, parts, people, poise',
    body: 'Methods for approaching a song, composing parts, performing with others, and building confidence so you command the instrument in real rooms.',
  },
  {
    title: 'The mindset of great band drummers',
    body: 'Trains members to understand how successful drummers think in band situations—and how to apply that mindset to their own playing.',
  },
  {
    title: 'Led by Mike Malinin',
    body: 'Mike shares decades of knowledge from 30+ years of recording and touring the world with the Goo Goo Dolls, Tanya Tucker, and others—on some of the biggest and most prestigious stages for live music.',
  },
  {
    title: 'Grow with your peers',
    body: 'Learn from other members on the same journey and grow together as drummers—a fun group with no egos or attitudes, just players helping each other become experts at the craft.',
  },
]

const phases = [
  {
    n: '01',
    title: 'Essential Basics',
    subtitle: 'Phase 1',
    body: 'Understand the process of making musical decisions and actually function as a drummer—not just hit drums.',
  },
  {
    n: '02',
    title: 'Technique and Tone',
    subtitle: 'Phase 2',
    body: 'Produce a controlled, professional sound without relying only on volume or force.',
  },
  {
    n: '03',
    title: 'Mental Confidence',
    subtitle: 'Phase 3',
    body: 'Play with certainty, stay locked in, and stop second-guessing yourself.',
  },
  {
    n: '04',
    title: 'Objective Listening and Thinking',
    subtitle: 'Phase 4',
    body: 'Identify what works, fix what doesn’t, and improve your playing with direction and clarity—consistently.',
  },
]

export function ClubPage() {
  return (
    <article className="relative">
      <section className="border-b border-white/[0.06] px-5 pb-20 pt-16 md:px-8 md:pb-28 md:pt-20">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <p className="font-garamond text-xs tracking-[0.35em] uppercase text-gold-dim">
              Practical Drumming
            </p>
            <h1 className="mt-4 font-bebas text-[clamp(2.75rem,8vw,5rem)] leading-[0.95] tracking-wide text-mist md:text-7xl">
              A mastermind club for
              <br />
              serious band drummers
            </h1>
          </Reveal>
          <Reveal delay={0.06} className="mt-8 max-w-3xl">
            <p className="font-garamond text-xl leading-relaxed text-mist/75 md:text-2xl">
              Adult drum set players, mastering musicality and confidence in real band situations—not
              another technique treadmill.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-charcoal/40 px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-4xl space-y-12">
          <Reveal>
            <h2 className="font-bebas text-4xl tracking-wide text-mist md:text-5xl">What this is</h2>
            <p className="mt-4 font-garamond text-lg text-mist/55 md:text-xl">
              Six commitments define the circle.
            </p>
          </Reveal>
          <div className="space-y-10">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.04}>
                <div className="border-l border-gold/35 pl-8 md:pl-10">
                  <h3 className="font-garamond text-xl text-gold md:text-2xl">{p.title}</h3>
                  <p className="mt-3 font-garamond text-lg leading-relaxed text-mist/70 md:text-xl">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <h2 className="font-bebas text-4xl tracking-wide text-mist md:text-5xl">
              Here’s how it works
            </h2>
            <p className="mt-4 max-w-2xl font-garamond text-lg text-mist/60 md:text-xl">
              A clear arc from musical decisions to tone, confidence, and ongoing improvement.
            </p>
          </Reveal>
          <ol className="mt-16 space-y-0">
            {phases.map((phase, i) => (
              <Reveal key={phase.n} delay={i * 0.06}>
                <li className="grid gap-6 border-t border-white/[0.08] py-10 md:grid-cols-[auto_1fr] md:gap-12 md:py-12">
                  <div className="font-bebas text-5xl leading-none text-gold/50 md:text-6xl">
                    {phase.n}
                  </div>
                  <div>
                    <p className="font-garamond text-xs tracking-[0.3em] uppercase text-gold-dim">
                      {phase.subtitle}
                    </p>
                    <h3 className="mt-2 font-bebas text-3xl tracking-wide text-mist md:text-4xl">
                      {phase.title}
                    </h3>
                    <p className="mt-4 font-garamond text-lg leading-relaxed text-mist/70 md:text-xl">
                      {phase.body}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-smoke/30 px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <h2 className="font-bebas text-4xl tracking-wide text-mist md:text-5xl">
              Community & rhythm of the week
            </h2>
          </Reveal>
          <ul className="mt-12 space-y-8">
            <Reveal delay={0.04}>
              <li className="flex gap-4">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <p className="font-garamond text-lg leading-relaxed text-mist/75 md:text-xl">
                  A supportive community of dedicated, driven, like-minded drummers—all working
                  toward the same goals.
                </p>
              </li>
            </Reveal>
            <Reveal delay={0.08}>
              <li className="flex gap-4">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <p className="font-garamond text-lg leading-relaxed text-mist/75 md:text-xl">
                  Two collaboration calls each week to work together, get feedback, and stay clear
                  on how to improve your playing.
                </p>
              </li>
            </Reveal>
          </ul>
        </div>
      </section>

      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="font-garamond text-xs tracking-[0.35em] uppercase text-gold">Member cap</p>
            <p className="mt-6 font-bebas text-4xl tracking-wide text-mist md:text-5xl">
              Initial limit: 20 drummers
            </p>
            <p className="mt-6 font-garamond text-lg text-mist/60 md:text-xl">
              A curated size so every member gets room to grow—and real attention.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-12">
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
