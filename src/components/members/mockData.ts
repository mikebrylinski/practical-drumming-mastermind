export const memberNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'cohorts', label: 'Cohorts', icon: 'users' },
  { id: 'vault', label: 'Session Vault', icon: 'play' },
  { id: 'qa', label: 'Q&A Board', icon: 'message' },
  { id: 'planner', label: 'Practice Planner', icon: 'calendar' },
  { id: 'community', label: 'Community', icon: 'feed' },
  { id: 'directory', label: 'Member Directory', icon: 'directory' },
  { id: 'resources', label: 'Resources', icon: 'folder' },
  { id: 'challenges', label: 'Challenges', icon: 'trophy' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
] as const

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
