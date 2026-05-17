import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Reveal } from '../components/Reveal'

function StatIcon({
  name,
}: {
  name: 'diamond' | 'streams' | 'grammy' | 'film' | 'arena'
}) {
  const common = 'h-6 w-6'
  switch (name) {
    case 'diamond':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path
            fill="currentColor"
            d="M12 2 4 9l8 13 8-13-8-7Zm0 4.2 4.8 7.8H7.2L12 6.2Zm-5.4 9 5.4 8.8 5.4-8.8H6.6Z"
          />
        </svg>
      )
    case 'streams':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path
            fill="currentColor"
            d="M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7V3Zm0 4a5 5 0 1 0 5 5h-2a3 3 0 1 1-3-3V7Zm0 4a1 1 0 1 0 1 1 1 1 0 0 0-1-1Z"
          />
        </svg>
      )
    case 'grammy':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path
            fill="currentColor"
            d="M8 3h8l1 3h4v4l-3 1 2 8-5 3-5-3 2-8-3-1V6H8V3Zm4 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
          />
        </svg>
      )
    case 'film':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path
            fill="currentColor"
            d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 4v2h3V9H4Zm5 0v2h3V9H9Zm5 0v2h3V9h-3ZM4 13v2h3v-2H4Zm5 0v2h3v-2H9Zm5 0v2h3v-2h-3Z"
          />
        </svg>
      )
    case 'arena':
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path
            fill="currentColor"
            d="M12 2 2 7v2l10 5 10-5V7L12 2Zm-8 9v2l8 4 8-4v-2l-8 4-8-4Zm0 5v2l8 4 8-4v-2l-8 4-8-4Z"
          />
        </svg>
      )
  }
}

const stats = [
  { icon: 'diamond', title: 'Diamond & Multi-Platinum Records' },
  { icon: 'streams', title: 'Nearly 5 Billion Streams' },
  { icon: 'grammy', title: 'Grammy Nominated' },
  { icon: 'film', title: 'Songs in Major Films' },
  { icon: 'arena', title: 'Played Arenas & Festivals' },
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
      <section className="relative h-[100svh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-[center_42%] hero-kenburns"
          style={{ backgroundImage: "url('/hero-arena.png')" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/90 via-void/45 to-void" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/95 via-void/75 to-transparent md:from-void/80 md:via-void/40 md:to-void/80" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.9]"
          style={{
            background:
              'radial-gradient(720px 480px at 50% 22%, rgba(201,165,92,0.22), transparent 58%), radial-gradient(900px 520px at 50% 55%, rgba(5,5,5,0.35), transparent 70%)',
          }}
          aria-hidden
        />
        <div
          className="absolute right-0 top-0 hidden h-[70%] w-1/2 bg-gradient-to-l from-gold/14 to-transparent blur-3xl md:left-1/2 md:right-auto md:block md:-translate-x-1/2"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 -180px 220px rgba(5,5,5,0.92)',
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pb-12 pt-20 md:justify-center md:px-8 md:pb-0 md:pt-0">
          <div className="mx-auto w-full max-w-6xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="font-garamond text-[0.7rem] tracking-[0.45em] uppercase text-mist/55 md:text-xs"
            >
              30+ years. Thousands of shows. Millions of fans. The biggest stages in the world.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.65 }}
              className="mt-6"
            >
              <p
                className="whitespace-nowrap font-bebas text-[clamp(1.15rem,9.5vw,6.5rem)] leading-none tracking-[0.06em] text-mist"
                style={{ textShadow: '0 0 80px rgba(201,165,92,0.12)' }}
              >
                PRACTICAL DRUMMING
              </p>
              <div className="mt-4 flex items-center justify-center gap-4 md:mt-5">
                <span className="gold-line hidden sm:block" />
                <p className="font-garamond text-lg tracking-[0.34em] text-gold md:text-2xl">
                  MASTERMIND CLUB
                </p>
                <span className="gold-line-r hidden sm:block" />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mx-auto mt-8 max-w-xl font-garamond text-base leading-relaxed text-mist/70 md:text-lg"
            >
              A one-year live program for adult drummers who want to perform with confidence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.55 }}
              className="mt-10 flex flex-col items-center gap-6"
            >
              <span
                className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-gold/50 to-transparent md:max-w-sm"
                aria-hidden
              />
              <div className="flex flex-wrap justify-center gap-4">
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
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] bg-charcoal/40 px-5 py-10 md:px-8 md:py-12">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <p className="font-garamond text-sm tracking-[0.22em] uppercase text-mist/55 md:text-base">
            A curated mentorship by
          </p>
          <span
            className="mx-auto mt-3 block h-px w-20 bg-gradient-to-r from-transparent via-gold/55 to-transparent md:mt-4 md:w-28"
            aria-hidden
          />
          <p className="mt-3 font-garamond text-xl tracking-[0.28em] uppercase text-gold/85 md:mt-4 md:text-2xl">
            Mike Malinin
          </p>
        </Reveal>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-5">
          {stats.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ delay: i * 0.05, duration: 0.45 }}
              className="relative flex min-h-[9.5rem] flex-col items-center justify-center overflow-hidden border border-white/[0.07] bg-charcoal/55 px-5 py-6"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gold/10 blur-2xl" />
              <div className="relative flex flex-col items-center justify-center gap-3 text-center text-gold/80">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gold/5">
                  <StatIcon name={s.icon} />
                </span>
                <p className="max-w-[12rem] font-bebas text-base leading-tight tracking-[0.08em] text-mist/90 md:text-lg">
                  {s.title}
                </p>
              </div>
            </motion.div>
          ))}
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
      <section className="relative flex min-h-[32rem] items-center justify-center overflow-hidden border-t border-gold/20 px-5 py-28 md:min-h-[36rem] md:px-8 md:py-36">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/limited-seating-bg.png')",
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-void/85" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-void via-void/70 to-void/90" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(900px 480px at 50% 50%, rgba(201,165,92,0.12), transparent 60%)',
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
          <Reveal>
            <p className="font-garamond text-xs tracking-[0.4em] uppercase text-gold">
              Limited membership
            </p>
            <h2 className="mt-6 whitespace-nowrap font-bebas text-[clamp(1.35rem,5.5vw,5.5rem)] leading-none tracking-wide text-mist">
              ONLY 20 MEMBERS ACCEPTED
            </h2>
            <span
              className="mx-auto mt-6 block h-px w-20 bg-gradient-to-r from-transparent via-gold/55 to-transparent md:mt-8 md:w-28"
              aria-hidden
            />
          </Reveal>
          <Reveal delay={0.1} className="mt-8 font-garamond text-lg text-mist/65 md:mt-10 md:text-xl">
            <p>
              A supportive community of dedicated, driven drummers with two collaboration calls per
              week.
            </p>
            <p className="mt-4 text-gold/90">Applications are reviewed individually.</p>
          </Reveal>
          <Reveal delay={0.15} className="mt-12 flex justify-center">
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
