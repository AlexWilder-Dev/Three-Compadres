import type { TargetAndTransition, Transition, Variants } from 'framer-motion'

/** Punchy spring with a little overshoot. */
export const spring: Transition = { type: 'spring', stiffness: 560, damping: 26, mass: 0.8 }
/** Snappier, for small things popping in. */
export const springPop: Transition = { type: 'spring', stiffness: 720, damping: 18 }
/** Heavier, for big blocks. Still lands, never floats. */
export const springBig: Transition = { type: 'spring', stiffness: 320, damping: 26 }

/** Boom (kick), bap (snare): two hits, the second one lighter. */
export const kickSnare: TargetAndTransition = {
  scale: [1, 1.1, 0.97, 1.05, 1],
  transition: { duration: 0.46, times: [0, 0.14, 0.34, 0.52, 1], ease: 'easeOut' },
}

export const press: TargetAndTransition = { scale: 0.93, transition: springPop }

export const rise: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: springBig },
}

export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: springPop },
}

export const stagger = (gap = 0.07, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
})

export const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.2 } } as const
