import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ScrollToTop } from './components/ScrollToTop'
import { SiteLayout } from './components/SiteLayout'
import { ProtectedRoute, RequireAdmin } from './components/auth/ProtectedRoute'
import { HomePage2 } from './pages/HomePage2'
import { AboutPage } from './pages/AboutPage'
import { ApplyPage } from './pages/ApplyPage'
import { FaqPage } from './pages/FaqPage'
import { ClubPage } from './pages/ClubPage'
import { MembersPage } from './pages/MembersPage'
import { LoginPage } from './pages/app/LoginPage'
import { ProfilePage } from './pages/app/ProfilePage'
import { CohortsPage } from './pages/app/CohortsPage'
import { CohortDetailPage } from './pages/app/CohortDetailPage'
import { SessionsPage } from './pages/app/SessionsPage'
import { VaultPage } from './pages/app/VaultPage'
import { MyBookingsPage } from './pages/app/MyBookingsPage'
import { BookPage } from './pages/app/BookPage'
// LiveKit room is heavy; load it on demand to keep the main bundle lean.
const RoomPage = lazy(() =>
  import('./pages/app/RoomPage').then((m) => ({ default: m.RoomPage })),
)
import { AdminHome } from './pages/admin/AdminHome'
import { AdminMembers } from './pages/admin/AdminMembers'
import { AdminMemberDetail } from './pages/admin/AdminMemberDetail'
import { AdminCohorts } from './pages/admin/AdminCohorts'
import { AdminApplications } from './pages/admin/AdminApplications'
import { AdminAvailability } from './pages/admin/AdminAvailability'
import { AdminBookings } from './pages/admin/AdminBookings'
import { LeadsPage } from './pages/admin/LeadsPage'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Full-screen LiveKit room (no marketing chrome) */}
        <Route
          path="/room/:roomName"
          element={
            <ProtectedRoute>
              <Suspense
                fallback={
                  <div className="flex min-h-svh items-center justify-center bg-void font-garamond text-sm tracking-[0.2em] text-mist/40 uppercase">
                    Loading room…
                  </div>
                }
              >
                <RoomPage />
              </Suspense>
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<SiteLayout />}>
          {/* Marketing */}
          <Route index element={<HomePage2 />} />
          <Route path="home-2" element={<Navigate to="/" replace />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="apply" element={<ApplyPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="club" element={<ClubPage />} />
          {/* /members retired — redirect to the member dashboard */}
          <Route path="members" element={<Navigate to="/dashboard" replace />} />

          {/* Auth + public booking */}
          <Route path="login" element={<LoginPage />} />
          <Route path="book/:slug" element={<BookPage />} />

          {/* Member (auth required) */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<MembersPage />} />
            <Route path="cohorts" element={<CohortsPage />} />
            <Route path="cohorts/:cohortId" element={<CohortDetailPage />} />
            <Route path="vault" element={<VaultPage />} />
            <Route path="sessions" element={<SessionsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="my-bookings" element={<MyBookingsPage />} />
          </Route>

          {/* Admin (admin role required) */}
          <Route element={<RequireAdmin />}>
            <Route path="admin" element={<AdminHome />} />
            <Route path="admin/members" element={<AdminMembers />} />
            <Route path="admin/member/:id" element={<AdminMemberDetail />} />
            <Route path="admin/cohorts" element={<AdminCohorts />} />
            <Route path="admin/sessions" element={<Navigate to="/admin/cohorts" replace />} />
            <Route path="admin/applications" element={<AdminApplications />} />
            <Route path="admin/availability" element={<AdminAvailability />} />
            <Route path="admin/bookings" element={<AdminBookings />} />
            <Route path="admin/leads" element={<LeadsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
