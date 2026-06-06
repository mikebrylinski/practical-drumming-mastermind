import { useEffect, useState, type FormEvent } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { AppShell } from '../../components/app/AppShell'
import { useAuth } from '../../lib/auth/AuthProvider'

type Mode = 'password' | 'signup' | 'magic'
type SeedRole = 'admin' | 'member'
type SeedStep = 'choose' | 'confirm'

const SEED_COPY: Record<
  SeedRole,
  { title: string; subtitle: string; destination: string; path: string }
> = {
  member: {
    title: 'Member dashboard',
    subtitle: 'Weekly cohorts, live sessions, vault, and community — all loaded from seed data.',
    destination: 'Member dashboard',
    path: '/dashboard',
  },
  admin: {
    title: 'Admin dashboard',
    subtitle: 'Cohorts, availability, bookings, applications, and CRM — all loaded from seed data.',
    destination: 'Admin dashboard',
    path: '/admin',
  },
}

const goldBtn =
  'flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-gold px-5 font-garamond text-sm tracking-[0.16em] uppercase text-void transition hover:bg-gold/90 disabled:opacity-50'

const outlineBtn =
  'flex min-h-11 flex-1 items-center justify-center rounded-full border border-gold/40 px-5 font-garamond text-sm tracking-[0.16em] text-gold uppercase transition hover:bg-gold/10'

const inputClass =
  'w-full rounded-lg border border-white/12 bg-charcoal/40 px-4 py-2.5 font-garamond text-mist placeholder:text-mist/35 outline-none transition focus:border-gold/45'

export function LoginPage() {
  const {
    mockMode,
    demoLoginEnabled,
    seedSignInAsAdmin,
    enterSeedDataLogin,
    signInWithPassword,
    signUp,
    signInWithOtp,
  } = useAuth()
  const showSeedLogin = mockMode || demoLoginEnabled
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const navState = location.state as { from?: string; seedRole?: SeedRole } | null
  const from = navState?.from ?? '/dashboard'

  const [mode, setMode] = useState<Mode>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [seedStep, setSeedStep] = useState<SeedStep>('choose')
  const [selectedRole, setSelectedRole] = useState<SeedRole | null>(null)

  useEffect(() => {
    if (!showSeedLogin) return
    const paramRole = searchParams.get('role')
    const hintedRole =
      navState?.seedRole ??
      (paramRole === 'admin' || paramRole === 'member' ? paramRole : null) ??
      (from.startsWith('/admin') ? 'admin' : from.startsWith('/dashboard') ? 'member' : null)
    if (hintedRole) {
      setSelectedRole(hintedRole)
      setSeedStep('confirm')
    }
  }, [showSeedLogin, searchParams, navState?.seedRole, from])

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

  function selectSeedRole(role: SeedRole) {
    setSelectedRole(role)
    setSeedStep('confirm')
  }

  async function seedContinue() {
    if (!selectedRole) return
    await enterSeedDataLogin(selectedRole)
    navigate(SEED_COPY[selectedRole].path, { replace: true })
  }

  const seedInfo = selectedRole ? SEED_COPY[selectedRole] : null
  const onSeedConfirm = showSeedLogin && seedStep === 'confirm' && seedInfo

  return (
    <AppShell
      eyebrow="Members"
      title={onSeedConfirm ? seedInfo.title : 'Sign in'}
      subtitle={
        onSeedConfirm
          ? seedInfo.subtitle
          : 'Access your mastermind dashboard.'
      }
    >
      <div className="mx-auto max-w-md">
        {showSeedLogin && seedStep === 'choose' ? (
          <div className="mb-6 rounded-xl border border-gold/25 bg-gold/5 p-5">
            <p className="font-garamond text-xs tracking-[0.2em] text-gold uppercase">
              Seed data
            </p>
            <p className="mt-2 font-garamond text-sm text-mist/65">
              Preview the site with built-in demo data — no password required.
            </p>
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={() => selectSeedRole('member')} className={goldBtn}>
                Member
              </button>
              <button type="button" onClick={() => selectSeedRole('admin')} className={outlineBtn}>
                Admin
              </button>
            </div>
          </div>
        ) : null}

        {onSeedConfirm ? (
          <div className="rounded-xl border border-gold/25 bg-gold/5 p-5">
            <p className="font-garamond text-xs tracking-[0.2em] text-gold uppercase">
              Seed data preview
            </p>
            <p className="mt-3 font-garamond text-sm leading-relaxed text-mist/65">
              You&apos;re about to open the {selectedRole} view with demo fixtures. Nothing you
              change here is saved to a live database.
              {seedSignInAsAdmin ? (
                <>
                  {' '}
                  For this build you&apos;ll sign in as admin so both member and admin areas are
                  available.
                </>
              ) : null}
            </p>
            <button type="button" onClick={seedContinue} className={`${goldBtn} mt-5`}>
              Continue to {seedInfo.destination}
            </button>
            <button
              type="button"
              onClick={() => {
                setSeedStep('choose')
                setSelectedRole(null)
              }}
              className="mt-3 w-full font-garamond text-xs tracking-[0.14em] text-mist/45 uppercase transition hover:text-gold"
            >
              ← Back
            </button>
          </div>
        ) : null}

        {!mockMode && seedStep === 'choose' ? (
          <>
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
          </>
        ) : null}
      </div>
    </AppShell>
  )
}
