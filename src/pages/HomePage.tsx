import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Reveal } from '../components/Reveal'

function StatIcon({ name }: { name: 'md' | 'kit' | 'globe' | 'stage' }) {
  const common = 'h-6 w-6'
  switch (name) {
    case 'md':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path
            fill="currentColor"
            d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm-3.6 14V8h1.9l1.7 3.2L13.7 8h1.9v8h-1.7V11.4l-1.4 2.6h-1l-1.4-2.6V16Z"
          />
        </svg>
      )
    case 'kit':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path
            fill="currentColor"
            d="M6 7a2 2 0 1 1 4 0v1h4V7a2 2 0 1 1 4 0v1h2v2h-1v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-8H4V8h2Zm1 3v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8H7Z"
          />
        </svg>
      )
    case 'globe':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path
            fill="currentColor"
            d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm7.9 9h-3.4a16 16 0 0 0-1.2-5 8.03 8.03 0 0 1 4.6 5ZM12 4c.9 0 2.3 2.1 3 7H9c.7-4.9 2.1-7 3-7ZM4.1 11a8.03 8.03 0 0 1 4.6-5 16 16 0 0 0-1.2 5Zm0 2H7.5a16 16 0 0 0 1.2 5 8.03 8.03 0 0 1-4.6-5Zm4.4 0H15c-.7 4.9-2.1 7-3 7s-2.3-2.1-3-7Zm7.8 5a16 16 0 0 0 1.2-5h3.4a8.03 8.03 0 0 1-4.6 5Z"
          />
        </svg>
      )
    case 'stage':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path
            fill="currentColor"
            d="M3 18v-2l9-5 9 5v2l-9-5-9 5Zm2 3v-2h2v2H5Zm12 0v-2h2v2h-2ZM9 21v-4h6v4h-2v-2h-2v2H9Z"
          />
        </svg>
      )
  }
}

const stats = [
  { icon: 'md', title: 'Modern Drummer cover artist', sub: 'Credibility & craft' },
  { icon: 'kit', title: 'Former drummer for Goo Goo Dolls', sub: 'Song-first arena work' },
  { icon: 'globe', title: '30+ years touring & recording', sub: 'Global stages, real rooms' },
  { icon: 'stage', title: "Played the world’s biggest venues", sub: 'Prestige + pressure tested' },
] as const

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

export function HomePage() {
  return (
    <div className="bg-void">
      {/* Hero */}
      <section className="relative min-h-[100svh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center hero-kenburns"
          style={{ backgroundImage: "url('/hero-mike.png')" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/95 via-void/45 to-void" />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/75 to-transparent" />
        <div
          className="absolute right-0 top-0 h-[70%] w-1/2 bg-gradient-to-l from-gold/14 to-transparent blur-3xl"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-24 md:px-8 md:pb-20 md:pt-24">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="font-garamond text-[0.7rem] tracking-[0.45em] uppercase text-mist/55 md:text-xs"
            >
              30+ years. Thousands of shows. The biggest stages in the world.
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.7 }}
              className="mt-6 font-garamond text-[clamp(3.25rem,9.5vw,6.5rem)] leading-[0.92] tracking-[0.06em] text-gold/85"
              style={{ textShadow: '0 0 90px rgba(201,165,92,0.10)' }}
            >
              MIKE
              <br />
              MALININ
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.32, duration: 0.6 }}
              className="mt-4"
            >
              <p className="font-bebas text-4xl tracking-[0.12em] text-mist md:text-5xl">
                PRACTICAL DRUMMING
              </p>
              <div className="mt-3 flex items-center gap-4">
                <span className="gold-line hidden sm:block" />
                <p className="font-garamond text-base tracking-[0.32em] text-gold md:text-lg">
                  MASTERMIND CLUB
                </p>
                <span className="gold-line-r hidden sm:block" />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.42, duration: 0.6 }}
              className="mt-8 max-w-xl font-garamond text-base leading-relaxed text-mist/70 md:text-lg"
            >
              A one-year live program for adult drummers who want to perform with confidence.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52, duration: 0.55 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                to="/apply"
                className="inline-flex min-h-12 items-center justify-center border border-gold/50 bg-gold/10 px-8 font-garamond text-xs tracking-[0.22em] uppercase text-gold backdrop-blur-sm transition hover:border-gold hover:bg-gold/20"
              >
                Apply for Membership
              </Link>
              <Link
                to="/club"
                className="inline-flex min-h-12 items-center justify-center border border-white/15 px-8 font-garamond text-xs tracking-[0.22em] uppercase text-mist/80 transition hover:border-gold/40 hover:text-mist"
              >
                Learn More
              </Link>
            </motion.div>
          </div>

          <div className="mt-14 grid gap-4 border-t border-white/[0.06] pt-10 md:mt-16 md:grid-cols-4 md:gap-5">
            {stats.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.62 + i * 0.05, duration: 0.45 }}
                className="relative overflow-hidden border border-white/[0.07] bg-charcoal/55 px-5 py-5"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gold/10 blur-2xl" />
                <div className="flex items-start gap-3 text-gold/80">
                  <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/25 bg-gold/5">
                    <StatIcon name={s.icon} />
                  </span>
                  <div>
                    <p className="font-garamond text-xs tracking-[0.26em] uppercase text-mist/55">
                      {s.sub}
                    </p>
                    <p className="mt-1 font-garamond text-sm leading-snug text-mist/80">
                      {s.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Poster-style panels */}
      <section className="border-t border-white/[0.06] bg-void px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="relative overflow-hidden border border-gold/25 bg-charcoal/55 p-8">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gold/[0.06] to-transparent" />
              <p className="relative font-garamond text-xs uppercase tracking-[0.32em] text-gold-dim">
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
              <p className="relative font-garamond text-xs uppercase tracking-[0.32em] text-gold-dim">
                The 4 phases of your development
              </p>
              <ol className="relative mt-8 space-y-7">
                {phases.map((p) => (
                  <li key={p.n} className="flex gap-5">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-gold/5 font-garamond text-lg text-gold">
                      {p.n}
                    </div>
                    <div className="border-b border-white/[0.06] pb-6">
                      <p className="font-bebas text-2xl tracking-[0.12em] text-mist">
                        {p.title}
                      </p>
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

      {/* Scarcity */}
      <section className="relative overflow-hidden border-t border-gold/20 px-5 py-28 md:px-8 md:py-36">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gold/[0.07] to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="font-garamond text-xs tracking-[0.4em] uppercase text-gold">
              Limited membership
            </p>
            <h2 className="mt-6 font-bebas text-[clamp(2.75rem,8vw,5.5rem)] leading-none tracking-wide text-mist">
              ONLY 20 MEMBERS
              <br />
              ACCEPTED
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-10 font-garamond text-lg text-mist/65 md:text-xl">
            <p>
              A supportive community of dedicated, driven drummers with two collaboration calls per
              week.
            </p>
            <p className="mt-4 text-gold/90">Applications are reviewed individually.</p>
          </Reveal>
          <Reveal delay={0.15} className="mt-12">
            <Link
              to="/apply"
              className="inline-flex min-h-12 items-center justify-center border border-gold bg-gold/15 px-12 font-garamond text-xs tracking-[0.28em] uppercase text-gold transition hover:bg-gold/25"
            >
              Apply Now
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
