import { motion } from 'framer-motion'
import { brand, media } from '../../data/venue'
import { ArrowUpRight, Instagram } from '../../components/Icons'
import { Photo } from '../../components/Photo'
import { inView, pop, spring, stagger } from '../../lib/motion'
import './InstaStrip.css'

const TILES = [
  { src: media.vibe.insta, alt: 'Boom Bap Burger on Instagram' },
  { src: media.vibe.beers, alt: 'Beers at Boom Bap Burger' },
  { src: media.leadenhall.restaurantBar, alt: 'The bar at Leadenhall Market' },
  { src: media.vibe.beastieBoys, alt: 'Hip hop and burgers at Boom Bap Burger' },
  { src: media.leadenhall.market, alt: 'Boom Bap Burger in Leadenhall Market' },
  { src: media.tooting.market, alt: 'Boom Bap Burger in Tooting Market' },
]

const TILT = [-3, 2, -1.5, 3, -2.5, 1.5]

export function InstaStrip() {
  const { instagram } = brand.social
  return (
    <section className="section insta" aria-labelledby="insta-title">
      <div className="wrap insta__head">
        <h2 id="insta-title" className="h-lg">
          <a href={instagram.url} target="_blank" rel="noopener noreferrer">
            {instagram.handle}
          </a>
        </h2>
        <a className="text-link" href={instagram.url} target="_blank" rel="noopener noreferrer">
          Follow on Instagram <ArrowUpRight />
        </a>
      </div>
      <motion.ul className="insta__strip" variants={stagger(0.06)} {...inView}>
        {TILES.map((tile, i) => (
          <motion.li key={tile.src} variants={pop} style={{ rotate: TILT[i] }}>
            <motion.a
              href={instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="insta__tile"
              whileHover={{ rotate: -TILT[i], scale: 1.05, zIndex: 2, transition: spring }}
              whileTap={{ scale: 0.96 }}
            >
              <Photo src={tile.src} alt={tile.alt} />
              <span className="insta__icon" aria-hidden="true">
                <Instagram />
              </span>
            </motion.a>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  )
}
