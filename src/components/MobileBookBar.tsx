import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { springPop } from '../lib/motion'
import { useBook } from './BookContext'
import './MobileBookBar.css'

/** Sticky "Book a table" button on small screens, shown once the hero is out of the way. */
export function MobileBookBar() {
  const { open, isOpen } = useBook()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.55)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && !isOpen && (
        <motion.div
          className="bookbar"
          initial={{ y: 120 }}
          animate={{ y: 0 }}
          exit={{ y: 120 }}
          transition={springPop}
        >
          <motion.button className="btn btn--block" onClick={open} whileTap={{ scale: 0.96 }}>
            Book a table
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
