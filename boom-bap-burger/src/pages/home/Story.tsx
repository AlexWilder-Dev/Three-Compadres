import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { brand, media, story } from '../../data/venue'
import { Photo } from '../../components/Photo'
import { Sticker } from '../../components/Sticker'
import { inView, rise, stagger } from '../../lib/motion'
import './Story.css'

/** Rubber stamp with the founding year. */
function Stamp() {
  return (
    <svg className="stamp" viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <filter id="stamp-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="3.5" />
        </filter>
        <path id="stamp-arc" d="M100,100 m-70,0 a70,70 0 1,1 140,0 a70,70 0 1,1 -140,0" />
      </defs>
      <g filter="url(#stamp-rough)">
        <circle cx="100" cy="100" r="94" className="stamp__ring" />
        <circle cx="100" cy="100" r="54" className="stamp__ring stamp__ring--thin" />
        <text className="stamp__arc">
          <textPath href="#stamp-arc" textLength="430" lengthAdjust="spacing">
            BOOM BAP BURGER · LONDON · BEERS + BURGERS + COCKTAILS ·
          </textPath>
        </text>
        <text x="100" y="94" className="stamp__est">
          EST.
        </text>
        <text x="100" y="124" className="stamp__year">
          {brand.founded}
        </text>
      </g>
    </svg>
  )
}

export function Story() {
  const collage = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: collage, offset: ['start end', 'end start'] })
  const lift = useTransform(scrollYProgress, [0, 1], [50, -50])
  const sink = useTransform(scrollYProgress, [0, 1], [-30, 40])
  const spin = useTransform(scrollYProgress, [0, 1], [-40, 40])
  const still = useReducedMotion()

  return (
    <section className="section story" aria-labelledby="story-title">
      <div className="wrap story__grid">
        <motion.div className="story__text" variants={stagger(0.09)} {...inView}>
          <motion.p className="eyebrow" variants={rise}>
            Our story
          </motion.p>
          <motion.h2 id="story-title" className="h-lg" variants={rise}>
            {story.heading}
          </motion.h2>
          {story.paragraphs.map((text) => (
            <motion.p key={text.slice(0, 16)} className="story__para" variants={rise}>
              {text}
            </motion.p>
          ))}
          <motion.ul className="story__facts" variants={stagger(0.08)}>
            {story.facts.map((fact) => (
              <motion.li key={fact.value} variants={rise}>
                <strong>{fact.value}</strong>
                <span>{fact.label}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <div className="story__collage" ref={collage}>
          <motion.div className="story__frame story__frame--a" style={still ? undefined : { y: lift }}>
            <Photo src={media.leadenhall.lunch} alt="Lunch at Boom Bap Burger, Leadenhall Market" />
          </motion.div>
          <motion.div className="story__frame story__frame--b" style={still ? undefined : { y: sink }}>
            <Photo src={media.vibe.beastieBoys} alt="Hip hop and burgers at Boom Bap Burger" />
          </motion.div>
          <motion.div className="story__stamp" style={still ? undefined : { rotate: spin }}>
            <Stamp />
          </motion.div>
          <Sticker src={media.stickers.beerCocktails} rotate={-14} className="story__sticker" />
        </div>
      </div>
    </section>
  )
}
