import { useState } from 'react'
import { PlayIcon } from '../members/MembersIcons'

const YOUTUBE_VIDEO_ID = 'EVf_cCLU_Iw'
const PREVIEW_IMAGE = '/webinar-video-preview.png'

export function WebinarVideoEmbed() {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-void shadow-[0_24px_80px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
      <div className="relative aspect-video bg-black">
        {playing ? (
          <iframe
            title="Practical Drumming Mastermind webinar overview"
            src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&start=6&rel=0&modestbranding=1`}
            className="absolute inset-0 size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group relative block size-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-void"
            aria-label="Play webinar overview video"
          >
            <img
              src={PREVIEW_IMAGE}
              alt="Mike Malinin in the mastermind webinar overview"
              className="absolute inset-0 size-full object-cover object-center transition duration-500 group-hover:scale-[1.01]"
              loading="lazy"
              decoding="async"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/40 via-transparent to-void/15"
              aria-hidden
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-gold text-void shadow-[0_8px_32px_rgba(201,165,92,0.35)] transition group-hover:scale-105 md:size-20">
                <PlayIcon className="size-7 md:size-8" />
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
