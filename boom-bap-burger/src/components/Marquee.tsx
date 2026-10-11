import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'framer-motion'
import { brand } from '../data/venue'
import './Marquee.css'

/** Small vinyl between phrases. */
const Spacer = () => (
  <svg className="marquee__disc" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="11" fill="currentColor" />
    <circle cx="12" cy="12" r="4" fill="var(--marquee-label)" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" />
  </svg>
)

function Band({ direction, className }: { direction: 1 | -1; className: string }) {
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(velocity, [-2000, 0, 2000], [-4, 0, 4], { clamp: false })
  const heading = useRef(direction)
  const translate = useTransform(x, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (reduced) return
    const b = boost.get()
    // Scrolling pushes the band along; scrolling back up flips it.
    if (b < 0) heading.current = (-direction as 1 | -1)
    else if (b > 0) heading.current = direction
    const speed = 2.2 * (1 + Math.abs(b))
    x.set(x.get() + heading.current * -speed * (delta / 1000))
  })

  const phrases = [...brand.marquee, ...brand.marquee]
  return (
    <div className={`marquee__band ${className}`} aria-hidden="true">
      <motion.div className="marquee__track" style={{ x: translate }}>
        {[0, 1].map((copy) => (
          <div className="marquee__group" key={copy}>
            {phrases.map((phrase, i) => (
              <span className="marquee__item" key={i}>
                {phrase}
                <Spacer />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/** Two crossed tape bands. The front one carries the words, the back one runs the other way. */
export function Marquee() {
  return (
    <section className="marquee">
      <p className="visually-hidden">{brand.marquee.join(' · ')}</p>
      <Band direction={-1} className="marquee__band--back" />
      <Band direction={1} className="marquee__band--front" />
    </section>
  )
}
