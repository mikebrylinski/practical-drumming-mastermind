/**
 * Verifies a reCAPTCHA v3 token with Google's siteverify API.
 *
 * Returns `{ ok: true }` (and skips the network call) when
 * `RECAPTCHA_SECRET_KEY` is not configured, so local/demo development keeps
 * working without a key. When configured, a missing/invalid token or a score
 * below `RECAPTCHA_MIN_SCORE` (default 0.5) fails verification.
 */
export async function verifyRecaptcha(token, { remoteip } = {}) {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) return { ok: true, skipped: true }
  if (!token) return { ok: false, error: 'Missing reCAPTCHA token' }

  const params = new URLSearchParams({ secret, response: token })
  if (remoteip) params.set('remoteip', remoteip)

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })
    const data = await res.json()
    const minScore = Number(process.env.RECAPTCHA_MIN_SCORE) || 0.5
    if (!data.success || (typeof data.score === 'number' && data.score < minScore)) {
      return { ok: false, error: 'reCAPTCHA verification failed', score: data.score }
    }
    return { ok: true, score: data.score }
  } catch {
    return { ok: false, error: 'reCAPTCHA verification error' }
  }
}
