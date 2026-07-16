import { verifyAdminRequest, handleOptions } from '../livekit/_lib.js'
import {
  fetchVercelAnalytics,
  vercelAnalyticsConfigured,
} from '../vercelAnalytics.js'

function isoDate(d) {
  return d.toISOString().slice(0, 10)
}

function rangeFromQuery(req) {
  const days = Math.min(90, Math.max(1, Number(req.query?.days) || 7))
  // Include today so the chart matches the Vercel dashboard (last point may be partial).
  const end = new Date()
  end.setUTCHours(23, 59, 59, 999)
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - (days - 1))
  start.setUTCHours(0, 0, 0, 0)
  return {
    days,
    since: start.toISOString(),
    until: end.toISOString(),
    startDate: isoDate(start),
    endDate: isoDate(end),
  }
}

function mockPayload(range) {
  const daily = []
  for (let i = 0; i < range.days; i++) {
    const d = new Date(range.since)
    d.setUTCDate(d.getUTCDate() + i)
    const visitors = 2 + ((i * 5) % 18)
    const pageviews = visitors + ((i * 3) % 12)
    daily.push({
      label: isoDate(d),
      timestamp: d.toISOString(),
      visitors,
      pageviews,
    })
  }

  const visitors = daily.reduce((s, r) => s + r.visitors, 0)
  const pageviews = daily.reduce((s, r) => s + r.pageviews, 0)

  return {
    ok: true,
    demo: true,
    range: {
      days: range.days,
      startDate: range.startDate,
      endDate: range.endDate,
    },
    site: 'www.pracdrum.com',
    vercel: {
      configured: false,
      visitors,
      pageviews,
      bounceRate: 76,
      deltas: { visitors: 53, pageviews: 83, bounceRate: 23 },
      daily,
      pages: [
        { label: '/about', visitors: 32, pageviews: 47 },
        { label: '/', visitors: 22, pageviews: 55 },
        { label: '/club', visitors: 5, pageviews: 8 },
        { label: '/apply', visitors: 4, pageviews: 6 },
        { label: '/admin', visitors: 2, pageviews: 4 },
      ],
      routes: [
        { label: '/', visitors: 22, pageviews: 55 },
        { label: '/about', visitors: 32, pageviews: 47 },
      ],
      hostnames: [{ label: 'www.pracdrum.com', visitors, pageviews }],
      referrers: [
        { label: 'google.com', visitors: 22, pageviews: 30 },
        { label: 'en.wikipedia.org', visitors: 5, pageviews: 5 },
        { label: 'facebook.com', visitors: 1, pageviews: 1 },
      ],
      countries: [
        { label: 'US', visitors: Math.round(visitors * 0.86), pageviews: Math.round(pageviews * 0.86) },
        { label: 'GB', visitors: Math.round(visitors * 0.06), pageviews: Math.round(pageviews * 0.06) },
      ],
      devices: [
        { label: 'desktop', visitors: Math.round(visitors * 0.59), pageviews: 0 },
        { label: 'mobile', visitors: Math.round(visitors * 0.29), pageviews: 0 },
      ],
      browsers: [
        { label: 'chrome', visitors: Math.round(visitors * 0.5), pageviews: 0 },
        { label: 'safari', visitors: Math.round(visitors * 0.3), pageviews: 0 },
      ],
      operatingSystems: [
        { label: 'GNU/Linux', visitors: Math.round(visitors * 0.41), pageviews: 0 },
        { label: 'iOS', visitors: Math.round(visitors * 0.41), pageviews: 0 },
      ],
    },
  }
}

/** Admin analytics: Vercel Web Analytics dashboard. */
export default async function handler(req, res) {
  if (handleOptions(req, res)) return

  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const auth = await verifyAdminRequest(req)
  if (!auth.ok) {
    return res.status(auth.status || 401).json({ ok: false, error: auth.error })
  }

  const range = rangeFromQuery(req)

  if (auth.demo || !vercelAnalyticsConfigured()) {
    return res.status(200).json(mockPayload(range))
  }

  try {
    const vercel = await fetchVercelAnalytics({
      since: range.since,
      until: range.until,
    })
    return res.status(200).json({
      ok: true,
      demo: false,
      range: {
        days: range.days,
        startDate: range.startDate,
        endDate: range.endDate,
      },
      site: 'www.pracdrum.com',
      vercel,
    })
  } catch (err) {
    console.error('[admin/analytics]', err)
    return res.status(200).json({
      ...mockPayload(range),
      demo: false,
      vercel: {
        configured: true,
        error: err?.message || 'Vercel analytics failed',
      },
      errors: { vercel: err?.message || 'Vercel analytics failed' },
    })
  }
}
