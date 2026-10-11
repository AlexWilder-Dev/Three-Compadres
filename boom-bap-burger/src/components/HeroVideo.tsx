import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { Location } from '../data/venue'
import { Pause, Play } from './Icons'
import './HeroVideo.css'

/** The chosen site's video behind the hero. Crossfades on switch, pauses off-screen, never autoplays for reduced motion. */
export function HeroVideo({ location }: { location: Location }) {
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(!!reduced)
  const [visible, setVisible] = useState(true)
  const wrap = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const v = video.current
    if (!v) return
    if (paused || !visible) v.pause()
    else v.play().catch(() => {})
  }, [paused, visible, location.id])

  return (
    <div className="hero-video" ref={wrap}>
      <AnimatePresence initial={false}>
        <motion.div
          key={location.id}
          className="hero-video__layer"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.6 }, scale: { type: 'spring', stiffness: 120, damping: 24 } }}
        >
          <video
            ref={(el) => {
              if (!el) return
              video.current = el
              // Set before play so mobile browsers allow inline autoplay.
              el.muted = true
              el.setAttribute('muted', '')
            }}
            src={location.video}
            poster={location.poster}
            muted
            loop
            playsInline
            autoPlay={!paused}
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
          />
        </motion.div>
      </AnimatePresence>
      <div className="hero-video__shade" />
      <button
        type="button"
        className="hero-video__toggle"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? 'Play background video' : 'Pause background video'}
      >
        {paused ? <Play /> : <Pause />}
      </button>
    </div>
  )
}
