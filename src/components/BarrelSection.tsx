import { useRef, useState } from 'react'
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { menu, photos, venue } from '../data/venue'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { springBig, springPop } from '../lib/motion'
import { BarrelArt } from './BarrelArt'
import { BarrelIcon } from './Barrel'
import { DishCard } from './DishCard'
import { EmberCanvas } from './EmberCanvas'
import './BarrelSection.css'

// Scroll progress at which beats 2–8 appear when the section is pinned.
// Beat 1 (the title) plays as soon as the section comes into view.
const BEATS = [0.05, 0.13, 0.24, 0.3, 0.38, 0.46, 0.54]

export function BarrelSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const dishesRef = useRef<HTMLDivElement>(null)
  const originRef = useRef<SVGCircleElement>(null)
  const reduced = !!useReducedMotion()
  const pinned = useMediaQuery('(min-width: 1024px) and (min-height: 700px)') && !reduced

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: pinned ? ['start start', 'end end'] : ['start end', 'end start'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 26, mass: 0.6 })
  const lid = useTransform(progress, pinned ? [0.02, 0.3] : [0.2, 0.45], [0, -32])
  const glow = useTransform(progress, pinned ? [0, 0.3] : [0.15, 0.45], [0.2, 1])
  const intensity = useTransform(progress, pinned ? [0, 0.3] : [0.1, 0.45], [0.3, 1])
  // Reduced motion: lid sits open and the glow stays on, nothing tracks the scroll.
  const lidStill = useMotionValue(-24)
  const glowStill = useMotionValue(1)

  const [beat, setBeat] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (pinned) setBeat(1 + BEATS.filter((b) => v >= b).length)
  })
  const textSeen = useInView(textRef, { once: true, amount: 0.3 })
  const dishesSeen = useInView(dishesRef, { once: true, amount: 0.15 })

  // Beats: 1 title, 2 method, 3 mission, 4 strap, 5–8 dishes.
  const shown = (n: number) => {
    if (reduced) return true
    if (pinned) return n === 1 ? textSeen : beat >= n
    return n <= 3 ? textSeen : dishesSeen
  }
  const delayFor = (n: number) => (pinned || reduced ? 0 : n <= 3 ? (n - 1) * 0.1 : (n - 4) * 0.09)
  const reveal = (n: number, transition = springBig) => ({
    initial: reduced ? false : ('hidden' as const),
    animate: shown(n) ? 'show' : 'hidden',
    variants: {
      hidden: { opacity: 0, y: 50, rotate: n >= 5 ? (n % 2 ? -3 : 3) : 0 },
      show: { opacity: 1, y: 0, rotate: 0, transition: { ...transition, delay: delayFor(n) } },
    },
  })

  return (
    <section
      id="barrel"
      ref={sectionRef}
      className={`barrel ${pinned ? 'barrel--pinned' : ''}`}
      aria-labelledby="barrel-title"
    >
      <div className="barrel__frame">
        <EmberCanvas className="barrel__embers" intensity={intensity} originRef={originRef} />
        <div className="barrel__grain" aria-hidden="true" />

        <div className="container barrel__layout">
          <div className="barrel__intro" ref={textRef}>
            <motion.p className="eyebrow barrel__eyebrow" {...reveal(1)}>
              <BarrelIcon width={28} height={28} /> Barril grill
            </motion.p>
            <motion.h2 id="barrel-title" className="display display--md barrel__title" {...reveal(1)}>
              {venue.barrel.title}
            </motion.h2>
            <motion.p className="barrel__method" {...reveal(2)}>
              {venue.barrel.method}
            </motion.p>
            <div className="barrel__row">
              <div className="barrel__art">
                {photos.barrel ? (
                  <img
                    className="barrel__photo"
                    src={`${import.meta.env.BASE_URL}${photos.barrel.src}`}
                    alt={photos.barrel.alt}
                    width={photos.barrel.width}
                    height={photos.barrel.height}
                    loading="lazy"
                  />
                ) : (
                  <BarrelArt lid={reduced ? lidStill : lid} glow={reduced ? glowStill : glow} originRef={originRef} />
                )}
              </div>
              <motion.p className="barrel__mission" {...reveal(3)}>
                {venue.barrel.mission}
              </motion.p>
            </div>
          </div>

          <div className="barrel__dishes" ref={dishesRef}>
            <motion.p className="barrel__strap" {...reveal(4)}>
              {venue.barrel.strap}
            </motion.p>
            <div className="barrel__grid">
              {menu.barrel.map((dish, i) => (
                <DishCard key={dish.id} dish={dish} {...reveal(5 + i, springPop)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
