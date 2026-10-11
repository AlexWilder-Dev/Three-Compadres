import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { BoomButton } from './BoomButton'
import { Close, MenuIcon } from './Icons'
import { LocationSwitch } from './LocationSwitch'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'
import { spring } from '../lib/motion'
import { NAV, STICKER_TILT } from '../lib/nav'
import './Header.css'

export function Header() {
  const { pathname } = useLocation()
  const [solid, setSolid] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setMenuOpen(false)
  }

  const closeMenu = () => {
    setMenuOpen(false)
    menuButton.current?.focus()
  }

  return (
    <>
      <header className={`header${solid || menuOpen ? ' is-solid' : ''}`}>
        <div className="header__inner wrap">
          <Link to="/" className="header__logo" aria-label="Boom Bap Burger home">
            <Logo eager decorative />
          </Link>

          <nav className="header__nav" aria-label="Main">
            {NAV.slice(1, 4).map((item, i) => (
              <NavLink key={item.to} to={item.to} className="nav-sticker-link">
                {({ isActive }) => (
                  <motion.span
                    className={`nav-sticker${isActive ? ' is-active' : ''}`}
                    style={{ rotate: STICKER_TILT[i + 1] }}
                    whileHover={{ rotate: 0, scale: 1.08, y: -2 }}
                    transition={spring}
                  >
                    {item.label}
                  </motion.span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="header__actions">
            <LocationSwitch className="header__switch" />
            <BoomButton to="/book" size="sm" className="header__book">
              Book
            </BoomButton>
            <button
              ref={menuButton}
              type="button"
              className="header__menu-btn"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={menuOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                  transition={spring}
                >
                  {menuOpen ? <Close /> : <MenuIcon />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>{menuOpen && <MobileMenu onClose={closeMenu} />}</AnimatePresence>
    </>
  )
}
