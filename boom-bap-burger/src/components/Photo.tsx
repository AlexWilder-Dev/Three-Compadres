import { useState } from 'react'
import './Photo.css'

interface PhotoProps {
  src: string
  alt: string
  className?: string
  eager?: boolean
}

/** Hotlinked photo. If the venue's server refuses it, a printed-ink panel takes its place so the layout holds. */
export function Photo({ src, alt, className = '', eager = false }: PhotoProps) {
  const [broken, setBroken] = useState(false)
  return (
    <div className={`photo ${className}`} data-broken={broken || undefined}>
      {broken ? (
        <div className="photo__fallback halftone" role={alt ? 'img' : undefined} aria-label={alt || undefined}>
          <span aria-hidden="true">Boom Bap</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setBroken(true)}
        />
      )}
    </div>
  )
}
