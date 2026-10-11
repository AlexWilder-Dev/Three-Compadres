import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { MOUSTACHE_PATH } from './Moustache'
import './Loader.css'

/** Page-load line: the three joined moustaches draw themselves, then the curtain lifts. */
export function Loader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 1150)
    return () => window.clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      className="loader"
      aria-hidden="true"
      exit={{ y: '-100%' }}
      transition={{ type: 'spring', stiffness: 220, damping: 30 }}
    >
      <div className="loader__row">
        <motion.span
          className="loader__line loader__line--left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.45 }}
        />
        <svg viewBox="-300 -44 600 88" className="loader__tash">
          {[-196, 0, 196].map((x, i) => (
            <motion.path
              key={x}
              d={MOUSTACHE_PATH}
              transform={`translate(${x} 0)`}
              fill="var(--butter)"
              stroke="var(--butter)"
              strokeWidth={3}
              initial={{ pathLength: 0, fillOpacity: 0 }}
              animate={{ pathLength: 1, fillOpacity: 1 }}
              transition={{
                pathLength: { duration: 0.6, delay: i * 0.08, ease: 'easeInOut' },
                fillOpacity: { duration: 0.2, delay: 0.5 + i * 0.08 },
              }}
            />
          ))}
        </svg>
        <motion.span
          className="loader__line loader__line--right"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.45 }}
        />
      </div>
    </motion.div>
  )
}
