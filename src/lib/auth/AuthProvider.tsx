import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { isDemoLoginEnabled, SEED_DATA_SESSION_KEY, seedSignInAsAdmin, clearStoredSeedSession, isRealSupabaseAuthEnabled } from '../demo/flags'
import { isSupabaseConfigured, supabase } from '../supabase/client'
import { setLeadUserId } from '../leads/track'
import { PROFILE_FIELDS } from '../profile/saveProfile'
import type { Profile, Role } from '../supabase/types'

type AuthResult = { error: string | null }

type AuthContextValue = {
  loading: boolean
  session: Session | null
  profile: Profile | null
  role: Role | null
  isAuthed: boolean
  isAdmin: boolean
  /** True when Supabase keys are absent (full mock auth). */
  mockMode: boolean
  /** True when exploring with built-in seed data (mock mode or VITE_DEMO_LOGIN session). */
  useSeedData: boolean
  demoLoginEnabled: boolean
  /** Demo build: seed login always uses admin role so both dashboards are reachable. */
  seedSignInAsAdmin: boolean
  signInWithPassword: (email: string, password: string) => Promise<AuthResult>
  signUp: (email: string, password: string, fullName: string) => Promise<AuthResult>
  signInWithOtp: (email: string) => Promise<AuthResult>
  resetPassword: (email: string) => Promise<AuthResult>
  updatePassword: (password: string) => Promise<AuthResult>
  signOut: () => Promise<void>
  enterSeedDataLogin: (role: Role) => Promise<void>
  setMockRole: (role: Role) => void
  refreshProfile: () => Promise<void>
  setLocalProfile: (patch: Partial<Profile>) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

// When Supabase is not configured we expose a local mock session so the entire
// authed/admin surface is explorable. Role is toggleable for demoing RBAC.
const MOCK_PROFILE: Profile = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'demo.admin@practicaldrumming.dev',
  full_name: 'Demo Admin',
  role: 'admin',
  avatar_url: '/about-mike.png',
  phone: '',
  location: '',
  bio: '',
}

