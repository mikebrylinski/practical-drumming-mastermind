import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { incrementVisitCount, trackLeadEvent } from './track'

/**
 * Auto-tracks a `page_visit` lead event on every route change (with repeat-visit
 * detection) and returns a `track` function for manual events such as
 * `booking_click` and `form_submit`.
 */
export function useLeadTracking() {
  const location = useLocation()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (lastPath.current === location.pathname) return
    lastPath.current = location.pathname
    const visitCount = incrementVisitCount()
    trackLeadEvent('page_visit', {
      path: location.pathname,
      repeat: visitCount > 1,
      visitCount,
    })
  }, [location.pathname])

  return { track: trackLeadEvent }
}
