import { useState } from 'react'
import type { FormEvent } from 'react'
import { trackLeadEvent } from '../lib/leads/track'
import { getRecaptchaToken, isRecaptchaEnabled } from '../lib/recaptcha'

const inputClass =
  'mt-1.5 w-full border border-white/10 bg-void/80 px-3 py-2 font-garamond text-sm text-mist placeholder:text-mist/30 outline-none transition focus:border-gold/50 focus:ring-1 focus:ring-gold/30'

export function FooterContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    try {
      const recaptchaToken = await getRecaptchaToken('contact')
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, recaptchaToken }),
      })
      if (!res.ok) throw new Error('Request failed')
      trackLeadEvent('form_submit', { type: 'contact', email })
      setStatus('success')
      setName('')
      setEmail('')
      setMessage('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="font-garamond text-sm leading-relaxed text-mist/70">
        Thanks — your message was sent. We&apos;ll be in touch soon.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-center font-garamond text-[0.7rem] tracking-[0.28em] uppercase text-gold/75">
        Get in touch
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block font-garamond text-xs text-mist/60">
          Name
          <input
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block font-garamond text-xs text-mist/60">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </label>
      </div>
      <label className="block font-garamond text-xs text-mist/60">
        Message
        <textarea
          required
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputClass} resize-y min-h-[4.5rem]`}
        />
      </label>
      {status === 'error' ? (
        <p className="font-garamond text-xs text-red-300/90">
          Something went wrong. Please try again or use the Apply page.
        </p>
      ) : null}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-gold/40 bg-gold/10 px-6 font-garamond text-xs tracking-[0.2em] uppercase text-gold transition hover:border-gold hover:bg-gold/20 disabled:opacity-50"
        >
          {status === 'submitting' ? 'Sending…' : 'Send message'}
        </button>
      </div>
      {isRecaptchaEnabled() ? (
        <p className="text-center font-garamond text-[0.65rem] leading-relaxed text-mist/35">
          Protected by reCAPTCHA. Google&apos;s{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-mist/20 underline-offset-2 hover:text-mist/55"
          >
            Privacy Policy
          </a>{' '}
          and{' '}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-mist/20 underline-offset-2 hover:text-mist/55"
          >
            Terms
          </a>{' '}
          apply.
        </p>
      ) : null}
    </form>
  )
}
