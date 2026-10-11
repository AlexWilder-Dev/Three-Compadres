import { useState } from 'react'
import { brand, media } from '../data/venue'

interface LogoProps {
  className?: string
  eager?: boolean
  /** Decorative when a text label sits next to it. */
  decorative?: boolean
}

/** Their white logo, hotlinked. Falls back to the name in the display face. */
export function Logo({ className = '', eager = false, decorative = false }: LogoProps) {
  const [broken, setBroken] = useState(false)
  if (broken) {
    return (
      <span className={`logo logo--text ${className}`} aria-hidden={decorative || undefined}>
        Boom Bap Burger
      </span>
    )
  }
  return (
    <img
      className={`logo ${className}`}
      src={media.logo}
      alt={decorative ? '' : brand.name}
      width={280}
      height={96}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setBroken(true)}
    />
  )
}
