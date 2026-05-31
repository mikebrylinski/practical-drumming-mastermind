export const adminNavLinks = [
  { to: '/admin', label: 'Overview', end: true, icon: 'grid' as const },
  { to: '/admin/leads', label: 'CRM Leads', icon: 'feed' as const },
  { to: '/admin/applications', label: 'Applications', icon: 'folder' as const },
  { to: '/admin/availability', label: 'Availability', icon: 'calendar' as const },
  { to: '/admin/bookings', label: 'Bookings', icon: 'message' as const },
  { to: '/admin/cohorts', label: 'Cohorts', icon: 'users' as const },
  { to: '/admin/members', label: 'Members', icon: 'directory' as const, alsoActive: '/admin/member' },
] as const

export const TEST_ROOM_NAME = 'admin-test-room'
