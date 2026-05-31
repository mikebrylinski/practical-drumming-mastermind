import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MembersLayout } from './MembersLayout'
import { MembersCard } from './MembersCard'
import { MembersRoadmap } from './MembersRoadmap'
import { MembersIcon, PlayIcon } from './MembersIcons'
import { buildDemoCohorts, buildDemoSessions } from '../../lib/demo/cohorts'
import { cohortRoomName } from '../../lib/slug'
import { communityPosts, directoryMembers, vaultVideos } from './mockData'

const goldBtn =
  'flex min-h-10 items-center justify-center gap-2 rounded-full bg-gold px-5 font-garamond text-xs tracking-[0.16em] uppercase text-void transition hover:bg-gold/90 sm:min-h-9 sm:inline-flex sm:px-4 sm:text-sm'

const LIVE_WINDOW_MS = 60 * 60 * 1000

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-0 flex-1 text-center">
      <span className="font-bebas text-2xl leading-none text-mist sm:text-3xl md:text-4xl">
        {String(Math.max(0, value)).padStart(2, '0')}
      </span>
      <span className="mt-0.5 block font-garamond text-xs tracking-wider text-mist/40 uppercase sm:mt-1">
        {label}
      </span>
    </div>
  )
}

function PracticeRing() {
  const pct = 62
  const r = 52
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  return (
    <div className="relative mx-auto size-28 shrink-0 sm:size-32">
      <svg className="size-full -rotate-90" viewBox="0 0 120 120" aria-hidden>
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="#c9a55c"
          strokeWidth="8"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-bebas text-xl text-gold sm:text-2xl">312</span>
        <span className="font-garamond text-sm text-mist/50">Minutes</span>
        <span className="font-garamond text-xs tracking-wide text-mist/35 uppercase">This Week</span>
      </div>
    </div>
  )
}

function diffParts(targetMs: number) {
  const total = Math.max(0, targetMs - Date.now())
  const days = Math.floor(total / 864e5)
  const hours = Math.floor((total % 864e5) / 36e5)
  const minutes = Math.floor((total % 36e5) / 6e4)
  const seconds = Math.floor((total % 6e4) / 1000)
  return { days, hours, minutes, seconds }
}

