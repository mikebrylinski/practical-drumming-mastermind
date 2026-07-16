import { Link } from 'react-router-dom'
import type { BookCallAnswers, DrummerLevel } from './types'
import { QUESTION_STEP_COUNT } from './types'

const LEVELS: DrummerLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Touring/Professional']

const GOALS = [
  'Tighter groove, pocket, and feel',
  'Audition / session readiness',
  'Touring consistency & stamina',
  'Studio mindset & musical decisions',
  'Career clarity as a working drummer',
  'Honest feedback from players above my level',
  'Other',
] as const

const inputClass =
  'mt-2 w-full rounded-md border border-white/10 bg-charcoal/80 px-4 py-3 font-garamond text-sm text-mist placeholder:text-mist/30 outline-none transition focus:border-gold/50 focus:ring-1 focus:ring-gold/30'

const optionCardClass =
  'w-full rounded-lg border border-white/10 bg-charcoal/50 px-5 py-4 text-left font-garamond text-base text-mist transition hover:border-white/20 md:py-[1.125rem] md:text-[1.05rem]'

const optionSelectedClass = 'border-gold/60 bg-gold/5 ring-1 ring-gold/30'

type BookCallQuestionnaireProps = {
  step: number
  answers: BookCallAnswers
  canAdvance: boolean
  onChange: (patch: Partial<BookCallAnswers>) => void
  onBack: () => void
  onNext: () => void
  submitting: boolean
}

export function BookCallQuestionnaire({
  step,
  answers,
  canAdvance,
  onChange,
  onBack,
  onNext,
  submitting,
}: BookCallQuestionnaireProps) {
  const progress = ((step + 1) / QUESTION_STEP_COUNT) * 100
  const isLast = step === QUESTION_STEP_COUNT - 1
  const beginnerSelected = answers.level === 'Beginner'

  function toggleGoal(goal: string) {
    const goals = answers.goals.includes(goal)
      ? answers.goals.filter((g) => g !== goal)
      : [...answers.goals, goal]
    onChange({ goals })
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-1 sm:px-0">
      <div className="flex min-h-[26rem] flex-col overflow-hidden rounded-xl border border-white/10 bg-charcoal/40 shadow-2xl sm:min-h-[28rem]">
        <div
          className="h-1 w-full bg-white/10"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={QUESTION_STEP_COUNT}
          aria-label={`Question ${step + 1} of ${QUESTION_STEP_COUNT}`}
        >
          <div
            className="h-full rounded-full bg-gold transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-8 md:p-10">
          <div className="flex min-h-[17rem] flex-1 flex-col sm:min-h-[19rem]">
            {step === 0 ? (
              <div>
                <h2 className="mb-8 font-bebas text-[clamp(1.5rem,4vw,2.25rem)] leading-tight tracking-wide text-mist">
                  First, your contact info.
                </h2>
                <div className="space-y-5">
                  <label className="block font-garamond text-sm text-mist/70">
                    Full Name
                    <input
                      required
                      className={inputClass}
                      value={answers.fullName}
                      onChange={(e) => onChange({ fullName: e.target.value })}
                    />
                  </label>
                  <label className="block font-garamond text-sm text-mist/70">
                    Email Address
                    <input
                      required
                      type="email"
                      className={inputClass}
                      value={answers.email}
                      onChange={(e) => onChange({ email: e.target.value })}
                    />
                  </label>
                  <label className="block font-garamond text-sm text-mist/70">
                    Instagram <span className="text-mist/40">(optional)</span>
                    <input
                      className={inputClass}
                      value={answers.instagram}
                      onChange={(e) => onChange({ instagram: e.target.value })}
                      placeholder="@handle"
                    />
                  </label>
                </div>
              </div>
            ) : null}

            {step === 1 ? (
              <fieldset className="border-0 p-0">
                <legend className="mb-8 block w-full font-bebas text-[clamp(1.5rem,4vw,2.25rem)] leading-tight tracking-wide text-mist">
                  Where are you currently at as a drummer?
                </legend>
                <div className="space-y-3">
                  {LEVELS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => onChange({ level })}
                      className={`${optionCardClass} ${answers.level === level ? optionSelectedClass : ''}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                {beginnerSelected ? (
                  <p className="mt-5 rounded-lg border border-gold/25 bg-gold/5 px-4 py-3 font-garamond text-sm leading-relaxed text-mist/70">
                    The Mastermind is built for intermediate and working players. If you&apos;re just starting
                    out, this isn&apos;t the right room yet — we&apos;ll point you to a better next step.
                  </p>
                ) : null}
              </fieldset>
            ) : null}

            {step === 2 ? (
              <fieldset className="border-0 p-0">
                <legend className="mb-8 block w-full font-bebas text-[clamp(1.5rem,4vw,2.25rem)] leading-tight tracking-wide text-mist">
                  What are you trying to achieve most right now?
                </legend>
                <div className="space-y-2">
                  {GOALS.map((goal) => (
                    <label
                      key={goal}
                      className={`flex cursor-pointer items-center gap-3.5 rounded-lg border border-white/10 bg-charcoal/50 px-4 py-3.5 transition hover:border-white/20 md:px-5 md:py-4 ${
                        answers.goals.includes(goal) ? optionSelectedClass : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="size-[1.125rem] shrink-0 accent-gold"
                        checked={answers.goals.includes(goal)}
                        onChange={() => toggleGoal(goal)}
                      />
                      <span className="font-garamond text-base text-mist md:text-[1.05rem]">{goal}</span>
                    </label>
                  ))}
                </div>
                {answers.goals.includes('Other') ? (
                  <input
                    type="text"
                    placeholder="Tell us more…"
                    className={`${inputClass} mt-4`}
                    value={answers.goalsOther}
                    onChange={(e) => onChange({ goalsOther: e.target.value })}
                  />
                ) : null}
              </fieldset>
            ) : null}

            {step === 3 ? (
              <div>
                <h2 className="mb-8 font-bebas text-[clamp(1.5rem,4vw,2.25rem)] leading-tight tracking-wide text-mist">
                  What&apos;s your biggest frustration right now?
                </h2>
                <textarea
                  rows={6}
                  placeholder="Type your answer here…"
                  className={`${inputClass} min-h-[160px] resize-y`}
                  value={answers.frustration}
                  onChange={(e) => onChange({ frustration: e.target.value })}
                />
              </div>
            ) : null}
          </div>

          <div className="mt-auto flex shrink-0 items-center justify-between gap-4 border-t border-white/10 pt-8">
            <button
              type="button"
              onClick={onBack}
              className="font-garamond text-sm tracking-[0.12em] text-mist/50 uppercase transition hover:text-mist"
            >
              Back
            </button>
            {step === 1 && beginnerSelected ? (
              <Link
                to="/faq"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-8 font-garamond text-xs tracking-[0.2em] uppercase text-void transition hover:bg-gold/90"
              >
                See FAQ instead
              </Link>
            ) : (
              <button
                type="button"
                onClick={onNext}
                disabled={submitting || !canAdvance}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-8 font-garamond text-xs tracking-[0.2em] uppercase text-void transition hover:bg-gold/90 disabled:opacity-50"
              >
                {submitting ? 'Saving…' : isLast ? 'Choose a time' : 'Next'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
