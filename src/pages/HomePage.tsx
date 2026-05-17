import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HomeIconBanner, HomeIconTile } from '../components/home/HomeIconTile'
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

const applyBtnClass =
  'inline-flex min-h-12 items-center justify-center border border-gold/50 bg-gold/10 px-8 font-garamond text-xs tracking-[0.22em] uppercase text-gold backdrop-blur-sm transition hover:border-gold hover:bg-gold/20'

function Prose({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-garamond text-base leading-relaxed text-mist/75 md:text-lg ${className}`}>
      {children}
    </p>
  )
}

function GoldDivider({ className = '' }: { className?: string }) {
  return (
    <span
      className={`mx-auto block h-px w-20 bg-gradient-to-r from-transparent via-gold/55 to-transparent md:w-28 ${className}`}
      aria-hidden
    />
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
      className={`border-t border-white/[0.06] px-5 py-16 md:px-8 md:py-24 ${
        alt ? 'bg-charcoal/40' : 'bg-void'
      } ${className}`}
    >
      <div className="mx-auto w-full max-w-5xl">{children}</div>
    </section>
  )
}

function SectionHeading({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <Reveal>
      {eyebrow ? (
        <p className="font-garamond text-xs tracking-[0.35em] uppercase text-gold-dim">{eyebrow}</p>
      ) : null}
      <h2
        className={`font-bebas text-3xl leading-tight tracking-wide text-mist md:text-4xl lg:text-5xl ${
          eyebrow ? 'mt-3' : ''
        }`}
      >
        {title}
      </h2>
    </Reveal>
  )
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item} className="flex gap-4">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold/80" />
          <p className="font-garamond text-base leading-relaxed text-mist/75 md:text-lg">{item}</p>
        </li>
      ))}
    </ul>
  )
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-l border-gold/35 pl-6 md:pl-8">
      <h3 className="font-garamond text-lg text-gold md:text-xl">{title}</h3>
      <p className="mt-3 font-garamond text-base leading-relaxed text-mist/70 md:text-lg">{body}</p>
    </div>
  )
}

export function HomePage() {
  return (
    <div className="bg-void">
      {/* Hero */}
      <section className="relative min-h-[100svh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-[center_42%] hero-kenburns"
          style={{ backgroundImage: "url('/hero-arena.png')" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/92 via-void/55 to-void" />
        <motion.div className="absolute inset-0 bg-gradient-to-r from-void/95 via-void/70 to-void/95 md:from-void/85 md:via-void/45 md:to-void/85" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(720px 480px at 50% 28%, rgba(201,165,92,0.2), transparent 58%)',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 -180px 220px rgba(5,5,5,0.92)',
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 py-24 md:px-8">
          <div className="mx-auto w-full max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.65 }}
            >
              <p
                className="font-bebas text-[clamp(2.5rem,10vw,5.5rem)] leading-none tracking-[0.06em] text-mist"
                style={{ textShadow: '0 0 80px rgba(201,165,92,0.12)' }}
              >
                Practical Drumming
              </p>
              <p className="mt-6 font-garamond text-sm tracking-[0.28em] uppercase text-mist/55 md:text-base">
                Mentorship by
              </p>
              <GoldDivider className="mt-4" />
              <p className="mt-4 font-garamond text-xl tracking-[0.2em] uppercase text-gold md:text-2xl">
                Mike Malinin
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.22, duration: 0.55 }}
              className="mx-auto mt-10 max-w-xl font-garamond text-lg text-mist/80 md:text-xl"
            >
              Built for drummers who want more than chops.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.55 }}
              className="mx-auto mt-8 max-w-md space-y-2"
            >
              {heroOutcomes.map((line) => (
                <li key={line} className="font-bebas text-lg tracking-wide text-mist/90 md:text-xl">
                  {line}
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38, duration: 0.55 }}
              className="mx-auto mt-10 max-w-2xl space-y-6"
            >
              <Prose className="text-mist/75">
                This is a curated mentorship experience designed to help serious drummers close the
                gap between practicing… and performing at a higher level.
              </Prose>
              <p className="font-garamond text-sm tracking-[0.22em] uppercase text-gold/90 md:text-base">
                Twenty members.
                <br />
                Direct access.
                <br />
                Real-world musicianship.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.55 }}
              className="mt-12 flex flex-col items-center gap-6"
            >
              <GoldDivider />
              <Link to="/apply" className={applyBtnClass}>
                Apply for Membership
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-t border-white/[0.06] bg-charcoal/40 px-5 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <div className="space-y-3 font-bebas text-xl tracking-wide text-mist/90 md:text-2xl">
              <p>Billion-stream catalog.</p>
              <p>Multi-platinum recordings.</p>
              <p>Decades of arena touring.</p>
            </div>
            <p className="mt-8 font-garamond text-base tracking-[0.18em] uppercase text-gold/85 md:text-lg">
              One direct line into the mindset behind it.
            </p>
            <GoldDivider className="mt-8" />
            <div className="mt-8 space-y-3">
              <p className="font-garamond text-lg text-mist/75 md:text-xl">
                Former drummer of Goo Goo Dolls.
              </p>
              <p className="font-garamond text-lg text-mist/75 md:text-xl">
                Now mentoring a small private group of committed drummers.
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-lg grid-cols-3 gap-6 md:gap-10">
              <Reveal delay={0.06}>
                <HomeIconTile icon="catalog" label="Catalog" />
              </Reveal>
              <Reveal delay={0.1}>
                <HomeIconTile icon="arena" label="Arena tours" />
              </Reveal>
              <Reveal delay={0.14}>
                <HomeIconTile icon="mentorship" label="Mentorship" />
              </Reveal>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Transformation */}
      <SectionShell>
        <SectionHeading title="Stop sounding like you’re practicing." />
        <Reveal delay={0.04} className="mt-4">
          <p className="font-bebas text-2xl tracking-wide text-gold md:text-3xl">
            Start sounding intentional.
          </p>
        </Reveal>
        <Reveal delay={0.08} className="mt-10 space-y-6">
          <Prose>
            Most drummers spend years collecting techniques without ever developing:
          </Prose>
          <BulletList items={lackingQualities} />
          <Prose className="text-mist/85">
            Practical Drumming helps members develop the qualities that actually make people want to
            play with you.
          </Prose>
        </Reveal>
        <Reveal delay={0.1} className="my-12">
          <HomeIconBanner icon="groove" label="Groove & feel" />
        </Reveal>
        <Reveal delay={0.12} className="mt-12">
          <p className="font-garamond text-base text-gold/90 md:text-lg">
            Inside the mentorship, you&apos;ll learn how to:
          </p>
          <div className="mt-6">
            <BulletList items={mentorshipSkills} />
          </div>
        </Reveal>
      </SectionShell>

      {/* What members gain */}
      <SectionShell alt>
        <SectionHeading eyebrow="What members gain" title="The difference people hear immediately." />
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {membersGain.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.04}>
              <FeatureCard title={item.title} body={item.body} />
            </Reveal>
          ))}
        </div>
        <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-5 md:mt-16 md:grid-cols-4 md:gap-6">
          <Reveal delay={0.08}>
            <HomeIconTile fill icon="feel" label="Feel" />
          </Reveal>
          <Reveal delay={0.12}>
            <HomeIconTile fill icon="confidence" label="Confidence" />
          </Reveal>
          <Reveal delay={0.16}>
            <HomeIconTile fill icon="live" label="Live performance" />
          </Reveal>
          <Reveal delay={0.2}>
            <HomeIconTile fill icon="musicianship" label="Musicianship" />
          </Reveal>
        </div>
      </SectionShell>

      {/* Experience */}
      <SectionShell>
        <SectionHeading eyebrow="The experience" title="A private mentorship experience." />
        <Reveal delay={0.04} className="mt-10">
          <HomeIconBanner icon="session" label="Mentorship session" aspect="landscape" />
        </Reveal>
        <div className="mt-12 space-y-10">
          {experienceItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <FeatureCard title={item.title} body={item.body} />
            </Reveal>
          ))}
        </div>
      </SectionShell>

      {/* Who this is for */}
      <SectionShell alt>
        <SectionHeading eyebrow="Who this is for" title="Built for drummers ready to level up." />
        <Reveal delay={0.06} className="mt-10 space-y-8">
          <Prose>This mentorship is for musicians who:</Prose>
          <BulletList items={whoFor} />
          <Prose className="text-mist/85">This is not passive content consumption.</Prose>
          <p className="font-bebas text-2xl tracking-wide text-gold md:text-3xl">
            It&apos;s active development.
          </p>
        </Reveal>
        <div className="mx-auto mt-12 flex max-w-md justify-center gap-10 md:gap-14">
          <Reveal delay={0.1}>
            <HomeIconTile icon="practice" label="Practice" />
          </Reveal>
          <Reveal delay={0.14}>
            <HomeIconTile icon="performance" label="Performance" />
          </Reveal>
        </div>
      </SectionShell>

      {/* Difference */}
      <SectionShell>
        <SectionHeading eyebrow="The difference" title="Information is everywhere." />
        <Reveal delay={0.04} className="mt-4">
          <p className="font-bebas text-2xl tracking-wide text-mist md:text-3xl">Experience is not.</p>
        </Reveal>
        <Reveal delay={0.08} className="mt-10 space-y-6">
          <Prose>You can learn rudiments anywhere.</Prose>
          <Prose>But very few drummers can teach:</Prose>
          <BulletList items={differencePoints} />
          <p className="font-garamond text-lg italic text-mist/80 md:text-xl">
            That level of perspective changes how you play forever.
          </p>
        </Reveal>
        <Reveal delay={0.12} className="mt-12">
          <HomeIconBanner icon="touring" label="Touring perspective" />
        </Reveal>
      </SectionShell>

      {/* Limited membership */}
      <section className="relative flex min-h-[32rem] items-center justify-center overflow-hidden border-t border-gold/20 px-5 py-28 md:min-h-[36rem] md:px-8 md:py-36">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/limited-seating-bg.png')" }}
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
            <h2 className="mt-6 font-bebas text-4xl leading-none tracking-wide text-mist md:text-5xl lg:text-6xl">
              Only 20 memberships available.
            </h2>
            <GoldDivider className="mt-8" />
          </Reveal>
          <Reveal delay={0.08} className="mt-8 space-y-2 font-garamond text-lg tracking-[0.12em] text-mist/80 md:text-xl">
            <p>Small by design.</p>
            <p>Personal by design.</p>
            <p>Focused by design.</p>
          </Reveal>
          <Reveal delay={0.12} className="mt-8">
            <Prose className="text-mist/70">
              Applications are reviewed carefully to preserve the quality of the mentorship
              experience.
            </Prose>
          </Reveal>
          <Reveal delay={0.16} className="mt-12 flex justify-center">
            <Link
              to="/apply"
              className="inline-flex min-h-12 items-center justify-center border border-gold bg-gold/15 px-12 font-garamond text-xs tracking-[0.28em] uppercase text-gold transition hover:bg-gold/25"
            >
              Apply for Membership
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Final */}
      <section className="border-t border-white/[0.06] bg-charcoal/40 px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal className="space-y-8">
            <Prose className="text-lg text-mist/85 md:text-xl">
              Becoming a better drummer changes more than your playing.
            </Prose>
            <motion.div className="space-y-2 font-garamond text-lg text-mist/75 md:text-xl">
              <p>You perform differently.</p>
              <p>You listen differently.</p>
              <p>You carry yourself differently.</p>
            </motion.div>
            <p className="font-bebas text-2xl tracking-wide text-gold md:text-3xl">And people notice.</p>
            <GoldDivider />
            <div className="pt-4">
              <p className="font-bebas text-3xl tracking-[0.06em] text-mist md:text-4xl">
                Practical Drumming
              </p>
              <p className="mt-3 font-garamond text-sm tracking-[0.32em] uppercase text-mist/50">
                With
              </p>
              <p className="mt-2 font-garamond text-xl tracking-[0.16em] uppercase text-gold md:text-2xl">
                Mike Malinin
              </p>
            </div>
            <p className="font-garamond text-base tracking-[0.2em] uppercase text-mist/60 md:text-lg">
              For drummers ready to raise their standard.
            </p>
            <div className="pt-4">
              <Link to="/club" className="font-garamond text-xs tracking-[0.22em] uppercase text-mist/50 transition hover:text-gold">
                Explore The Club →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
