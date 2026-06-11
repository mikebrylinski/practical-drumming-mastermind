import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { SectionGridOverlay } from '../../components/SectionGridOverlay'
import { useAuth } from '../../lib/auth/AuthProvider'
import { postLoginPath } from '../../lib/auth/postLoginPath'
import { supabase } from '../../lib/supabase/client'

type AuthView = 'signin' | 'recover' | 'reset' | 'signup'
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
  'flex min-h-11 w-full items-center justify-center rounded-full bg-gold px-5 font-garamond text-sm tracking-[0.16em] uppercase text-void transition hover:bg-gold/90 disabled:opacity-50'

const outlineBtn =
  'flex min-h-11 flex-1 items-center justify-center rounded-full border border-gold/40 px-5 font-garamond text-sm tracking-[0.14em] text-gold uppercase transition hover:bg-gold/10'

const inputClass =
  'w-full rounded-lg border border-white/12 bg-charcoal/40 px-4 py-2.5 font-garamond text-mist placeholder:text-mist/35 outline-none transition focus:border-gold/45'

const labelClass = 'mb-1.5 block font-garamond text-xs tracking-[0.12em] text-mist/50 uppercase'

export function LoginPage() {
  const {
    mockMode,
    demoLoginEnabled,
    enterSeedDataLogin,
    signInWithPassword,
    signUp,
    resetPassword,
    updatePassword,
    isAuthed,
    loading,
    role,
    useSeedData,
  } = useAuth()
  const showSeedLogin = mockMode || demoLoginEnabled
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const navState = location.state as { from?: string; seedRole?: SeedRole } | null
  const from = navState?.from ?? '/dashboard'
  const roleHint =
    navState?.seedRole ??
    (searchParams.get('role') === 'admin' || searchParams.get('role') === 'member'
      ? (searchParams.get('role') as SeedRole)
      : null) ??
    (from.startsWith('/admin') ? 'admin' : from.startsWith('/dashboard') ? 'member' : null)

  useEffect(() => {
    if (loading || !isAuthed || !role) return
    if (useSeedData) return
    navigate(postLoginPath(from, role, roleHint), { replace: true })
  }, [loading, isAuthed, role, useSeedData, from, roleHint, navigate])

  const [view, setView] = useState<AuthView>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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

  useEffect(() => {
    if (!supabase) return
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setView('reset')
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  function switchView(next: AuthView) {
    setView(next)
    setError(null)
    setNotice(null)
  }

  async function handleSignIn(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setNotice(null)
    const res = await signInWithPassword(email, password)
    setBusy(false)
    if (res.error) setError(res.error)
  }

  async function handleRecover(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setNotice(null)
    const res = await resetPassword(email)
    setBusy(false)
    if (res.error) {
      setError(res.error)
      return
    }
    setNotice('Check your email for a password reset link.')
  }

  async function handleReset(e: FormEvent) {
    e.preventDefault()
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setBusy(true)
    setError(null)
    setNotice(null)
    const res = await updatePassword(newPassword)
    setBusy(false)
    if (res.error) {
      setError(res.error)
      return
    }
    setNotice('Password updated. Signing you in…')
    switchView('signin')
  }

  async function handleSignUp(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setNotice(null)
    const res = await signUp(email, password, fullName)
    setBusy(false)
    if (res.error) {
      setError(res.error)
      return
    }
    setNotice('Account created. Confirm your email if prompted, then sign in.')
    switchView('signin')
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
    <section className="relative min-h-[calc(100svh-9rem)] border-t border-white/[0.06] bg-void">
      <SectionGridOverlay />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-charcoal/25 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] xl:grid-cols-[minmax(0,1.1fr)_24rem]">
            {/* Private club */}
            <div className="border-b border-white/[0.06] bg-gradient-to-br from-charcoal/80 via-void/40 to-void/20 p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <p className="font-garamond text-xs tracking-[0.28em] text-gold uppercase">
                Private club
              </p>
              <h1 className="mt-2 font-bebas text-4xl tracking-wide text-mist md:text-5xl">
                Members only
              </h1>
              <p className="mt-3 max-w-lg font-garamond text-base leading-relaxed text-mist/65">
                The Practical Drumming Mastermind Club is a closed room for serious drummers — live
                weekly mentorship, honest feedback, and a community that shows up.
              </p>

              <p className="mt-6 font-garamond text-sm text-mist/45">
                Not a member yet?{' '}
                <Link to="/club" className="text-gold underline decoration-gold/35 underline-offset-2">
                  Learn about the club
                </Link>{' '}
                or{' '}
                <Link to="/apply" className="text-gold underline decoration-gold/35 underline-offset-2">
                  apply for access
                </Link>
                .
              </p>
            </div>

            {/* Sign in */}
            <div className="p-6 sm:p-8">
              {mockMode ? (
                <p className="mb-5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 font-garamond text-sm leading-relaxed text-mist/70">
                  Demo mode — configure Supabase in <code className="text-gold">.env</code> for real
                  sign-in.
                </p>
              ) : null}

              {showSeedLogin && seedStep === 'choose' ? (
                <div className="mb-6 rounded-xl border border-gold/25 bg-gold/5 p-4">
                  <p className="font-garamond text-xs tracking-[0.2em] text-gold uppercase">
                    Preview
                  </p>
                  <p className="mt-2 font-garamond text-sm text-mist/65">
                    Explore with built-in demo data — no password required.
                  </p>
                  <div className="mt-4 flex gap-2">
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
                <div className="rounded-xl border border-gold/25 bg-gold/5 p-4">
                  <p className="font-garamond text-xs tracking-[0.2em] text-gold uppercase">
                    Seed data preview
                  </p>
                  <p className="mt-3 font-garamond text-sm leading-relaxed text-mist/65">
                    Open the {selectedRole} view with demo fixtures. Nothing is saved to a live database.
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
                <div>
                  {view === 'signin' ? (
                    <>
                      <h2 className="font-garamond text-lg text-mist">Sign in</h2>
                      <p className="mt-1 font-garamond text-sm text-mist/50">
                        Enter the email and password for your member account.
                      </p>
                      <form onSubmit={handleSignIn} className="mt-5 space-y-4">
                        <label className="block">
                          <span className={labelClass}>Email</span>
                          <input
                            className={inputClass}
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </label>
                        <label className="block">
                          <span className={labelClass}>Password</span>
                          <input
                            className={inputClass}
                            type="password"
                            required
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => switchView('recover')}
                          className="font-garamond text-xs text-gold underline decoration-gold/35 underline-offset-2"
                        >
                          Forgot password?
                        </button>
                        {error ? <p className="font-garamond text-sm text-red-400/90">{error}</p> : null}
                        {notice ? <p className="font-garamond text-sm text-gold/90">{notice}</p> : null}
                        <button type="submit" className={goldBtn} disabled={busy}>
                          {busy ? 'Signing in…' : 'Sign in'}
                        </button>
                      </form>
                    </>
                  ) : null}

                  {view === 'recover' ? (
                    <>
                      <h2 className="font-garamond text-lg text-mist">Recover password</h2>
                      <p className="mt-1 font-garamond text-sm text-mist/50">
                        Enter your email and we&apos;ll send a link to reset your password.
                      </p>
                      <form onSubmit={handleRecover} className="mt-5 space-y-4">
                        <label className="block">
                          <span className={labelClass}>Email</span>
                          <input
                            className={inputClass}
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </label>
                        {error ? <p className="font-garamond text-sm text-red-400/90">{error}</p> : null}
                        {notice ? <p className="font-garamond text-sm text-gold/90">{notice}</p> : null}
                        <button type="submit" className={goldBtn} disabled={busy}>
                          {busy ? 'Sending…' : 'Send reset link'}
                        </button>
                      </form>
                      <button
                        type="button"
                        onClick={() => switchView('signin')}
                        className="mt-4 w-full font-garamond text-xs tracking-[0.14em] text-mist/45 uppercase transition hover:text-gold"
                      >
                        ← Back to sign in
                      </button>
                    </>
                  ) : null}

                  {view === 'reset' ? (
                    <>
                      <h2 className="font-garamond text-lg text-mist">Set new password</h2>
                      <p className="mt-1 font-garamond text-sm text-mist/50">
                        Choose a new password for your account.
                      </p>
                      <form onSubmit={handleReset} className="mt-5 space-y-4">
                        <label className="block">
                          <span className={labelClass}>New password</span>
                          <input
                            className={inputClass}
                            type="password"
                            required
                            minLength={8}
                            autoComplete="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </label>
                        <label className="block">
                          <span className={labelClass}>Confirm password</span>
                          <input
                            className={inputClass}
                            type="password"
                            required
                            minLength={8}
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </label>
                        {error ? <p className="font-garamond text-sm text-red-400/90">{error}</p> : null}
                        {notice ? <p className="font-garamond text-sm text-gold/90">{notice}</p> : null}
                        <button type="submit" className={goldBtn} disabled={busy}>
                          {busy ? 'Saving…' : 'Update password'}
                        </button>
                      </form>
                    </>
                  ) : null}

                  {view === 'signup' ? (
                    <>
                      <h2 className="font-garamond text-lg text-mist">Create account</h2>
                      <p className="mt-1 font-garamond text-sm text-mist/50">
                        Use the email you were invited with.
                      </p>
                      <form onSubmit={handleSignUp} className="mt-5 space-y-4">
                        <label className="block">
                          <span className={labelClass}>Full name</span>
                          <input
                            className={inputClass}
                            required
                            autoComplete="name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                          />
                        </label>
                        <label className="block">
                          <span className={labelClass}>Email</span>
                          <input
                            className={inputClass}
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </label>
                        <label className="block">
                          <span className={labelClass}>Password</span>
                          <input
                            className={inputClass}
                            type="password"
                            required
                            minLength={8}
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </label>
                        {error ? <p className="font-garamond text-sm text-red-400/90">{error}</p> : null}
                        {notice ? <p className="font-garamond text-sm text-gold/90">{notice}</p> : null}
                        <button type="submit" className={goldBtn} disabled={busy}>
                          {busy ? 'Creating…' : 'Create account'}
                        </button>
                      </form>
                      <button
                        type="button"
                        onClick={() => switchView('signin')}
                        className="mt-4 w-full font-garamond text-xs tracking-[0.14em] text-mist/45 uppercase transition hover:text-gold"
                      >
                        ← Back to sign in
                      </button>
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
