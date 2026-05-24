import { motion, useReducedMotion } from 'framer-motion'
import { sectionGridPatternStyle } from '../SectionGridOverlay'

type Density = 'light' | 'medium' | 'full'

type OrbitConfig = {
  cx: string
  cy: string
  radius: number
  duration: number
  reverse: boolean
  nodes: number
}

type ParticleConfig = {
  x: string
  y: string
  dur: number
  delay: number
}

const ORBITS_BY_DENSITY: Record<Density, readonly OrbitConfig[]> = {
  light: [
    { cx: '25%', cy: '40%', radius: 120, duration: 55, reverse: false, nodes: 3 },
    { cx: '75%', cy: '60%', radius: 100, duration: 42, reverse: true, nodes: 3 },
  ],
  medium: [
    { cx: '20%', cy: '30%', radius: 125, duration: 55, reverse: false, nodes: 3 },
    { cx: '80%', cy: '45%', radius: 105, duration: 42, reverse: true, nodes: 4 },
    { cx: '50%', cy: '55%', radius: 180, duration: 68, reverse: false, nodes: 3 },
    { cx: '15%', cy: '75%', radius: 90, duration: 38, reverse: true, nodes: 2 },
    { cx: '85%', cy: '80%', radius: 95, duration: 48, reverse: false, nodes: 3 },
  ],
  full: [
    { cx: '18%', cy: '28%', radius: 130, duration: 55, reverse: false, nodes: 3 },
    { cx: '82%', cy: '38%', radius: 110, duration: 42, reverse: true, nodes: 4 },
    { cx: '50%', cy: '50%', radius: 210, duration: 68, reverse: false, nodes: 3 },
    { cx: '12%', cy: '72%', radius: 95, duration: 38, reverse: true, nodes: 3 },
    { cx: '88%', cy: '78%', radius: 105, duration: 48, reverse: false, nodes: 2 },
    { cx: '65%', cy: '18%', radius: 85, duration: 34, reverse: true, nodes: 3 },
    { cx: '35%', cy: '85%', radius: 90, duration: 44, reverse: false, nodes: 2 },
  ],
}

const PARTICLES_BY_DENSITY: Record<Density, readonly ParticleConfig[]> = {
  light: [
    { x: '15%', y: '25%', dur: 16, delay: 0 },
    { x: '45%', y: '60%', dur: 18, delay: 1.2 },
    { x: '72%', y: '35%', dur: 15, delay: 0.6 },
    { x: '88%', y: '70%', dur: 17, delay: 2 },
  ],
  medium: [
    { x: '10%', y: '22%', dur: 14, delay: 0 },
    { x: '28%', y: '58%', dur: 18, delay: 1.5 },
    { x: '48%', y: '32%', dur: 16, delay: 0.8 },
    { x: '62%', y: '72%', dur: 20, delay: 2.2 },
    { x: '78%', y: '28%', dur: 17, delay: 1.2 },
    { x: '90%', y: '55%', dur: 19, delay: 3 },
    { x: '35%', y: '85%', dur: 16, delay: 2.8 },
    { x: '55%', y: '12%', dur: 21, delay: 1.8 },
  ],
  full: [
    { x: '8%', y: '20%', dur: 14, delay: 0 },
    { x: '22%', y: '55%', dur: 18, delay: 1.5 },
    { x: '38%', y: '30%', dur: 16, delay: 0.8 },
    { x: '52%', y: '68%', dur: 20, delay: 2.2 },
    { x: '68%', y: '42%', dur: 15, delay: 0.4 },
    { x: '78%', y: '22%', dur: 17, delay: 3 },
    { x: '92%', y: '58%', dur: 19, delay: 1.2 },
    { x: '45%', y: '12%', dur: 16, delay: 2.8 },
    { x: '58%', y: '88%', dur: 21, delay: 1.8 },
    { x: '15%', y: '88%', dur: 18, delay: 3.5 },
    { x: '85%', y: '12%', dur: 14, delay: 0.6 },
    { x: '72%', y: '72%', dur: 17, delay: 2.4 },
  ],
}

const SCAN_Y_BY_DENSITY: Record<Density, readonly number[]> = {
  light: [20, 50, 80],
  medium: [12, 28, 44, 60, 76, 92],
  full: [8, 18, 28, 38, 48, 58, 68, 78, 88, 96],
}

const SCAN_X_BY_DENSITY: Record<Density, readonly number[]> = {
  light: [25, 75],
  medium: [18, 42, 68, 88],
  full: [12, 28, 44, 60, 76, 92],
}

