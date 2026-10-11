import { AnimatePresence, motion } from 'framer-motion'
import type { Location } from '../data/venue'
import { useOpenStatus } from '../hooks/useOpenStatus'
import { springPop } from '../lib/motion'
import './OpenBadge.css'

/** Live open/closed pill in London time. */
export function OpenBadge({ location, className = '' }: { location: Location; className?: string }) {
  const status = useOpenStatus(location)
  return (
    <span className={`open-badge open-badge--${status.state} ${className}`}>
      <span className="open-badge__dot" aria-hidden="true" />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={status.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={springPop}
        >
          {status.label}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
