import { Link } from 'react-router'
import { brand, locationIds, locations, media } from '../data/venue'
import { mapsDirections } from '../lib/format'
import { BoomButton } from './BoomButton'
import { ArrowUpRight, Facebook, Instagram, Mail, Phone, TikTok } from './Icons'
import { Logo } from './Logo'
import { Address, EmailText, HoursList } from './SiteDetails'
import { Sticker } from './Sticker'
import './Footer.css'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top wrap">
        <p className="footer__strap">{brand.strapline}</p>
        <Sticker src={media.stickers.londonBeer} rotate={9} className="footer__sticker" />
      </div>

      <div className="footer__grid wrap">
        <div className="footer__brand">
          <Link to="/" aria-label="Boom Bap Burger home">
            <Logo className="footer__logo" decorative />
          </Link>
          <p className="footer__tag">{brand.tagline}</p>
          <div className="footer__newsletter">
            <p>News from both sites, straight to your inbox.</p>
            <BoomButton href={brand.newsletter} size="sm" icon={<ArrowUpRight />}>
              Join the mailing list
            </BoomButton>
          </div>
          <ul className="footer__social" aria-label="Social">
            {[
              { ...brand.social.instagram, Icon: Instagram },
              { ...brand.social.tiktok, Icon: TikTok },
              { ...brand.social.facebook, Icon: Facebook },
            ].map(({ label, url, Icon }) => (
              <li key={label}>
                <a href={url} target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {locationIds.map((id) => {
          const site = locations[id]
          return (
            <section key={id} className="footer__site" aria-labelledby={`footer-${id}`}>
              <h2 id={`footer-${id}`} className="footer__site-name">
                {site.name} <span>{site.code}</span>
              </h2>
              <Address location={site} />
              <p className="footer__contact">
                <a href={`tel:${site.phone.tel}`}>
                  <Phone /> {site.phone.display}
                </a>
                <a href={`mailto:${site.email}`}>
                  <Mail /> <EmailText email={site.email} />
                </a>
              </p>
              <p className="footer__hours-title">{site.hoursTitle}</p>
              <HoursList location={site} />
              {site.hoursNote && <p className="footer__note">{site.hoursNote}</p>}
              <p className="footer__links">
                <a href={site.bookUrl} target="_blank" rel="noopener noreferrer">
                  Book
                </a>
                <a href={mapsDirections(site.geo.lat, site.geo.lng)} target="_blank" rel="noopener noreferrer">
                  Directions
                </a>
                {site.takeaway.kind === 'delivery' ? (
                  <a href={site.takeaway.href} target="_blank" rel="noopener noreferrer">
                    Deliveroo
                  </a>
                ) : (
                  <a href={`tel:${site.phone.tel}`}>Takeaway: call ahead</a>
                )}
              </p>
            </section>
          )
        })}
      </div>

      <div className="footer__bottom wrap">
        <p>
          © {new Date().getFullYear()} {brand.name}
        </p>
        <p>Site by AlexWilder-Dev</p>
      </div>
    </footer>
  )
}
