import type { Role } from '../supabase/types'

/** Where to send the user after a successful Supabase sign-in. */
export function postLoginPath(
  from: string | undefined,
  role: Role | null,
  roleHint: 'admin' | 'member' | null,
): string {
  const safeFrom = from && from !== '/login' ? from : null

  if (safeFrom?.startsWith('/admin')) {
    return role === 'admin' ? safeFrom : '/dashboard'
  }

  if (safeFrom && !safeFrom.startsWith('/admin')) {
    return safeFrom
  }

  if (roleHint === 'admin' && role === 'admin') return '/admin'
  if (roleHint === 'member') return '/dashboard'
  if (role === 'admin') return '/admin'
  return '/dashboard'
}
