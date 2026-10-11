import { useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { menu, venue, type DietTag, type Dish, type PriceItem } from '../data/venue'
import { formatPrice } from '../lib/format'
import { inView, pop, rise, spring, stagger } from '../lib/motion'
import { BarrelIcon } from './Barrel'
import { DishCard } from './DishCard'
import './Menu.css'

type TabId = 'starters' | 'mains' | 'barrel' | 'sides'

const TABS: { id: TabId; label: string; strap?: string }[] = [
  { id: 'starters', label: 'Starters' },
  { id: 'mains', label: 'Mains' },
  { id: 'barrel', label: 'From the Barrel', strap: venue.barrel.strap },
  { id: 'sides', label: 'Sides & Sauces' },
]

const FILTERS: { tag: DietTag; label: string }[] = [
  { tag: 'GF', label: 'Gluten free' },
  { tag: 'V option', label: 'Vegetarian option' },
]

const dishesFor = (tab: TabId): Dish[] =>
  tab === 'starters' ? menu.starters : tab === 'mains' ? menu.mains : tab === 'barrel' ? menu.barrel : []

function PriceList({ title, items, dimmed }: { title: string; items: PriceItem[]; dimmed: boolean }) {
  return (
    <motion.div className={`menu__list ${dimmed ? 'is-dimmed' : ''}`} variants={pop}>
      <h4 className="menu__list-title">
        <BarrelIcon width={22} height={22} /> {title}
      </h4>
      <ul>
        {items.map((item) => (
          <li key={item.name} className="price-row">
            <span className="price-row__name">{item.name}</span>
            <span className="price-row__dots" aria-hidden="true" />
            <span className="price">{formatPrice(item.price)}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export function Menu() {
  const [tab, setTab] = useState<TabId>('starters')
  const [filters, setFilters] = useState<DietTag[]>([])
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const reduced = useReducedMotion()

  const matches = (dish: Dish) => filters.every((f) => dish.tags.includes(f))
  const toggle = (tag: DietTag) =>
    setFilters((current) => (current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]))

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = TABS.findIndex((t) => t.id === tab)
    const next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? TABS.length - 1 : null
    if (next === null) return
    e.preventDefault()
    const n = (next + TABS.length) % TABS.length
    setTab(TABS[n].id)
    tabRefs.current[n]?.focus()
  }

  const dishes = dishesFor(tab)
  const current = TABS.find((t) => t.id === tab)!
  const matchCount = tab === 'sides' ? (filters.length ? 0 : menu.sides.length + menu.sauces.length) : dishes.filter(matches).length

  return (
    <section id="menu" className="menu section" aria-labelledby="menu-title">
      <div className="container">
        <motion.div className="menu__head" {...inView} variants={stagger(0.08)}>
          <motion.p className="eyebrow" variants={rise}>
            Food
          </motion.p>
          <motion.h2 id="menu-title" className="display" variants={rise}>
            The menu
          </motion.h2>
        </motion.div>

        <div className="menu__controls">
          <div className="menu__tabs" role="tablist" aria-label="Menu sections" onKeyDown={onTabKey}>
            {TABS.map((t, i) => (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls="menu-panel"
                tabIndex={tab === t.id ? 0 : -1}
                className={`menu__tab ${tab === t.id ? 'is-active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {tab === t.id && (
                  <motion.span layoutId="menu-tab-pill" className="menu__tab-pill" transition={spring} />
                )}
                <span className="menu__tab-label">
                  <BarrelIcon width={20} height={20} />
                  {t.label}
                </span>
              </button>
            ))}
          </div>

          <div className="menu__filters" role="group" aria-label="Highlight dishes by tag">
            <span className="menu__filters-label">Show me</span>
            {FILTERS.map((f) => (
              <motion.button
                key={f.tag}
                className="chip"
                aria-pressed={filters.includes(f.tag)}
                aria-label={`${f.tag}: ${f.label}`}
                onClick={() => toggle(f.tag)}
                whileTap={{ scale: 0.9 }}
                transition={spring}
              >
                {f.tag}
              </motion.button>
            ))}
          </div>
        </div>

        <p className="visually-hidden" aria-live="polite">
          {filters.length ? `${matchCount} items marked ${filters.join(' and ')} in ${current.label}` : ''}
        </p>

        <div id="menu-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="menu__panel">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={reduced ? false : 'hidden'}
              animate="show"
              exit={reduced ? undefined : { opacity: 0, y: 12, transition: { duration: 0.12 } }}
              variants={stagger(0.05)}
            >
              {current.strap && (
                <motion.p className="menu__strap" variants={pop}>
                  {current.strap}
                </motion.p>
              )}

              {tab === 'sides' ? (
                <div className="menu__lists">
                  <PriceList title="Sides" items={menu.sides} dimmed={filters.length > 0} />
                  <PriceList title="Sauces" items={menu.sauces} dimmed={filters.length > 0} />
                </div>
              ) : (
                <div className="menu__grid">
                  {dishes.map((dish) => (
                    <DishCard key={dish.id} dish={dish} dimmed={!matches(dish)} variants={pop} />
                  ))}
                </div>
              )}

              {filters.length > 0 && matchCount === 0 && (
                <motion.p className="menu__empty" variants={pop}>
                  Nothing here is marked {filters.join(' + ')} on the printed menu. Ask your server.
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="menu__foot">
          <p>
            <span className="tag">GF</span> gluten free <span className="menu__sep">·</span>{' '}
            <span className="tag">V option</span> vegetarian option. Tags as printed on the menu.
          </p>
          <p>{venue.allergyNote}</p>
        </div>
      </div>
    </section>
  )
}
