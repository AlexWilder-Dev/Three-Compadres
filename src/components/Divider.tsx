import { motion, useReducedMotion } from 'framer-motion'
import { MoustacheTrio } from './Moustache'
import { springPop } from '../lib/motion'
import './Divider.css'

/** Section divider: the three joined moustaches with a rule either side. */
export function Divider({ tone = 'butter' }: { tone?: 'butter' | 'ink' | 'gold' }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={`divider divider--${tone}`}
      aria-hidden="true"
      initial={reduced ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.8 }}
    >
      <motion.span
        className="divider__line divider__line--left"
        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { ...springPop, delay: 0.12 } } }}
      />
      <motion.span
        className="divider__tash"
        variants={{ hidden: { scale: 0.4, opacity: 0 }, show: { scale: 1, opacity: 1, transition: springPop } }}
      >
        <MoustacheTrio />
      </motion.span>
      <motion.span
        className="divider__line divider__line--right"
        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { ...springPop, delay: 0.12 } } }}
      />
    </motion.div>
  )
}
