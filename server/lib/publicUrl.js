const PRODUCTION_SITE = 'https://www.pracdrum.com'

function normalizeBaseUrl(raw) {
  if (!raw) return ''
  if (raw.startsWith('http')) return raw.replace(/\/$/, '')
  return `https://${raw.replace(/\/$/, '')}`
}

function isLocalhostUrl(url) {
  return /localhost|127\.0\.0\.1/i.test(url)
}

/** Public site base URL for links in emails (no trailing slash). */
export function getPublicBaseUrl() {
  const emailOverride = normalizeBaseUrl(process.env.EMAIL_PUBLIC_BASE_URL || '')
  if (emailOverride) return emailOverride

  const configured = normalizeBaseUrl(process.env.PUBLIC_BASE_URL || '')
  if (configured && !isLocalhostUrl(configured)) return configured

  if (process.env.VERCEL === '1') {
    if (process.env.VERCEL_ENV === 'production') return PRODUCTION_SITE
    const vercelUrl = process.env.VERCEL_URL
    if (vercelUrl) return normalizeBaseUrl(vercelUrl)
  }

  return PRODUCTION_SITE
}

export function publicPath(path) {
  const base = getPublicBaseUrl()
  const p = path.startsWith('/') ? path : `/${path}`
  return base ? `${base}${p}` : p
}

export function publicRoomUrl(roomName) {
  return publicPath(`/room/${roomName}`)
}
