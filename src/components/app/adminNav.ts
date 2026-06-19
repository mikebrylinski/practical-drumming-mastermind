export const adminNavLinks = [
  { to: '/admin', label: 'Overview', end: true, icon: 'grid' as const },
  { to: '/admin/contacts', label: 'Contacts', icon: 'directory' as const },
  { to: '/admin/calendar', label: 'Master calendar', icon: 'calendar' as const },
  { to: '/admin/availability', label: 'Availability', icon: 'calendar' as const },
  { to: '/admin/bookings', label: 'Bookings', icon: 'message' as const },
  { to: '/admin/cohorts', label: 'Cohorts & sessions', icon: 'users' as const },
  { to: '/admin/vault', label: 'Video vault', icon: 'folder' as const },
  { to: '/admin/members', label: 'Members', icon: 'directory' as const, alsoActive: '/admin/member' },
] as const

export const TEST_ROOM_NAME = 'admin-test-room'
