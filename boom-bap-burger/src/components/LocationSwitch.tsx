import { useId, useRef, type KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { locationIds, locations } from '../data/venue'
import { useLocationSite } from '../lib/location'
import { spring } from '../lib/motion'
import './LocationSwitch.css'

interface LocationSwitchProps {
  /** `full` shows the market name and postcode area, `compact` the short name (postcode area on tiny screens). */
  variant?: 'full' | 'compact'
  className?: string
}

/** Leadenhall / Tooting. Swaps hours, phone, booking, takeaway, video and events across the site. */
export function LocationSwitch({ variant = 'compact', className = '' }: LocationSwitchProps) {
  const { location, setLocation } = useLocationSite()
  const pillId = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
    event.preventDefault()
    const next = (index + 1) % locationIds.length
    setLocation(locationIds[next])
    refs.current[next]?.focus()
  }

  return (
    <div className={`loc-switch loc-switch--${variant} ${className}`} role="radiogroup" aria-label="Choose your site">
      {locationIds.map((id, index) => {
        const site = locations[id]
        const active = id === location.id
        return (
          <button
            key={id}
            ref={(el) => {
              refs.current[index] = el
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            className={`loc-switch__option${active ? ' is-active' : ''}`}
            onClick={() => setLocation(id)}
            onKeyDown={(e) => onKeyDown(e, index)}
          >
            {active && <motion.span layoutId={pillId} className="loc-switch__pill" transition={spring} />}
            {variant === 'full' ? (
              <span className="loc-switch__label">
                <span className="loc-switch__name">{site.name}</span>
                <span className="loc-switch__code">{site.code}</span>
              </span>
            ) : (
              <span className="loc-switch__label">
                <span className="loc-switch__short">{site.short}</span>
                <span className="loc-switch__tiny" aria-hidden="true">
                  {site.code}
                </span>
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
