import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { locationIds, locations, type Location } from '../../data/venue'
import { BoomButton } from '../../components/BoomButton'
import { ArrowRight, ArrowUpRight, Clock } from '../../components/Icons'
import { OpenBadge } from '../../components/OpenBadge'
import { Photo } from '../../components/Photo'
import { SectionHead } from '../../components/SectionHead'
import { Address } from '../../components/SiteDetails'
import { useOpenStatus } from '../../hooks/useOpenStatus'
import { mapsDirections } from '../../lib/format'
import { formatRange } from '../../lib/hours'
import { useLocationSite } from '../../lib/location'
import { inView, rise, spring, stagger } from '../../lib/motion'
import './Sites.css'

function SiteCard({ site }: { site: Location }) {
  const { location, setLocation } = useLocationSite()
  const status = useOpenStatus(site)
  const active = site.id === location.id

  return (
    <motion.article
      className={`site-card${active ? ' is-active' : ''}`}
      variants={rise}
      whileHover={{ y: -6, transition: spring }}
      aria-labelledby={`site-${site.id}-name`}
    >
      <div className="site-card__media">
        <Photo src={site.photos.card} alt={site.photos.gallery[0].alt} />
        <span className="site-card__code" aria-hidden="true">
          {site.code}
        </span>
        {active ? (
          <span className="site-card__flag">Your spot</span>
        ) : (
          <button type="button" className="site-card__flag site-card__flag--button" onClick={() => setLocation(site.id)}>
            Make it my spot
          </button>
        )}
      </div>
      <div className="site-card__body">
        <h3 id={`site-${site.id}-name`} className="site-card__name">
          {site.name}
        </h3>
        <Address location={site} />
        <p className="site-card__today">
          <Clock />
          <span>
            {site.todayLabel}: <strong>{formatRange(status.today)}</strong>
          </span>
        </p>
        <OpenBadge location={site} />
        <div className="site-card__actions">
          <BoomButton href={site.bookUrl} size="sm" ariaLabel={`Book at ${site.name}`}>
            Book
          </BoomButton>
          <BoomButton
            href={mapsDirections(site.geo.lat, site.geo.lng)}
            size="sm"
            variant="ghost"
            icon={<ArrowUpRight />}
            ariaLabel={`Directions to ${site.name}`}
          >
            Directions
          </BoomButton>
        </div>
      </div>
    </motion.article>
  )
}

export function Sites() {
  return (
    <section className="section sites" aria-labelledby="sites-title">
      <div className="wrap">
        <SectionHead
          eyebrow="Two sites, one sound"
          id="sites-title"
          title="Pull up"
          lede="In the City inside Leadenhall Market, and down in SW17 inside Tooting Market."
          aside={
            <Link className="text-link" to="/locations">
              Hours, maps &amp; more <ArrowRight />
            </Link>
          }
        />
        <motion.div className="sites__grid" variants={stagger(0.12)} {...inView}>
          {locationIds.map((id) => (
            <SiteCard key={id} site={locations[id]} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
