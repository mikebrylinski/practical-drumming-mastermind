import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'

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
    body: 'As her bandleader, Malinin guided the live shows through highly celebrated performances at legendary, bucket-list venues. This included a historic, standing-room-only performance at West Hollywood’s iconic The Troubadour (which was captured for a live album release) and a highly revered taping for Austin City Limits.',
  },
] as const

function SectionHeading({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div>
      {eyebrow ? (
        <p className="font-garamond text-xs tracking-[0.32em] uppercase text-gold-dim">{eyebrow}</p>
      ) : null}
      <h2 className={`font-bebas text-2xl tracking-wide text-mist md:text-3xl ${eyebrow ? 'mt-3' : ''}`}>
        {title}
      </h2>
    </div>
  )
}

type PlaceholderAspect = 'landscape' | 'portrait' | 'wide'

function AboutImagePlaceholder({
  label = '',
  caption,
  aspect = 'landscape',
  className = '',
  fill = false,
  src,
  alt,
}: {
  label?: string
  caption?: string
  aspect?: PlaceholderAspect
  className?: string
  /** Portrait fills its column (e.g. beside intro copy) */
  fill?: boolean
  src?: string
  alt?: string
}) {
  const aspectClass =
    aspect === 'portrait'
      ? fill
        ? 'aspect-[4/5] w-full'
        : 'mx-auto aspect-[4/5] w-full max-w-sm'
      : aspect === 'wide'
        ? 'aspect-[21/9] w-full'
        : 'aspect-[16/10] w-full'

  return (
    <figure className={className}>
      <div
        className={`relative overflow-hidden border border-white/[0.08] bg-charcoal shadow-[inset_0_1px_0_rgba(201,165,92,0.08)] ${aspectClass}`}
      >
        {src ? (
          <>
            <img
              src={src}
              alt={alt ?? ''}
              className="absolute inset-0 h-full w-full object-cover object-[center_22%]"
              loading="eager"
              decoding="async"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/55 via-void/10 to-transparent"
              aria-hidden
            />
          </>
        ) : (
          <>
            <div
              className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(201,165,92,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,165,92,0.06) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-void/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
          <svg
            className="h-10 w-10 text-gold/35 md:h-12 md:w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="font-garamond text-xs tracking-[0.32em] uppercase text-mist/45">{label}</span>
            </div>
          </>
        )}
      </div>
      {caption ? (
        <figcaption className="mt-3 text-center font-garamond text-sm italic text-mist/45 md:text-left">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

function HighlightBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-l border-gold/30 pl-6 md:pl-8">
      <h3 className="font-garamond text-base text-gold md:text-lg">{title}</h3>
      <p className="mt-3 font-garamond text-sm leading-relaxed text-mist/75 md:text-base">{body}</p>
    </div>
  )
}

export function AboutPage() {
  return (
    <article className="bg-void">
      <section className="border-b border-white/[0.06] px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto w-full max-w-5xl">
          <Reveal>
            <p className="font-garamond text-xs tracking-[0.35em] uppercase text-gold-dim">About</p>
            <h1 className="mt-4 font-bebas text-4xl text-mist md:text-5xl lg:text-6xl">
              About Mike Malinin
            </h1>
          </Reveal>
          <Reveal
            delay={0.06}
            className="mt-10 grid items-start gap-8 md:grid-cols-[minmax(0,13rem)_1fr] md:gap-10 lg:grid-cols-[minmax(0,15rem)_1fr] lg:gap-12"
          >
            <AboutImagePlaceholder
              fill
              aspect="portrait"
              src="/about-mike.png"
              alt="Mike Malinin performing live on drums"
              caption="Mike Malinin — Practical Drumming"
              className="w-full max-w-[13rem] md:max-w-none"
            />
            <div className="space-y-6 font-garamond text-base leading-relaxed text-mist/75 md:text-lg">
              <p>
                Mike Malinin is an American rock drummer best known for anchoring the rhythm section of
                the alternative rock band Goo Goo Dolls during their most commercially successful era.
                Joining the group in January 1995, Malinin’s precise, hard-hitting style provided the
                backbone for the band’s transition from gritty punk-rockers to global, multi-platinum
                superstars.
              </p>
              <p>
                His career is defined by driving the percussion on some of the most statistically
                dominant records, iconic live spectacles, and prestigious award-winning projects in
                modern music history:
              </p>
            </div>
          </Reveal>
          <div className="mt-12 space-y-10">
            {careerHighlights.map((item, i) => (
              <Reveal key={item.title} delay={0.08 + i * 0.04}>
                <HighlightBlock title={item.title} body={item.body} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] px-5 py-10 md:px-8 md:py-14">
        <div className="mx-auto w-full max-w-5xl">
          <Reveal>
            <AboutImagePlaceholder
              aspect="wide"
              label="Live at arena · photo coming soon"
              caption="Goo Goo Dolls era — stadium & festival performances"
            />
          </Reveal>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-charcoal/30 px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto w-full max-w-5xl">
          <Reveal>
            <SectionHeading title="Massive Shows and Arena Footprint" />
            <p className="mt-6 font-garamond text-base leading-relaxed text-mist/75 md:text-lg">
              During his 19-year tenure, Malinin transitioned from playing localized indie clubs to
              commanding some of the world&apos;s most legendary music stages:
            </p>
          </Reveal>
          <div className="mt-12 space-y-10">
            {arenaHighlights.map((item, i) => (
              <Reveal key={item.title} delay={0.06 + i * 0.04}>
                <HighlightBlock title={item.title} body={item.body} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto w-full max-w-5xl">
          <Reveal>
            <SectionHeading title="TV and Movie Features" />
            <p className="mt-6 font-garamond text-base leading-relaxed text-mist/75 md:text-lg">
              Malinin&apos;s work with the band heavily crossed over into mainstream television and
              cinematic pop culture:
            </p>
          </Reveal>
          <div className="mt-12 space-y-10">
            {screenHighlights.map((item, i) => (
              <Reveal key={item.title} delay={0.06 + i * 0.04}>
                <HighlightBlock title={item.title} body={item.body} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] px-5 py-10 md:px-8 md:py-14">
        <div className="mx-auto w-full max-w-5xl">
          <Reveal>
            <AboutImagePlaceholder
              label="Studio & screen · photo coming soon"
              caption="Recording sessions, film, and television appearances"
            />
          </Reveal>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-charcoal/30 px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto w-full max-w-5xl">
          <Reveal>
            <SectionHeading
              eyebrow="Nashville"
              title="Country Reinvention & Grammy Success with Tanya Tucker"
            />
            <p className="mt-6 font-garamond text-base leading-relaxed text-mist/75 md:text-lg">
              Following his departure from the Goo Goo Dolls, Malinin relocated to Nashville and spent
              nearly seven years (2016–2022) serving as the drummer and bandleader for country music
              legend Tanya Tucker. Transitioning from arena rock to legendary country music required
              Malinin to find &ldquo;intensity without volume,&rdquo; perfectly supporting Tucker&apos;s
              immense vocal presence.
            </p>
          </Reveal>
          <div className="mt-12 space-y-10">
            {tanyaHighlights.map((item, i) => (
              <Reveal key={item.title} delay={0.06 + i * 0.04}>
                <HighlightBlock title={item.title} body={item.body} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto w-full max-w-5xl">
          <Reveal>
            <SectionHeading title="Learn From a Diamond-Certified Legend" />
            <div className="mt-8 space-y-6 font-garamond text-base leading-relaxed text-mist/75 md:text-lg">
              <p>
                Are you looking for the best online drum lessons to elevate your rhythmic technique
                and step up your performance style? Learn directly from an industry veteran who has
                conquered alternative rock radio and Grammy-winning country charts alike.
              </p>
              <p>
                Mike is available for exclusive, limited-seat drum mentorship and personalized drum
                coaching to exactly 20 dedicated students. Whether you want to master intricate rock
                rhythms, build stadium-ready live performance endurance, or find your unique studio
                pocket, this is your chance to get direct industry feedback.
              </p>
              <p>
                Don&apos;t wait until spots are completely filled—join Practical Drumming today! Learn
                from an artist officially backed by industry-standard titans like TAMA Drums and Remo
                Drumheads.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="mt-12 flex justify-center">
            <Link
              to="/apply"
              className="inline-flex min-h-12 items-center justify-center border border-gold/50 bg-gold/10 px-10 font-garamond text-xs tracking-[0.22em] uppercase text-gold transition hover:border-gold hover:bg-gold/20"
            >
              Apply for Membership
            </Link>
          </Reveal>
        </div>
      </section>
    </article>
  )
}
