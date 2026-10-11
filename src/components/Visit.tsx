import { motion } from 'framer-motion'
import { venue } from '../data/venue'
import { useOpenStatus } from '../hooks/useOpenStatus'
import { DAY_NAMES, WEEK_ORDER, formatRange } from '../lib/hours'
import { inView, pop, rise, springPop, stagger } from '../lib/motion'
import { HoursBadge } from './HoursBadge'
import { ArrowUpRight, Phone, Pin } from './Icons'
import './Visit.css'

export function Visit() {
  const status = useOpenStatus()

  return (
    <section id="visit" className="visit section" aria-labelledby="visit-title">
      <div className="container">
        <motion.div className="visit__head" {...inView} variants={stagger(0.08)}>
          <motion.p className="eyebrow" variants={rise}>
            Find us
          </motion.p>
          <motion.h2 id="visit-title" className="display" variants={rise}>
            Visit
          </motion.h2>
        </motion.div>

        <motion.div className="visit__grid" {...inView} variants={stagger(0.1)}>
          <motion.div className="visit__card visit__where" variants={pop}>
            <Pin width={30} height={30} className="visit__pin" />
            <address className="visit__address">
              {venue.address.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
            <p className="visit__tube">Nearest tube: {venue.address.tube}</p>
            <p className="visit__market">{venue.address.marketNote}</p>
            <div className="visit__actions">
              <motion.a
                className="btn"
                href={venue.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, rotate: -1.5 }}
                whileTap={{ scale: 0.95 }}
                transition={springPop}
              >
                Get directions <ArrowUpRight />
              </motion.a>
              <motion.a
                className="btn btn--ghost"
                href={`tel:${venue.phone.tel}`}
                whileHover={{ y: -3, rotate: 1.5 }}
                whileTap={{ scale: 0.95 }}
                transition={springPop}
              >
                <Phone /> {venue.phone.display}
              </motion.a>
            </div>
          </motion.div>

          <motion.div className="visit__card visit__hours" variants={pop}>
            <div className="visit__hours-head">
              <h3>Opening hours</h3>
              <HoursBadge size="sm" />
            </div>
            <table className="hours">
              <caption className="visually-hidden">Opening hours, London time</caption>
              <tbody>
                {WEEK_ORDER.map((day) => {
                  const today = day === status.day
                  return (
                    <tr key={day} className={today ? 'is-today' : ''} aria-current={today ? 'date' : undefined}>
                      <th scope="row">
                        {DAY_NAMES[day]}
                        {today && <span className="hours__today">Today</span>}
                      </th>
                      <td className={venue.hours[day] ? '' : 'is-closed'}>{formatRange(venue.hours[day])}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </motion.div>
        </motion.div>

        <p className="visit__service">{venue.serviceCharge}</p>
      </div>
    </section>
  )
}
