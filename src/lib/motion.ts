import type { Transition, Variants } from 'framer-motion'

/** Snappy spring with a little overshoot. */
export const spring: Transition = { type: 'spring', stiffness: 520, damping: 24, mass: 0.9 }
/** Bouncier, for small things popping in. */
export const springPop: Transition = { type: 'spring', stiffness: 700, damping: 16 }
/** Slightly softer, for big blocks. */
export const springBig: Transition = { type: 'spring', stiffness: 260, damping: 22 }

export const rise: Variants = {
  hidden: { opacity: 0, y: 48 },
  show: { opacity: 1, y: 0, transition: springBig },
}

export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: springPop },
}

export const stagger = (gap = 0.07, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
})

export const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.25 } } as const
