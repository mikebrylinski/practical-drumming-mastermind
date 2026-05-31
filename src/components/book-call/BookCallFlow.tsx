import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { markSlotBooked } from '../../lib/booking/slotStore'
import { supabase } from '../../lib/supabase/client'
import { trackLeadEvent } from '../../lib/leads/track'
import type { AvailabilitySlot } from '../../lib/supabase/types'
import { SectionGridOverlay } from '../SectionGridOverlay'
import { BookCallIntro } from './BookCallIntro'
import { BookCallQuestionnaire } from './BookCallQuestionnaire'
import { BookCallScheduler } from './BookCallScheduler'
import { BookCallStepIndicator } from './BookCallStepIndicator'
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
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [confirmed, setConfirmed] = useState<{ dateLabel: string; roomName: string | null } | null>(
    null,
  )

  function patchAnswers(patch: Partial<BookCallAnswers>) {
    setAnswers((prev) => ({ ...prev, ...patch }))
  }

  async function submitApplication(slot: AvailabilitySlot) {
    setSubmitting(true)
    setSubmitError(false)
    try {
      const applyRes = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'book-a-call',
          slotId: slot.id,
          startsAt: slot.starts_at,
          ...answers,
        }),
      })
      if (!applyRes.ok) throw new Error('Application failed')

      const bookRes = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: slot.id,
          name: answers.fullName,
          email: answers.email,
          userId: null,
        }),
      })
      const bookJson = await bookRes.json()
      if (!bookRes.ok || !bookJson.ok) throw new Error(bookJson.error || 'Booking failed')

      if (!supabase) markSlotBooked(slot.id)

      trackLeadEvent('form_submit', { type: 'book-a-call', email: answers.email })
      trackLeadEvent('booking_created', { email: answers.email, slotId: slot.id })

      setSelectedSlot(slot)
      setConfirmed({
        dateLabel: new Date(slot.starts_at).toLocaleString(undefined, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        }),
        roomName: bookJson.booking?.livekit_room_name ?? null,
      })
      setPhase('confirmed')
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
    setSubmitError(false)
    setPhase('schedule')
  }

  function handleQuestionBack() {
    if (step > 0) {
      setStep((s) => s - 1)
      return
    }
    setPhase('intro')
  }

  function handleSlotSelect(slot: AvailabilitySlot) {
    trackLeadEvent('booking_click', { source: 'apply-scheduler', slotId: slot.id })
    void submitApplication(slot)
  }

  function resetFlow() {
    setPhase('intro')
    setStep(0)
    setAnswers(initialBookCallAnswers)
    setSelectedSlot(null)
    setConfirmed(null)
    setSubmitError(false)
  }

  const contentMinH =
    'min-h-[calc(100svh-13.5rem)] sm:min-h-[calc(100svh-15rem)] md:min-h-[calc(100svh-16rem)]'
  const stepPanelClass = `flex ${contentMinH} flex-col justify-center py-6 sm:py-8`

  return (
    <section className="relative overflow-hidden border-t border-white/[0.06] bg-void px-5 py-14 sm:px-8 sm:py-16 md:px-10 md:py-20 lg:py-24">
      <SectionGridOverlay />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(201,165,92,0.12),transparent)]"
        aria-hidden
      />
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <BookCallStepIndicator phase={phase} questionStep={step} />
        <div className={`relative ${contentMinH}`}>
          <AnimatePresence mode="wait">
          {phase === 'intro' ? (
            <motion.div
              key="intro"
              className={stepPanelClass}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <BookCallIntro
                onStart={() => {
                  trackLeadEvent('booking_click', { source: 'book-call-intro' })
                  setStep(0)
                  setPhase('questions')
                }}
              />
            </motion.div>
          ) : null}

          {phase === 'questions' ? (
            <motion.div
              key="questions"
              className={stepPanelClass}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
            >
              <BookCallQuestionnaire
                step={step}
                answers={answers}
                canAdvance={canAdvanceStep(step, answers)}
                onChange={patchAnswers}
                onBack={handleQuestionBack}
                onNext={handleQuestionNext}
                submitting={false}
              />
            </motion.div>
          ) : null}

          {phase === 'schedule' ? (
            <motion.div
              key="schedule"
              className={`${stepPanelClass} justify-start overflow-y-auto`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <BookCallScheduler
                selectedSlot={selectedSlot}
                onSelectSlot={handleSlotSelect}
                onBack={() => {
                  setSubmitError(false)
                  setPhase('questions')
                  setStep(4)
                }}
                submitting={submitting}
              />
              {submitError ? (
                <p className="mt-6 text-center font-garamond text-sm text-red-400/90">
                  Something went wrong booking your call. Please try another time or try again.
                </p>
              ) : null}
            </motion.div>
          ) : null}

          {phase === 'confirmed' && confirmed ? (
            <motion.div
              key="confirmed"
              className={stepPanelClass}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="mx-auto w-full max-w-lg rounded-xl border border-gold/30 bg-gold/5 p-8 text-center sm:p-10">
              <p className="font-garamond text-xs tracking-[0.3em] text-gold uppercase">You&apos;re booked</p>
              <h2 className="mt-4 font-bebas text-3xl text-mist">See you soon.</h2>
              <p className="mt-4 font-garamond text-base leading-relaxed text-mist/70">{confirmed.dateLabel}</p>
              {confirmed.roomName ? (
                <p className="mt-2 font-garamond text-sm text-mist/45">
                  Room link will be in your confirmation email.
                </p>
              ) : null}
              <button
                type="button"
                onClick={resetFlow}
                className="mt-8 font-garamond text-sm text-gold underline decoration-gold/35 underline-offset-4 transition hover:text-mist"
              >
                Start over
              </button>
              </div>
            </motion.div>
          ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
