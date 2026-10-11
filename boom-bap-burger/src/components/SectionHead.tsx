import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { inView, rise, stagger } from '../lib/motion'
import './SectionHead.css'

interface SectionHeadProps {
  eyebrow: string
  title: ReactNode
  id?: string
  lede?: ReactNode
  aside?: ReactNode
  as?: 'h1' | 'h2'
  size?: 'xl' | 'lg' | 'md'
}

export function SectionHead({ eyebrow, title, id, lede, aside, as = 'h2', size = 'lg' }: SectionHeadProps) {
  const Heading = as === 'h1' ? motion.h1 : motion.h2
  return (
    <motion.div className="section-head" variants={stagger(0.08)} {...inView}>
      <div className="section-head__main">
        <motion.p className="eyebrow" variants={rise}>
          {eyebrow}
        </motion.p>
        <Heading id={id} className={`h-${size}`} variants={rise}>
          {title}
        </Heading>
        {lede && (
          <motion.p className="lede" variants={rise}>
            {lede}
          </motion.p>
        )}
      </div>
      {aside && (
        <motion.div className="section-head__aside" variants={rise}>
          {aside}
        </motion.div>
      )}
    </motion.div>
  )
}
