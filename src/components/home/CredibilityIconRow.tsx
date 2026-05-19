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

export function CredibilityIconRow() {
  return (
    <div className="mt-10 flex w-full flex-col gap-4 sm:gap-5 lg:mt-0 lg:gap-6">
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
