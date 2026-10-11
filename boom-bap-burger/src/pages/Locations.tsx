import { motion } from 'framer-motion'
import { locationIds, locations, media, type Location, type LocationId } from '../data/venue'
import { BoomButton } from '../components/BoomButton'
import { ArrowUpRight, Bag, Mail, Phone, Pin } from '../components/Icons'
import { LondonMap } from '../components/LondonMap'
import { OpenBadge } from '../components/OpenBadge'
import { PageHero } from '../components/PageHero'
import { Photo } from '../components/Photo'
import { Address, EmailText } from '../components/SiteDetails'
import { Sticker } from '../components/Sticker'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useOpenStatus } from '../hooks/useOpenStatus'
import { mapsDirections } from '../lib/format'
import { DAY_NAMES, WEEK_ORDER, formatRange } from '../lib/hours'
import { useLocationSite } from '../lib/location'
import { inView, rise, stagger } from '../lib/motion'
import './Locations.css'

function HoursTable({ site }: { site: Location }) {
  const { day: today } = useOpenStatus(site)
  return (
    <table className="hours-table">
      <caption className="label">{site.hoursTitle}</caption>
      <tbody>
        {WEEK_ORDER.map((day) => (
          <tr key={day} className={day === today ? 'is-today' : undefined}>
            <th scope="row">
              {DAY_NAMES[day]}
              {day === today && <span className="hours-table__today">Today</span>}
            </th>
            <td>{formatRange(site.hours[day])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function SitePanel({ site, flip }: { site: Location; flip: boolean }) {
  const { location, setLocation } = useLocationSite()
  const active = site.id === location.id
  const [main, ...extra] = site.photos.gallery

  return (
    <section
      id={`site-${site.id}`}
      className={`site-panel${flip ? ' site-panel--flip' : ''}${active ? ' is-active' : ''}`}
      aria-labelledby={`panel-${site.id}`}
    >
      <div className="wrap site-panel__grid">
        <motion.div className="site-panel__photos" variants={stagger(0.1)} {...inView}>
          <motion.div className="site-panel__main" variants={rise}>
            <Photo src={main.src} alt={main.alt} />
            <span className="site-panel__code" aria-hidden="true">
              {site.code}
            </span>
          </motion.div>
          {extra.length === 0 && (
            <Sticker src={media.stickers.londonBeer} rotate={10} className="site-panel__sticker" />
          )}
          {extra.length > 0 && (
            <div className="site-panel__extra">
              {extra.map((photo) => (
                <motion.div key={photo.src} variants={rise}>
                  <Photo src={photo.src} alt={photo.alt} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div className="site-panel__info" variants={stagger(0.07)} {...inView}>
          <motion.p className="eyebrow" variants={rise}>
            {site.area} · {site.code}
          </motion.p>
          <motion.h2 id={`panel-${site.id}`} className="h-lg" variants={rise}>
            {site.name}
          </motion.h2>
          <motion.div className="site-panel__status" variants={rise}>
            <OpenBadge location={site} />
            {active ? (
              <span className="tag tag--amber">Your spot</span>
            ) : (
              <button type="button" className="site-panel__pick" onClick={() => setLocation(site.id)}>
                Make it my spot
              </button>
            )}
          </motion.div>
          <motion.p className="site-panel__blurb" variants={rise}>
            {site.blurb}
          </motion.p>

          <motion.div className="site-panel__cols" variants={rise}>
            <div>
              <h3 className="label">Address</h3>
              <Address location={site} />
              <a
                className="site-panel__link"
                href={mapsDirections(site.geo.lat, site.geo.lng)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Pin /> Get directions
              </a>
            </div>
            <div>
              <h3 className="label">Contact</h3>
              <a className="site-panel__link" href={`tel:${site.phone.tel}`}>
                <Phone /> {site.phone.display}
              </a>
              <a className="site-panel__link" href={`mailto:${site.email}`}>
                <Mail /> <EmailText email={site.email} />
              </a>
            </div>
          </motion.div>

          <motion.div variants={rise}>
            <HoursTable site={site} />
            {site.hoursNote && <p className="site-panel__note">{site.hoursNote}</p>}
          </motion.div>

          <motion.div className="site-panel__takeaway" variants={rise}>
            <Bag />
            <div>
              <h3 className="label">{site.takeaway.label}</h3>
              <p>{site.takeaway.detail}</p>
            </div>
            {site.takeaway.kind === 'delivery' ? (
              <a className="text-link" href={site.takeaway.href} target="_blank" rel="noopener noreferrer">
                {site.takeaway.cta} <ArrowUpRight />
              </a>
            ) : (
              <a className="text-link" href={`tel:${site.phone.tel}`}>
                {site.takeaway.cta} <Phone />
              </a>
            )}
          </motion.div>

          <motion.div className="site-panel__actions" variants={rise}>
            <BoomButton href={site.bookUrl} ariaLabel={`Book a table at ${site.name}`}>
              Book a table
            </BoomButton>
            <BoomButton href={`tel:${site.phone.tel}`} variant="ghost" icon={<Phone />}>
              Call
            </BoomButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export function Locations() {
  useDocumentTitle('Locations')

  const scrollToSite = (id: LocationId) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(`site-${id}`)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <>
      <PageHero
        eyebrow="Locations"
        title="Two sites. One sound."
        lede="Leadenhall Market in the City and Tooting Market in SW17. Tap a pin to make it your spot."
        art={<LondonMap onPick={scrollToSite} />}
      />
      {locationIds.map((id, i) => (
        <SitePanel key={id} site={locations[id]} flip={i % 2 === 1} />
      ))}
    </>
  )
}
