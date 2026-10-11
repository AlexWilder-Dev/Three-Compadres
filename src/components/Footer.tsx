import { venue } from '../data/venue'
import { useBook } from './BookContext'
import { Divider } from './Divider'
import { ArrowUpRight } from './Icons'
import { Logo } from './Logo'
import './Footer.css'

export function Footer() {
  const { open } = useBook()
  return (
    <footer className="footer">
      <div className="container">
        <Divider />
        <div className="footer__grid">
          <div className="footer__brand">
            <Logo height={72} />
            <p className="footer__tagline">{venue.tagline}</p>
          </div>
          <div className="footer__links">
            <a href={venue.social.instagram} target="_blank" rel="noopener noreferrer">
              Instagram <ArrowUpRight />
            </a>
            <a href={venue.social.tiktok} target="_blank" rel="noopener noreferrer">
              TikTok <ArrowUpRight />
            </a>
            <button className="btn btn--sm footer__book" onClick={open}>
              Book a table
            </button>
          </div>
        </div>
        <div className="footer__base">
          <p>{venue.allergyNote}</p>
          <p className="footer__credit">{venue.credit}</p>
        </div>
      </div>
    </footer>
  )
}
