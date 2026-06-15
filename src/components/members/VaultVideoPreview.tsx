const SQUARE_LOGO = '/logo-dd.png'

type VaultVideoPreviewProps = {
  className?: string
  logoClassName?: string
}

export function VaultVideoPreview({
  className = '',
  logoClassName = 'size-14 sm:size-16 md:size-20',
}: VaultVideoPreviewProps) {
  return (
    <div
      className={`flex size-full items-center justify-center bg-gradient-to-br from-charcoal/80 via-void/90 to-charcoal/70 ${className}`}
      aria-hidden
    >
      <img
        src={SQUARE_LOGO}
        alt=""
        className={`object-contain ${logoClassName}`}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