export function MembersDashboard() {
  const { cohort, session, room, liveNow, startMs } = useMemo(() => {
    const cohorts = buildDemoCohorts()
    const sessions = buildDemoSessions()
    const now = Date.now()
    const upcoming = sessions
      .filter((s) => s.scheduled_at && new Date(s.scheduled_at).getTime() > now - LIVE_WINDOW_MS)
      .sort((a, b) => (a.scheduled_at ?? '').localeCompare(b.scheduled_at ?? ''))
    const next = upcoming[0] ?? null
    const c = next ? cohorts.find((x) => x.id === next.cohort_id) ?? cohorts[0] : cohorts[0]
    const start = next?.scheduled_at ? new Date(next.scheduled_at).getTime() : now + 3 * 864e5
    return {
      cohort: c,
      session: next,
      room: next?.livekit_room_name || (c ? cohortRoomName(c) : 'cohort-spring-mastermind'),
      liveNow: next ? Math.abs(start - now) <= LIVE_WINDOW_MS : false,
      startMs: start,
    }
  }, [])

  const [countdown, setCountdown] = useState(() => diffParts(startMs))

  useEffect(() => {
    const id = window.setInterval(() => setCountdown(diffParts(startMs)), 1000)
    return () => window.clearInterval(id)
  }, [startMs])

  const featuredVault = vaultVideos.slice(0, 4)

  return (
    <MembersLayout activeId="dashboard">
      {/* Hero + countdown */}
      <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] lg:gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <section className="relative overflow-hidden rounded-xl border border-white/10">
          <div
            className="absolute inset-0 bg-cover bg-[center_30%] sm:bg-center"
            style={{ backgroundImage: "url('/hero-mike-live.png')" }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-r from-void/95 via-void/85 to-void/55" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-t from-void/95 via-void/30 to-void/50" aria-hidden />
          <div className="relative z-10 px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
            <p className="font-garamond text-sm tracking-[0.2em] text-gold uppercase sm:text-base">
              Welcome back, Mike
            </p>
            <h1 className="mt-2 font-bebas text-[clamp(1.75rem,6vw,3rem)] leading-tight tracking-wide text-mist">
              Keep pushing. Keep growing.
            </h1>
            <p className="mt-3 max-w-xl font-garamond text-base leading-relaxed text-mist/65 sm:mt-4 sm:text-lg">
              You&apos;re part of a community built for serious drummers. Show up, participate, and
              let the work compound.
            </p>
            <Link to="/cohorts" className={`${goldBtn} mt-5 w-full sm:mt-6 sm:w-auto`}>
              <PlayIcon />
              Go to your cohorts
            </Link>
          </div>
        </section>

        <MembersCard title="Next Live Session" className="flex flex-col justify-center">
          <div className="flex items-center justify-between gap-0.5 sm:gap-1">
            <CountdownUnit value={countdown.days} label="Days" />
            <span className="shrink-0 font-bebas text-lg text-mist/20 sm:text-2xl">:</span>
            <CountdownUnit value={countdown.hours} label="Hrs" />
            <span className="shrink-0 font-bebas text-lg text-mist/20 sm:text-2xl">:</span>
            <CountdownUnit value={countdown.minutes} label="Mins" />
            <span className="shrink-0 font-bebas text-lg text-mist/20 sm:text-2xl">:</span>
            <CountdownUnit value={countdown.seconds} label="Secs" />
          </div>
          <p className="mt-3 text-center font-garamond text-sm text-mist/55 sm:mt-4 sm:text-base">
            {session?.scheduled_at
              ? new Date(session.scheduled_at).toLocaleString(undefined, {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })
              : 'TBA'}
          </p>
        </MembersCard>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
        {/* Real next cohort */}
        <MembersCard className="min-w-0">
          <div className="grid min-w-0 max-w-full grid-cols-1 gap-5 text-center md:grid-cols-[auto_minmax(0,1fr)] md:items-start md:gap-4 md:text-left">
            <div className="relative mx-auto w-fit shrink-0 md:mx-0">
              <img
                src="/about-mike.png"
                alt="Mike Malinin"
                className="size-20 rounded-lg object-cover ring-2 ring-gold/25 md:size-[5.5rem]"
              />
              {liveNow ? (
                <span className="absolute -right-1 -top-1 rounded bg-red-600 px-1.5 py-0.5 font-garamond text-[0.6rem] font-medium tracking-wider text-white uppercase">
                  Live
                </span>
              ) : null}
            </div>
            <div className="min-w-0 max-w-full space-y-2 break-words">
              <p className="font-garamond text-xs tracking-[0.2em] text-gold/80 uppercase sm:text-sm">
                {liveNow ? 'Live cohort now' : 'Upcoming live cohort'}
              </p>
              <h3 className="font-garamond text-lg font-medium leading-snug text-mist md:text-xl">
                {cohort?.name ?? 'Spring Mastermind'}
              </h3>
              <p className="font-garamond text-base leading-relaxed text-mist/55">
                {session?.title ?? 'Weekly live coaching with Mike'}
              </p>
              <p className="pt-1 font-garamond text-sm text-mist/45">
                {session?.scheduled_at
                  ? new Date(session.scheduled_at).toLocaleString(undefined, {
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })
                  : 'Schedule coming soon'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1 md:justify-start">
                <Link
                  to={`/room/${room}`}
                  className={`${goldBtn} box-border w-full max-w-full md:w-auto ${
                    liveNow ? '!bg-red-600 !text-white hover:!bg-red-600/90' : ''
                  }`}
                >
                  {liveNow ? 'Join live now' : 'Join session'}
                </Link>
                <Link
                  to="/cohorts"
                  className="font-garamond text-sm text-gold underline decoration-gold/35 underline-offset-2"
                >
                  View all cohorts
                </Link>
              </div>
            </div>
          </div>
        </MembersCard>

        {/* Video Vault preview */}
        <MembersCard
          title="Video Vault"
          className="min-w-0 overflow-hidden"
          action={
            <Link
              to="/vault"
              className="font-garamond text-sm text-gold underline decoration-gold/35 underline-offset-2"
            >
              View all
            </Link>
          }
        >
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {featuredVault.map((item) => (
              <Link
                key={item.id}
                to="/vault"
                className="group w-[8.5rem] shrink-0 snap-start text-left sm:w-36"
              >
                <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10">
                  <img src={item.thumb} alt="" className="h-full w-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-void/30 text-gold opacity-0 transition group-hover:opacity-100">
                    <PlayIcon />
                  </span>
                  <span className="absolute bottom-1 right-1 rounded bg-void/80 px-1 py-0.5 font-garamond text-[0.6rem] text-mist/80">
                    {item.duration}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 font-garamond text-sm text-mist/70">{item.title}</p>
              </Link>
            ))}
          </div>
        </MembersCard>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <MembersCard title="Practice Tracker">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
            <PracticeRing />
            <ul className="w-full space-y-2.5 font-garamond text-base text-mist/70 sm:space-y-3">
              <li className="flex items-center justify-center gap-2 sm:justify-start">
                <span className="text-gold">🔥</span> 7 Day Streak
              </li>
              <li className="flex items-center justify-center gap-2 sm:justify-start">
                <span className="text-gold">✓</span> 4/5 Goals Completed
              </li>
              <li className="flex items-center justify-center gap-2 sm:justify-start">
                <span className="text-gold">◎</span> 18/40 Rudiments Practiced
              </li>
            </ul>
          </div>
          <button
            type="button"
            className="mt-4 w-full rounded-lg border border-gold/30 py-2.5 font-garamond text-sm tracking-[0.14em] text-gold uppercase transition hover:bg-gold/10 sm:mt-5"
          >
            View Practice Planner
          </button>
        </MembersCard>

        <MembersCard title="Community Feed">
          <ul className="max-h-64 space-y-4 overflow-y-auto pr-1 sm:max-h-80">
            {communityPosts.map((post) => (
              <li
                key={post.name + post.time}
                className="border-b border-white/[0.06] pb-4 last:border-0 last:pb-0"
              >
                <div className="flex gap-3">
                  <img src={post.avatar} alt="" className="size-9 shrink-0 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate font-garamond text-base font-medium text-mist">
                        {post.name}
                      </span>
                      <span className="shrink-0 font-garamond text-sm text-mist/40">{post.time}</span>
                    </div>
                    <p className="mt-1 font-garamond text-base leading-relaxed text-mist/65">
                      {post.body}
                    </p>
                    {'image' in post && post.image ? (
                      <img
                        src={post.image}
                        alt=""
                        className="mt-2 max-h-28 w-full rounded-lg object-cover"
                      />
                    ) : null}
                    <div className="mt-2 flex gap-4 font-garamond text-sm text-mist/45">
                      <span className="flex items-center gap-1">
                        <MembersIcon name="heart" className="size-3.5" /> {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MembersIcon name="comment" className="size-3.5" /> {post.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </MembersCard>

        <MembersCard title="Ask Mike">
          <p className="font-garamond text-base leading-relaxed text-mist/60">
            Can&apos;t make the live session? Submit a question for Mike.
          </p>
          <button type="button" className={`${goldBtn} mt-4 w-full`}>
            + Submit a Question
          </button>
          <ul className="mt-3 space-y-2 sm:mt-4">
            {[
              { label: 'Record Audio', icon: '🎤' },
              { label: 'Upload Video', icon: '🎬' },
              { label: 'Write a Question', icon: '✎' },
            ].map(({ label, icon }) => (
              <li key={label}>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 font-garamond text-base text-mist/70 transition hover:border-gold/25 hover:text-mist"
                >
                  <span aria-hidden>{icon}</span>
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </MembersCard>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
        <MembersCard title="Your Roadmap" className="lg:col-span-2">
          <MembersRoadmap />
        </MembersCard>

        <MembersCard title="Member Directory">
          <ul className="space-y-3">
            {directoryMembers.map((m) => (
              <li key={m.name} className="flex items-center gap-3">
                <img src={m.avatar} alt="" className="size-10 shrink-0 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-garamond text-base text-mist">{m.name}</p>
                  <span className="font-garamond text-xs tracking-[0.18em] text-gold/80 uppercase">
                    {m.tag}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-4 w-full rounded-full border border-gold/40 py-2.5 font-garamond text-sm tracking-[0.14em] text-gold uppercase transition hover:bg-gold/10"
          >
            Browse Members
          </button>
        </MembersCard>
      </div>
    </MembersLayout>
  )
}
