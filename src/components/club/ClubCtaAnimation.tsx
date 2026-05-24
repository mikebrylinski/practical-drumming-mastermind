import { motion, useReducedMotion } from 'framer-motion'
import { SectionGridOverlay } from '../SectionGridOverlay'

const ORBITS = [
  { radius: 118, duration: 60, reverse: false, nodes: 3, nodeSize: 4 },
  { radius: 88, duration: 42, reverse: true, nodes: 4, nodeSize: 3.5 },
  { radius: 58, duration: 32, reverse: false, nodes: 2, nodeSize: 3 },
] as const

function OrbitRing({
  radius,
  duration,
  reverse,
  nodes,
  nodeSize,
  reduced,
}: {
  radius: number
  duration: number
  reverse: boolean
  nodes: number
  nodeSize: number
  reduced: boolean
}) {
  const cx = 160
  const cy = 160

  return (
    <g
      className={reduced ? undefined : 'club-cta-orbit'}
      style={
        reduced
          ? undefined
          : {
              transformOrigin: `${cx}px ${cy}px`,
              animationDuration: `${duration}s`,
              animationDirection: reverse ? 'reverse' : 'normal',
            }
      }
    >
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="rgba(201,165,92,0.12)"
        strokeWidth="1"
        strokeDasharray="3 9"
      />
      {Array.from({ length: nodes }, (_, i) => {
        const angle = (i / nodes) * Math.PI * 2
        const x = cx + radius * Math.cos(angle - Math.PI / 2)
        const y = cy + radius * Math.sin(angle - Math.PI / 2)
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={nodeSize}
            fill="#c9a55c"
            opacity={0.55 + (i % 2) * 0.25}
          />
        )
      })}
    </g>
  )
}

export function ClubCtaAnimation() {
  const reduced = useReducedMotion()

  return (
    <div className="mx-auto w-full max-w-[26rem] sm:max-w-[30rem] lg:max-w-[34rem] xl:max-w-[38rem]">
      <motion.div
        className="relative aspect-square w-full overflow-visible"
        initial={reduced ? false : { opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,165,92,0.18),transparent_62%)]"
          animate={reduced ? undefined : { opacity: [0.45, 0.85, 0.45] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        />
        <SectionGridOverlay className="opacity-[0.18]" />

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 320 320"
          fill="none"
          aria-hidden
        >
          {!reduced &&
            [0, 1, 2].map((i) => (
              <circle
                key={i}
                cx="160"
                cy="160"
                r="52"
                stroke="rgba(201,165,92,0.35)"
                strokeWidth="1"
                className="club-cta-pulse-ring"
                style={{ animationDelay: `${i * 2.3}s` }}
              />
            ))}

          <circle
            cx="160"
            cy="160"
            r="132"
            stroke="rgba(201,165,92,0.08)"
            strokeWidth="1"
          />

          {ORBITS.map((orbit) => (
            <OrbitRing key={orbit.radius} {...orbit} reduced={!!reduced} />
          ))}

          <motion.g
            animate={reduced ? undefined : { scale: [1, 1.04, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '160px 160px' }}
          >
            <circle cx="160" cy="160" r="40" stroke="rgba(201,165,92,0.35)" strokeWidth="1.5" />
            <circle cx="160" cy="160" r="32" fill="rgba(201,165,92,0.1)" stroke="rgba(201,165,92,0.5)" strokeWidth="1" />
            <circle cx="160" cy="160" r="6" fill="#c9a55c" opacity="0.9" />
            <line x1="160" y1="128" x2="160" y2="192" stroke="rgba(201,165,92,0.25)" strokeWidth="1" />
            <line x1="128" y1="160" x2="192" y2="160" stroke="rgba(201,165,92,0.25)" strokeWidth="1" />
          </motion.g>

          {[0, 72, 144, 216, 288].map((deg) => {
            const rad = (deg * Math.PI) / 180
            const x2 = 160 + 132 * Math.cos(rad - Math.PI / 2)
            const y2 = 160 + 132 * Math.sin(rad - Math.PI / 2)
            return (
              <line
                key={deg}
                x1="160"
                y1="160"
                x2={x2}
                y2={y2}
                stroke="rgba(201,165,92,0.06)"
                strokeWidth="1"
              />
            )
          })}
        </svg>

        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-3xl sm:h-48 sm:w-48"
          animate={reduced ? undefined : { opacity: [0.2, 0.45, 0.2], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        />
      </motion.div>
    </div>
  )
}
