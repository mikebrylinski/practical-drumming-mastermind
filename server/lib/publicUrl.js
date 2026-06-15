/** Public site base URL for links in emails (no trailing slash). */
export function getPublicBaseUrl() {
  const raw = process.env.PUBLIC_BASE_URL || process.env.VERCEL_URL || ''
  if (!raw) return ''
  if (raw.startsWith('http')) return raw.replace(/\/$/, '')
  return `https://${raw.replace(/\/$/, '')}`
}

export function publicPath(path) {
  const base = getPublicBaseUrl()
  const p = path.startsWith('/') ? path : `/${path}`
  return base ? `${base}${p}` : p
}

export function publicRoomUrl(roomName) {
  return publicPath(`/room/${roomName}`)
}
