import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { drinks, type Cocktail } from '../data/venue'
import { formatPrice } from '../lib/format'
import { inView, pop, rise, spring, springPop, stagger } from '../lib/motion'
import './Drinks.css'

function CocktailItem({ cocktail, spicy }: { cocktail: Cocktail; spicy: boolean }) {
  const [variant, setVariant] = useState<string | null>(null)
  const chosen = cocktail.variants?.find((v) => v.id === variant)
  const hot = spicy && cocktail.spicy
  const name = hot ? cocktail.spicy!.name : chosen ? chosen.name : cocktail.name
  const addition = hot ? cocktail.spicy!.addition : chosen?.addition

  return (
    <motion.li className={`cocktail ${hot ? 'is-hot' : ''}`} variants={pop} layout="position">
      <h4 className="cocktail__name">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={name}
            className="cocktail__name-text"
            initial={{ y: 26, opacity: 0, rotate: -3 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -26, opacity: 0 }}
            transition={springPop}
          >
            {name}
          </motion.span>
        </AnimatePresence>
      </h4>
      <p className="cocktail__desc">
        {cocktail.description.replace(/\.$/, '')}
        <AnimatePresence initial={false}>
          {addition && (
            <motion.span
              key={addition}
              className="cocktail__plus"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={springPop}
            >
              + {addition}
            </motion.span>
          )}
        </AnimatePresence>
        .
      </p>
      {cocktail.variants && (
        <div className="cocktail__variants" role="group" aria-label={`${cocktail.name} style`}>
          {[{ id: null, label: 'Classic' }, ...cocktail.variants].map((v) => (
            <motion.button
              key={v.label}
              className="chip chip--sm"
              aria-pressed={variant === v.id}
              onClick={() => setVariant(v.id)}
              whileTap={{ scale: 0.9 }}
              transition={spring}
            >
              {v.label}
            </motion.button>
          ))}
        </div>
      )}
    </motion.li>
  )
}

function Board({ title, children }: { title: string; children: ReactNode }) {
  return (
    <motion.div className="board" variants={pop}>
      <h4 className="board__title">{title}</h4>
      {children}
    </motion.div>
  )
}

export function Drinks() {
  const [spicy, setSpicy] = useState(false)

  return (
    <section id="drinks" className="drinks section" aria-labelledby="drinks-title">
      <div className="container">
        <motion.div className="drinks__head" {...inView} variants={stagger(0.08)}>
          <motion.p className="eyebrow" variants={rise}>
            Bar
          </motion.p>
          <motion.h2 id="drinks-title" className="display" variants={rise}>
            Drinks
          </motion.h2>
        </motion.div>

        <div className="drinks__bar">
          <h3 className="drinks__sub">
            Cocktails <span className="drinks__price">All cocktails {formatPrice(drinks.cocktailPrice)}</span>
          </h3>
          <button
            className={`spicy ${spicy ? 'is-on' : ''}`}
            role="switch"
            aria-checked={spicy}
            onClick={() => setSpicy((v) => !v)}
          >
            <span className="spicy__track" aria-hidden="true">
              <motion.span className="spicy__knob" layout transition={springPop} />
            </span>
            Make it spicy
          </button>
        </div>

        <motion.ul className="cocktails" {...inView} variants={stagger(0.04)}>
          {drinks.cocktails.map((c) => (
            <CocktailItem key={c.id} cocktail={c} spicy={spicy} />
          ))}
        </motion.ul>

        <motion.div className="boards" {...inView} variants={stagger(0.07)}>
          <Board title="Shots & more">
            <ul>
              {drinks.shots.map((d) => (
                <li key={d.name} className="price-row">
                  <span className="price-row__name">{d.name}</span>
                  <span className="price-row__dots" aria-hidden="true" />
                  <span className="price">{formatPrice(d.price)}</span>
                </li>
              ))}
            </ul>
          </Board>
          <Board title="Beer">
            <ul>
              {drinks.beer.map((d) => (
                <li key={d.name} className="price-row">
                  <span className="price-row__name">{d.name}</span>
                  <span className="price-row__dots" aria-hidden="true" />
                  <span className="price">{formatPrice(d.price)}</span>
                </li>
              ))}
            </ul>
          </Board>
          <Board title="Wine">
            <p className="board__note">{drinks.wine.kinds}</p>
            <ul>
              <li className="price-row">
                <span className="price-row__name">Glass</span>
                <span className="price-row__dots" aria-hidden="true" />
                <span className="price">{formatPrice(drinks.wine.glass)}</span>
              </li>
              <li className="price-row">
                <span className="price-row__name">Bottle</span>
                <span className="price-row__dots" aria-hidden="true" />
                <span className="price">{formatPrice(drinks.wine.bottle)}</span>
              </li>
            </ul>
          </Board>
          <Board title="Soft drinks">
            <p className="board__soft">{drinks.soft.items.join(' · ')}</p>
            <p className="board__each">
              <span className="price">{formatPrice(drinks.soft.price)}</span> each
            </p>
          </Board>
        </motion.div>
      </div>
    </section>
  )
}
