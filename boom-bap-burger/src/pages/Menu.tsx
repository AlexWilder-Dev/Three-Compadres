import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { aSide, bSides, dietLabels, type Diet, type MenuItem } from '../data/venue'
import { Equalizer } from '../components/Equalizer'
import { ArrowUpRight, Bag, Pause, Phone, Play } from '../components/Icons'
import { PageHero } from '../components/PageHero'
import { Record } from '../components/Record'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatPrice } from '../lib/format'
import { useLocationSite } from '../lib/location'
import { spring, springPop } from '../lib/motion'
import { Drinks } from './menu/Drinks'
import './Menu.css'

type Filter = Diet | null

const FILTERS: Filter[] = [null, 'veggie', 'plant-based', 'halal']

/** Plant-based dishes are meat-free too, so they count as veggie. */
function matches(item: MenuItem, filter: Filter) {
  if (!filter) return true
  const diet = item.diet ?? []
  return diet.includes(filter) || (filter === 'veggie' && diet.includes('plant-based'))
}

function Track({ item, number, flash }: { item: MenuItem; number: string; flash: boolean }) {
  return (
    <motion.li
      layout="position"
      id={`track-${item.id}`}
      className={`track${flash ? ' is-flash' : ''}`}
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24, transition: { duration: 0.15 } }}
      transition={spring}
    >
      <span className="track__no">
        <span className="track__num">{number}</span>
        <Equalizer bars={3} className="track__eq" />
      </span>
      <div className="track__main">
        <div className="track__title">
          <h3 className="track__name">{item.name}</h3>
          {item.signature && <span className="tag tag--amber">Signature</span>}
          {item.diet?.map((d) => (
            <span key={d} className="tag">
              {dietLabels[d]}
            </span>
          ))}
        </div>
        {item.description && <p className="track__desc">{item.description}</p>}
      </div>
      <span className="track__leader" aria-hidden="true" />
      <span className="track__price">{formatPrice(item.price)}</span>
    </motion.li>
  )
}

function Side({
  id,
  side,
  title,
  subtitle,
  items,
  filter,
  flash,
}: {
  id: string
  side: 'A' | 'B'
  title: string
  subtitle: string
  items: MenuItem[]
  filter: Filter
  flash: string | null
}) {
  const shown = items.filter((item) => matches(item, filter))
  return (
    <section className="side" aria-labelledby={id}>
      <header className="side__head">
        <h2 id={id} className="side__title">
          {title}
        </h2>
        <p className="side__sub">
          {subtitle} · {shown.length} {shown.length === 1 ? 'track' : 'tracks'}
        </p>
      </header>
      <ol className="side__list">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((item, i) =>
            matches(item, filter) ? (
              <Track key={item.id} item={item} number={`${side}${i + 1}`} flash={flash === item.id} />
            ) : null,
          )}
        </AnimatePresence>
      </ol>
      <AnimatePresence>
        {shown.length === 0 && filter && (
          <motion.p
            className="side__empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Nothing on this side is tagged {dietLabels[filter].toLowerCase()}. Ask the team what they can do.
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  )
}

export function Menu() {
  useDocumentTitle('Menu')
  const { location } = useLocationSite()
  const reduced = useReducedMotion()
  const [params] = useSearchParams()
  const flash = params.get('track')
  const [filter, setFilter] = useState<Filter>(null)
  const [playing, setPlaying] = useState(!reduced)
  const [side, setSide] = useState<'A' | 'B'>('A')
  const sideB = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()

  // Flip the record once the B-Sides reach the middle of the screen.
  useMotionValueEvent(scrollY, 'change', () => {
    const top = sideB.current?.getBoundingClientRect().top ?? Infinity
    setSide(top < window.innerHeight * 0.55 ? 'B' : 'A')
  })

  // Arriving from a signature card: glide to that track and light it up.
  useEffect(() => {
    if (!flash) return
    const id = window.setTimeout(() => {
      document.getElementById(`track-${flash}`)?.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'center',
      })
    }, 450)
    return () => window.clearTimeout(id)
  }, [flash, reduced])

  const total = aSide.length + bSides.length
  const count = [...aSide, ...bSides].filter((item) => matches(item, filter)).length

  const goTo = (target: 'A' | 'B') => {
    const el = target === 'A' ? document.getElementById('side-a') : sideB.current
    el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <>
      <PageHero
        eyebrow="The menu"
        title="Burgers & B-Sides"
        lede="Side A is the burgers. Flip it for the B-Sides. Drinks are the bonus disc."
      >
        {location.takeaway.kind === 'delivery' ? (
          <a className="menu-order" href={location.takeaway.href} target="_blank" rel="noopener noreferrer">
            <Bag /> {location.takeaway.cta} from {location.short} <ArrowUpRight />
          </a>
        ) : (
          <a className="menu-order" href={`tel:${location.phone.tel}`}>
            <Phone /> Takeaway from {location.short}: call ahead on {location.phone.display}
          </a>
        )}
      </PageHero>

      <section className="section menu" aria-label="Food menu">
        <div className="wrap menu__grid">
          <aside className="menu__deck">
            <div className="menu__deck-inner">
              <Record side={side} playing={playing} />
              <div className="deck-controls">
                <motion.button
                  type="button"
                  className="deck-btn"
                  onClick={() => setPlaying((p) => !p)}
                  aria-pressed={playing}
                  whileTap={{ scale: 0.92 }}
                >
                  {playing ? <Pause /> : <Play />}
                  <span>{playing ? 'Stop' : 'Play'}</span>
                </motion.button>
                {(['A', 'B'] as const).map((s) => (
                  <motion.button
                    key={s}
                    type="button"
                    className={`deck-btn${side === s ? ' is-active' : ''}`}
                    onClick={() => goTo(s)}
                    whileTap={{ scale: 0.92 }}
                  >
                    Side {s}
                  </motion.button>
                ))}
              </div>
            </div>
          </aside>

          <div className="menu__tracks">
            <div className="filters">
              <div className="filters__chips" role="group" aria-label="Filter the menu">
                {FILTERS.map((f) => {
                  const active = filter === f
                  return (
                    <button
                      key={f ?? 'all'}
                      type="button"
                      className={`chip${active ? ' is-active' : ''}`}
                      aria-pressed={active}
                      onClick={() => setFilter(f)}
                    >
                      {active && <motion.span layoutId="chip-pill" className="chip__pill" transition={springPop} />}
                      <span className="chip__label">{f ? dietLabels[f] : 'All tracks'}</span>
                    </button>
                  )
                })}
              </div>
              <p className="filters__count" aria-live="polite">
                {count} of {total} tracks
              </p>
            </div>

            <Side id="side-a" side="A" title="A-Side" subtitle="Burgers" items={aSide} filter={filter} flash={flash} />
            <div ref={sideB}>
              <Side
                id="side-b"
                side="B"
                title="B-Sides"
                subtitle="Sides & extras"
                items={bSides}
                filter={filter}
                flash={flash}
              />
            </div>
            <p className="menu__note">
              Allergies or dietary needs? Talk to the team before you order.
            </p>
          </div>
        </div>
      </section>

      <Drinks />
    </>
  )
}
