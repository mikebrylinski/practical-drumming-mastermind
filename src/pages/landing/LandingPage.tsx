import { Link, Navigate } from 'react-router-dom'
import { Reveal } from '../../components/Reveal'
import { Seo } from '../../components/Seo'
import { SectionGridOverlay } from '../../components/SectionGridOverlay'
import { pageWrapClass, SectionShell } from '../../components/SectionShell'
import { getLandingPage, type LandingPageData } from './landingData'

const SITE_ORIGIN = 'https://www.pracdrum.com'

const primaryBtnClass =
  'inline-flex min-h-14 items-center justify-center rounded-full bg-gold px-10 font-garamond text-xs tracking-[0.18em] uppercase text-void transition hover:bg-gold/90'
const secondaryBtnClass =
  'inline-flex min-h-14 items-center justify-center rounded-full border border-gold/40 px-10 font-garamond text-xs tracking-[0.18em] uppercase text-gold transition hover:bg-gold/10'

const credibilityStats = [
  { value: '5B+', label: 'Streams on recordings Mike has played on' },
  { value: 'Diamond', label: 'RIAA-certified record ("Iris")' },
  { value: '19 yrs', label: 'Touring & recording professionally' },
  { value: 'Grammy era', label: 'Bandleader for Tanya Tucker' },
] as const

function buildJsonLd(data: LandingPageData) {
  const pageUrl = `${SITE_ORIGIN}/${data.slug}`

  const course = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: data.seoTitle,
    description: data.seoDescription,
    url: pageUrl,
    provider: {
      '@type': 'Organization',
      name: 'Practical Drumming',
      url: SITE_ORIGIN,
    },
    instructor: {
      '@type': 'Person',
      name: 'Mike Malinin',
      description:
        'Professional drummer, recording artist, mentor and educator — former Goo Goo Dolls drummer (1995–2013) and bandleader for Tanya Tucker.',
    },
  }

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: data.eyebrow, item: pageUrl },
    ],
  }

  return JSON.stringify([course, faqPage, breadcrumb])
}

