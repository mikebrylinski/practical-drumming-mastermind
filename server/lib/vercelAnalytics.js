/**
 * Vercel Web Analytics REST helpers.
 * Docs: GET /v1/query/web-analytics/visits/count|aggregate
 */

const API = 'https://api.vercel.com'

function config() {
  const token = process.env.VERCEL_API_TOKEN || process.env.VERCEL_TOKEN || ''
  const projectId =
    process.env.VERCEL_PROJECT_ID || process.env.VERCEL_PROJECT_NAME || ''
  const teamId = process.env.VERCEL_TEAM_ID || ''
  return { token, projectId, teamId }
}

export function vercelAnalyticsConfigured() {
  const { token, projectId } = config()
  return Boolean(token && projectId)
}

export function extractMetric(row, prefer = 'pageviews') {
  if (row == null) return 0
  if (typeof row === 'number' && Number.isFinite(row)) return row
  if (typeof row !== 'object') return 0

  const preferred = [prefer, 'pageviews', 'visitors', 'total', 'count', 'value', 'visits']
  for (const key of preferred) {
    const v = row[key]
    if (typeof v === 'number' && Number.isFinite(v)) return v
  }
  return 0
}

async function vercelGet(path, params) {
  const { token, projectId, teamId } = config()
  if (!token || !projectId) {
    throw new Error('Vercel analytics is not configured (VERCEL_API_TOKEN + VERCEL_PROJECT_ID)')
  }

  const qs = new URLSearchParams()
  qs.set('projectId', projectId)
  if (teamId) qs.set('teamId', teamId)
  for (const [k, v] of Object.entries(params || {})) {
    if (v == null || v === '') continue
    if (Array.isArray(v)) {
      for (const item of v) qs.append(k, String(item))
    } else {
      qs.set(k, String(v))
    }
  }

  const url = `${API}${path}?${qs.toString()}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })
  const text = await res.text()
  let json
  try {
    json = text ? JSON.parse(text) : {}
  } catch {
    json = { error: text || 'Invalid JSON from Vercel' }
  }
  if (!res.ok) {
    const msg = json?.error?.message || json?.message || json?.error || `Vercel API ${res.status}`
    const err = new Error(typeof msg === 'string' ? msg : JSON.stringify(msg))
    err.status = res.status
    throw err
  }
  return json
}

function mapRows(res, labelKey) {
  const rows = Array.isArray(res?.data) ? res.data : []
  return rows
    .map((row) => {
      let label = row?.[labelKey]
      if (label == null || String(label).trim() === '') {
        label = labelKey === 'referrerHostname' ? '(direct)' : row?.timestamp ?? '—'
      }
      return {
        label: String(label),
        pageviews: Number(row?.pageviews) || 0,
        visitors: Number(row?.visitors) || 0,
        timestamp: row?.timestamp ? String(row.timestamp) : null,
      }
    })
    .filter((r) => r.pageviews > 0 || r.visitors > 0 || r.timestamp)
}

function sortByVisitors(rows) {
  return [...rows].sort((a, b) => b.visitors - a.visitors || b.pageviews - a.pageviews)
}

function pctChange(current, previous) {
  if (previous == null || previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

function previousRange(since, until) {
  const start = new Date(since)
  const end = new Date(until)
  const ms = end.getTime() - start.getTime()
  const prevEnd = new Date(start.getTime() - 1)
  const prevStart = new Date(prevEnd.getTime() - ms)
  return { since: prevStart.toISOString(), until: prevEnd.toISOString() }
}

export async function fetchVercelAnalytics({ since, until, limit = 25 } = {}) {
  const prev = previousRange(since, until)

  const [
    countRes,
    prevCountRes,
    dailyRes,
    pagesRes,
    routesRes,
    hostnamesRes,
    referrersRes,
    countriesRes,
    devicesRes,
    browsersRes,
    osRes,
  ] = await Promise.all([
    vercelGet('/v1/query/web-analytics/visits/count', { since, until }),
    vercelGet('/v1/query/web-analytics/visits/count', prev),
    vercelGet('/v1/query/web-analytics/visits/aggregate', {
      since,
      until,
      by: ['day'],
      limit: 90,
    }),
    vercelGet('/v1/query/web-analytics/visits/aggregate', {
      since,
      until,
      by: ['requestPath'],
      limit,
    }),
    vercelGet('/v1/query/web-analytics/visits/aggregate', {
      since,
      until,
      by: ['route'],
      limit,
    }).catch(() => ({ data: [] })),
    vercelGet('/v1/query/web-analytics/visits/aggregate', {
      since,
      until,
      by: ['requestHostname'],
      limit,
    }).catch(() => ({ data: [] })),
    vercelGet('/v1/query/web-analytics/visits/aggregate', {
      since,
      until,
      by: ['referrerHostname'],
      limit,
    }),
    vercelGet('/v1/query/web-analytics/visits/aggregate', {
      since,
      until,
      by: ['country'],
      limit,
    }),
    vercelGet('/v1/query/web-analytics/visits/aggregate', {
      since,
      until,
      by: ['deviceType'],
      limit,
    }),
    vercelGet('/v1/query/web-analytics/visits/aggregate', {
      since,
      until,
      by: ['browserName'],
      limit,
    }),
    vercelGet('/v1/query/web-analytics/visits/aggregate', {
      since,
      until,
      by: ['osName'],
      limit,
    }),
  ])

  const pageviews = Number(countRes?.data?.pageviews) || 0
  const visitors = Number(countRes?.data?.visitors) || 0
  const prevPageviews = Number(prevCountRes?.data?.pageviews) || 0
  const prevVisitors = Number(prevCountRes?.data?.visitors) || 0

  // Bounce rate isn't returned by the public visits/count endpoint.
  const bounceRate =
    typeof countRes?.data?.bounceRate === 'number'
      ? Math.round(countRes.data.bounceRate * (countRes.data.bounceRate <= 1 ? 100 : 1))
      : null
  const prevBounce =
    typeof prevCountRes?.data?.bounceRate === 'number'
      ? Math.round(prevCountRes.data.bounceRate * (prevCountRes.data.bounceRate <= 1 ? 100 : 1))
      : null

  const daily = mapRows(dailyRes, 'timestamp').sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  )

  return {
    configured: true,
    pageviews,
    visitors,
    bounceRate,
    deltas: {
      visitors: pctChange(visitors, prevVisitors),
      pageviews: pctChange(pageviews, prevPageviews),
      bounceRate:
        bounceRate != null && prevBounce != null ? bounceRate - prevBounce : null,
    },
    daily,
    pages: sortByVisitors(mapRows(pagesRes, 'requestPath')),
    routes: sortByVisitors(mapRows(routesRes, 'route')),
    hostnames: sortByVisitors(mapRows(hostnamesRes, 'requestHostname')),
    referrers: sortByVisitors(mapRows(referrersRes, 'referrerHostname')),
    countries: sortByVisitors(mapRows(countriesRes, 'country')),
    devices: sortByVisitors(mapRows(devicesRes, 'deviceType')),
    browsers: sortByVisitors(mapRows(browsersRes, 'browserName')),
    operatingSystems: sortByVisitors(mapRows(osRes, 'osName')),
  }
}
