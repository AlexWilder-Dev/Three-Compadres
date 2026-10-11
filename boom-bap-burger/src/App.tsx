import { useEffect, useRef } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { MobileBar } from './components/MobileBar'
import { LocationProvider } from './lib/location'
import { spring } from './lib/motion'
import { Book } from './pages/Book'
import { Events } from './pages/Events'
import { Home } from './pages/Home'
import { Locations } from './pages/Locations'
import { Menu } from './pages/Menu'
import { NotFound } from './pages/NotFound'

function Shell() {
  const route = useLocation()
  const main = useRef<HTMLElement>(null)
  const firstRender = useRef(true)

  // After a page change, move focus to the new page so screen readers start at the top.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    main.current?.focus({ preventScroll: true })
  }, [route.pathname])

  return (
    <>
      <button type="button" className="skip-link" onClick={() => main.current?.focus()}>
        Skip to content
      </button>
      <Header />
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.main
          key={route.pathname}
          id="main"
          ref={main}
          tabIndex={-1}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0, transition: spring }}
          exit={{ opacity: 0, transition: { duration: 0.14 } }}
        >
          <Routes location={route}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/events" element={<Events />} />
            <Route path="/book" element={<Book />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <MobileBar />
    </>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <HashRouter>
        <LocationProvider>
          <Shell />
        </LocationProvider>
      </HashRouter>
    </MotionConfig>
  )
}
