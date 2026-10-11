import { motion, useReducedMotion } from 'framer-motion'
import { offers } from '../data/venue'
import { inView, pop, rise, springPop, stagger } from '../lib/motion'
import { Divider } from './Divider'
import './Offers.css'

export function Offers() {
  const reduced = useReducedMotion()
  return (
    <section id="offers" className="offers section" aria-labelledby="offers-title">
      <div className="container">
        <Divider tone="gold" />
        <motion.div className="offers__head" {...inView} variants={stagger(0.08)}>
          <motion.p className="eyebrow" variants={rise}>
            On at the market
          </motion.p>
          <motion.h2 id="offers-title" className="display" variants={rise}>
            Offers
          </motion.h2>
        </motion.div>

        <motion.div className="offers__grid" {...inView} variants={stagger(0.12)}>
          {offers.map((offer, i) => (
            <motion.article
              key={offer.id}
              className={`offer offer--${i ? 'gold' : 'butter'}`}
              variants={pop}
              whileHover={reduced ? undefined : { rotate: i ? 1.5 : -1.5, y: -6 }}
              transition={springPop}
            >
              <h3 className="offer__title">{offer.title}</h3>
              {'big' in offer && offer.big && <p className="offer__big">{offer.big}</p>}
              {'body' in offer && offer.body && <p className="offer__body">{offer.body}</p>}
              <p className="offer__cta">{offer.cta}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
