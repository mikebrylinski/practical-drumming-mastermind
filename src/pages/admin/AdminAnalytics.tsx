import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AdminShell } from '../../components/app/AdminShell'
import { useAuth } from '../../lib/auth/AuthProvider'
import { adminRequestHeaders } from '../../lib/auth/accessToken'

type Row = {
  label: string
  visitors?: number
  pageviews?: number
  timestamp?: string | null
}

type VercelData = {
  configured?: boolean
  error?: string
  visitors?: number
  pageviews?: number
  bounceRate?: number | null
  deltas?: {
    visitors?: number | null
    pageviews?: number | null
    bounceRate?: number | null
  }
  daily?: Row[]
  pages?: Row[]
  routes?: Row[]
  hostnames?: Row[]
  referrers?: Row[]
  countries?: Row[]
  devices?: Row[]
  browsers?: Row[]
  operatingSystems?: Row[]
}

type AnalyticsPayload = {
  ok: boolean
  demo?: boolean
  site?: string
  range?: { days: number; startDate: string; endDate: string }
  vercel?: VercelData
  error?: string
  errors?: { vercel?: string }
}

const DAY_OPTIONS = [
  { days: 7 as const, label: 'Last 7 Days' },
  { days: 28 as const, label: 'Last 28 Days' },
  { days: 90 as const, label: 'Last 90 Days' },
]

const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States of America',
  GB: 'United Kingdom',
  UK: 'United Kingdom',
  CA: 'Canada',
  AU: 'Australia',
  DE: 'Germany',
  FR: 'France',
  NL: 'Netherlands',
  IE: 'Ireland',
  IN: 'India',
  BR: 'Brazil',
  MX: 'Mexico',
  ES: 'Spain',
  IT: 'Italy',
  JP: 'Japan',
  KR: 'South Korea',
  SE: 'Sweden',
  NO: 'Norway',
  DK: 'Denmark',
  PL: 'Poland',
  PT: 'Portugal',
  NZ: 'New Zealand',
  SG: 'Singapore',
  PH: 'Philippines',
  ZA: 'South Africa',
}

function fmt(n: number | undefined | null) {
  if (n == null || Number.isNaN(n)) return '—'
  return new Intl.NumberFormat('en-US').format(Math.round(n))
}

function fmtPct(n: number | undefined | null) {
  if (n == null || Number.isNaN(n)) return '—'
  return `${Math.round(n)}%`
}

