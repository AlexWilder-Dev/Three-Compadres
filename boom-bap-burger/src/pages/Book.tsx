import { motion } from 'framer-motion'
import { everywhere, type Location } from '../data/venue'
import { BoomButton } from '../components/BoomButton'
import { ArrowUpRight, Clock, Mail, Phone } from '../components/Icons'
import { OpenBadge } from '../components/OpenBadge'
import { PageHero } from '../components/PageHero'
import { Photo } from '../components/Photo'
import { Address, EmailText } from '../components/SiteDetails'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useOpenStatus } from '../hooks/useOpenStatus'
import { formatRange } from '../lib/hours'
import { useLocationSite } from '../lib/location'
import { inView, rise, spring, stagger } from '../lib/motion'
import './Book.css'

function BookCard({ site, active }: { site: Location; active: boolean }) {
  const status = useOpenStatus(site)
  return (
    <motion.article
      layout
      className={`book-card${active ? ' is-active' : ''}`}
      variants={rise}
      transition={spring}
      aria-labelledby={`book-${site.id}`}
    >
      <div className="book-card__media">
        <Photo src={site.photos.card} alt={site.photos.gallery[0].alt} />
        <span className="book-card__code" aria-hidden="true">
          {site.code}
        </span>
        {active && <span className="book-card__flag">Your spot</span>}
      </div>
      <div className="book-card__body">
        <h2 id={`book-${site.id}`} className="book-card__name">
          {site.name}
        </h2>
        <Address location={site} />
        <OpenBadge location={site} />
        <p className="book-card__today">
          <Clock /> {site.todayLabel}: {formatRange(status.today)}
        </p>
        <BoomButton href={site.bookUrl} size="lg" icon={<ArrowUpRight />} ariaLabel={`Book online at ${site.name}`}>
          Book online
        </BoomButton>
        <ul className="book-card__links">
          <li>
            <span className="label">Email</span>
            <a href={`mailto:${site.email}`}>
              <Mail /> <EmailText email={site.email} />
            </a>
          </li>
          <li>
            <span className="label">Phone</span>
            <a href={`tel:${site.phone.tel}`}>
              <Phone /> {site.phone.display}
            </a>
          </li>
        </ul>
      </div>
    </motion.article>
  )
}

export function Book() {
  useDocumentTitle('Book')
  const { location, other } = useLocationSite()
  const walkIns = everywhere.find((e) => e.id === 'walk-ins')

  return (
    <>
      <PageHero
        eyebrow="Book"
        title="Book a table"
        lede="Pick your site and book online. Big group or want the place to yourselves? Email the team."
      />
      <section className="section book" aria-label="Booking details for both sites">
        <motion.div className="wrap book__grid" variants={stagger(0.12)} {...inView}>
          {[location, other].map((site) => (
            <BookCard key={site.id} site={site} active={site.id === location.id} />
          ))}
        </motion.div>
        {walkIns && (
          <div className="wrap">
            <p className="book__walkins">
              <strong>{walkIns.title}</strong> {walkIns.when.toLowerCase()}. {walkIns.blurb}
            </p>
          </div>
        )}
      </section>
    </>
  )
}
