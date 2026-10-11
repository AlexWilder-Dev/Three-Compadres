import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll } from 'framer-motion'
import { brand, media } from '../data/venue'
import { spring } from '../lib/motion'
import './Record.css'

/** 33⅓ rpm in degrees per second. */
const RPM_33 = (100 / 3) * 6

const GROOVES = Array.from({ length: 30 }, (_, i) => 84 + i * 3.6)

interface RecordProps {
  side: 'A' | 'B'
  playing: boolean
}

/** The menu as a 12-inch: spins at 33⅓, scrubs with the scroll, flips when you reach the B-Sides. */
export function Record({ side, playing }: RecordProps) {
  const rotate = useMotionValue(0)
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()
  const lastScroll = useRef(0)

  useEffect(() => {
    if (reduced) return
    lastScroll.current = scrollY.get()
    return scrollY.on('change', (y) => {
      rotate.set(rotate.get() + (y - lastScroll.current) * 0.35)
      lastScroll.current = y
    })
  }, [scrollY, rotate, reduced])

  useAnimationFrame((_, delta) => {
    if (playing) rotate.set(rotate.get() + RPM_33 * (delta / 1000))
  })

  return (
    <div className="record">
      <AnimatePresence mode="wait" initial={false}>
        <motion.svg
          key={side}
          className="record__disc"
          viewBox="0 0 400 400"
          aria-hidden="true"
          initial={{ rotateY: 90, scale: 0.9 }}
          animate={{ rotateY: 0, scale: 1, transition: spring }}
          exit={{ rotateY: -90, scale: 0.9, transition: { duration: 0.16, ease: 'easeIn' } }}
        >
          <defs>
            <linearGradient id={`sheen-${side}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.38" stopColor="#fff" stopOpacity="0.12" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.62" stopColor="#fff" stopOpacity="0.08" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <path id={`label-arc-${side}`} d="M200,200 m-56,0 a56,56 0 1,1 112,0 a56,56 0 1,1 -112,0" />
          </defs>

          <motion.g style={{ rotate }}>
            <circle cx="200" cy="200" r="196" className="record__vinyl" />
            {GROOVES.map((r, i) => (
              <circle key={r} cx="200" cy="200" r={r} className={i % 9 === 8 ? 'record__gap' : 'record__groove'} />
            ))}
            <circle cx="200" cy="200" r="76" className="record__label" />
            <circle cx="200" cy="200" r="76" className="record__label-ring" />
            <text className="record__arc-text">
              <textPath href={`#label-arc-${side}`} textLength="348" lengthAdjust="spacing">
                BURGERS &amp; B-SIDES · BOOM BAP BURGER · EST. {brand.founded} ·
              </textPath>
            </text>
            <image href={media.logo} x="164" y="170" width="72" height="24.7" />
            <text x="200" y="222" className="record__side">
              SIDE {side}
            </text>
            <text x="200" y="238" className="record__side-sub">
              {side === 'A' ? 'BURGERS' : 'SIDES & EXTRAS'}
            </text>
            <circle cx="200" cy="200" r="5" className="record__hole" />
          </motion.g>

          <circle cx="200" cy="200" r="196" fill={`url(#sheen-${side})`} pointerEvents="none" />
        </motion.svg>
      </AnimatePresence>

      <svg className="record__arm" viewBox="0 0 400 400" aria-hidden="true">
        <motion.g
          style={{ transformBox: 'view-box', originX: '360px', originY: '46px' }}
          initial={{ rotate: -28 }}
          animate={{ rotate: playing ? 0 : -28 }}
          transition={{ type: 'spring', stiffness: 140, damping: 16, delay: playing ? 0.15 : 0 }}
        >
          <circle cx="360" cy="46" r="20" className="record__arm-base" />
          <circle cx="360" cy="46" r="7" className="record__arm-pivot" />
          <path d="M360,46 L352,210 Q350,236 330,254 L306,276" className="record__arm-tube" />
          <rect x="290" y="268" width="26" height="16" rx="3" transform="rotate(42 303 276)" className="record__arm-head" />
        </motion.g>
      </svg>
    </div>
  )
}
