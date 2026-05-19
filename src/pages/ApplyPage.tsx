import { useState } from 'react'
import type { FormEvent } from 'react'
import { Reveal } from '../components/Reveal'
import { SectionGridOverlay } from '../components/SectionGridOverlay'
import { pageWrapClass } from '../components/SectionShell'

const levels = ['Beginner', 'Intermediate', 'Advanced', 'Professional'] as const

type FormState = {
  fullName: string
  email: string
  age: string
  experienceLevel: string
  whyDrums: string
  musicShaped: string
  improveMost: string
  favoriteArtists: string
  optionalLink: string
}

const initial: FormState = {
  fullName: '',
  email: '',
  age: '',
  experienceLevel: 'Intermediate',
  whyDrums: '',
  musicShaped: '',
  improveMost: '',
  favoriteArtists: '',
  optionalLink: '',
}

export function ApplyPage() {
  const [form, setForm] = useState<FormState>(initial)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
      setForm(initial)
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'mt-2 w-full border border-white/10 bg-charcoal/80 px-4 py-3 font-garamond text-sm text-mist placeholder:text-mist/30 outline-none transition focus:border-gold/50 focus:ring-1 focus:ring-gold/30'

  return (
    <section className="relative overflow-hidden border-t border-white/[0.06] bg-void py-14 md:py-20 lg:py-28">
      <SectionGridOverlay />
      <article className={`relative z-10 ${pageWrapClass} max-w-6xl`}>
      <Reveal>
        <p className="font-garamond text-xs tracking-[0.35em] uppercase text-gold-dim">
          Application
        </p>
        <h1 className="mt-4 font-bebas text-4xl text-mist md:text-5xl">Apply for Membership</h1>
        <p className="mt-6 font-garamond text-base leading-relaxed text-mist/65 md:text-lg">
          This is a limited mentorship experience. Only 20 drummers will be accepted.
        </p>
      </Reveal>

      {status === 'success' ? (
        <Reveal className="mt-14 border border-gold/30 bg-gold/5 p-10 text-center">
          <p className="font-garamond text-base leading-relaxed text-mist md:text-lg">
            Your application has been received. If selected, you will be contacted directly.
          </p>
        </Reveal>
      ) : (
        <form onSubmit={handleSubmit} className="mt-14 space-y-8">
          <Reveal>
            <label className="block font-garamond text-sm tracking-wide text-mist/70">
              Full Name
              <input
                required
                className={inputClass}
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              />
            </label>
          </Reveal>
          <Reveal delay={0.03}>
            <label className="block font-garamond text-sm tracking-wide text-mist/70">
              Email
              <input
                required
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </label>
          </Reveal>
          <Reveal delay={0.06}>
            <label className="block font-garamond text-sm tracking-wide text-mist/70">
              Age
              <input
                required
                type="number"
                min={1}
                max={120}
                className={inputClass}
                value={form.age}
                onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
              />
            </label>
          </Reveal>
          <Reveal delay={0.09}>
            <label className="block font-garamond text-sm tracking-wide text-mist/70">
              Experience Level
              <select
                required
                className={`${inputClass} appearance-none`}
                value={form.experienceLevel}
                onChange={(e) => setForm((f) => ({ ...f, experienceLevel: e.target.value }))}
              >
                {levels.map((l) => (
                  <option key={l} value={l} className="bg-charcoal text-mist">
                    {l}
                  </option>
                ))}
              </select>
            </label>
          </Reveal>
          <Reveal delay={0.12}>
            <label className="block font-garamond text-sm tracking-wide text-mist/70">
              Why do you play drums?
              <textarea
                required
                rows={4}
                className={`${inputClass} resize-y min-h-[120px]`}
                value={form.whyDrums}
                onChange={(e) => setForm((f) => ({ ...f, whyDrums: e.target.value }))}
              />
            </label>
          </Reveal>
          <Reveal delay={0.15}>
            <label className="block font-garamond text-sm tracking-wide text-mist/70">
              What music shaped you?
              <textarea
                required
                rows={4}
                className={`${inputClass} resize-y min-h-[120px]`}
                value={form.musicShaped}
                onChange={(e) => setForm((f) => ({ ...f, musicShaped: e.target.value }))}
              />
            </label>
          </Reveal>
          <Reveal delay={0.18}>
            <label className="block font-garamond text-sm tracking-wide text-mist/70">
              What do you want to improve most?
              <textarea
                required
                rows={4}
                className={`${inputClass} resize-y min-h-[120px]`}
                value={form.improveMost}
                onChange={(e) => setForm((f) => ({ ...f, improveMost: e.target.value }))}
              />
            </label>
          </Reveal>
          <Reveal delay={0.21}>
            <label className="block font-garamond text-sm tracking-wide text-mist/70">
              Favorite bands/artists
              <input
                required
                className={inputClass}
                value={form.favoriteArtists}
                onChange={(e) => setForm((f) => ({ ...f, favoriteArtists: e.target.value }))}
              />
            </label>
          </Reveal>
          <Reveal delay={0.24}>
            <label className="block font-garamond text-sm tracking-wide text-mist/70">
              Optional link (Instagram / video / playing sample)
              <input
                type="url"
                className={inputClass}
                value={form.optionalLink}
                onChange={(e) => setForm((f) => ({ ...f, optionalLink: e.target.value }))}
                placeholder="https://"
              />
            </label>
          </Reveal>
          {status === 'error' ? (
            <p className="font-garamond text-sm text-red-400/90">
              Something went wrong. Please try again.
            </p>
          ) : null}
          <Reveal delay={0.27}>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full border border-gold/50 bg-gold/10 py-4 font-garamond text-xs tracking-[0.28em] uppercase text-gold transition hover:border-gold hover:bg-gold/20 disabled:opacity-50"
            >
              {status === 'submitting' ? 'Submitting…' : 'Submit Application'}
            </button>
          </Reveal>
        </form>
      )}
      </article>
    </section>
  )
}
