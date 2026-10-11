import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, MotionConfig, useReducedMotion } from 'framer-motion'
import { BookContext } from './components/BookContext'
import { BookSheet } from './components/BookSheet'
import { BarrelSection } from './components/BarrelSection'
import { Drinks } from './components/Drinks'
import { Footer } from './components/Footer'
import { ForbiddenTaco } from './components/ForbiddenTaco'
import { Gallery } from './components/Gallery'
import { Hero } from './components/Hero'
import { Loader } from './components/Loader'
import { Menu } from './components/Menu'
import { MobileBookBar } from './components/MobileBookBar'
import { Nav } from './components/Nav'
import { Offers } from './components/Offers'
import { Reviews } from './components/Reviews'
import { Visit } from './components/Visit'
import { Welcome } from './components/Welcome'

export default function App() {
  const reduced = useReducedMotion()
  const [loaded, setLoaded] = useState(!!reduced)
  const [bookOpen, setBookOpen] = useState(false)
  const finishLoading = useCallback(() => setLoaded(true), [])

  const book = useMemo(
    () => ({ isOpen: bookOpen, open: () => setBookOpen(true), close: () => setBookOpen(false) }),
    [bookOpen],
  )

  return (
    <MotionConfig reducedMotion="user">
      <BookContext.Provider value={book}>
        <a className="skip-link" href="#menu">
          Skip to the menu
        </a>
        <AnimatePresence>{!loaded && <Loader key="loader" onDone={finishLoading} />}</AnimatePresence>
        <Nav />
        <main>
          <Hero ready={loaded} />
          <Welcome />
          <BarrelSection />
          <Menu />
          <ForbiddenTaco />
          <Drinks />
          <Offers />
          <Reviews />
          <Gallery />
          <Visit />
        </main>
        <Footer />
        <MobileBookBar />
        <BookSheet />
      </BookContext.Provider>
    </MotionConfig>
  )
}
