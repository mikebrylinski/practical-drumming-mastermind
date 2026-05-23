import { roadmapSteps } from './mockData'

export function MembersRoadmap() {
  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] sm:hidden [&::-webkit-scrollbar]:hidden">
        {roadmapSteps.map((step, i) => (
          <div
            key={step.label}
            className="flex min-w-[7.5rem] shrink-0 flex-col items-center gap-2 rounded-lg border border-white/10 bg-void/40 px-3 py-3 text-center"
          >
            <div
              className={`flex size-8 items-center justify-center rounded-full font-garamond text-sm ${
                step.done
                  ? 'bg-gold text-void'
                  : step.active
                    ? 'border-2 border-gold bg-gold/10 text-gold'
                    : 'border border-white/20 text-mist/40'
              }`}
            >
              {step.done ? '✓' : i + 1}
            </div>
            <p
              className={`font-garamond text-xs leading-snug ${
                step.active ? 'text-gold' : step.done ? 'text-mist/70' : 'text-mist/40'
              }`}
            >
              {step.label}
            </p>
          </div>
        ))}
      </div>
      <div className="hidden sm:flex sm:items-center sm:gap-2">
        {roadmapSteps.map((step, i) => (
          <div key={step.label} className="flex min-w-0 flex-1 items-center gap-2">
            <div
              className={`flex size-8 shrink-0 items-center justify-center rounded-full font-garamond text-xs ${
                step.done
                  ? 'bg-gold text-void'
                  : step.active
                    ? 'border-2 border-gold bg-gold/10 text-gold'
                    : 'border border-white/20 text-mist/40'
              }`}
            >
              {step.done ? '✓' : i + 1}
            </div>
            <p
              className={`min-w-0 truncate font-garamond text-base ${
                step.active ? 'text-gold' : step.done ? 'text-mist/70' : 'text-mist/40'
              }`}
            >
              {step.label}
            </p>
            {i < roadmapSteps.length - 1 ? (
              <div
                className={`mx-1 hidden h-0.5 min-w-[1rem] flex-1 md:block ${
                  step.done ? 'bg-gold/50' : 'bg-white/10'
                }`}
                aria-hidden
              />
            ) : null}
          </div>
        ))}
      </div>
    </>
  )
}
