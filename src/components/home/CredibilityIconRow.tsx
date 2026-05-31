import { Reveal } from '../Reveal'
import { sectionGridPatternStyle } from '../SectionGridOverlay'

const credibilityItems = [
  {
    imageSrc: '/icon-equalizer.png',
    label: 'Nearly 5 billion streams across the catalog',
  },
  {
    imageSrc: '/icon-gramophone.png',
    label: 'Grammy Nominated',
  },
  {
    imageSrc: '/icon-vinyl.png',
    label: 'Diamond and multi-platinum recordings',
  },
  {
    imageSrc: '/icon-drum.png',
    label: 'Decades of arena and festival touring',
  },
  {
    imageSrc: '/icon-waveform.png',
    label: 'Work in major films',
  },
] as const

const topRowItems = credibilityItems.slice(0, 3)
const bottomRowItems = credibilityItems.slice(3)

/** Duplicated for seamless infinite scroll on mobile. */
const carouselItems = [...credibilityItems, ...credibilityItems]

export function CredibilityIconRow() {
  return (
    <div className="mt-10 w-full lg:mt-0">
      {/* Mobile / tablet: auto-scrolling carousel of all 5 icons */}
      <div className="lg:hidden">
        <Reveal delay={0.05}>
          <div
            className="relative -mx-5 overflow-hidden sm:-mx-6"
            aria-label="Career highlights"
            role="region"
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-void/90 to-transparent" aria-hidden />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-void/90 to-transparent" aria-hidden />
            <div className="credibility-carousel-track flex w-max gap-4 px-5 py-1 sm:gap-5 sm:px-6">
              {carouselItems.map((item, i) => (
                <CredibilityCarouselSlide
                  key={`${item.label}-${i}`}
                  imageSrc={item.imageSrc}
                  label={item.label}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Desktop: original two-row grid */}
      <div className="hidden flex-col gap-4 sm:gap-5 lg:flex lg:gap-6">
        <Reveal
          delay={0.05}
          className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
        >
          {topRowItems.map((item) => (
            <CredibilityIconCard key={item.label} imageSrc={item.imageSrc} label={item.label} />
          ))}
        </Reveal>
        <Reveal
          delay={0.08}
          className="flex w-full flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-5 lg:gap-6"
        >
          {bottomRowItems.map((item) => (
            <CredibilityIconCard
              key={item.label}
              imageSrc={item.imageSrc}
              label={item.label}
              className="sm:max-w-[min(100%,20rem)] lg:w-[calc((100%-3rem)/3)] lg:max-w-none"
            />
          ))}
        </Reveal>
      </div>
    </div>
  )
}

function CredibilityCarouselSlide({
  imageSrc,
  label,
}: {
  imageSrc: string
  label: string
}) {
  return (
    <figure className="w-[min(72vw,17.5rem)] shrink-0 sm:w-[16.5rem]">
      <div className="relative flex h-full min-h-[10.5rem] flex-col overflow-hidden border border-white/[0.1] bg-charcoal shadow-[inset_0_1px_0_rgba(201,165,92,0.12)] sm:min-h-[11rem]">
        <div className="absolute inset-0 opacity-40" style={sectionGridPatternStyle} aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(201,165,92,0.2),transparent_65%)]"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-void/15 to-transparent" aria-hidden />
        <div className="relative flex flex-1 flex-col items-center justify-between gap-3 px-5 py-6 text-center">
          <div className="flex flex-1 items-center justify-center pt-1">
            <img
              src={imageSrc}
              alt=""
              className="h-14 w-14 shrink-0 object-contain drop-shadow-[0_0_16px_rgba(201,165,92,0.45)] sm:h-16 sm:w-16"
            />
          </div>
          <p className="font-bebas text-base leading-snug tracking-wide text-white sm:text-lg">
            {label}
          </p>
        </div>
      </div>
    </figure>
  )
}

function CredibilityIconCard({
  imageSrc,
  label,
  className = '',
}: {
  imageSrc: string
  label: string
  className?: string
}) {
  return (
    <figure className={`w-full max-w-lg lg:min-w-0 ${className}`}>
      <div className="group relative flex w-full flex-col overflow-hidden border border-white/[0.1] bg-charcoal shadow-[inset_0_1px_0_rgba(201,165,92,0.12)] transition-colors duration-300 hover:border-gold/30 lg:aspect-[4/5] lg:min-h-[15rem]">
        <div className="absolute inset-0 opacity-40" style={sectionGridPatternStyle} aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(201,165,92,0.2),transparent_65%)]"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-void/15 to-transparent" aria-hidden />

        <div className="relative flex flex-col items-center gap-4 px-6 py-8 text-center sm:gap-5 sm:px-8 sm:py-10 lg:h-full lg:justify-between lg:gap-4 lg:p-6">
          <div className="flex flex-1 items-center justify-center transition-transform duration-300 group-hover:scale-105 lg:pt-1">
            <img
              src={imageSrc}
              alt=""
              className="h-16 w-16 shrink-0 object-contain drop-shadow-[0_0_16px_rgba(201,165,92,0.45)] lg:h-[4.75rem] lg:w-[4.75rem] xl:h-20 xl:w-20"
            />
          </div>
          <p className="w-full shrink-0 font-bebas text-lg leading-snug tracking-wide text-white sm:text-xl lg:text-base lg:leading-snug xl:text-lg">
            {label}
          </p>
        </div>
      </div>
    </figure>
  )
}