function titleCase(s: string) {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function countryLabel(code: string) {
  const key = code.toUpperCase()
  return COUNTRY_NAMES[key] || code
}

function DeltaPill({ value, invert }: { value: number | null | undefined; invert?: boolean }) {
  if (value == null || Number.isNaN(value)) return null
  const up = value >= 0
  const good = invert ? !up : up
  const cls = good
    ? 'bg-emerald-500/15 text-emerald-400'
    : 'bg-red-500/15 text-red-400'
  const sign = value > 0 ? '+' : ''
  return (
    <span className={`rounded px-1.5 py-0.5 font-mono text-[11px] font-medium tabular-nums ${cls}`}>
      {sign}
      {value}%
    </span>
  )
}

function MetricTab({
  label,
  value,
  delta,
  invertDelta,
  active,
  onClick,
}: {
  label: string
  value: string
  delta?: number | null
  invertDelta?: boolean
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex-1 px-4 py-3 text-left transition ${
        active ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-[13px] text-white/50">{label}</span>
        <DeltaPill value={delta} invert={invertDelta} />
      </div>
      <p className="mt-1 text-[28px] font-semibold tracking-tight text-white tabular-nums leading-none">
        {value}
      </p>
      {active ? (
        <span className="absolute inset-x-0 bottom-0 h-px bg-white/80" />
      ) : null}
    </button>
  )
}

function LineChart({
  rows,
  metric,
}: {
  rows: Row[]
  metric: 'visitors' | 'pageviews'
}) {
  const width = 720
  const height = 220
  const pad = { t: 16, r: 12, b: 28, l: 36 }

  const points = useMemo(() => {
    return rows.map((r) => ({
      xLabel: r.timestamp || r.label,
      y: Number(r[metric]) || 0,
    }))
  }, [rows, metric])

  if (!points.length) {
    return (
      <div className="flex h-[220px] items-center justify-center text-sm text-white/35">
        No data for this range.
      </div>
    )
  }

  const maxY = Math.max(...points.map((p) => p.y), 1)
  const niceMax = Math.ceil(maxY / 10) * 10 || 10
  const innerW = width - pad.l - pad.r
  const innerH = height - pad.t - pad.b

  const coords = points.map((p, i) => {
    const x = pad.l + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW)
    const y = pad.t + innerH - (p.y / niceMax) * innerH
    return { ...p, x, y }
  })

  const today = new Date().toISOString().slice(0, 10)
  const lastIsToday = (points[points.length - 1]?.xLabel || '').startsWith(today)
  const solidEnd = lastIsToday && coords.length > 1 ? coords.length - 1 : coords.length
  const solid = coords.slice(0, solidEnd)
  const dashed = lastIsToday ? coords.slice(Math.max(0, coords.length - 2)) : []

  const toPath = (pts: typeof coords) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

  const gridYs = [0, niceMax / 2, niceMax]

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[220px] w-full" role="img">
      {gridYs.map((g) => {
        const y = pad.t + innerH - (g / niceMax) * innerH
        return (
          <g key={g}>
            <line
              x1={pad.l}
              x2={width - pad.r}
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
            <text
              x={pad.l - 8}
              y={y + 3}
              textAnchor="end"
              className="fill-white/30"
              style={{ fontSize: 10 }}
            >
              {g}
            </text>
          </g>
        )
      })}
      <path d={toPath(solid)} fill="none" stroke="#0070f3" strokeWidth="2" strokeLinecap="round" />
      {dashed.length > 1 ? (
        <path
          d={toPath(dashed)}
          fill="none"
          stroke="#0070f3"
          strokeWidth="2"
          strokeDasharray="5 5"
          strokeLinecap="round"
        />
      ) : null}
      {coords.map((p, i) => {
        const d = new Date(p.xLabel.includes('T') ? p.xLabel : `${p.xLabel}T12:00:00Z`)
        const label = Number.isNaN(d.getTime())
          ? p.xLabel.slice(5)
          : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
        const show =
          points.length <= 10 || i === 0 || i === points.length - 1 || i % Math.ceil(points.length / 7) === 0
        if (!show) return null
        return (
          <text
            key={p.xLabel + i}
            x={p.x}
            y={height - 8}
            textAnchor="middle"
            className="fill-white/35"
            style={{ fontSize: 10 }}
          >
            {label}
          </text>
        )
      })}
    </svg>
  )
}

function PanelTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[]
  active: string
  onChange: (id: string) => void
}) {
  return (
    <div className="flex items-center gap-4 border-b border-white/[0.06] px-4">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`relative py-3 text-[13px] transition ${
            active === t.id ? 'text-white' : 'text-white/40 hover:text-white/70'
          }`}
        >
          {t.label}
          {active === t.id ? (
            <span className="absolute inset-x-0 bottom-0 h-px bg-white" />
          ) : null}
        </button>
      ))}
    </div>
  )
}

