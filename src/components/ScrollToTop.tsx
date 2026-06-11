import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToTop } from '../lib/scrollToTop'

/** Reset scroll position on client-side route changes (React Router does not do this by default). */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (hash) return
    scrollToTop()
  }, [pathname, hash])

  return null
}
