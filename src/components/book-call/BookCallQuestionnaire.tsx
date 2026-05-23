import type { BookCallAnswers, DrummerLevel, Seriousness } from './types'
import { LockIcon } from './icons'

const LEVELS: DrummerLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Touring/Professional']

const GOALS = [
  'Improve technique',
  'Play professionally',
  'Build confidence',
  'Join/start a band',
  'Record music',
  'Tour',
  'Networking',
  'Other',
] as const

const SERIOUSNESS_OPTIONS: { value: Seriousness; title: string; subtitle: string; locked?: boolean }[] = [
  { value: 'Curious', title: 'Curious', subtitle: "I'm exploring my options" },
  { value: 'Committed', title: 'Committed', subtitle: "I'm ready to level up" },
  { value: 'All In', title: 'All In', subtitle: "I'm ready to make a real change", locked: true },
]

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
  const progress = ((step + 1) / 5) * 100
  const isLast = step === 4

  function toggleGoal(goal: string) {
    const goals = answers.goals.includes(goal)
      ? answers.goals.filter((g) => g !== goal)
      : [...answers.goals, goal]
    onChange({ goals })
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <div
        className="mb-8 h-0.5 w-full overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={5}
        aria-label={`Question ${step + 1} of 5`}
      >
        <div
          className="h-full rounded-full bg-gold transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {step === 0 ? (
        <fieldset className="border-0 p-0">
          <legend className="mb-6 block w-full text-center font-bebas text-2xl tracking-wide text-mist md:text-3xl">
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
        </fieldset>
      ) : null}

      {step === 1 ? (
        <fieldset className="border-0 p-0">
          <legend className="mb-6 block w-full text-center font-bebas text-2xl tracking-wide text-mist md:text-3xl">
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

      {step === 2 ? (
        <div>
          <h2 className="mb-6 text-center font-bebas text-2xl tracking-wide text-mist md:text-3xl">
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

      {step === 3 ? (
        <fieldset className="border-0 p-0">
          <legend className="mb-6 block w-full text-center font-bebas text-2xl tracking-wide text-mist md:text-3xl">
            How serious are you about improving this year?
          </legend>
          <div className="space-y-3">
            {SERIOUSNESS_OPTIONS.map(({ value, title, subtitle, locked }) => {
              const selected = answers.seriousness === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onChange({ seriousness: value })}
                  className={`${optionCardClass} ${
                    selected ? optionSelectedClass : ''
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block font-garamond text-lg text-mist md:text-xl">{title}</span>
                      <span className="mt-1 block text-base leading-snug text-mist/55 md:text-[1.05rem]">{subtitle}</span>
                    </span>
                    {locked && selected ? (
                      <LockIcon className="text-gold/80" aria-hidden />
                    ) : null}
                  </span>
                </button>
              )
            })}
          </div>
        </fieldset>
      ) : null}

      {step === 4 ? (
        <div>
          <h2 className="mb-6 text-center font-bebas text-2xl tracking-wide text-mist md:text-3xl">
            Let&apos;s get your contact info.
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

      <div className="mt-10 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={step === 0}
          className="font-garamond text-sm tracking-[0.12em] text-mist/50 uppercase transition hover:text-mist disabled:invisible"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={submitting || !canAdvance}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-8 font-garamond text-xs tracking-[0.2em] uppercase text-void transition hover:bg-gold/90 disabled:opacity-50"
        >
          {submitting ? 'Submitting…' : isLast ? 'Submit & Continue' : 'Next'}
        </button>
      </div>
    </div>
  )
}