function RankList({
  rows,
  mode = 'count',
  totalVisitors,
}: {
  rows: Row[]
  mode?: 'count' | 'percent'
  totalVisitors: number
}) {
  if (!rows.length) {
    return <p className="px-4 py-6 text-sm text-white/35">No data.</p>
  }
  const max = Math.max(...rows.map((r) => r.visitors || 0), 1)
  return (
    <ul className="max-h-72 overflow-y-auto">
      <li className="flex items-center justify-between px-4 py-2 text-[11px] tracking-[0.08em] text-white/30 uppercase">
        <span />
        <span>Visitors</span>
      </li>
      {rows.map((row) => {
        const v = row.visitors || 0
        const bar = Math.max(4, Math.round((v / max) * 100))
        const display =
          mode === 'percent'
            ? fmtPct(totalVisitors > 0 ? (v / totalVisitors) * 100 : 0)
            : fmt(v)
        return (
          <li key={row.label} className="relative px-4 py-2.5">
            <div
              className="absolute inset-y-1 left-2 rounded-sm bg-white/[0.04]"
              style={{ width: `calc(${bar}% - 8px)` }}
            />
            <div className="relative flex items-center justify-between gap-3">
              <span className="min-w-0 truncate text-[13px] text-white/80" title={row.label}>
                {row.label}
              </span>
              <span className="shrink-0 text-[13px] text-white/55 tabular-nums">{display}</span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-lg border border-white/[0.08] bg-[#0a0a0a] ${className}`}>
      {children}
    </div>
  )
}

export function AdminAnalytics() {
  const { session, isAdmin, mockMode, useSeedData } = useAuth()
  const demoAdmin = isAdmin && (useSeedData || mockMode)

  const [days, setDays] = useState<(typeof DAY_OPTIONS)[number]['days']>(7)
  const [metric, setMetric] = useState<'visitors' | 'pageviews' | 'bounce'>('visitors')
  const [pageTab, setPageTab] = useState<'pages' | 'routes' | 'hostnames'>('pages')
  const [refTab, setRefTab] = useState<'referrers'>('referrers')
  const [deviceTab, setDeviceTab] = useState<'devices' | 'browsers'>('devices')

  const [data, setData] = useState<AnalyticsPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const headers = await adminRequestHeaders(session, demoAdmin)
      const res = await fetch(`/api/admin/analytics?days=${days}`, { headers })
      const text = await res.text()
      let json: AnalyticsPayload
      try {
        json = JSON.parse(text) as AnalyticsPayload
      } catch {
        throw new Error(
          res.status === 404
            ? 'Analytics API not found — restart the dev server so Express picks up /api/admin/analytics.'
            : `Analytics API returned non-JSON (${res.status}).`,
        )
      }
      if (!res.ok || !json.ok) {
        throw new Error(json.error || `Request failed (${res.status})`)
      }
      setData(json)
    } catch (err) {
      setData(null)
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }, [session, demoAdmin, days])

  useEffect(() => {
    void load()
  }, [load])

  const v = data?.vercel
  const totalVisitors = v?.visitors || 0
  const dayLabel = DAY_OPTIONS.find((d) => d.days === days)?.label || `Last ${days} Days`

  const pageRows =
    pageTab === 'pages' ? v?.pages || [] : pageTab === 'routes' ? v?.routes || [] : v?.hostnames || []
  const deviceRows = deviceTab === 'devices' ? v?.devices || [] : v?.browsers || []

  const chartMetric = metric === 'bounce' ? 'visitors' : metric

  return (
    <AdminShell
      eyebrow="Admin"
      title="Analytics"
      subtitle="Web Analytics for www.pracdrum.com"
      wide
    >
      {loading ? (
        <p className="font-garamond text-mist/40">Loading analytics…</p>
      ) : error ? (
        <Card>
          <p className="px-4 py-6 text-sm text-red-300/90">{error}</p>
        </Card>
      ) : (
        <div className="space-y-3 font-sans antialiased">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-0.5">
            <div className="flex items-center gap-3">
              <a
                href="https://www.pracdrum.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-white/80 transition hover:text-white"
              >
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-white/10 text-[10px]">
                  P
                </span>
                {data?.site || 'www.pracdrum.com'}
                <span className="text-white/30">↗</span>
              </a>
              <span className="flex items-center gap-1.5 text-xs text-white/40">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                0 online
              </span>
              {data?.demo ? (
                <span className="rounded bg-white/6 px-2 py-0.5 text-[10px] tracking-[0.12em] text-white/40 uppercase">
                  Sample
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70">
                Production
              </span>
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value) as 7 | 28 | 90)}
                className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 outline-none"
              >
                {DAY_OPTIONS.map((o) => (
                  <option key={o.days} value={o.days} className="bg-[#0a0a0a]">
                    {o.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => void load()}
                className="rounded-md border border-white/10 px-2.5 py-1.5 text-xs text-white/50 hover:text-white"
                title="Refresh"
              >
                ↻
              </button>
            </div>
          </div>

          {v?.error ? (
            <Card>
              <p className="px-4 py-3 text-sm text-amber-200/80">{v.error}</p>
            </Card>
          ) : null}

          {/* Metrics + chart */}
          <Card>
            <div className="grid grid-cols-1 divide-y divide-white/[0.06] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <MetricTab
                label="Visitors"
                value={fmt(v?.visitors)}
                delta={v?.deltas?.visitors}
                active={metric === 'visitors'}
                onClick={() => setMetric('visitors')}
              />
              <MetricTab
                label="Page Views"
                value={fmt(v?.pageviews)}
                delta={v?.deltas?.pageviews}
                active={metric === 'pageviews'}
                onClick={() => setMetric('pageviews')}
              />
              <MetricTab
                label="Bounce Rate"
                value={fmtPct(v?.bounceRate)}
                delta={v?.deltas?.bounceRate}
                invertDelta
                active={metric === 'bounce'}
                onClick={() => setMetric('bounce')}
              />
            </div>
            <div className="border-t border-white/[0.06] px-2 pt-2 pb-1">
              <LineChart rows={v?.daily || []} metric={chartMetric} />
              <p className="px-3 pb-3 text-[11px] text-white/30">{dayLabel}</p>
            </div>
          </Card>

          {/* Pages + Referrers */}
          <div className="grid gap-3 lg:grid-cols-2">
            <Card>
              <PanelTabs
                tabs={[
                  { id: 'pages', label: 'Pages' },
                  { id: 'routes', label: 'Routes' },
                  { id: 'hostnames', label: 'Hostnames' },
                ]}
                active={pageTab}
                onChange={(id) => setPageTab(id as typeof pageTab)}
              />
              <RankList rows={pageRows} totalVisitors={totalVisitors} />
            </Card>
            <Card>
              <PanelTabs
                tabs={[{ id: 'referrers', label: 'Referrers' }]}
                active={refTab}
                onChange={() => setRefTab('referrers')}
              />
              <RankList rows={v?.referrers || []} totalVisitors={totalVisitors} />
            </Card>
          </div>

          {/* Countries / Devices / OS */}
          <div className="grid gap-3 md:grid-cols-3">
            <Card>
              <div className="border-b border-white/[0.06] px-4 py-3 text-[13px] text-white/70">
                Countries
              </div>
              <RankList
                rows={(v?.countries || []).map((r) => ({
                  ...r,
                  label: countryLabel(r.label),
                }))}
                mode="percent"
                totalVisitors={totalVisitors}
              />
            </Card>
            <Card>
              <PanelTabs
                tabs={[
                  { id: 'devices', label: 'Devices' },
                  { id: 'browsers', label: 'Browsers' },
                ]}
                active={deviceTab}
                onChange={(id) => setDeviceTab(id as typeof deviceTab)}
              />
              <RankList
                rows={deviceRows.map((r) => ({ ...r, label: titleCase(r.label) }))}
                mode="percent"
                totalVisitors={totalVisitors}
              />
            </Card>
            <Card>
              <div className="border-b border-white/[0.06] px-4 py-3 text-[13px] text-white/70">
                Operating Systems
              </div>
              <RankList
                rows={(v?.operatingSystems || []).map((r) => ({
                  ...r,
                  label: r.label === 'mac' ? 'macOS' : titleCase(r.label),
                }))}
                mode="percent"
                totalVisitors={totalVisitors}
              />
            </Card>
          </div>
        </div>
      )}
    </AdminShell>
  )
}
