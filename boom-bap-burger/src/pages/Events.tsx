import { AnimatePresence, motion } from 'framer-motion'
import { brand, events, everywhere, locations, media, type Location, type VenueEvent } from '../data/venue'
import { BoomButton } from '../components/BoomButton'
import { Equalizer } from '../components/Equalizer'
import { ArrowRight, Calendar, Mail, Phone, eventIcons } from '../components/Icons'
import { LocationSwitch } from '../components/LocationSwitch'
import { PageHero } from '../components/PageHero'
import { Photo } from '../components/Photo'
import { EmailText } from '../components/SiteDetails'
import { Sticker } from '../components/Sticker'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { nextWeekdayLabel } from '../lib/hours'
import { useLocationSite } from '../lib/location'
import { inView, pop, rise, spring, stagger } from '../lib/motion'
import './Events.css'

/** Gig-poster flyer for the Friday DJ. */
function DjFlyer({ event, site }: { event: VenueEvent; site: Location }) {
  const next = event.weekday !== undefined ? nextWeekdayLabel(event.weekday) : event.when
  return (
    <motion.article className="flyer" variants={rise} aria-labelledby={`ev-${event.id}`}>
      <div className="flyer__photo">
        <Photo src={media.vibe.beastieBoys} alt="Hip hop and burgers at Boom Bap Burger" />
        <Sticker src={media.stickers.beerCocktails} rotate={-12} className="flyer__sticker" />
      </div>
      <div className="flyer__body halftone">
        <p className="flyer__where">
          {site.name} · {site.code}
        </p>
        <h2 id={`ev-${event.id}`} className="flyer__title">
          {event.title}
        </h2>
        <p className="flyer__next">
          <Calendar />
          <span>
            {event.when} · next up <strong>{next}</strong>
          </span>
          <Equalizer bars={5} className="flyer__eq" />
        </p>
        <p className="flyer__blurb">{event.blurb}</p>
        {event.tags && (
          <motion.ul className="flyer__genres" variants={stagger(0.06, 0.2)} {...inView}>
            {event.tags.map((tag, i) => (
              <motion.li
                key={tag}
                variants={pop}
                style={{ rotate: i % 2 ? 2 : -2 }}
                whileHover={{ rotate: 0, scale: 1.1, transition: spring }}
              >
                {tag}
              </motion.li>
            ))}
          </motion.ul>
        )}
        <div className="flyer__actions">
          <BoomButton href={site.bookUrl} variant="dark" ariaLabel={`Book a table at ${site.name}`}>
            Book for Friday
          </BoomButton>
        </div>
      </div>
    </motion.article>
  )
}

function EventCard({ event, site }: { event: VenueEvent; site?: Location }) {
  const Icon = eventIcons[event.icon]
  return (
    <motion.article className="event-card" variants={rise} whileHover={{ y: -6, transition: spring }}>
      <Icon className="event-card__icon" />
      <p className="label">{event.when}</p>
      <h3 className="event-card__title">{event.title}</h3>
      <p className="event-card__blurb">{event.blurb}</p>
      {site && event.icon === 'group' && (
        <div className="event-card__contact">
          <a href={`mailto:${site.email}?subject=${encodeURIComponent(`Group booking at ${site.name}`)}`}>
            <Mail /> <EmailText email={site.email} />
          </a>
          <a href={`tel:${site.phone.tel}`}>
            <Phone /> {site.phone.display}
          </a>
        </div>
      )}
    </motion.article>
  )
}

/** Shown at Leadenhall: the Friday nights happen in Tooting. */
function CrossPromo() {
  const { setLocation } = useLocationSite()
  const tooting = locations.tooting
  // "Live DJ every Friday and live Premier League football at Tooting Market."
  const titles = events.tooting.map((e, i) => (i === 0 ? e.title : e.title[0].toLowerCase() + e.title.slice(1)))
  const promo = `${titles.join(' and ')} at ${tooting.name}.`
  return (
    <motion.article className="cross-promo" variants={rise}>
      <div>
        <p className="label">Over in SW17</p>
        <h3 className="cross-promo__title">Fridays are louder in Tooting</h3>
        <p className="cross-promo__text">{promo}</p>
      </div>
      <BoomButton onClick={() => setLocation('tooting')} icon={<ArrowRight />}>
        Switch to Tooting
      </BoomButton>
    </motion.article>
  )
}

export function Events() {
  useDocumentTitle('Events')
  const { location } = useLocationSite()
  const siteEvents = events[location.id]
  const [headline, ...rest] = siteEvents

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="What’s on"
        lede={`Live music, the football, and room for the whole crew. Showing ${location.name}.`}
      >
        <LocationSwitch variant="full" />
      </PageHero>

      <section className="section events" aria-label={`Events at ${location.name}`}>
        <div className="wrap">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.id}
              className="events__site"
              variants={stagger(0.1)}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -16, transition: { duration: 0.15 } }}
            >
              {headline ? (
                <>
                  <DjFlyer event={headline} site={location} />
                  {rest.length > 0 && (
                    <div className="events__grid">
                      {rest.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <CrossPromo />
              )}
            </motion.div>
          </AnimatePresence>

          <h2 className="events__subhead h-md">At both sites</h2>
          <motion.div className="events__grid" variants={stagger(0.1)} {...inView}>
            {everywhere.map((event) => (
              <EventCard key={event.id} event={event} site={location} />
            ))}
          </motion.div>

          <motion.aside className="artists" variants={rise} {...inView} aria-labelledby="artists-title">
            <div className="artists__deck" aria-hidden="true">
              <Equalizer bars={7} />
            </div>
            <div className="artists__text">
              <p className="label">DJs &amp; artists</p>
              <h2 id="artists-title" className="h-md">
                Want a slot on the decks?
              </h2>
              <p>Send us a line with your style and a link to your sets.</p>
            </div>
            <BoomButton href={`mailto:${brand.artistsEmail}`} icon={<Mail />}>
              {brand.artistsEmail}
            </BoomButton>
          </motion.aside>
        </div>
      </section>
    </>
  )
}
