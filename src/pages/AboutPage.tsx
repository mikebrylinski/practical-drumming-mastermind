import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CredibilityIconRow } from '../components/home/CredibilityIconRow'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import { SectionGridOverlay } from '../components/SectionGridOverlay'
import { pageWrapClass, SectionShell } from '../components/SectionShell'

const albumsPerformedOn = [
  'Dizzy Up the Girl (1998)',
  'Gutterflower (2002)',
  'Let Love In (2006)',
  'Something for the Rest of Us (2010)',
  'Magnetic (2013)',
] as const

const studentTopics = [
  'Professional touring drummer techniques',
  'Rock drumming fundamentals and advanced concepts',
  'Studio recording preparation',
  'Drum parts and song construction',
  'Music industry career development',
  'Auditions and touring opportunities',
  'Building consistency and confidence behind the kit',
] as const

const careerHighlights = [
  {
    title: 'The Pulse of a Diamond Hit',
    body: 'Malinin laid down the iconic 6/8 time signature groove for the 1998 hit “Iris.” His work on this single propelled it to an official RIAA Diamond certification (over 10 million units) and a global footprint nearing 5 billion streams across digital platforms.',
  },
  {
    title: 'Radio History Maker',
    body: 'Malinin’s drumming backed “Iris” during its historic run on the airwaves, holding the Billboard Hot 100 Airplay #1 spot for an astonishing 18 weeks—a record that stood unbroken for over two decades.',
  },
  {
    title: 'An Anchor for Multi-Platinum Eras',
    body: 'Beyond “Iris,” Malinin’s distinctive pop-rock drive powered the 5× Multi-Platinum album Dizzy Up The Girl and consecutive chart-topping alternative rock staples including “Slide” (3× Platinum) and “Black Balloon” (Platinum).',
  },
] as const

const arenaHighlights = [
  {
    title: 'Olympic Performances & Global Audiences',
    body: 'Malinin anchored massive international arena and stadium tours throughout the late ’90s and 2000s. He brought his powerful percussion directly to the global stage during the 2002 Winter Olympics in Salt Lake City, where the Goo Goo Dolls headlined a massive concert series celebrating the games.',
  },
  {
    title: 'USO Tours & Military Events',
    body: 'Malinin frequently used his platform to perform for military service members, most notably headlining a massive USO Concert for thousands of troops at the Ramstein Air Base in Germany.',
  },
  {
    title: 'Iconic Venues',
    body: 'His powerful live percussion is immortalized in several high-profile live releases, most notably the Goo Goo Dolls: Live at Red Rocks concert film filmed at the world-famous Colorado amphitheater.',
  },
] as const

const screenHighlights = [
  {
    title: 'Movie Soundtracks & Transformers',
    body: 'His drumming on “Iris” was originally commissioned for the multi-platinum movie soundtrack of the 1998 romantic drama City of Angels. Years later, Malinin provided the driving percussion for the 2007 blockbuster Transformers, recording the hit song “Before It’s Too Late (Sam and Mikaela’s Theme)” specifically as the lead emotional theme for the film’s main characters.',
  },
  {
    title: 'Late-Night & Daytime TV',
    body: 'To support major soundtrack releases like Transformers, he made dozens of television appearances performing live on foundational programs like The Tonight Show with Jay Leno, Late Show with David Letterman, and ABC’s Good Morning America in Central Park.',
  },
  {
    title: 'Pop Culture Cameos',
    body: 'Demonstrating the band’s massive household-name status during his era, Malinin also made a notable television guest appearance on Sesame Street.',
  },
] as const

const tanyaHighlights = [
  {
    title: 'The Grammy-Winning Resurgence',
    body: 'Malinin anchored the live band during Tucker’s historic 2019 career resurgence driven by the critically acclaimed album While I’m Livin’. During his tenure, Tanya Tucker won her first-ever Grammy Awards at the 2020 ceremony, taking home trophies for Best Country Album and Best Country Song (“Bring My Flowers Now”).',
  },
  {
    title: 'Historic Venues',
    body: 'As her bandleader, Malinin guided the live shows through highly celebrated performances at legendary, bucket-list venues. This included a historic, standing-room-only performance at West Hollywood’s iconic The Troubadour (which was captured for a live album release).',
  },
] as const

