import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router'
import { motion } from 'framer-motion'
import { brand } from '../data/venue'
import { useLocationSite } from '../lib/location'
import { pop, spring, stagger } from '../lib/motion'
import { NAV, STICKER_TILT } from '../lib/nav'
import { Facebook, Instagram, Phone, TikTok } from './Icons'
import { OpenBadge } from './OpenBadge'
import './MobileMenu.css'

export function MobileMenu({ onClose }: { onClose: () => void }) {
  const { location } = useLocationSite()
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    panel.current?.querySelector<HTMLElement>('a')?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <motion.div
      id="mobile-menu"
      ref={panel}
      className="mobile-menu"
      initial={{ clipPath: 'circle(0% at calc(100% - 38px) 32px)' }}
      animate={{ clipPath: 'circle(150% at calc(100% - 38px) 32px)' }}
      exit={{ clipPath: 'circle(0% at calc(100% - 38px) 32px)' }}
      transition={{ type: 'spring', stiffness: 220, damping: 30 }}
    >
      <motion.nav className="mobile-menu__nav" aria-label="Main" variants={stagger(0.05, 0.08)} initial="hidden" animate="show">
        {NAV.map((item, i) => (
          <motion.div key={item.to} variants={pop}>
            <NavLink to={item.to} end className="mobile-menu__link" style={{ rotate: `${STICKER_TILT[i]}deg` }}>
              {item.label}
            </NavLink>
          </motion.div>
        ))}
      </motion.nav>

      <motion.div
        className="mobile-menu__site"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0, transition: { ...spring, delay: 0.25 } }}
      >
        <p className="mobile-menu__site-name">{location.name}</p>
        <OpenBadge location={location} />
        <a className="mobile-menu__call" href={`tel:${location.phone.tel}`}>
          <Phone /> {location.phone.display}
        </a>
        <div className="mobile-menu__social">
          <a href={brand.social.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <Instagram />
          </a>
          <a href={brand.social.tiktok.url} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <TikTok />
          </a>
          <a href={brand.social.facebook.url} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <Facebook />
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}
