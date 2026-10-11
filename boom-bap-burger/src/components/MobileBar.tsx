import { AnimatePresence, motion } from 'framer-motion'
import { useLocationSite } from '../lib/location'
import { kickSnare, press, springPop } from '../lib/motion'
import { Phone } from './Icons'
import './MobileBar.css'

/** Phones only: book or call the chosen site from anywhere. */
export function MobileBar() {
  const { location } = useLocationSite()
  return (
    <div className="mobile-bar" role="region" aria-label={`Book or call ${location.name}`}>
      <motion.a
        className="mobile-bar__book"
        href={location.bookUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={kickSnare}
        whileTap={press}
      >
        <span>Book a table</span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.small
            key={location.id}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={springPop}
          >
            {location.name}
          </motion.small>
        </AnimatePresence>
      </motion.a>
      <motion.a className="mobile-bar__call" href={`tel:${location.phone.tel}`} whileTap={press}>
        <Phone />
        <span>Call</span>
      </motion.a>
    </div>
  )
}