function readStoredSeedRole(): Role | null {
  try {
    const raw = sessionStorage.getItem(SEED_DATA_SESSION_KEY)
    return raw === 'admin' || raw === 'member' ? raw : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const mockMode = !isSupabaseConfigured
  const demoLoginEnabled = isDemoLoginEnabled
  const realAuth = isRealSupabaseAuthEnabled(isSupabaseConfigured)
  const forceAdminSeed = seedSignInAsAdmin(mockMode)
  const storedSeedRole = readStoredSeedRole()
  const [seedDataActive, setSeedDataActive] = useState(
    () => !realAuth && demoLoginEnabled && storedSeedRole !== null,
  )
  const useSeedData = seedDataActive
  const [loading, setLoading] = useState(mockMode ? false : !seedDataActive)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(seedDataActive ? MOCK_PROFILE : null)
  const [mockRole, setMockRole] = useState<Role>(
    () => (forceAdminSeed ? 'admin' : storedSeedRole) ?? 'admin',
  )

  const loadProfile = useCallback(async (userId: string, fallbackEmail?: string) => {
    if (!supabase) return
    const { data } = await supabase
      .from('profiles')
      .select(PROFILE_FIELDS)
      .eq('id', userId)
      .maybeSingle()
    if (data) {
      setProfile(data as Profile)
    } else {
      setProfile({
        id: userId,
        email: fallbackEmail ?? '',
        full_name: '',
        role: 'member',
        avatar_url: null,
        phone: null,
        location: null,
        bio: null,
      })
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (useSeedData || !session?.user?.id) return
    await loadProfile(session.user.id, session.user.email ?? undefined)
  }, [useSeedData, session, loadProfile])

  const setLocalProfile = useCallback(
    (patch: Partial<Profile>) => {
      setProfile((prev) => {
        const base = useSeedData
          ? { ...MOCK_PROFILE, role: mockRole }
          : prev ?? {
              id: session?.user?.id ?? '',
              email: session?.user?.email ?? '',
              full_name: '',
              role: 'member' as Role,
            }
        return { ...base, ...patch }
      })
    },
    [useSeedData, mockRole, session],
  )

  useEffect(() => {
    if (!realAuth) return
    clearStoredSeedSession()
    setSeedDataActive(false)
  }, [realAuth])

  useEffect(() => {
    if (mockMode || !supabase) return

    let active = true

    async function bootstrap() {
      const { data } = await supabase!.auth.getSession()
      if (!active) return
      setSession(data.session)
      if (data.session?.user) {
        await loadProfile(data.session.user.id, data.session.user.email ?? undefined)
      }
      if (active) setLoading(false)
    }

    void bootstrap()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void (async () => {
        setLoading(true)
        setSession(nextSession)
        if (nextSession?.user) {
          setSeedDataActive(false)
          clearStoredSeedSession()
          await loadProfile(nextSession.user.id, nextSession.user.email ?? undefined)
        } else {
          setProfile(null)
        }
        setLoading(false)
      })()
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [mockMode, loadProfile])

  const signInWithPassword = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (!supabase) return { error: null }
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error: error?.message ?? null }
    },
    [],
  )

  const signUp = useCallback(
    async (email: string, password: string, fullName: string): Promise<AuthResult> => {
      if (!supabase) return { error: null }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })
      return { error: error?.message ?? null }
    },
    [],
  )

  const signInWithOtp = useCallback(async (email: string): Promise<AuthResult> => {
    if (!supabase) return { error: null }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    })
    return { error: error?.message ?? null }
  }, [])

  const resetPassword = useCallback(async (email: string): Promise<AuthResult> => {
    if (!supabase) return { error: 'Auth is not configured' }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })
    return { error: error?.message ?? null }
  }, [])

  const updatePassword = useCallback(async (password: string): Promise<AuthResult> => {
    if (!supabase) return { error: 'Auth is not configured' }
    const { error } = await supabase.auth.updateUser({ password })
    return { error: error?.message ?? null }
  }, [])

  const signOut = useCallback(async () => {
    setSeedDataActive(false)
    clearStoredSeedSession()
    if (!supabase) {
      setProfile(null)
      setSession(null)
      return
    }
    await supabase.auth.signOut()
    setProfile(null)
    setSession(null)
  }, [])

  const updateMockRole = useCallback(
    (role: Role) => {
      const effectiveRole = forceAdminSeed ? 'admin' : role
      setMockRole(effectiveRole)
      if (seedDataActive) {
        try {
          sessionStorage.setItem(SEED_DATA_SESSION_KEY, effectiveRole)
        } catch {
          /* no-op */
        }
      }
    },
    [forceAdminSeed, seedDataActive],
  )

  const enterSeedDataLogin = useCallback(
    async (role: Role) => {
      if (realAuth) return
      const effectiveRole = forceAdminSeed ? 'admin' : role
      if (supabase) await supabase.auth.signOut()
      setSession(null)
      setMockRole(effectiveRole)
      setProfile(MOCK_PROFILE)
      setSeedDataActive(true)
      try {
        sessionStorage.setItem(SEED_DATA_SESSION_KEY, effectiveRole)
      } catch {
        /* no-op */
      }
      setLoading(false)
    },
    [forceAdminSeed, realAuth],
  )

  const effectiveProfile = useSeedData ? { ...MOCK_PROFILE, role: mockRole } : profile

  useEffect(() => {
    setLeadUserId(session?.user?.id ?? null)
  }, [session])

  const value = useMemo<AuthContextValue>(
    () => ({
      loading,
      session,
      profile: effectiveProfile,
      role: effectiveProfile?.role ?? null,
      isAuthed: useSeedData ? true : Boolean(session),
      isAdmin: effectiveProfile?.role === 'admin',
      mockMode,
      useSeedData,
      demoLoginEnabled,
      seedSignInAsAdmin: forceAdminSeed,
      signInWithPassword,
      signUp,
      signInWithOtp,
      resetPassword,
      updatePassword,
      signOut,
      enterSeedDataLogin,
      setMockRole: updateMockRole,
      refreshProfile,
      setLocalProfile,
    }),
    [
      loading,
      session,
      effectiveProfile,
      mockMode,
      useSeedData,
      demoLoginEnabled,
      forceAdminSeed,
      signInWithPassword,
      signUp,
      signInWithOtp,
      resetPassword,
      updatePassword,
      signOut,
      enterSeedDataLogin,
      updateMockRole,
      refreshProfile,
      setLocalProfile,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
