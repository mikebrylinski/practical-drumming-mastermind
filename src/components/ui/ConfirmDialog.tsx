import { useCallback, useEffect, useRef, useState } from 'react'

export type ConfirmOptions = {
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}

type ConfirmDialogProps = ConfirmOptions & {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Promise-based confirmation. Call `confirm(options)` from any handler and
 * `await` the boolean result; render `<ConfirmDialog {...dialogProps} />` once.
 */
export function useConfirm() {
  const [state, setState] = useState<ConfirmOptions & { open: boolean }>({
    open: false,
    title: '',
  })
  const resolver = useRef<((value: boolean) => void) | null>(null)

  const confirm = useCallback((options: ConfirmOptions) => {
    setState({ ...options, open: true })
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve
    })
  }, [])

  const close = useCallback((result: boolean) => {
    setState((s) => ({ ...s, open: false }))
    resolver.current?.(result)
    resolver.current = null
  }, [])

  const dialogProps: ConfirmDialogProps = {
    ...state,
    onConfirm: () => close(true),
    onCancel: () => close(false),
  }

  return { confirm, dialogProps }
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden
      />
      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-charcoal p-6 shadow-2xl">
        <h2 className="font-bebas text-2xl tracking-wide text-mist">{title}</h2>
        {message ? (
          <p className="mt-2 font-garamond text-sm leading-relaxed text-mist/65">{message}</p>
        ) : null}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-white/15 px-5 py-2 font-garamond text-sm tracking-[0.14em] text-mist/70 uppercase transition hover:border-white/30 hover:text-mist"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-full px-5 py-2 font-garamond text-sm tracking-[0.14em] uppercase transition ${
              danger
                ? 'bg-red-500/90 text-white hover:bg-red-500'
                : 'bg-gold text-void hover:bg-gold/90'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
