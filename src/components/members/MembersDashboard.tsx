import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MembersLayout } from './MembersLayout'
import { MembersCard } from './MembersCard'
import { PlayIcon } from './MembersIcons'
import { useAuth } from '../../lib/auth/AuthProvider'
import { supabase } from '../../lib/supabase/client'
import { buildDemoCohorts } from '../../lib/demo/cohorts'
import type { Cohort } from '../../lib/supabase/types'
import { cohortRoomName } from '../../lib/slug'
import { formatDateTime } from '../../lib/datetime'
import { vaultVideos } from './mockData'
import { VaultVideoPreview } from './VaultVideoPreview'

const goldBtn =
  'flex min-h-10 items-center justify-center gap-2 rounded-full bg-gold px-5 font-garamond text-xs tracking-[0.16em] uppercase text-void transition hover:bg-gold/90 sm:min-h-9 sm:inline-flex sm:px-4 sm:text-sm'

const LIVE_WINDOW_MS = 60 * 60 * 1000

export function MembersDashboard() {
  const { profile, useSeedData } = useAuth()
  const firstName = profile?.full_name?.split(/\s+/)[0] || 'Member'

  // Real cohorts from Supabase when configured; demo cohorts otherwise.
  const [cohorts, setCohorts] = useState<Cohort[]>(() => buildDemoCohorts())

  useEffect(() => {
    let active = true
    async function load() {
      if (!supabase || useSeedData) return
      const { data } = await supabase
        .from('cohorts')
        .select('*')
        .order('starts_at', { ascending: true })
      if (active && data && data.length) setCohorts(data as Cohort[])
    }
    void load()
    return () => {
      active = false
    }
  }, [useSeedData])

  const { cohort, room, liveNow } = useMemo(() => {
    const now = Date.now()
    const sorted = [...cohorts]
      .filter((c) => c.starts_at)
      .sort((a, b) => (a.starts_at ?? '').localeCompare(b.starts_at ?? ''))
    // The soonest cohort whose start is still ahead (within the live window),
    // falling back to the most recent one so the card always has content.
    const next =
      sorted.find((c) => new Date(c.starts_at as string).getTime() > now - LIVE_WINDOW_MS) ??
      sorted[sorted.length - 1] ??
      cohorts[0] ??
      null
    const start = next?.starts_at ? new Date(next.starts_at).getTime() : now + 3 * 864e5
    return {
      cohort: next,
      room: next?.livekit_room_name || (next ? cohortRoomName(next) : 'cohort-spring-mastermind'),
      liveNow: next ? Math.abs(start - now) <= LIVE_WINDOW_MS : false,
    }
  }, [cohorts])

  const featuredVault = vaultVideos.slice(0, 4)

  return (
    <MembersLayout activeId="dashboard">
      <section className="rounded-xl border border-white/10 bg-charcoal/35 px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
        <p className="font-garamond text-sm tracking-[0.2em] text-gold uppercase sm:text-base">
          Welcome back, {firstName}
        </p>
        <h1 className="mt-2 font-bebas text-[clamp(1.75rem,6vw,3rem)] leading-tight tracking-wide text-mist">
          Keep pushing. Keep growing.
        </h1>
        <p className="mt-3 max-w-xl font-garamond text-base leading-relaxed text-mist/65 sm:mt-4 sm:text-lg">
          You&apos;re part of a community built for serious drummers. Show up, participate, and
          let the work compound.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row">
          <Link to="/cohorts" className={`${goldBtn} w-full sm:w-auto`}>
            <PlayIcon />
            Go to your cohorts
          </Link>
          <Link
            to="/community"
            className="flex min-h-10 items-center justify-center rounded-full border border-gold/35 px-5 font-garamond text-xs tracking-[0.14em] text-gold uppercase transition hover:bg-gold/10 sm:text-sm"
          >
            Community forum
          </Link>
        </div>
      </section>

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
        <MembersCard className="min-w-0">
          <div className="grid min-w-0 max-w-full grid-cols-1 gap-5 text-center md:grid-cols-[auto_minmax(0,1fr)] md:items-start md:gap-4 md:text-left">
            <div className="relative mx-auto w-fit shrink-0 md:mx-0">
              <img
                src="/logo-dd-footer.png"
                alt=""
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
                {cohort?.description ?? 'Weekly live coaching with Mike'}
              </p>
              <p className="pt-1 font-garamond text-sm text-mist/45">
                {cohort?.starts_at
                  ? formatDateTime(cohort.starts_at, {
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
                  <VaultVideoPreview logoClassName="size-10 sm:size-12" />
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
    </MembersLayout>
  )
}