const primaryBtnClass =
  'inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-7 font-garamond text-xs tracking-[0.18em] uppercase text-void transition hover:bg-gold/90'

type PlaceholderAspect = 'landscape' | 'portrait'

const portraitFrameClass =
  'rounded-[1.75rem] border border-white/10 bg-charcoal/80 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10 backdrop-blur-[2px]'
const landscapeFrameClass =
  'rounded-2xl border border-white/10 bg-charcoal/80 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)] ring-1 ring-gold/15'

const twoColClass =
  'mt-8 flex flex-col items-center gap-8 text-center lg:grid lg:grid-cols-2 lg:items-center lg:gap-10 lg:text-left xl:gap-12'

const colClass = 'flex w-full flex-col items-center justify-center text-center lg:items-start lg:justify-center lg:text-left'

const portraitSizeClass = 'mx-auto w-full max-w-[13rem] sm:max-w-[14rem] lg:max-w-[15rem]'
const portraitDesktopSizeClass =
  'mx-auto w-full max-w-[14rem] sm:max-w-[16rem] lg:max-w-[22rem] xl:max-w-[28rem]'

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
  subtitleClassName = 'text-mist/65',
  center = false,
}: {
  eyebrow?: string
  title: ReactNode
  subtitle?: string
  subtitleClassName?: string
  center?: boolean
}) {
  const alignClass = center ? 'text-center' : 'text-center lg:text-left'

  return (
    <div className={`w-full ${alignClass}`}>
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
        <p className={`mt-3 font-garamond text-lg leading-snug md:text-xl ${subtitleClassName}`}>
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}

function AboutFigure({
  caption,
  aspect = 'landscape',
  className = '',
  captionCenter = false,
  src,
  alt,
}: {
  caption?: string
  aspect?: PlaceholderAspect
  className?: string
  captionCenter?: boolean
  src: string
  alt: string
}) {
  const isPortrait = aspect === 'portrait'
  const frameClass = isPortrait ? portraitFrameClass : landscapeFrameClass
  const aspectClass =
    aspect === 'portrait' ? 'aspect-[4/5] w-full' : 'aspect-[16/10] w-full sm:aspect-[2/1]'

  return (
    <figure className={className}>
      <div className={`relative overflow-hidden ${frameClass} ${aspectClass}`}>
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/50 via-transparent to-void/10"
          aria-hidden
        />
      </div>
      {caption ? (
        <figcaption
          className={`mt-3 text-center font-garamond text-xs tracking-[0.22em] uppercase text-mist/50 ${captionCenter ? '' : 'lg:text-left'}`}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

function BulletList({ items, center = false }: { items: readonly string[]; center?: boolean }) {
  return (
    <ul className={`mt-4 space-y-2.5 ${center ? 'mx-auto w-fit max-w-md' : ''}`}>
      {items.map((item) => (
        <li
          key={item}
          className={`flex gap-3 font-garamond text-base leading-relaxed text-mist/70 md:text-[1.05rem] ${
            center ? 'items-start justify-center text-left' : ''
          }`}
        >
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-charcoal/75 p-6 ring-1 ring-white/[0.04] backdrop-blur-sm md:p-7">
      <h3 className="font-bebas text-xl tracking-wide text-gold md:text-2xl">{title}</h3>
      <p className="mt-2.5 font-garamond text-sm leading-relaxed text-mist/65 md:text-base">{body}</p>
    </div>
  )
}

function HighlightGrid({
  items,
  delayStart = 0.04,
}: {
  items: readonly { title: string; body: string }[]
  delayStart?: number
}) {
  const gridCols =
    items.length === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2'

  return (
    <div className={`mt-8 grid gap-4 lg:mt-10 lg:gap-5 ${gridCols}`}>
      {items.map((item, i) => (
        <Reveal key={item.title} delay={delayStart + i * 0.04}>
          <FeatureCard title={item.title} body={item.body} />
        </Reveal>
      ))}
    </div>
  )
}

export function AboutPage() {
  return (
    <article className="bg-void">
      <Seo
        title="About Mike Malinin — Goo Goo Dolls Drummer, Mentor & Educator"
        description="Mike Malinin is an American professional drummer, recording artist, mentor, and educator — former Goo Goo Dolls drummer (1995–2013) on Iris, Slide, and platinum albums including Dizzy Up the Girl. Learn rock drumming, studio prep, and music industry career development through Practical Drumming."
        image="/about-mike-practical.png"
        canonicalPath="/about"
        type="profile"
      />
      {/* Hero — credibility from original home */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
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
            <div className="flex w-full flex-col justify-center text-center lg:self-center lg:text-left">
              <h1 className="font-bebas text-[clamp(2.75rem,7vw,4.5rem)] leading-[0.92] tracking-[0.03em] text-mist">
                About <span className="text-gold">Mike Malinin</span>
              </h1>
              <p className="mt-3 font-bebas text-[clamp(1.4rem,3.4vw,2.1rem)] leading-tight tracking-[0.02em] text-mist/90">
                5 billion streams. Diamond &amp; platinum records. The world&apos;s biggest stages.
              </p>
              <p className="mt-3 font-garamond text-lg leading-snug text-mist/65 md:text-xl">
                Professional drummer, recording artist, mentor, and educator — former Goo
                Goo Dolls drummer (1995–2013) on platinum albums, world tours, and hits like
                &ldquo;Iris&rdquo; and &ldquo;Slide,&rdquo; and drummer for Tanya Tucker
                (2016–2022).
              </p>
            </div>
            <CredibilityIconRow />
          </div>
        </div>
      </section>

      <SectionShell alt>
        <Reveal delay={0.05} className={twoColClass}>
          <div className="flex w-full flex-col items-center justify-center text-center">
            <AboutFigure
              aspect="landscape"
              src="/about-mike-practical.png"
              alt="Mike Malinin behind the drum kit"
              caption="Mike Malinin — Practical Drumming"
              captionCenter
              className="w-full max-w-md lg:max-w-none"
            />
          </div>
          <div className={`${colClass} space-y-5`}>
            <SectionHeading
              title="Mike Malinin"
              subtitle="Professional Drummer · Recording Artist · Mentor · Educator"
              subtitleClassName="text-gold"
            />
            <Prose>
              Mike Malinin is an American professional drummer, recording artist, mentor, and educator
              best known as the drummer for the Goo Goo Dolls from 1995 to 2013. During his nearly two
              decades with the band, Mike performed on some of the most successful alternative rock
              recordings of the modern era and toured internationally in front of millions of fans.
            </Prose>
            <Prose>
              Mike joined the Goo Goo Dolls during the recording of{' '}
              <em className="text-mist/85">A Boy Named Goo</em> and became an integral part of the
              band&apos;s signature sound during their most commercially successful years. He performed on
              platinum-selling albums including{' '}
              <em className="text-mist/85">Dizzy Up the Girl</em>,{' '}
              <em className="text-mist/85">Gutterflower</em>,{' '}
              <em className="text-mist/85">Let Love In</em>, and{' '}
              <em className="text-mist/85">Something for the Rest of Us</em>, helping shape hit songs
              such as &ldquo;Iris,&rdquo; &ldquo;Slide,&rdquo; &ldquo;Black Balloon,&rdquo;
              &ldquo;Broadway,&rdquo; &ldquo;Here Is Gone,&rdquo; &ldquo;Better Days,&rdquo; and many
              others.
            </Prose>
            <Prose>
              Today, Mike shares the lessons he learned from decades of recording, touring, songwriting
              collaboration, drum performance, and navigating the professional music industry. Through{' '}
              <Link to="/club" className="text-gold underline decoration-gold/35 underline-offset-2">
                Practical Drumming
              </Link>
              , students gain direct access to the experience of a drummer who has performed on
              major-label releases, world tours, television appearances, and some of the most
              recognizable rock songs of the last three decades.
            </Prose>
          </div>
        </Reveal>

        <HighlightGrid items={careerHighlights} delayStart={0.08} />
      </SectionShell>

      <SectionShell>
        <Reveal delay={0.04}>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col items-center text-center">
              <SectionHeading eyebrow="Discography" title="Albums Mike Performed On" center />
              <BulletList items={albumsPerformedOn} center />
            </div>
            <div className="flex flex-col items-center text-center">
              <SectionHeading eyebrow="Practical Drumming" title="What Students Learn" center />
              <BulletList items={studentTopics} center />
            </div>
          </div>
        </Reveal>
      </SectionShell>

      <SectionShell alt>
        <Reveal delay={0.04} className={twoColClass}>
          <div className={colClass}>
            <SectionHeading title="Massive Shows and Arena Footprint" />
            <Prose className="mt-5">
              During his 19-year tenure, Malinin transitioned from playing localized indie clubs to
              commanding some of the world&apos;s most legendary music stages.
            </Prose>
          </div>
          <div className={colClass}>
            <AboutFigure
              aspect="landscape"
              src="/about-mike-live.png"
              alt="Mike Malinin performing live on drums"
              caption="Goo Goo Dolls era — stadium & festival performances"
              className="w-full"
            />
          </div>
        </Reveal>
        <HighlightGrid items={arenaHighlights} />
      </SectionShell>

      <SectionShell>
        <Reveal delay={0.04} className={twoColClass}>
          <div className={`${colClass} lg:order-1`}>
            <AboutFigure
              aspect="landscape"
              src="/about-mike-stage.png"
              alt="Mike Malinin behind a TAMA drum kit on stage"
              caption="Live on stage — Goo Goo Dolls era"
              className="w-full"
            />
          </div>
          <div className={`${colClass} lg:order-2`}>
            <SectionHeading title="TV and Movie Features" />
            <Prose className="mt-5">
              Malinin&apos;s work with the band heavily crossed over into mainstream television and
              cinematic pop culture.
            </Prose>
          </div>
        </Reveal>
        <HighlightGrid items={screenHighlights} />
      </SectionShell>

      <SectionShell alt>
        <Reveal delay={0.04} className={twoColClass}>
          <div className={colClass}>
            <SectionHeading
              eyebrow="Nashville"
              title="Country Reinvention & Grammy Success with Tanya Tucker"
            />
            <Prose className="mt-5">
              Following his departure from the Goo Goo Dolls, Malinin relocated to Nashville and spent
              nearly seven years (2016–2022) as drummer and bandleader for country legend Tanya Tucker —
              finding &ldquo;intensity without volume&rdquo; to support her immense vocal presence.
            </Prose>
          </div>
          <div className="flex w-full flex-col items-center justify-center text-center">
            <AboutFigure
              aspect="portrait"
              src="/about-mike-tanya.png"
              alt="Mike Malinin behind the drum kit for Tanya Tucker"
              caption="Bandleader for Tanya Tucker — Nashville"
              captionCenter
              className={portraitDesktopSizeClass}
            />
          </div>
        </Reveal>
        <HighlightGrid items={tanyaHighlights} />
      </SectionShell>

      <SectionShell>
        <Reveal delay={0.04} className={twoColClass}>
          <div className="flex w-full flex-col items-center justify-center text-center">
            <figure className={portraitDesktopSizeClass}>
              <div className={`relative overflow-hidden ${portraitFrameClass} aspect-[3/4] w-full`}>
                <img
                  src="/about-modern-drummer-cover.png"
                  alt="August 2002 Modern Drummer magazine cover featuring Mike Malinin of the Goo Goo Dolls"
                  className="absolute inset-0 h-full w-full object-cover object-top"
                  loading="lazy"
                  decoding="async"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/35 via-transparent to-transparent"
                  aria-hidden
                />
              </div>
              <figcaption className="mt-3 text-center font-garamond text-xs tracking-[0.22em] uppercase text-mist/50">
                Modern Drummer · August 2002
              </figcaption>
            </figure>
          </div>
          <div className={`${colClass} space-y-5`}>
            <SectionHeading
              eyebrow="Press & recognition"
              title={
                <>
                  On the Cover of <span className="text-gold">Modern Drummer</span>
                </>
              }
              subtitle="Goo Goo Dolls' Mike Malinin — Maximum Pop"
            />
            <Prose>
              In August 2002, Mike Malinin graced the cover of{' '}
              <a
                href="https://www.moderndrummer.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline decoration-gold/35 underline-offset-2"
              >
                <em className="text-mist/85 not-italic">Modern Drummer</em>
              </a>{' '}
              — the definitive global publication for the instrument and the highest-profile honor a
              working drummer can receive.
            </Prose>
            <Prose>
              The feature spotlighted his role anchoring the Goo Goo Dolls at the peak of their
              commercial run — the pocket, dynamics, and song-first musicality behind hits like
              &ldquo;Iris,&rdquo; &ldquo;Slide,&rdquo; and &ldquo;Black Balloon.&rdquo; A cover
              placement puts a player among the elite drummers whose approach shapes how the next
              generation thinks about playing for the music.{' '}
              <a
                href="https://www.moderndrummer.com/2004/05/mike-malinin/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline decoration-gold/35 underline-offset-2"
              >
                Read &ldquo;Mike Malinin: Pop-Rock Precision&rdquo;
              </a>
              .
            </Prose>
            <Prose className="text-mist/65">
              That same philosophy — feel over flash, serving the song — is at the core of Practical
              Drumming today. Mike has long played{' '}
              <a
                href="https://remo.com/profile/mike-malinin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline decoration-gold/35 underline-offset-2"
              >
                Remo
              </a>{' '}
              heads on stage and in the studio — the same focus on tone and reliability he brings to
              mastermind sessions.
            </Prose>
          </div>
        </Reveal>
      </SectionShell>

      <SectionShell alt>
        <Reveal delay={0.04} className={twoColClass}>
          <div className="order-1 flex w-full flex-col items-center justify-center text-center lg:order-2">
            <figure className={`${portraitSizeClass} w-full max-w-[14rem] sm:max-w-[15rem] lg:max-w-[16rem]`}>
              <div className={`relative overflow-hidden ${portraitFrameClass} aspect-[3/4] w-full`}>
                <img
                  src="/about-cta-rockwalk.png"
                  alt="Mike Malinin at his Guitar Center RockWalk induction beside his handprint plaque in Hollywood"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/35 via-transparent to-transparent"
                  aria-hidden
                />
              </div>
              <figcaption className="mt-3 text-center font-garamond text-xs tracking-[0.22em] uppercase text-mist/50">
                Guitar Center RockWalk · Hollywood
              </figcaption>
            </figure>
          </div>
          <div className={`${colClass} order-2 space-y-5 lg:order-1`}>
            <SectionHeading
              eyebrow="Honors & recognition"
              title={
                <>
                  Guitar Center <span className="text-gold">RockWalk</span>
                </>
              }
              subtitle="Handprints set in stone on the world's most famous music boulevard"
            />
            <Prose>
              The Guitar Center RockWalk of Fame in Hollywood immortalizes the musicians who have shaped
              popular music, capturing their handprints alongside legends like Jimi Hendrix, Eddie Van
              Halen, and Stevie Wonder.
            </Prose>
            <Prose>
              As part of the Goo Goo Dolls, Mike was inducted with his bandmates — his handprints
              permanently placed on Hollywood Boulevard alongside the artists who defined their eras.
            </Prose>
            <Prose className="text-mist/65">
              It&apos;s recognition reserved for artists whose work defines a generation — and a testament
              to the rock-solid drumming that powered five billion streams.
            </Prose>
          </div>
        </Reveal>
      </SectionShell>

      <section className="relative overflow-hidden border-t border-gold/15 bg-charcoal/25 py-14 md:py-16 lg:py-20">
        <SectionGridOverlay />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_50%,rgba(201,165,92,0.08),transparent_65%)]"
          aria-hidden
        />
        <div className={`relative z-10 ${pageWrapClass}`}>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
            <Reveal className="order-2 lg:order-1">
              <div className="flex w-full flex-col items-center justify-center text-center">
                <AboutFigure
                  aspect="portrait"
                  src="/hero-mike-live.png"
                  alt="Mike Malinin performing live on drums"
                  className="mx-auto w-full max-w-[15rem] sm:max-w-[17rem] lg:max-w-[19rem]"
                />
              </div>
            </Reveal>

            <div className="order-1 flex flex-col items-center gap-8 text-center lg:order-2 lg:items-start lg:text-left">
              <Reveal className="w-full">
                <SectionHeading
                  title={
                    <>
                      <span className="text-mist">Learn Directly From </span>
                      <span className="text-gold">Mike Malinin</span>
                    </>
                  }
                />
                <div className="mt-6 space-y-5">
                  <Prose>
                    Learn directly from an industry veteran who has conquered alternative rock radio
                    and Grammy-winning country charts alike.
                  </Prose>
                  <Prose>
                    Today, Mike runs Practical Drumming full time — building the mastermind community
                    where serious drummers get live mentorship, honest feedback, and direct access to
                    someone who&apos;s lived it at the highest level.
                  </Prose>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <Link to="/apply" className={`${primaryBtnClass} min-h-14 px-10 md:min-h-16 md:px-14`}>
                  Apply for Membership
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}
