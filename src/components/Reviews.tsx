import { motion } from 'framer-motion'
import { reviews } from '../data/venue'
import { inView, pop, rise, stagger } from '../lib/motion'
import './Reviews.css'

/** Google reviews, quoted exactly. Hidden while there are none in venue.ts. */
export function Reviews() {
  if (!reviews.length) return null
  return (
    <section id="reviews" className="reviews section on-butter" aria-labelledby="reviews-title">
      <div className="container">
        <motion.div className="reviews__head" {...inView} variants={stagger(0.08)}>
          <motion.p className="eyebrow" variants={rise}>
            From Google reviews
          </motion.p>
          <motion.h2 id="reviews-title" className="display" variants={rise}>
            Word from the market
          </motion.h2>
        </motion.div>
        <motion.ul className="reviews__grid" {...inView} variants={stagger(0.08)}>
          {reviews.map((r, i) => (
            <motion.li key={i} className="review" variants={pop} style={{ rotate: i % 2 ? 1.2 : -1.2 }}>
              <blockquote>
                <p>{r.text}</p>
              </blockquote>
              <p className="review__name">{r.name}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
