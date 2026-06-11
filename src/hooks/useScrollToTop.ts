import { useLayoutEffect } from 'react'
import { scrollToTop } from '../lib/scrollToTop'

/** Scroll the window to the top when deps change (before paint). */
export function useScrollToTop(...deps: unknown[]) {
  useLayoutEffect(() => {
    scrollToTop()
  }, deps)
}
