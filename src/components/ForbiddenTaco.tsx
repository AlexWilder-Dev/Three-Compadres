import { useEffect, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useAnimate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'
import { forbiddenTaco as ft, type Taco } from '../data/venue'
import { formatPrice } from '../lib/format'
import { inView, pop, rise, spring, springPop, stagger } from '../lib/motion'
import './ForbiddenTaco.css'

const SLOTS = 3
const BAR_WIDTHS = [
  [62, 88],
  [48, 96, 40],
  [74, 70],
  [56, 92, 30],
  [80, 84, 52],
  [64, 90, 44],
]

function TacoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" aria-hidden="true" focusable="false">
      <path
        d="M7 22c1-5 4-9 7-10 1-4 6-6 9-4 3-3 8-2 10 2 4-1 8 3 8 8"
        fill="#C3942C"
        stroke="#000"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path d="M3 29C3 17 12 9 24 9s21 8 21 20z" fill="#FED289" stroke="#000" strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M11 24c2-5 7-8 13-8" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" opacity="0.35" />
    </svg>
  )
}

export function tacoTotal(picks: Taco[]) {
  const supplements = picks.reduce((sum, t) => sum + t.supplement, 0)
  const base = picks.length === SLOTS ? ft.three : picks.length * ft.single
  return { total: base + supplements, supplements }
}

function Classified({ onReveal }: { onReveal: () => void }) {
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-240, 0, 240], [-14, -4, 6])
  const [peeled, setPeeled] = useState(false)

  const peel = (direction: number) => {
    setPeeled(true)
    if (reduced) return onReveal()
    animate(x, direction * window.innerWidth, { ...spring, velocity: direction * 1600 })
    window.setTimeout(onReveal, 260)
  }

  return (
    <div className="dossier dossier--classified">
      <ol className="dossier__rows" aria-hidden="true">
        {BAR_WIDTHS.map((widths, i) => (
          <li key={i} className="dossier__row">
            <span className="dossier__num">{String(i + 1).padStart(2, '0')}</span>
            <span className="dossier__bars">
              {widths.map((w, j) => (
                <span key={j} className="redaction" style={{ width: `${w}%` }} />
              ))}
            </span>
          </li>
        ))}
      </ol>

      <span className="dossier__stamp" aria-hidden="true">
        Classified
      </span>

      <motion.div
        className="tape"
        style={{ x, rotate }}
        drag={peeled ? false : 'x'}
        dragElastic={0.6}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_, info) => {
          if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 700) {
            peel(Math.sign(info.offset.x || info.velocity.x) || 1)
          }
        }}
        aria-hidden="true"
      >
        <span>Do not peel · Do not peel · Do not peel · Do not peel · Do not peel</span>
      </motion.div>

      <div className="dossier__actions">
        <motion.button
          className="btn btn--ink"
          onClick={() => peel(1)}
          whileHover={reduced ? undefined : { rotate: -2, y: -2 }}
          whileTap={{ scale: 0.94 }}
          transition={springPop}
        >
          {ft.revealButton}
        </motion.button>
        <p className="dossier__hint">…or drag the tape off.</p>
      </div>
    </div>
  )
}

