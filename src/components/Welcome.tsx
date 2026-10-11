import { motion } from 'framer-motion'
import { photos, venue } from '../data/venue'
import { inView, rise, stagger } from '../lib/motion'
import { Divider } from './Divider'
import './Welcome.css'

export function Welcome() {
  const words = venue.motto.split(' ')
  return (
    <section id="welcome" className="welcome section on-butter" aria-labelledby="welcome-title">
      <div className="container">
        <Divider tone="ink" />
        <div className="welcome__grid">
          <motion.h2 id="welcome-title" className="welcome__motto" {...inView} variants={stagger(0.09)}>
            {words.map((word, i) => (
              <motion.span key={i} variants={rise} className={word === 'and' ? 'welcome__and' : ''}>
                {word}
                {i === words.length - 1 ? '.' : ''}
              </motion.span>
            ))}
          </motion.h2>

          <motion.div className="welcome__copy" {...inView} variants={stagger(0.1, 0.2)}>
            <motion.p className="eyebrow" variants={rise}>
              Welcome to the market
            </motion.p>
            <motion.p className="welcome__text" variants={rise}>
              {venue.welcome}
            </motion.p>
            {photos.welcome && (
              <motion.img
                variants={rise}
                className="welcome__photo"
                src={`${import.meta.env.BASE_URL}${photos.welcome.src}`}
                alt={photos.welcome.alt}
                width={photos.welcome.width}
                height={photos.welcome.height}
                loading="lazy"
              />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
