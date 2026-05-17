import { useId, type ReactNode, type SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function GoldDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0e2c4" />
        <stop offset="45%" stopColor="#c9a55c" />
        <stop offset="100%" stopColor="#7a6840" />
      </linearGradient>
    </defs>
  )
}

function useStroke(url: string) {
  return { stroke: url, strokeWidth: 1.35, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
}

type StrokeProps = ReturnType<typeof useStroke>

function IconFrame({
  size = 48,
  className = '',
  render,
  ...props
}: Omit<IconProps, 'children'> & { render: (stroke: StrokeProps, fill: string) => ReactNode }) {
  const gradId = useId()
  const stroke = useStroke(`url(#${gradId})`)

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      aria-hidden
      {...props}
    >
      <GoldDefs id={gradId} />
      {render(stroke, `url(#${gradId})`)}
    </svg>
  )
}

export function StreamsIcon(props: IconProps) {
  return (
    <IconFrame {...props} render={(s, fill) => (
        <>
          <path d="M8 26c4-6 8-6 12 0s8 6 12 0 4-6 8-6" {...s} />
          <path d="M8 32c4-4 8-4 12 0s8 4 12 0" {...s} opacity={0.55} />
          <circle cx="24" cy="14" r="6" {...s} />
          <path
            d="M21 12h6v1.5h-1.5V18H21v-1.5h1.5v-3H21V12z"
            fill={fill}
            fillOpacity={0.35}
            stroke={fill}
            strokeWidth={0.75}
          />
        </>
      )}
    />
  )
}

export function RecordsIcon(props: IconProps) {
  return (
    <IconFrame {...props} render={(s, fill) => (
        <>
          <path
            d="M24 8l5.2 3v10L24 24l-5.2-3V11L24 8z"
            fill={fill}
            fillOpacity={0.2}
            {...s}
          />
          <path d="M24 11v13M18.8 13.5v7M29.2 13.5v7" {...s} opacity={0.6} />
          <circle cx="24" cy="32" r="8" {...s} />
          <circle cx="24" cy="32" r="3" {...s} opacity={0.85} />
        </>
      )}
    />
  )
}

export function CatalogIcon(props: IconProps) {
  return (
    <IconFrame {...props} render={(s, fill) => (
        <>
          <circle cx="24" cy="24" r="14" {...s} />
          <circle cx="24" cy="24" r="5" {...s} opacity={0.85} />
          <path d="M24 10v4M24 34v4M10 24h4M34 24h4" {...s} opacity={0.5} />
          <path
            d="M30 14l2.5 2.5M16 32l2.5 2.5"
            {...s}
            strokeWidth={1}
            opacity={0.65}
          />
          <path
            d="M32 18l4-1.5 1 4-3.2 2.8-1.8-5.3z"
            fill={fill}
            fillOpacity={0.35}
            stroke={fill}
            strokeWidth={1}
          />
        </>
      )}
    />
  )
}

export function ArenaIcon(props: IconProps) {
  return (
    <IconFrame {...props} render={(s, fill) => (
        <>
          <path d="M8 32c6-8 26-8 32 0" {...s} />
          <path d="M12 32h24" {...s} opacity={0.45} />
          <path d="M18 28V18M24 26V14M30 28V18" {...s} />
          <ellipse cx="24" cy="34" rx="10" ry="2" fill={fill} fillOpacity={0.12} />
        </>
      )}
    />
  )
}

export function MentorshipIcon(props: IconProps) {
  return (
    <IconFrame {...props} render={(s, fill) => (
        <>
          <circle cx="17" cy="18" r="4.5" {...s} />
          <circle cx="31" cy="18" r="4.5" {...s} />
          <path d="M21 22c2 3 4 3 6 0" {...s} />
          <ellipse cx="24" cy="34" rx="9" ry="4" {...s} />
          <path d="M20 30h8M22 26h4" {...s} opacity={0.7} />
          <path
            d="M24 12v3M21 10.5l3 1.5 3-1.5"
            {...s}
            strokeWidth={1}
          />
          <circle cx="24" cy="9" r="1.2" fill={fill} />
        </>
      )}
    />
  )
}

export function FeelIcon(props: IconProps) {
  return (
    <IconFrame
      {...props}
      render={(s) => (
        <>
          <path d="M8 26c4-6 8-6 12 0s8 6 12 0 4-6 8-6" {...s} />
          <path d="M8 32c4-4 8-4 12 0s8 4 12 0" {...s} opacity={0.55} />
          <circle cx="24" cy="16" r="2" {...s} strokeWidth={1} />
        </>
      )}
    />
  )
}

export function ConfidenceIcon(props: IconProps) {
  return (
    <IconFrame {...props} render={(s, fill) => (
        <>
          <path d="M24 36V14" {...s} />
          <path d="M20 18l4-4 4 4" {...s} />
          <path d="M18 22l6-3 6 3M16 28l8-4 8 4" {...s} opacity={0.7} />
          <circle cx="24" cy="38" r="2.5" fill={fill} fillOpacity={0.25} {...s} />
        </>
      )}
    />
  )
}

export function LiveIcon(props: IconProps) {
  return (
    <IconFrame {...props} render={(s, fill) => (
        <>
          <path d="M10 34l14-20 14 20H10z" {...s} />
          <path d="M16 30h16" {...s} opacity={0.5} />
          <circle cx="18" cy="28" r="1.5" fill={fill} />
          <circle cx="24" cy="26" r="2" fill={fill} fillOpacity={0.4} />
          <circle cx="30" cy="28" r="1.5" fill={fill} />
          <path d="M14 12h6M22 10h6M30 12h4" {...s} strokeWidth={1} opacity={0.65} />
        </>
      )}
    />
  )
}

