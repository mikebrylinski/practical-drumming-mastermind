import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Reset scroll position on client-side route changes (React Router does not do this by default). */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (hash) return

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}
