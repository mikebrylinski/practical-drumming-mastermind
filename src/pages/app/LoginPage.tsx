import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppShell } from '../../components/app/AppShell'
import { useAuth } from '../../lib/auth/AuthProvider'

type Mode = 'password' | 'signup' | 'magic'

const goldBtn =
  'flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-gold px-5 font-garamond text-sm tracking-[0.16em] uppercase text-void transition hover:bg-gold/90 disabled:opacity-50'

const inputClass =
  'w-full rounded-lg border border-white/12 bg-charcoal/40 px-4 py-2.5 font-garamond text-mist placeholder:text-mist/35 outline-none transition focus:border-gold/45'

export function LoginPage() {
  const { mockMode, signInWithPassword, signUp, signInWithOtp, setMockRole } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  const [mode, setMode] = useState<Mode>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setNotice(null)

    let res: { error: string | null } = { error: null }
    if (mode === 'password') res = await signInWithPassword(email, password)
    else if (mode === 'signup') res = await signUp(email, password, fullName)
    else res = await signInWithOtp(email)

    setBusy(false)
    if (res.error) {
      setError(res.error)
      return
    }
    if (mode === 'magic') {
      setNotice('Check your inbox for a magic sign-in link.')
      return
    }
    if (mode === 'signup') {
      setNotice('Account created. You can sign in now (confirm your email if required).')
      setMode('password')
      return
    }
    navigate(from, { replace: true })
  }

  function mockEnter(role: 'admin' | 'member') {
    setMockRole(role)
    navigate(role === 'admin' ? '/admin' : '/dashboard', { replace: true })
  }

  return (
    <AppShell eyebrow="Members" title="Sign in" subtitle="Access your mastermind dashboard.">
      <div className="mx-auto max-w-md">
        {mockMode ? (
          <div className="mb-6 rounded-xl border border-gold/25 bg-gold/5 p-5">
            <p className="font-garamond text-xs tracking-[0.2em] text-gold uppercase">
              Demo mode
            </p>
            <p className="mt-2 font-garamond text-sm text-mist/65">
              Supabase keys are not configured, so authentication is mocked. Jump straight in to
              explore the platform.
            </p>
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={() => mockEnter('admin')} className={goldBtn}>
                Enter as Admin
              </button>
              <button
                type="button"
                onClick={() => mockEnter('member')}
                className="flex min-h-11 w-full items-center justify-center rounded-full border border-gold/40 px-5 font-garamond text-sm tracking-[0.16em] text-gold uppercase transition hover:bg-gold/10"
              >
                Enter as Member
              </button>
            </div>
          </div>
        ) : null}

        <div className="mb-5 flex gap-2">
          {(['password', 'magic', 'signup'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m)
                setError(null)
                setNotice(null)
              }}
              className={`flex-1 rounded-full px-3 py-1.5 font-garamond text-xs tracking-[0.14em] uppercase transition ${
                mode === m
                  ? 'bg-gold/20 text-gold ring-1 ring-gold/40'
                  : 'bg-white/5 text-mist/55 hover:text-mist'
              }`}
            >
              {m === 'password' ? 'Sign in' : m === 'magic' ? 'Magic link' : 'Sign up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' ? (
            <input
              className={inputClass}
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
          ) : null}
          <input
            className={inputClass}
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {mode !== 'magic' ? (
            <input
              className={inputClass}
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
          ) : null}

          {error ? <p className="font-garamond text-sm text-red-400/90">{error}</p> : null}
          {notice ? <p className="font-garamond text-sm text-gold/90">{notice}</p> : null}

          <button type="submit" className={goldBtn} disabled={busy}>
            {busy
              ? 'Working…'
              : mode === 'password'
                ? 'Sign in'
                : mode === 'signup'
                  ? 'Create account'
                  : 'Send magic link'}
          </button>
        </form>
      </div>
    </AppShell>
  )
}
