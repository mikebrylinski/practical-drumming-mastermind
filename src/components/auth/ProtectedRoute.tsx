import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/auth/AuthProvider'

function AuthLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <span className="font-garamond text-sm tracking-[0.2em] text-mist/40 uppercase">
        Loading…
      </span>
    </div>
  )
}

export function ProtectedRoute({ children }: { children?: ReactNode }) {
  const { isAuthed, loading } = useAuth()
  const location = useLocation()

  if (loading) return <AuthLoading />
  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children ? <>{children}</> : <Outlet />
}

export function RequireAdmin({ children }: { children?: ReactNode }) {
  const { isAuthed, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) return <AuthLoading />
  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return children ? <>{children}</> : <Outlet />
}
