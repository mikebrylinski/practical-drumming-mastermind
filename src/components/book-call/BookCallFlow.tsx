import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionGridOverlay } from '../SectionGridOverlay'
import { BookCallIntro } from './BookCallIntro'
import { BookCallQuestionnaire } from './BookCallQuestionnaire'
import { BookCallStepIndicator } from './BookCallStepIndicator'
import { MockScheduler } from './MockScheduler'
import {
  type BookCallAnswers,
  type BookCallPhase,
  initialBookCallAnswers,
} from './types'

function canAdvanceStep(step: number, answers: BookCallAnswers) {
  switch (step) {
    case 0:
      return answers.level !== ''
    case 1:
      return answers.goals.length > 0
    case 2:
      return answers.frustration.trim().length > 0
    case 3:
      return answers.seriousness !== ''
    case 4:
      return answers.fullName.trim() !== '' && answers.email.trim() !== ''
    default:
      return false
  }
}

export function BookCallFlow() {
  const [phase, setPhase] = useState<BookCallPhase>('intro')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<BookCallAnswers>(initialBookCallAnswers)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [booking, setBooking] = useState<{ dateLabel: string; time: string } | null>(null)

  function patchAnswers(patch: Partial<BookCallAnswers>) {
    setAnswers((prev) => ({ ...prev, ...patch }))
  }

  async function submitQuestionnaire() {
    setSubmitting(true)
    setSubmitError(false)
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'book-a-call',
          ...answers,
        }),
      })
      if (!res.ok) throw new Error('Request failed')
      setPhase('booking')
    } catch {
      setSubmitError(true)
    } finally {
      setSubmitting(false)
    }
  }

  function handleQuestionNext() {
    if (!canAdvanceStep(step, answers)) return
    if (step < 4) {
      setStep((s) => s + 1)
      return
    }
    void submitQuestionnaire()
  }

  function handleQuestionBack() {
    if (step > 0) {
      setStep((s) => s - 1)
      return
    }
    setPhase('intro')
  }

  return (
    <section className="relative overflow-hidden border-t border-white/[0.06] bg-void py-12 md:py-16 lg:py-20">
      <SectionGridOverlay />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(201,165,92,0.12),transparent)]" aria-hidden />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8">
        <BookCallStepIndicator phase={phase} questionStep={step} />
        <AnimatePresence mode="wait">
          {phase === 'intro' ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <BookCallIntro onStart={() => setPhase('questions')} />
            </motion.div>
          ) : null}

          {phase === 'questions' ? (
            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.28 }}
            >
              <BookCallQuestionnaire
                step={step}
                answers={answers}
                canAdvance={canAdvanceStep(step, answers)}
                onChange={patchAnswers}
                onBack={handleQuestionBack}
                onNext={handleQuestionNext}
                submitting={submitting}
              />
              {submitError ? (
                <p className="mt-6 text-center font-garamond text-sm text-red-400/90">
                  Something went wrong saving your answers. Please try again.
                </p>
              ) : null}
            </motion.div>
          ) : null}

          {phase === 'booking' ? (
            <motion.div
              key="booking"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <MockScheduler
                onConfirm={(b) => {
                  setBooking(b)
                  setPhase('confirmed')
                }}
              />
            </motion.div>
          ) : null}

          {phase === 'confirmed' && booking ? (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-lg border border-gold/30 bg-gold/5 p-10 text-center"
            >
              <p className="font-garamond text-xs tracking-[0.3em] text-gold uppercase">You&apos;re booked</p>
              <h2 className="mt-4 font-bebas text-3xl text-mist">See you soon.</h2>
              <p className="mt-4 font-garamond text-base leading-relaxed text-mist/70">
                {booking.dateLabel} at {booking.time}
                <br />
                <span className="text-mist/50">(Mock booking — Calendly integration coming soon.)</span>
              </p>
              <button
                type="button"
                onClick={() => {
                  setPhase('intro')
                  setStep(0)
                  setAnswers(initialBookCallAnswers)
                  setBooking(null)
                }}
                className="mt-8 font-garamond text-sm text-gold underline decoration-gold/35 underline-offset-4 transition hover:text-mist"
              >
                Start over
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  )
}
