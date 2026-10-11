import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { rise, stagger } from '../lib/motion'
import './PageHero.css'

interface PageHeroProps {
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
  children?: ReactNode
  art?: ReactNode
}

/** Opening block for the inner pages. */
export function PageHero({ eyebrow, title, lede, children, art }: PageHeroProps) {
  return (
    <section className={`page-hero${art ? ' page-hero--art' : ''}`}>
      <div className="page-hero__inner wrap">
        <motion.div className="page-hero__text" variants={stagger(0.08, 0.05)} initial="hidden" animate="show">
          <motion.p className="eyebrow" variants={rise}>
            {eyebrow}
          </motion.p>
          <motion.h1 className="h-xl" variants={rise}>
            {title}
          </motion.h1>
          {lede && (
            <motion.p className="lede" variants={rise}>
              {lede}
            </motion.p>
          )}
          {children && (
            <motion.div className="page-hero__extra" variants={rise}>
              {children}
            </motion.div>
          )}
        </motion.div>
        {art && <div className="page-hero__art">{art}</div>}
      </div>
    </section>
  )
}
