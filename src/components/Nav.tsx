import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { reviews, photos } from '../data/venue'
import { spring, springPop } from '../lib/motion'
import { useBook } from './BookContext'
import { HoursBadge } from './HoursBadge'
import { Logo } from './Logo'
import { Burger, Close } from './Icons'
import './Nav.css'

export const NAV_LINKS = [
  { id: 'menu', label: 'Menu' },
  { id: 'barrel', label: 'The barrel' },
  { id: 'secret', label: 'Secret tacos' },
  { id: 'drinks', label: 'Drinks' },
  { id: 'offers', label: 'Offers' },
  ...(reviews.length ? [{ id: 'reviews', label: 'Reviews' }] : []),
  ...(photos.gallery.length ? [{ id: 'gallery', label: 'Photos' }] : []),
  { id: 'visit', label: 'Visit' },
]

export function Nav() {
  const { open } = useBook()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the section in view.
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    document.body.classList.add('is-locked')
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('is-locked')
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <>
      <header className={`nav ${scrolled || menuOpen ? 'nav--solid' : ''}`}>
        <div className="nav__inner container">
          <a href="#top" className="nav__brand" aria-label="Three Compadres, back to top" onClick={() => setMenuOpen(false)}>
            <Logo height={40} />
          </a>

          <nav className="nav__links" aria-label="Sections">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`nav__link ${active === link.id ? 'is-active' : ''}`}
                aria-current={active === link.id ? 'true' : undefined}
              >
                {link.label}
                {active === link.id && (
                  <motion.span layoutId="nav-underline" className="nav__underline" transition={spring} />
                )}
              </a>
            ))}
          </nav>

          <div className="nav__right">
            <span className="nav__badge">
              <HoursBadge size="sm" />
            </span>
            <motion.button
              className="btn btn--sm nav__book"
              onClick={open}
              whileHover={{ y: -2, rotate: -2 }}
              whileTap={{ scale: 0.94 }}
              transition={springPop}
            >
              Book a table
            </motion.button>
            <button
              className="nav__burger"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <Close width={24} height={24} /> : <Burger width={24} height={24} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ clipPath: 'circle(0% at calc(100% - 40px) 32px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 40px) 32px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 40px) 32px)' }}
            transition={{ type: 'spring', stiffness: 160, damping: 24 }}
          >
            <motion.nav
              aria-label="Sections"
              className="mobile-menu__links"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } } }}
            >
              {NAV_LINKS.map((link) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMenuOpen(false)}
                  variants={{ hidden: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0, transition: springPop } }}
                >
                  {link.label}
                </motion.a>
              ))}
            </motion.nav>
            <div className="mobile-menu__foot">
              <HoursBadge />
              <button
                className="btn btn--block"
                onClick={() => {
                  setMenuOpen(false)
                  open()
                }}
              >
                Book a table
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