export function MusicianshipIcon(props: IconProps) {
  return (
    <IconFrame {...props} render={(s, fill) => (
        <>
          <path d="M10 20h20M10 26h20M10 32h14" {...s} opacity={0.45} />
          <path
            d="M28 14v22M28 14c3 0 5 2 5 5s-2 5-5 5"
            {...s}
          />
          <ellipse cx="28" cy="36" rx="3" ry="2" fill={fill} fillOpacity={0.3} {...s} />
          <path d="M34 10l6 14-3 1.5-6-14 3-1.5z" fill={fill} fillOpacity={0.2} {...s} />
        </>
      )}
    />
  )
}

export function PracticeIcon(props: IconProps) {
  return (
    <IconFrame {...props} render={(s, fill) => (
        <>
          <path d="M24 10L38 36H10L24 10z" {...s} />
          <path d="M24 16v14" {...s} />
          <circle cx="24" cy="32" r="2.5" fill={fill} fillOpacity={0.35} {...s} />
          <path d="M20 24h8" {...s} opacity={0.5} />
        </>
      )}
    />
  )
}

export function PerformanceIcon(props: IconProps) {
  return (
    <IconFrame {...props} render={(s, fill) => (
        <>
          <path d="M24 8v28" {...s} />
          <path d="M18 36h12" {...s} />
          <ellipse cx="24" cy="8" rx="4" ry="2" {...s} />
          <path d="M14 14l20-4" {...s} opacity={0.4} />
          <path
            d="M24 18c-8 4-8 14 0 18 8-4 8-14 0-18z"
            fill={fill}
            fillOpacity={0.12}
            {...s}
          />
        </>
      )}
    />
  )
}

export function GrooveWideIcon({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  const gradId = useId()
  const s = useStroke(`url(#${gradId})`)

  return (
    <svg viewBox="0 0 120 40" className={className} fill="none" aria-hidden {...props}>
      <GoldDefs id={gradId} />
      <path d="M4 24c10-10 20-10 30 0s20 10 30 0 10-10 20-10 20 0" {...s} />
      <path d="M4 30c10-6 20-6 30 0s20 6 30 0" {...s} opacity={0.45} />
      <path d="M52 8l8 24M60 8l-8 24" {...s} strokeWidth={1.2} />
      <circle cx="56" cy="22" r="3" {...s} />
    </svg>
  )
}

export function SessionWideIcon({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  const gradId = useId()
  const s = useStroke(`url(#${gradId})`)
  const fill = `url(#${gradId})`

  return (
    <svg viewBox="0 0 120 40" className={className} fill="none" aria-hidden {...props}>
      <GoldDefs id={gradId} />
      <rect x="8" y="8" width="48" height="24" rx="2" {...s} />
      <path d="M26 18l10 6-10 6V18z" fill={fill} fillOpacity={0.25} {...s} />
      <rect x="64" y="12" width="48" height="16" rx="2" {...s} opacity={0.7} />
      <path d="M72 20h12M72 24h8" {...s} opacity={0.5} />
      <circle cx="98" cy="20" r="4" {...s} />
    </svg>
  )
}

export function TouringWideIcon({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  const gradId = useId()
  const s = useStroke(`url(#${gradId})`)
  const fill = `url(#${gradId})`

  return (
    <svg viewBox="0 0 120 40" className={className} fill="none" aria-hidden {...props}>
      <GoldDefs id={gradId} />
      <path
        d="M8 28c16-14 32-14 48 0s32 14 48 0"
        {...s}
        strokeDasharray="4 3"
      />
      <circle cx="20" cy="24" r="3" {...s} />
      <circle cx="60" cy="20" r="3" {...s} />
      <circle cx="100" cy="24" r="3" {...s} />
      <rect x="52" y="10" width="16" height="10" rx="1" {...s} />
      <circle cx="56" cy="22" r="2" fill={fill} />
      <circle cx="64" cy="22" r="2" fill={fill} />
    </svg>
  )
}

export type HomeIconName =
  | 'catalog'
  | 'streams'
  | 'records'
  | 'arena'
  | 'mentorship'
  | 'feel'
  | 'confidence'
  | 'live'
  | 'musicianship'
  | 'practice'
  | 'performance'
  | 'groove'
  | 'session'
  | 'touring'

const tileIcons: Record<
  Exclude<HomeIconName, 'groove' | 'session' | 'touring'>,
  (props: IconProps) => React.ReactElement
> = {
  catalog: CatalogIcon,
  streams: StreamsIcon,
  records: RecordsIcon,
  arena: ArenaIcon,
  mentorship: MentorshipIcon,
  feel: FeelIcon,
  confidence: ConfidenceIcon,
  live: LiveIcon,
  musicianship: MusicianshipIcon,
  practice: PracticeIcon,
  performance: PerformanceIcon,
}

export function HomeIcon({ name, className, size }: { name: HomeIconName; className?: string; size?: number }) {
  if (name === 'groove') return <GrooveWideIcon className={className} />
  if (name === 'session') return <SessionWideIcon className={className} />
  if (name === 'touring') return <TouringWideIcon className={className} />
  const Icon = tileIcons[name]
  return <Icon className={className} size={size} />
}
