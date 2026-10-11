import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { brand, events, everywhere, media } from '../../data/venue'
import { BoomButton } from '../../components/BoomButton'
import { Equalizer } from '../../components/Equalizer'
import { HeroVideo } from '../../components/HeroVideo'
import { ArrowRight, ArrowUpRight, Bag } from '../../components/Icons'
import { LocationSwitch } from '../../components/LocationSwitch'
import { Logo } from '../../components/Logo'
import { OpenBadge } from '../../components/OpenBadge'
import { Sticker } from '../../components/Sticker'
import { useLocationSite } from '../../lib/location'
import { springPop } from '../../lib/motion'
import './Hero.css'

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { ...springPop, delay },
})

export function Hero() {
  const { location } = useLocationSite()
  const headline = events[location.id][0] ?? everywhere[0]

  return (
    <section className="hero" aria-labelledby="hero-title">
      <HeroVideo location={location} />
      <Sticker src={media.stickers.beerCocktails} rotate={-11} className="hero__sticker hero__sticker--a" delay={0.9} />
      <Sticker src={media.stickers.londonBeer} rotate={9} className="hero__sticker hero__sticker--b" delay={1.05} />

      <div className="hero__content wrap">
        <motion.div {...enter(0.05)}>
          <OpenBadge location={location} />
        </motion.div>

        <h1 id="hero-title" className="hero__title">
          {/* Boom: the logo lands like a kick drum. */}
          <motion.span
            className="hero__logo"
            initial={{ opacity: 0, scale: 1.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 520, damping: 16, delay: 0.15 }}
          >
            <Logo eager />
          </motion.span>
        </h1>

        {/* Bap: the tagline snaps in after it. */}
        <motion.p
          className="hero__tagline"
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: -2.5 }}
          transition={{ type: 'spring', stiffness: 700, damping: 15, delay: 0.42 }}
        >
          {brand.tagline}
        </motion.p>

        <motion.div className="hero__switch" {...enter(0.55)}>
          <LocationSwitch variant="full" />
        </motion.div>

        <motion.div className="hero__ctas" {...enter(0.65)}>
          <BoomButton href={location.bookUrl} size="lg" ariaLabel={`Book a table at ${location.name}`}>
            Book a table
          </BoomButton>
          <BoomButton to="/menu" variant="ghost" size="lg">
            See the menu
          </BoomButton>
        </motion.div>

        <motion.div className="hero__meta" {...enter(0.75)}>
          {location.takeaway.kind === 'delivery' ? (
            <a href={location.takeaway.href} target="_blank" rel="noopener noreferrer">
              <Bag /> {location.takeaway.cta} <ArrowUpRight />
            </a>
          ) : (
            <a href={`tel:${location.phone.tel}`}>
              <Bag /> Takeaway: call ahead on {location.phone.display}
            </a>
          )}
          <Link to="/events">
            {headline.icon === 'decks' && <Equalizer bars={4} />}
            {headline.title} <ArrowRight />
          </Link>
        </motion.div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span>Scroll</span>
        <span className="hero__scroll-line" />
      </div>
    </section>
  )
}
