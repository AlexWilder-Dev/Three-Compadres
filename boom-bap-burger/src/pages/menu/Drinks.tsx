import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { drinks, media } from '../../data/venue'
import { Photo } from '../../components/Photo'
import { SectionHead } from '../../components/SectionHead'
import { inView, rise, spring, stagger } from '../../lib/motion'
import './Drinks.css'

/** Scalloped beer mat with the house beer's name on it. */
function BeerMat({ name, note, tilt }: { name: string; note: string; tilt: number }) {
  const short = name.replace('Boom Bap ', '')
  return (
    <motion.figure
      className="beer-mat"
      style={{ rotate: tilt }}
      whileHover={{ rotate: tilt + 360, scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
    >
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <path
          className="beer-mat__edge"
          d={Array.from({ length: 36 }, (_, i) => {
            const a = (i / 36) * Math.PI * 2
            const r = i % 2 === 0 ? 98 : 93
            return `${i === 0 ? 'M' : 'L'}${(100 + Math.cos(a) * r).toFixed(1)},${(100 + Math.sin(a) * r).toFixed(1)}`
          }).join(' ') + ' Z'}
        />
        <circle cx="100" cy="100" r="80" className="beer-mat__ring" />
        <text x="100" y="78" className="beer-mat__small">
          BOOM BAP
        </text>
        <text x="100" y="118" className="beer-mat__name">
          {short}
        </text>
        <text x="100" y="146" className="beer-mat__small">
          {note.toUpperCase()}
        </text>
      </svg>
      <figcaption className="visually-hidden">
        {name}, {note.toLowerCase()}
      </figcaption>
    </motion.figure>
  )
}

/** Their cocktail clip, playing only while it's on screen. */
function CocktailVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  const visible = useInView(ref, { amount: 0.3 })
  const reduced = useReducedMotion()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.muted = true
    if (visible && !reduced) v.play().catch(() => {})
    else v.pause()
  }, [visible, reduced])

  if (failed) return <Photo src={media.vibe.beers} alt="" className="drink-card__bg" />
  return (
    <video
      ref={ref}
      className="drink-card__bg"
      src={media.video.cocktails}
      poster={media.vibe.beers}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
      onError={() => setFailed(true)}
    />
  )
}

export function Drinks() {
  return (
    <section className="section drinks" aria-labelledby="drinks-title">
      <div className="wrap">
        <SectionHead
          eyebrow="Bonus disc"
          id="drinks-title"
          title="Beers + cocktails"
          lede="Two house beers with our name on them, the classics on the bar and cocktails shaken to order."
        />
        <motion.div className="drinks__grid" variants={stagger(0.1)} {...inView}>
          <motion.article className="drink-card drink-card--house" variants={rise}>
            <p className="label">House beers</p>
            <h3 className="drink-card__title">Our own pour</h3>
            <div className="drink-card__mats">
              {drinks.houseBeers.map((beer, i) => (
                <BeerMat key={beer.name} name={beer.name} note={beer.note} tilt={i === 0 ? -8 : 7} />
              ))}
            </div>
          </motion.article>

          <motion.article className="drink-card drink-card--beers" variants={rise}>
            <Photo src={media.vibe.beers} alt="Beers at Boom Bap Burger" className="drink-card__photo" />
            <div className="drink-card__body">
              <p className="label">Also on the bar</p>
              <h3 className="drink-card__title">Beers</h3>
              <ul className="drink-list">
                {drinks.beers.map((beer, i) => (
                  <motion.li key={beer} whileHover={{ x: 8 }} transition={spring}>
                    <span className="drink-list__no">{String(i + 1).padStart(2, '0')}</span>
                    {beer}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.article>

          <motion.article className="drink-card drink-card--cocktails" variants={rise}>
            <CocktailVideo />
            <div className="drink-card__shade" />
            <div className="drink-card__body">
              <p className="label">Shaken, stirred</p>
              <h3 className="drink-card__title">Cocktails</h3>
              <p className="drink-card__text">{drinks.cocktails}</p>
            </div>
          </motion.article>

          <motion.article className="drink-card drink-card--spirits" variants={rise}>
            <p className="label">Behind the bar</p>
            <h3 className="drink-card__title">Spirits</h3>
            <ul className="spirit-tags">
              {drinks.spirits.map((spirit, i) => (
                <motion.li
                  key={spirit}
                  style={{ rotate: i % 2 ? 2.5 : -2.5 }}
                  whileHover={{ rotate: 0, scale: 1.08 }}
                  transition={spring}
                >
                  {spirit}
                </motion.li>
              ))}
            </ul>
          </motion.article>
        </motion.div>
      </div>
    </section>
  )
}
