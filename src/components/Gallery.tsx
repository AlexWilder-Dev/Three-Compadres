import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { photos } from '../data/venue'
import { inView, pop, rise, spring, stagger } from '../lib/motion'
import { Chevron, Close } from './Icons'
import './Gallery.css'

/** Photo grid with a swipeable lightbox. Hidden while there are no gallery photos in venue.ts. */
export function Gallery() {
  const [index, setIndex] = useState<number | null>(null)
  const [direction, setDirection] = useState(0)
  const reduced = useReducedMotion()
  const items = photos.gallery
  const count = items.length

  const go = useCallback(
    (step: number) => {
      setDirection(step)
      setIndex((i) => (i === null ? i : (i + step + count) % count))
    },
    [count],
  )

  useEffect(() => {
    if (index === null) return
    document.body.classList.add('is-locked')
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIndex(null)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('is-locked')
      window.removeEventListener('keydown', onKey)
    }
  }, [index, go])

  if (!count) return null
  const base = import.meta.env.BASE_URL

  return (
    <section id="gallery" className="gallery section" aria-labelledby="gallery-title">
      <div className="container">
        <motion.div className="gallery__head" {...inView} variants={stagger(0.08)}>
          <motion.p className="eyebrow" variants={rise}>
            Photos
          </motion.p>
          <motion.h2 id="gallery-title" className="display" variants={rise}>
            In the market
          </motion.h2>
        </motion.div>
        <motion.ul className="gallery__grid" {...inView} variants={stagger(0.06)}>
          {items.map((photo, i) => (
            <motion.li key={photo.src} variants={pop}>
              <button className="gallery__thumb" onClick={() => setIndex(i)} aria-label={`Open photo: ${photo.alt}`}>
                <img src={`${base}${photo.src}`} alt="" width={photo.width} height={photo.height} loading="lazy" />
              </button>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <AnimatePresence>
        {index !== null && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button className="lightbox__close" onClick={() => setIndex(null)} aria-label="Close" autoFocus>
              <Close />
            </button>
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.img
                key={items[index].src}
                className="lightbox__img"
                src={`${base}${items[index].src}`}
                alt={items[index].alt}
                custom={direction}
                initial={reduced ? { opacity: 0 } : { x: direction * 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={reduced ? { opacity: 0 } : { x: direction * -300, opacity: 0 }}
                transition={spring}
                drag={count > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80 || info.velocity.x < -500) go(1)
                  else if (info.offset.x > 80 || info.velocity.x > 500) go(-1)
                }}
              />
            </AnimatePresence>
            {count > 1 && (
              <>
                <button className="lightbox__nav lightbox__nav--prev" onClick={() => go(-1)} aria-label="Previous photo">
                  <Chevron style={{ transform: 'scaleX(-1)' }} />
                </button>
                <button className="lightbox__nav lightbox__nav--next" onClick={() => go(1)} aria-label="Next photo">
                  <Chevron />
                </button>
                <p className="lightbox__count">
                  {index + 1} / {count}
                </p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