function OrbitCluster({
  cx,
  cy,
  radius,
  duration,
  reverse,
  nodes,
  reduced,
}: OrbitConfig & { reduced: boolean }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: cx, top: cy, width: radius * 2, height: radius * 2, x: '-50%', y: '-50%' }}
    >
      <motion.div
        className={reduced ? 'absolute inset-0' : 'club-cta-orbit absolute inset-0'}
        style={
          reduced
            ? undefined
            : {
                animationDuration: `${duration}s`,
                animationDirection: reverse ? 'reverse' : 'normal',
              }
        }
      >
        <svg className="h-full w-full" viewBox={`0 0 ${radius * 2} ${radius * 2}`} fill="none" aria-hidden>
          <circle
            cx={radius}
            cy={radius}
            r={radius - 4}
            stroke="rgba(201,165,92,0.28)"
            strokeWidth="1"
            strokeDasharray="4 10"
          />
          <circle
            cx={radius}
            cy={radius}
            r={radius * 0.62}
            stroke="rgba(201,165,92,0.12)"
            strokeWidth="1"
            strokeDasharray="2 8"
          />
          {Array.from({ length: nodes }, (_, i) => {
            const angle = (i / nodes) * Math.PI * 2 - Math.PI / 2
            const x = radius + (radius - 12) * Math.cos(angle)
            const y = radius + (radius - 12) * Math.sin(angle)
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={4.5}
                fill="#c9a55c"
                opacity={0.7 + (i % 2) * 0.2}
              />
            )
          })}
          <circle cx={radius} cy={radius} r={5} fill="#c9a55c" opacity="0.5" />
        </svg>
      </motion.div>
      {!reduced &&
        [0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/35"
            animate={{ scale: [0.45, 1.35], opacity: [0.5, 0] }}
            transition={{
              duration: 6.5,
              repeat: Infinity,
              delay: i * 1.8,
              ease: 'easeOut',
            }}
            aria-hidden
          />
        ))}
    </motion.div>
  )
}

type ClubAnimatedBackgroundProps = {
  density?: Density
  opacity?: number
}

export function ClubAnimatedBackground({ density = 'full', opacity = 0.7 }: ClubAnimatedBackgroundProps) {
  const reduced = useReducedMotion()
  const orbits = ORBITS_BY_DENSITY[density]
  const particles = PARTICLES_BY_DENSITY[density]
  const scanY = SCAN_Y_BY_DENSITY[density]
  const scanX = SCAN_X_BY_DENSITY[density]
  const gridOpacity = density === 'light' ? 'opacity-25' : density === 'medium' ? 'opacity-30' : 'opacity-35'

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity }}
      aria-hidden
    >
      <div
        className={`absolute inset-[-48px] ${gridOpacity} ${reduced ? '' : 'club-benefits-grid-drift'}`}
        style={sectionGridPatternStyle}
      />
      <div
        className={`absolute inset-[-48px] opacity-15 ${reduced ? '' : 'club-benefits-grid-drift-reverse'}`}
        style={{
          ...sectionGridPatternStyle,
          backgroundSize: '32px 32px',
        }}
      />

      {orbits.map((orbit) => (
        <OrbitCluster key={`${orbit.cx}-${orbit.cy}`} {...orbit} reduced={!!reduced} />
      ))}

      {!reduced &&
        scanY.map((y, i) => (
          <motion.div
            key={`h-${y}`}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"
            style={{ top: `${y}%` }}
            animate={{ opacity: [0.1, 0.6, 0.1], scaleX: [0.8, 1, 0.8] }}
            transition={{
              duration: 8 + (i % 4),
              repeat: Infinity,
              delay: i * 0.7,
              ease: 'easeInOut',
            }}
          />
        ))}

      {!reduced &&
        scanX.map((x, i) => (
          <motion.div
            key={`v-${x}`}
            className="absolute bottom-0 top-0 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent"
            style={{ left: `${x}%` }}
            animate={{ opacity: [0.08, 0.45, 0.08] }}
            transition={{
              duration: 9 + (i % 3),
              repeat: Infinity,
              delay: i * 1.3,
              ease: 'easeInOut',
            }}
          />
        ))}

      {!reduced &&
        particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-gold/70 shadow-[0_0_10px_rgba(201,165,92,0.55)]"
            style={{ left: p.x, top: p.y }}
            animate={{
              y: [0, -28, 0],
              x: [0, i % 2 === 0 ? 14 : -14, 0],
              opacity: [0.2, 0.75, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut',
            }}
          />
        ))}

      <motion.div
        className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-gold/25 blur-3xl"
        animate={reduced ? undefined : { x: [0, 35, 0], y: [0, -25, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/5 h-80 w-80 rounded-full bg-gold/20 blur-3xl"
        animate={reduced ? undefined : { x: [0, -30, 0], y: [0, 25, 0], opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      {density !== 'light' && (
        <motion.div
          className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl"
          animate={reduced ? undefined : { scale: [0.9, 1.15, 0.9], opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      )}

      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_50%,rgba(201,165,92,0.12),transparent_65%)]"
        animate={reduced ? undefined : { opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-void/5 via-void/30 to-void/50" />
    </div>
  )
}
