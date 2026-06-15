/** Extract client IP from Vercel/proxy headers. */
export function clientIpFromRequest(req) {
  const forwarded = req.headers['x-forwarded-for'] || req.headers['X-Forwarded-For']
  if (forwarded) {
    const first = String(forwarded).split(',')[0]?.trim()
    if (first) return first
  }
  const real = req.headers['x-real-ip'] || req.headers['X-Real-Ip']
  if (real) return String(real).trim()
  return req.socket?.remoteAddress || null
}
