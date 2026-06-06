import { useNavigate } from 'react-router-dom'
import { AppCard, AppShell } from '../../components/app/AppShell'
import { useAuth } from '../../lib/auth/AuthProvider'

export function ProfilePage() {
  const { profile, useSeedData, role, setMockRole, signOut, seedSignInAsAdmin } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <AppShell eyebrow="Account" title="Your profile">
      <div className="max-w-xl space-y-5">
        <AppCard>
          <dl className="space-y-3 font-garamond">
            <div className="flex justify-between gap-4">
              <dt className="text-mist/45">Name</dt>
              <dd className="text-mist">{profile?.full_name || '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mist/45">Email</dt>
              <dd className="text-mist">{profile?.email || '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mist/45">Role</dt>
              <dd className="text-gold uppercase tracking-[0.14em]">{role}</dd>
            </div>
          </dl>
        </AppCard>

        {useSeedData && !seedSignInAsAdmin ? (
          <AppCard>
            <p className="font-garamond text-xs tracking-[0.2em] text-gold uppercase">
              Demo role switch
            </p>
            <p className="mt-2 font-garamond text-sm text-mist/55">
              Toggle your role to preview member vs admin access.
            </p>
            <div className="mt-3 flex gap-2">
              {(['member', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setMockRole(r)}
                  className={`rounded-full px-4 py-1.5 font-garamond text-sm uppercase tracking-[0.14em] transition ${
                    role === r
                      ? 'bg-gold/20 text-gold ring-1 ring-gold/40'
                      : 'bg-white/5 text-mist/55 hover:text-mist'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </AppCard>
        ) : null}

        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-full border border-white/15 px-5 py-2.5 font-garamond text-sm tracking-[0.14em] text-mist/70 uppercase transition hover:border-red-400/40 hover:text-red-300"
        >
          Sign out
        </button>
      </div>
    </AppShell>
  )
}
