import type { BookCallPhase } from './types'
import { QUESTION_STEP_COUNT } from './types'

const STEPS = [
  { key: 'intro', label: 'Welcome' },
  { key: 'questions', label: 'Questions' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'confirmed', label: 'Confirmed' },
] as const

function phaseToIndex(phase: BookCallPhase) {
  switch (phase) {
    case 'intro':
      return 0
    case 'questions':
      return 1
    case 'schedule':
      return 2
    case 'confirmed':
      return 3
  }
}

type BookCallStepIndicatorProps = {
  phase: BookCallPhase
  questionStep?: number
}

export function BookCallStepIndicator({ phase, questionStep = 0 }: BookCallStepIndicatorProps) {
  const activeIndex = phaseToIndex(phase)

  return (
    <nav aria-label="Booking progress" className="mb-8 px-1 sm:mb-10 md:mb-12">
      <ol className="flex items-start justify-center gap-0">
        {STEPS.map((step, i) => {
          const done = i < activeIndex
          const active = i === activeIndex
          const upcoming = i > activeIndex

          return (
            <li key={step.key} className="flex min-w-0 flex-1 flex-col items-center last:flex-none">
              <div className="flex w-full items-center">
                {i > 0 ? (
                  <span
                    className={`mx-1 h-px flex-1 md:mx-2 ${
                      done || active ? 'bg-gold/50' : 'bg-white/10'
                    }`}
                    aria-hidden
                  />
                ) : null}
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-garamond text-xs transition md:h-9 md:w-9 ${
                    done
                      ? 'border-gold bg-gold text-void'
                      : active
                        ? 'border-gold bg-gold/15 text-gold ring-2 ring-gold/25'
                        : 'border-white/15 bg-charcoal/50 text-mist/35'
                  }`}
                  aria-current={active ? 'step' : undefined}
                >
                  {done ? (
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path
                        d="M3.5 8.5l3 3 6-6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                {i < STEPS.length - 1 ? (
                  <span
                    className={`mx-1 h-px flex-1 md:mx-2 ${
                      done ? 'bg-gold/50' : 'bg-white/10'
                    }`}
                    aria-hidden
                  />
                ) : null}
              </div>
              <span
                className={`mt-2 max-w-[4.5rem] text-center font-garamond text-[0.65rem] leading-tight tracking-wide uppercase sm:max-w-none sm:text-xs ${
                  active ? 'text-gold' : done ? 'text-mist/55' : upcoming ? 'text-mist/30' : 'text-mist/55'
                }`}
              >
                {step.label}
              </span>
            </li>
          )
        })}
      </ol>

      <p
        className={`mt-4 min-h-[1.25rem] text-center font-garamond text-xs tracking-[0.2em] uppercase ${
          phase === 'questions' ? 'text-mist/45' : 'invisible'
        }`}
        aria-hidden={phase !== 'questions'}
      >
        Question {questionStep + 1} of {QUESTION_STEP_COUNT}
      </p>
    </nav>
  )
}
