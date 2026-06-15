import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/** Renders above site header/sidebars — escapes parent stacking contexts. */
export const OVERLAY_Z = 'z-[200]'

type OverlayPortalProps = {
  children: ReactNode
}

export function OverlayPortal({ children }: OverlayPortalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  return createPortal(children, document.body)
}
