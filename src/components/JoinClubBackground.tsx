import { useEffect, useRef, useState } from 'react'

const POSTER = '/home2-join-club-poster.jpg'
const VIDEO_SRC = '/home2-join-club-bg.mp4'

/** Slow ambient motion; browsers enforce a minimum (often 0.0625–0.5). */
function applyPlaybackRate(video: HTMLVideoElement) {
  for (const rate of [0.25, 0.2, 0.125, 0.5, 0.0625]) {
    try {
      video.playbackRate = rate
      return
    } catch {
      /* try next rate in supported range */
    }
  }
}

export function JoinClubBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoVisible, setVideoVisible] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.loop = true
    applyPlaybackRate(video)

    const onPlaying = () => setVideoVisible(true)

    const startPlayback = () => {
      applyPlaybackRate(video)
      void video.play().then(() => setVideoVisible(true)).catch(() => {
        /* keep poster visible until a later canplay retry */
      })
    }

    video.addEventListener('playing', onPlaying)
    video.addEventListener('canplay', startPlayback)

    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      startPlayback()
    } else {
      video.load()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) startPlayback()
        else video.pause()
      },
      { threshold: 0.15 },
    )
    observer.observe(video)

    return () => {
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('canplay', startPlayback)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className={`join-club-kenburns absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
            videoVisible ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ backgroundImage: `url('${POSTER}')` }}
        />
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          className={`absolute inset-0 h-full w-full scale-105 object-cover transition-opacity duration-700 ${
            videoVisible ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={POSTER}
        />
      </div>
      <div className="absolute inset-0 bg-void/60" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-void/70 via-void/45 to-void/75"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-void/65 via-void/40 to-void/65"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_50%_45%,transparent_15%,rgba(5,5,5,0.65)_65%,rgba(5,5,5,0.97)_100%)]"
        aria-hidden
      />
    </>
  )
}
