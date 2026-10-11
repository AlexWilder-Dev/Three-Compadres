import { motion, useReducedMotion } from 'framer-motion'
import { venue } from '../data/venue'
import { springBig, springPop } from '../lib/motion'
import { useBook } from './BookContext'
import { Faces } from './Faces'
import { HoursBadge } from './HoursBadge'
import { ArrowDown } from './Icons'
import { Logo } from './Logo'
import './Hero.css'

export function Hero({ ready }: { ready: boolean }) {
  const { open } = useBook()
  const reduced = useReducedMotion()
  const show = ready || !!reduced
  const enter = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 40 },
          animate: show ? { opacity: 1, y: 0 } : undefined,
          transition: { ...springBig, delay },
        }

  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true" />
      <div className="container hero__inner">
        <motion.div className="hero__badge" {...enter(0.35)}>
          <HoursBadge />
        </motion.div>

        {venue.heroArt === 'faces' ? (
          <>
            <div className="hero__faces">
              <Faces ready={show} />
            </div>
            <h1 id="hero-title" className="hero__title">
              {['Three', 'Compadres'].map((word, i) => (
                <motion.span
                  key={word}
                  className="hero__word"
                  initial={reduced ? false : { opacity: 0, y: '60%', rotate: i ? 4 : -4 }}
                  animate={show ? { opacity: 1, y: 0, rotate: 0 } : undefined}
                  transition={{ ...springPop, delay: 0.2 + i * 0.08 }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>
          </>
        ) : (
          <motion.h1 id="hero-title" className="hero__logo" {...enter(0.1)}>
            <Logo height={320} />
          </motion.h1>
        )}

        <motion.p className="hero__tagline" {...enter(0.32)}>
          <span className="hero__rule" aria-hidden="true" />
          {venue.tagline}
          <span className="hero__rule" aria-hidden="true" />
        </motion.p>

        <motion.p className="hero__headline" {...enter(0.4)}>
          {venue.headline}
        </motion.p>

        <motion.div className="hero__ctas" {...enter(0.48)}>
          <motion.button
            className="btn"
            onClick={open}
            whileHover={reduced ? undefined : { y: -3, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={springPop}
          >
            Book a table
          </motion.button>
          <motion.a
            className="btn btn--ghost"
            href="#menu"
            whileHover={reduced ? undefined : { y: -3, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            transition={springPop}
          >
            See the menu
          </motion.a>
        </motion.div>
      </div>

      <a className="hero__scroll" href="#welcome" aria-label="Scroll to welcome">
        <ArrowDown />
      </a>
    </section>
  )
}
