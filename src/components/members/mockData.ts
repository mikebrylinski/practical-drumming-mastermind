export const memberNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'cohorts', label: 'Cohorts', icon: 'users' },
  { id: 'vault', label: 'Video Vault', icon: 'play' },
  { id: 'community', label: 'Community', icon: 'feed' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
] as const

/** Member nav ids that map to real routes. */
export const memberNavRoutes: Record<string, string> = {
  dashboard: '/dashboard',
  cohorts: '/cohorts',
  vault: '/vault',
  community: '/community',
  profile: '/profile',
  settings: '/profile',
}

export const vaultFilters = [
  'All',
  'Live session',
  'Touring',
  'Studio',
  'Creativity',
  'Mindset',
  'Technique',
  'Career',
] as const

export type VaultVideo = {
  id: string
  title: string
  category: (typeof vaultFilters)[number] | 'Live session'
  duration: string
  thumb: string
  date: string
  description: string
  playbackUrl?: string
}

export const vaultVideos: VaultVideo[] = [
  {
    id: 'v1',
    title: 'Building Confidence Behind the Kit',
    category: 'Mindset',
    duration: '48:12',
    thumb: '/logo-dd.png',
    date: 'May 22, 2026',
    description:
      'Mike breaks down the mental game of performing live — how to silence the inner critic and lock into the moment.',
  },
  {
    id: 'v2',
    title: 'Touring Discipline & Road Survival',
    category: 'Touring',
    duration: '36:40',
    thumb: '/logo-dd.png',
    date: 'May 15, 2026',
    description:
      'Routines, gear prep, and the habits that keep you sharp across a 40-city run.',
  },
  {
    id: 'v3',
    title: 'Studio Survival: Tracking to a Click',
    category: 'Studio',
    duration: '52:05',
    thumb: '/logo-dd.png',
    date: 'May 8, 2026',
    description:
      'Getting usable takes fast — tuning, mic feel, and playing in the pocket under pressure.',
  },
  {
    id: 'v4',
    title: 'Creativity Under Pressure',
    category: 'Creativity',
    duration: '41:18',
    thumb: '/logo-dd.png',
    date: 'Apr 30, 2026',
    description:
      'Turning constraints into ideas — improvisation frameworks you can use on any session.',
  },
  {
    id: 'v5',
    title: 'Ghost Notes & Dynamic Control',
    category: 'Technique',
    duration: '29:54',
    thumb: '/logo-dd.png',
    date: 'Apr 23, 2026',
    description: 'A deep technical session on touch, dynamics, and making a groove breathe.',
  },
  {
    id: 'v6',
    title: 'From Bedroom to Backline: Your Career',
    category: 'Career',
    duration: '57:33',
    thumb: '/logo-dd.png',
    date: 'Apr 16, 2026',
    description:
      'Networking, auditions, and the unglamorous work that actually builds a drumming career.',
  },
  {
    id: 'v7',
    title: 'Linear Phrasing Workshop',
    category: 'Technique',
    duration: '44:09',
    thumb: '/logo-dd.png',
    date: 'Apr 9, 2026',
    description: 'Constructing fills and grooves with linear concepts for fluid four-limb playing.',
  },
  {
    id: 'v8',
    title: 'Confidence On Stage Q&A',
    category: 'Mindset',
    duration: '33:27',
    thumb: '/logo-dd.png',
    date: 'Apr 2, 2026',
    description: 'Member questions on nerves, mistakes, and owning the performance.',
  },
]

export const roadmapSteps: { label: string; done: boolean; active?: boolean }[] = [
  { label: 'Foundation', done: true },
  { label: 'Growth', done: true },
  { label: 'Performance', done: false, active: true },
  { label: 'Opportunities', done: false },
]