export function LandingPage({ slug }: { slug: string }) {
  const data = getLandingPage(slug)

  if (!data) {
    return <Navigate to="/" replace />
  }

  return (
    <article className="bg-void">
      <Seo
        title={data.seoTitle}
        description={data.seoDescription}
        canonicalPath={`/${data.slug}`}
        image="/about-mike-practical.png"
      />
      <script
        type="application/ld+json"
        // JSON-LD structured data for rich results (Course, FAQ, Breadcrumb).
        dangerouslySetInnerHTML={{ __html: buildJsonLd(data) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/credibility-bg.png')" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-void/55" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-b from-void/40 via-void/55 to-void/80"
          aria-hidden
        />
        <div className={`relative z-10 ${pageWrapClass} py-16 md:py-20 lg:py-28`}>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-garamond text-[0.7rem] tracking-[0.32em] uppercase text-gold/80 md:text-xs">
              {data.eyebrow}
            </p>
            <h1 className="mt-3 font-bebas text-[clamp(2.75rem,7vw,4.75rem)] leading-[0.92] tracking-[0.03em] text-mist">
              {data.h1Lead} <span className="text-gold">{data.h1Highlight}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl font-garamond text-lg leading-snug text-mist/75 md:text-xl">
              {data.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/apply" className={primaryBtnClass}>
                Book a Call
              </Link>
              <Link to="/club" className={secondaryBtnClass}>
                Explore the Club
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <SectionShell alt>
        <Reveal className="mx-auto max-w-3xl space-y-5 text-center">
          {data.intro.map((para) => (
            <p
              key={para}
              className="font-garamond text-base leading-relaxed text-mist/75 md:text-[1.1rem]"
            >
              {para}
            </p>
          ))}
        </Reveal>
      </SectionShell>

      {/* Features */}
      <SectionShell>
        <div className="text-center">
          <h2 className="font-bebas text-[clamp(1.9rem,4.5vw,3rem)] leading-[0.95] tracking-[0.03em] text-mist">
            {data.featuresTitle}
          </h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:gap-5">
          {data.features.map((feature, i) => (
            <Reveal key={feature.title} delay={0.04 + i * 0.04}>
              <div className="h-full rounded-2xl border border-white/[0.08] bg-charcoal/75 p-6 ring-1 ring-white/[0.04] backdrop-blur-sm md:p-7">
                <h3 className="font-bebas text-xl tracking-wide text-gold md:text-2xl">
                  {feature.title}
                </h3>
                <p className="mt-2.5 font-garamond text-sm leading-relaxed text-mist/70 md:text-base">
                  {feature.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      {/* Credibility */}
      <SectionShell alt>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <Reveal>
            <p className="font-garamond text-[0.7rem] tracking-[0.32em] uppercase text-gold/80 md:text-xs">
              Why learn with Mike
            </p>
            <h2 className="mt-2 font-bebas text-[clamp(1.9rem,4.5vw,3rem)] leading-[0.95] tracking-[0.03em] text-mist">
              A professional who has done it at the highest level
            </h2>
            <p className="mt-4 font-garamond text-base leading-relaxed text-mist/70 md:text-[1.05rem]">
              Mike Malinin is an American professional drummer, recording artist, mentor and
              educator — best known as the drummer for the Goo Goo Dolls from 1995 to 2013, and
              later bandleader for Grammy-winning country artist Tanya Tucker. He brings that
              real-world experience directly to serious drummers.{' '}
              <Link
                to="/about"
                className="text-gold underline decoration-gold/35 underline-offset-2"
              >
                Read Mike&apos;s full story
              </Link>
              .
            </p>
          </Reveal>
          <div className="grid grid-cols-2 gap-4">
            {credibilityStats.map((stat, i) => (
              <Reveal key={stat.label} delay={0.04 + i * 0.04}>
                <div className="h-full rounded-2xl border border-white/[0.08] bg-void/50 p-5 text-center ring-1 ring-white/[0.04]">
                  <p className="font-bebas text-3xl tracking-wide text-gold md:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 font-garamond text-xs leading-snug text-mist/60 md:text-sm">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* Audience */}
      <SectionShell>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-bebas text-[clamp(1.9rem,4.5vw,3rem)] leading-[0.95] tracking-[0.03em] text-mist">
            {data.audienceTitle}
          </h2>
          <ul className="mx-auto mt-6 w-fit max-w-xl space-y-3 text-left">
            {data.audience.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 font-garamond text-base leading-relaxed text-mist/75 md:text-[1.05rem]"
              >
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </SectionShell>

      {/* FAQ */}
      <SectionShell alt>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-bebas text-[clamp(1.9rem,4.5vw,3rem)] leading-[0.95] tracking-[0.03em] text-mist">
            {data.faqTitle}
          </h2>
          <dl className="mt-8 space-y-8">
            {data.faqs.map(({ q, a }, i) => (
              <Reveal key={q} delay={i * 0.04}>
                <div>
                  <dt className="font-garamond text-lg text-gold md:text-xl">{q}</dt>
                  <dd className="mt-2.5 font-garamond text-base leading-relaxed text-mist/70 md:text-lg">
                    {a}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </SectionShell>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-gold/15 bg-charcoal/25 py-14 md:py-16 lg:py-20">
        <SectionGridOverlay />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(201,165,92,0.1),transparent_65%)]"
          aria-hidden
        />
        <div className={`relative z-10 ${pageWrapClass} text-center`}>
          <h2 className="mx-auto max-w-2xl font-bebas text-[clamp(2rem,5vw,3.25rem)] leading-[0.95] tracking-[0.03em] text-mist">
            {data.ctaTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-garamond text-lg leading-snug text-mist/70">
            {data.ctaBody}
          </p>
          <div className="mt-8">
            <Link to="/apply" className={`${primaryBtnClass} md:min-h-16 md:px-14`}>
              Book a Call
            </Link>
          </div>
        </div>
      </section>
    </article>
  )
}
