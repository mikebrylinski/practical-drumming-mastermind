import { useEffect, useState } from 'react'
import { PlayIcon } from '../members/MembersIcons'
import { OverlayPortal, OVERLAY_Z } from '../ui/OverlayPortal'

const YOUTUBE_VIDEO_ID = 'EVf_cCLU_Iw'
const PREVIEW_IMAGE = '/hero-video-preview.png'
const SQUARE_LOGO = '/logo-dd.png'

function SquareLogoBadge({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg bg-black/55 p-1.5 ring-1 ring-white/15 backdrop-blur-sm ${className}`}
    >
      <img src={SQUARE_LOGO} alt="" width={40} height={40} className="size-9 sm:size-10" aria-hidden />
    </div>
  )
}

function YoutubeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <OverlayPortal>
      <div
        className={`fixed inset-0 ${OVERLAY_Z} flex items-center justify-center bg-void/85 p-4 backdrop-blur`}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Watch intro video"
      >
        <div
          className="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-charcoal shadow-[0_24px_80px_-20px_rgba(0,0,0,0.9)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative aspect-video bg-black">
            <iframe
              title="Practical Drumming Mastermind intro"
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close video"
              className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-void/70 font-garamond text-mist/80 transition hover:text-gold"
            >
              ✕
            </button>
            <SquareLogoBadge className="absolute bottom-3 right-3 z-10" />
          </div>
        </div>
      </div>
    </OverlayPortal>
  )
}

type HeroVideoPopupProps = {
  caption?: string
  previewImage?: string
  previewAlt?: string
  aspectClass?: string
  imageClassName?: string
}

export function HeroVideoPopup({
  caption = 'mastermind club',
  previewImage = PREVIEW_IMAGE,
  previewAlt = 'Mike Malinin in a live mastermind session',
  aspectClass = 'aspect-[4/5] sm:aspect-[5/6]',
  imageClassName = 'object-cover object-[center_20%]',
}: HeroVideoPopupProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="hero-visual relative mx-auto w-3/4 max-w-[17rem] sm:w-full sm:max-w-sm lg:ml-auto lg:max-w-md">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative block w-full overflow-hidden rounded-[1.75rem] bg-charcoal/80 text-left shadow-[0_24px_80px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10 backdrop-blur-[2px] transition hover:ring-gold/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
          aria-label="Play intro video"
        >
          <div className={`relative ${aspectClass}`}>
            <img
              src={previewImage}
              alt={previewAlt}
              className={`absolute inset-0 h-full w-full transition duration-500 group-hover:scale-[1.02] ${imageClassName}`}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/60 via-void/10 to-void/20"
              aria-hidden
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-gold text-void shadow-[0_8px_32px_rgba(201,165,92,0.35)] transition group-hover:scale-105">
                <PlayIcon className="size-7" />
              </span>
            </span>
            <SquareLogoBadge className="absolute bottom-3 right-3" />
          </div>
        </button>
        <p className="mt-4 text-center font-garamond text-xs tracking-[0.22em] uppercase text-mist/50 lg:text-right">
          {caption}
        </p>
      </div>

      <YoutubeModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
