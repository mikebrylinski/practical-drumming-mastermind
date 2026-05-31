export const memberNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'cohorts', label: 'Cohorts', icon: 'users' },
  { id: 'vault', label: 'Video Vault', icon: 'play' },
  { id: 'qa', label: 'Q&A Board', icon: 'message' },
  { id: 'planner', label: 'Practice Planner', icon: 'calendar' },
  { id: 'community', label: 'Community', icon: 'feed' },
  { id: 'directory', label: 'Member Directory', icon: 'directory' },
  { id: 'resources', label: 'Resources', icon: 'folder' },
  { id: 'challenges', label: 'Challenges', icon: 'trophy' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
] as const

/** Member nav ids that map to real routes; others are placeholders for now. */
export const memberNavRoutes: Record<string, string> = {
  dashboard: '/dashboard',
  cohorts: '/cohorts',
  vault: '/vault',
  profile: '/profile',
  settings: '/profile',
}

export const sessionVaultItems = [
  { title: 'Touring Discipline', thumb: '/about-mike-live.png' },
  { title: 'Studio Survival', thumb: '/about-mike-stage.png' },
  { title: 'Creativity Under Pressure', thumb: '/about-mike-tanya.png' },
  { title: 'Confidence On Stage', thumb: '/hero-mike-live.png' },
] as const

export const vaultFilters = [
  'All',
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
  category: (typeof vaultFilters)[number]
  duration: string
  thumb: string
  date: string
  description: string
}

export const vaultVideos: VaultVideo[] = [
  {
    id: 'v1',
    title: 'Building Confidence Behind the Kit',
    category: 'Mindset',
    duration: '48:12',
    thumb: '/hero-mike-live.png',
    date: 'May 22, 2026',
    description:
      'Mike breaks down the mental game of performing live — how to silence the inner critic and lock into the moment.',
  },
  {
    id: 'v2',
    title: 'Touring Discipline & Road Survival',
    category: 'Touring',
    duration: '36:40',
    thumb: '/about-mike-live.png',
    date: 'May 15, 2026',
    description:
      'Routines, gear prep, and the habits that keep you sharp across a 40-city run.',
  },
  {
    id: 'v3',
    title: 'Studio Survival: Tracking to a Click',
    category: 'Studio',
    duration: '52:05',
    thumb: '/about-mike-stage.png',
    date: 'May 8, 2026',
    description:
      'Getting usable takes fast — tuning, mic feel, and playing in the pocket under pressure.',
  },
  {
    id: 'v4',
    title: 'Creativity Under Pressure',
    category: 'Creativity',
    duration: '41:18',
    thumb: '/about-mike-tanya.png',
    date: 'Apr 30, 2026',
    description:
      'Turning constraints into ideas — improvisation frameworks you can use on any session.',
  },
  {
    id: 'v5',
    title: 'Ghost Notes & Dynamic Control',
    category: 'Technique',
    duration: '29:54',
    thumb: '/hero-mike-live.png',
    date: 'Apr 23, 2026',
    description: 'A deep technical session on touch, dynamics, and making a groove breathe.',
  },
  {
    id: 'v6',
    title: 'From Bedroom to Backline: Your Career',
    category: 'Career',
    duration: '57:33',
    thumb: '/about-mike-stage.png',
    date: 'Apr 16, 2026',
    description:
      'Networking, auditions, and the unglamorous work that actually builds a drumming career.',
  },
  {
    id: 'v7',
    title: 'Linear Phrasing Workshop',
    category: 'Technique',
    duration: '44:09',
    thumb: '/about-mike-live.png',
    date: 'Apr 9, 2026',
    description: 'Constructing fills and grooves with linear concepts for fluid four-limb playing.',
  },
  {
    id: 'v8',
    title: 'Confidence On Stage Q&A',
    category: 'Mindset',
    duration: '33:27',
    thumb: '/about-mike.png',
    date: 'Apr 2, 2026',
    description: 'Member questions on nerves, mistakes, and owning the performance.',
  },
]

export const communityPosts = [
  {
    name: 'Jordan Lee',
    avatar: '/about-mike.png',
    time: '2h ago',
    body: 'Finally nailed the chorus feel from last week’s session. The push-pull exercise Mike shared is a game changer.',
    likes: 12,
    comments: 4,
  },
  {
    name: 'Alex Rivera',
    avatar: '/about-mike-tanya.png',
    time: '5h ago',
    body: 'Anyone else working through the May groove challenge? Posting my take tonight.',
    likes: 8,
    comments: 6,
    image: '/about-mike-live.png',
  },
  {
    name: 'Sam Ortiz',
    avatar: '/about-mike-stage.png',
    time: 'Yesterday',
    body: 'Grateful for the honest feedback on my audition prep video. Back to the woodshed.',
    likes: 21,
    comments: 9,
  },
] as const

export const directoryMembers = [
  { name: 'Chris Nolan', tag: 'TOURING', avatar: '/about-mike-live.png' },
  { name: 'Elena Park', tag: 'STUDIO', avatar: '/about-mike.png' },
  { name: 'Marcus Webb', tag: 'EDUCATOR', avatar: '/about-mike-stage.png' },
  { name: 'Priya Shah', tag: 'TOURING', avatar: '/about-mike-tanya.png' },
] as const

export const roadmapSteps: { label: string; done: boolean; active?: boolean }[] = [
  { label: 'Foundation', done: true },
  { label: 'Growth', done: true },
  { label: 'Performance', done: false, active: true },
  { label: 'Opportunities', done: false },
]

export const countdown = { days: 5, hours: 12, minutes: 48, seconds: 37 }
