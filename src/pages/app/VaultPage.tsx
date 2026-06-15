import { useEffect, useMemo, useState } from 'react'
import { MembersLayout } from '../../components/members/MembersLayout'
import { PlayIcon } from '../../components/members/MembersIcons'
import { VaultVideoPreview } from '../../components/members/VaultVideoPreview'
import { OverlayPortal, OVERLAY_Z } from '../../components/ui/OverlayPortal'
import { vaultFilters, vaultVideos, type VaultVideo } from '../../components/members/mockData'
import { useAuth } from '../../lib/auth/AuthProvider'
import { fetchSavedRecordings } from '../../lib/recording/api'
import { formatRecordingDuration } from '../../lib/recording/types'
import { formatDate } from '../../lib/datetime'

function VideoCard({ video, onPlay }: { video: VaultVideo; onPlay: (v: VaultVideo) => void }) {
  return (
    <button
      type="button"
      onClick={() => onPlay(video)}
      className="group text-left"
    >
      <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10">
        <VaultVideoPreview />
        <span className="absolute inset-0 flex items-center justify-center bg-void/40 opacity-0 transition group-hover:opacity-100">
          <span className="flex size-12 items-center justify-center rounded-full bg-gold text-void">
            <PlayIcon />
          </span>
        </span>
        <span className="absolute bottom-2 right-2 rounded bg-void/80 px-1.5 py-0.5 font-garamond text-xs text-mist/85">
          {video.duration}
        </span>
        <span className="absolute left-2 top-2 rounded-full bg-void/70 px-2 py-0.5 font-garamond text-[0.65rem] tracking-[0.12em] text-gold uppercase">
          {video.category}
        </span>
      </div>
      <h3 className="mt-2.5 font-garamond text-base font-medium leading-snug text-mist">
        {video.title}
      </h3>
      <p className="mt-0.5 font-garamond text-sm text-mist/40">{video.date}</p>
    </button>
  )
}

function PlayerModal({ video, onClose }: { video: VaultVideo; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <OverlayPortal>
      <div
        className={`fixed inset-0 ${OVERLAY_Z} flex items-center justify-center bg-void/85 p-4 backdrop-blur`}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={video.title}
      >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-charcoal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video bg-black">
          {video.playbackUrl ? (
            <video
              src={video.playbackUrl}
              controls
              playsInline
              className="h-full w-full object-contain"
            />
          ) : (
            <>
              <VaultVideoPreview className="opacity-90" logoClassName="size-16 md:size-20" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <span className="flex size-16 items-center justify-center rounded-full bg-gold text-void">
                  <PlayIcon />
                </span>
                <span className="font-garamond text-sm tracking-[0.18em] text-mist/70 uppercase">
                  Recording playback
                </span>
              </div>
            </>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-void/70 font-garamond text-mist/80 transition hover:text-gold"
          >
            ✕
          </button>
        </div>
        <div className="p-5 sm:p-6">
          <span className="font-garamond text-xs tracking-[0.14em] text-gold uppercase">
            {video.category} · {video.duration}
          </span>
          <h2 className="mt-1.5 font-bebas text-2xl tracking-wide text-mist">{video.title}</h2>
          <p className="mt-2 font-garamond text-base leading-relaxed text-mist/60">
            {video.description}
          </p>
          <p className="mt-3 font-garamond text-sm text-mist/40">Recorded {video.date}</p>
        </div>
      </div>
      </div>
    </OverlayPortal>
  )
}

export function VaultPage() {
  const { useSeedData } = useAuth()
  const [filter, setFilter] = useState<string>('All')
  const [active, setActive] = useState<VaultVideo | null>(null)
  const [savedVideos, setSavedVideos] = useState<VaultVideo[]>([])
  const [loading, setLoading] = useState(!useSeedData)

  useEffect(() => {
    if (useSeedData) {
      setLoading(false)
      return
    }
    setLoading(true)
    void fetchSavedRecordings()
      .then((recordings) => {
        setSavedVideos(
          recordings
            .filter((r) => r.playback_url)
            .map((r) => ({
              id: r.id,
              title: r.title || r.room_name,
              description: `Recorded live session · ${r.room_name}`,
              category: 'Live session' as const,
              duration: formatRecordingDuration(r.duration_seconds),
              date: formatDate(r.started_at, { month: 'short', day: 'numeric', year: 'numeric' }),
              thumb: '/logo-dd.png',
              playbackUrl: r.playback_url || undefined,
            })),
        )
      })
      .finally(() => setLoading(false))
  }, [useSeedData])

  const allVideos = useMemo(
    () => (useSeedData ? [...savedVideos, ...vaultVideos] : savedVideos),
    [savedVideos, useSeedData],
  )

  const filtered = useMemo(
    () => (filter === 'All' ? allVideos : allVideos.filter((v) => v.category === filter)),
    [filter, allVideos],
  )

  const [featured, ...rest] = filtered

  return (
    <MembersLayout activeId="vault">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-garamond text-xs tracking-[0.28em] text-gold uppercase">Members</p>
          <h1 className="mt-1 font-bebas text-3xl tracking-wide text-mist md:text-4xl">
            Video Vault
          </h1>
          <p className="mt-1 font-garamond text-base text-mist/55">
            Every recorded session, workshop, and Q&amp;A — on demand.
          </p>
        </div>
        <span className="font-garamond text-sm text-mist/40">{filtered.length} videos</span>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {vaultFilters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 font-garamond text-sm transition ${
              filter === f
                ? 'bg-gold/20 text-gold ring-1 ring-gold/40'
                : 'bg-white/5 text-mist/55 hover:text-mist'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="font-garamond text-mist/45">Loading videos…</p>
      ) : filtered.length === 0 ? (
        <p className="font-garamond text-mist/45">
          {useSeedData
            ? 'No videos in this category yet.'
            : 'No published recordings yet. Your admin will add sessions here after live calls.'}
        </p>
      ) : (
        <>
          {/* Featured */}
          {featured ? (
            <button
              type="button"
              onClick={() => setActive(featured)}
              className="group grid w-full overflow-hidden rounded-2xl border border-white/10 text-left md:grid-cols-2"
            >
              <div className="relative aspect-video md:aspect-auto">
                <VaultVideoPreview logoClassName="size-16 md:size-24" />
                <span className="absolute inset-0 flex items-center justify-center bg-void/30">
                  <span className="flex size-14 items-center justify-center rounded-full bg-gold text-void">
                    <PlayIcon />
                  </span>
                </span>
              </div>
              <div className="flex flex-col justify-center gap-2 bg-charcoal/60 p-5 sm:p-7">
                <span className="font-garamond text-xs tracking-[0.16em] text-gold uppercase">
                  Featured · {featured.category} · {featured.duration}
                </span>
                <h2 className="font-garamond text-xl font-medium text-mist md:text-2xl">
                  {featured.title}
                </h2>
                <p className="font-garamond text-base leading-relaxed text-mist/55">
                  {featured.description}
                </p>
                <p className="font-garamond text-sm text-mist/40">{featured.date}</p>
              </div>
            </button>
          ) : null}

          {/* Grid */}
          {rest.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((v) => (
                <VideoCard key={v.id} video={v} onPlay={setActive} />
              ))}
            </div>
          ) : null}
        </>
      )}

      {active ? <PlayerModal video={active} onClose={() => setActive(null)} /> : null}
    </MembersLayout>
  )
}