function Tray({ picks, onRemove, onClear, nudge }: { picks: Taco[]; onRemove: (i: number) => void; onClear: () => void; nudge: number }) {
  const { total, supplements } = tacoTotal(picks)
  const n = picks.length
  const detail =
    n === 0
      ? 'Tap tacos to fill your three.'
      : n < SLOTS
        ? `${n} × ${formatPrice(ft.single)}${supplements ? ` + ${formatPrice(supplements)} extra` : ''} · ${SLOTS - n} more for the ${formatPrice(ft.three)} deal`
        : `3 for ${formatPrice(ft.three)}${supplements ? ` + ${formatPrice(supplements)} extra` : ''}`

  // Shake when someone tries to add a fourth taco.
  const [scope, shake] = useAnimate<HTMLDivElement>()
  useEffect(() => {
    if (nudge) shake(scope.current, { x: [0, -10, 9, -6, 3, 0] }, { duration: 0.45 })
  }, [nudge, scope, shake])

  return (
    <div className="tray" ref={scope}>
      <div className="tray__slots">
        {Array.from({ length: SLOTS }, (_, i) => {
          const taco = picks[i]
          return (
            <button
              key={i}
              className={`tray__slot ${taco ? 'is-filled' : ''}`}
              onClick={() => taco && onRemove(i)}
              aria-label={taco ? `Remove ${taco.name}` : `Empty slot ${i + 1}`}
              disabled={!taco}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {taco ? (
                  <motion.span
                    key={`${taco.id}-${i}`}
                    className="tray__taco"
                    initial={{ scale: 0.2, y: -30, rotate: -20 }}
                    animate={{ scale: 1, y: 0, rotate: 0 }}
                    exit={{ scale: 0.2, opacity: 0 }}
                    transition={springPop}
                  >
                    <TacoIcon className="tray__icon" />
                    <span className="tray__name">{taco.name.replace(/ Taco$/, '')}</span>
                  </motion.span>
                ) : (
                  <motion.span key="empty" className="tray__empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {i + 1}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )
        })}
      </div>
      <div className="tray__summary" aria-live="polite">
        <p className="tray__total">
          <span>Your three</span>
          <strong className="price">{formatPrice(total)}</strong>
        </p>
        <p className="tray__detail">{detail}</p>
      </div>
      <div className="tray__foot">
        <p className="tray__line">{ft.trayLine}</p>
        {n > 0 && (
          <button className="tray__clear" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
    </div>
  )
}

function Revealed() {
  const [picks, setPicks] = useState<Taco[]>([])
  const [nudge, setNudge] = useState(0)

  const add = (taco: Taco) => {
    if (picks.length >= SLOTS) return setNudge((v) => v + 1)
    setPicks([...picks, taco])
  }

  return (
    <div className="secret__open">
      <motion.p
        className="secret__after"
        initial={{ scale: 1.6, opacity: 0, rotate: -6 }}
        animate={{ scale: 1, opacity: 1, rotate: -2 }}
        transition={{ ...springPop, delay: 0.1 }}
      >
        {ft.afterReveal}
      </motion.p>

      <motion.p className="secret__prices" variants={pop} initial="hidden" animate="show">
        1 taco <strong className="price">{formatPrice(ft.single)}</strong>
        <span aria-hidden="true"> · </span>3 tacos <strong className="price">{formatPrice(ft.three)}</strong>
      </motion.p>

      <motion.ul className="secret__tacos" initial="hidden" animate="show" variants={stagger(0.06, 0.25)}>
        {ft.tacos.map((taco) => {
          const count = picks.filter((p) => p.id === taco.id).length
          return (
            <motion.li key={taco.id} variants={pop}>
              <motion.button
                className={`taco ${count ? 'is-picked' : ''}`}
                onClick={() => add(taco)}
                whileHover={{ y: -4, rotate: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={springPop}
                aria-label={`Add ${taco.name} to your three${taco.supplement ? `, plus ${formatPrice(taco.supplement)}` : ''}`}
              >
                <span className="taco__head">
                  <span className="taco__name">{taco.name}</span>
                  {taco.supplement > 0 && <span className="taco__supp price">+{formatPrice(taco.supplement)}</span>}
                </span>
                <span className="taco__desc">{taco.description}</span>
                <span className="taco__add" aria-hidden="true">
                  {count ? `In your three ×${count}` : 'Tap to add'}
                </span>
              </motion.button>
            </motion.li>
          )
        })}
      </motion.ul>

      <Tray
        picks={picks}
        nudge={nudge}
        onRemove={(i) => setPicks(picks.filter((_, j) => j !== i))}
        onClear={() => setPicks([])}
      />

      <motion.div className="quesadillas" variants={rise} initial="hidden" animate="show">
        <div className="quesadillas__head">
          <h3>{ft.quesadillas.name}</h3>
          <span className="price">{formatPrice(ft.quesadillas.price)}</span>
        </div>
        <p>{ft.quesadillas.description}</p>
        <p className="quesadillas__note">
          {ft.quesadillas.extra} · Not part of the taco deal.
        </p>
      </motion.div>
    </div>
  )
}

export function ForbiddenTaco() {
  const [revealed, setRevealed] = useState(false)

  return (
    <section id="secret" className="secret section on-butter" aria-labelledby="secret-title">
      <div className="container">
        <motion.header className="secret__head" {...inView} variants={stagger(0.08)}>
          <motion.p className="eyebrow" variants={rise}>
            Secret menu
          </motion.p>
          <motion.h2 id="secret-title" className="display" variants={rise}>
            {ft.title}
          </motion.h2>
          <motion.p className="secret__warning" variants={rise}>
            {ft.warning}
          </motion.p>
        </motion.header>

        <AnimatePresence mode="wait" initial={false}>
          {revealed ? (
            <motion.div key="open" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Revealed />
            </motion.div>
          ) : (
            <motion.div key="closed" exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}>
              <Classified onReveal={() => setRevealed(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
