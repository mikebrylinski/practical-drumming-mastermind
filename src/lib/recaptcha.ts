/**
 * reCAPTCHA v3 (invisible, score-based) client helper.
 *
 * Set `VITE_RECAPTCHA_SITE_KEY` to enable. When the key is absent the helpers
 * no-op and return null, so local/demo development works without a key.
 */

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, opts: { action: string }) => Promise<string>
    }
  }
}

let loadPromise: Promise<void> | null = null

export function isRecaptchaEnabled(): boolean {
  return Boolean(SITE_KEY)
}

function loadScript(): Promise<void> {
  if (!SITE_KEY) return Promise.resolve()
  if (loadPromise) return loadPromise
  loadPromise = new Promise<void>((resolve, reject) => {
    if (document.querySelector('script[data-recaptcha]')) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`
    script.async = true
    script.defer = true
    script.dataset.recaptcha = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA'))
    document.head.appendChild(script)
  })
  return loadPromise
}

/** Returns a fresh reCAPTCHA token for the given action, or null if disabled. */
export async function getRecaptchaToken(action: string): Promise<string | null> {
  if (!SITE_KEY) return null
  await loadScript()
  const grecaptcha = window.grecaptcha
  if (!grecaptcha) return null
  await new Promise<void>((resolve) => grecaptcha.ready(() => resolve()))
  return grecaptcha.execute(SITE_KEY, { action })
}
