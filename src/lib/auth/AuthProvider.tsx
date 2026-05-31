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
import { isSupabaseConfigured, supabase } from '../supabase/client'
import { setLeadUserId } from '../leads/track'
import type { Profile, Role } from '../supabase/types'

type AuthResult = { error: string | null }

type AuthContextValue = {
  loading: boolean
  session: Session | null
  profile: Profile | null
  role: Role | null
  isAuthed: boolean
  isAdmin: boolean
  mockMode: boolean
  signInWithPassword: (email: string, password: string) => Promise<AuthResult>
  signUp: (email: string, password: string, fullName: string) => Promise<AuthResult>
  signInWithOtp: (email: string) => Promise<AuthResult>
  signOut: () => Promise<void>
  setMockRole: (role: Role) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

// When Supabase is not configured we expose a local mock session so the entire
// authed/admin surface is explorable. Role is toggleable for demoing RBAC.
const MOCK_PROFILE: Profile = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'demo.admin@practicaldrumming.dev',
  full_name: 'Demo Admin',
  role: 'admin',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const mockMode = !isSupabaseConfigured
  const [loading, setLoading] = useState(!mockMode)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(mockMode ? MOCK_PROFILE : null)
  const [mockRole, setMockRole] = useState<Role>('admin')

  const loadProfile = useCallback(async (userId: string, fallbackEmail?: string) => {
    if (!supabase) return
    const { data } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, created_at')
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
      })
    }
  }, [])

  useEffect(() => {
    if (mockMode || !supabase) return

    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      if (data.session?.user) {
        void loadProfile(data.session.user.id, data.session.user.email ?? undefined)
      }
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      if (nextSession?.user) {
        void loadProfile(nextSession.user.id, nextSession.user.email ?? undefined)
      } else {
        setProfile(null)
      }
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

  const signOut = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setProfile(null)
    setSession(null)
  }, [])

  const effectiveProfile = mockMode
    ? { ...MOCK_PROFILE, role: mockRole }
    : profile

  useEffect(() => {
    setLeadUserId(session?.user?.id ?? null)
  }, [session])

  const value = useMemo<AuthContextValue>(
    () => ({
      loading,
      session,
      profile: effectiveProfile,
      role: effectiveProfile?.role ?? null,
      isAuthed: mockMode ? true : Boolean(session),
      isAdmin: effectiveProfile?.role === 'admin',
      mockMode,
      signInWithPassword,
      signUp,
      signInWithOtp,
      signOut,
      setMockRole,
    }),
    [
      loading,
      session,
      effectiveProfile,
      mockMode,
      signInWithPassword,
      signUp,
      signInWithOtp,
      signOut,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
