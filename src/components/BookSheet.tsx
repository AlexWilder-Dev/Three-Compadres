import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { venue } from '../data/venue'
import { useOpenStatus } from '../hooks/useOpenStatus'
import { DAY_NAMES, formatRange } from '../lib/hours'
import { spring } from '../lib/motion'
import { useBook } from './BookContext'
import { HoursBadge } from './HoursBadge'
import { MoustacheTrio } from './Moustache'
import { ArrowUpRight, Close, Phone } from './Icons'
import './BookSheet.css'

export function BookSheet() {
  const { isOpen, close } = useBook()
  const status = useOpenStatus()
  const reduced = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const firstRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const previous = document.activeElement as HTMLElement | null
    document.body.classList.add('is-locked')
    const t = window.setTimeout(() => firstRef.current?.focus(), 50)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key !== 'Tab' || !panelRef.current) return
      // Keep focus inside the sheet.
      const items = panelRef.current.querySelectorAll<HTMLElement>('a[href], button')
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('is-locked')
      previous?.focus?.()
    }
  }, [isOpen, close])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="sheet" role="presentation">
          <motion.div
            className="sheet__backdrop"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            ref={panelRef}
            className="sheet__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-title"
            initial={reduced ? { opacity: 0 } : { y: '100%' }}
            animate={reduced ? { opacity: 1 } : { y: 0 }}
            exit={reduced ? { opacity: 0 } : { y: '110%' }}
            transition={spring}
            drag={reduced ? false : 'y'}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) close()
            }}
          >
            <div className="sheet__grab" aria-hidden="true" />
            <button className="sheet__close" onClick={close} aria-label="Close">
              <Close />
            </button>
            <MoustacheTrio className="sheet__tash" />
            <h2 id="book-title" className="sheet__title">
              Book a table
            </h2>

            <div className="sheet__today">
              <HoursBadge size="sm" />
              <p>
                Today, {DAY_NAMES[status.day]}: <strong>{formatRange(status.today)}</strong>
              </p>
            </div>

            <div className="sheet__actions">
              <a
                ref={firstRef}
                className="btn btn--block"
                href={venue.booking.easytable}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book on Easytable <ArrowUpRight />
              </a>
              <a
                className="btn btn--gold btn--block"
                href={venue.booking.thefork}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book on TheFork <ArrowUpRight />
              </a>
              <a className="btn btn--ghost btn--block" href={`tel:${venue.phone.tel}`}>
                <Phone /> Call {venue.phone.display}
              </a>
            </div>
            <p className="sheet__note">Booking pages open in a new tab.</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
