import { useState } from 'react'
import { venue } from '../data/venue'

/** The venue's own logo PNG. Falls back to the name in text if the file is missing. */
export function Logo({ className = '', height = 44 }: { className?: string; height?: number }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <span className={`logo-text ${className}`} style={{ fontSize: height * 0.42 }}>
        {venue.name}
      </span>
    )
  }
  return (
    <img
      className={`logo-img ${className}`}
      src={`${import.meta.env.BASE_URL}${venue.logo}`}
      alt={venue.name}
      height={height}
      style={{ height }}
      onError={() => setFailed(true)}
    />
  )
}
