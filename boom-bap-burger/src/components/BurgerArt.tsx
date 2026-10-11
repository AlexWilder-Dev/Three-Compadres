import type { ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'
import type { BurgerLayer } from '../data/venue'
import './BurgerArt.css'

const W = 240
const OVERLAP = 3

/** Frilly edge between two x positions, as a run of quadratic bumps. */
function frill(from: number, to: number, y: number, depth: number, step: number, up = false) {
  let d = ''
  for (let x = to; x > from; x -= step) {
    const mid = x - step / 2
    d += ` Q${mid},${up ? y - depth : y + depth} ${Math.max(from, x - step)},${y}`
  }
  return d
}

const seeds = [
  [70, 30, -20],
  [96, 18, 10],
  [124, 14, -5],
  [150, 22, 18],
  [176, 34, -12],
  [110, 34, 25],
  [140, 40, -30],
  [84, 44, 8],
]

/** Height of each layer and how to draw it, with y = 0 at its top edge. */
const LAYERS: Record<BurgerLayer, { h: number; draw: () => ReactNode }> = {
  bunBottom: {
    h: 30,
    draw: () => (
      <path className="b-bun" d="M28,0 H212 Q217,0 217,5 V9 Q217,30 195,30 H45 Q23,30 23,9 V5 Q23,0 28,0 Z" />
    ),
  },
  patty: {
    h: 26,
    draw: () => (
      <>
        <path
          className="b-meat"
          d="M30,1 Q26,0 22,6 Q19,13 22,20 Q25,26 32,26 H208 Q215,26 218,20 Q221,13 218,6 Q214,0 210,1 Q190,-1 170,1 Q150,3 130,1 Q110,-1 90,1 Q70,3 50,1 Z"
        />
        <path className="b-char" d="M48,10 h12 M86,16 h16 M128,9 h10 M160,17 h14 M190,10 h10" />
      </>
    ),
  },
  smash: {
    h: 16,
    draw: () => (
      <path
        className="b-meat"
        d="M28,2 H212 L223,4 L216,7 L224,10 L213,14 H27 L16,10 L23,7 L15,4 Z"
      />
    ),
  },
  cheese: {
    h: 7,
    draw: () => (
      <path
        className="b-cheese"
        d="M16,0 H224 L220,7 Q213,7 211,13 Q209,22 205,13 Q203,7 190,7 H152 Q146,7 145,15 Q143,28 139,15 Q138,7 128,7 H82 Q76,7 75,12 Q73,19 70,12 Q68,7 56,7 H38 Q32,7 31,15 Q29,24 26,15 Q25,7 20,7 Z"
      />
    ),
  },
  bacon: {
    h: 13,
    draw: () => (
      <>
        <path
          className="b-bacon"
          d="M18,4 Q33,-3 48,4 T78,4 T108,4 T138,4 T168,4 T198,4 T224,3 L224,11 Q209,18 196,11 T166,11 T136,11 T106,11 T76,11 T46,11 T16,11 Z"
        />
        <path className="b-fat" d="M24,7.5 Q36,3 48,7.5 T78,7.5 T108,7.5 T138,7.5 T168,7.5 T198,7.5 T218,7" />
      </>
    ),
  },
  pork: {
    h: 22,
    draw: () => (
      <>
        <path
          className="b-meat"
          d="M24,17 Q18,7 32,6 Q38,-1 50,4 Q60,-3 72,4 Q84,-1 94,5 Q106,-2 118,4 Q130,-1 142,5 Q154,-2 166,4 Q178,-1 190,5 Q204,1 210,8 Q224,10 217,19 Q200,23 120,23 Q40,23 24,17 Z"
        />
        <path
          className="b-strand"
          d="M40,12 q10,-5 22,2 M74,9 q12,6 24,-1 M108,14 q10,-6 22,1 M144,9 q12,6 22,0 M178,13 q10,-5 20,2"
        />
      </>
    ),
  },
  lettuce: {
    h: 10,
    draw: () => <path className="b-leaf" d={`M14,2 H226 L224,6${frill(14, 224, 6, 8, 14)} Z`} />,
  },
  onion: {
    h: 8,
    draw: () => (
      <>
        <rect className="b-line" x="26" y="1" width="188" height="6" rx="3" />
        <ellipse className="b-ring" cx="34" cy="4" rx="14" ry="5" />
        <ellipse className="b-ring" cx="120" cy="5" rx="16" ry="4.5" />
        <ellipse className="b-ring" cx="204" cy="4" rx="14" ry="5" />
      </>
    ),
  },
  pickles: {
    h: 8,
    draw: () => (
      <>
        {[38, 92, 148, 204].map((cx) => (
          <g key={cx}>
            <ellipse className="b-ring" cx={cx} cy="5" rx="11" ry="5" />
            <path className="b-dots" d={`M${cx - 4},5 h0.1 M${cx + 4},5 h0.1 M${cx},3 h0.1`} />
          </g>
        ))}
      </>
    ),
  },
  chilli: {
    h: 8,
    draw: () => (
      <>
        {[30, 72, 118, 164, 210].map((cx) => (
          <g key={cx}>
            <circle className="b-ring" cx={cx} cy="4" r="6" />
            <circle className="b-seed" cx={cx} cy="4" r="1.6" />
          </g>
        ))}
      </>
    ),
  },
  sauce: {
    h: 5,
    draw: () => (
      <path
        className="b-sauce"
        d="M22,0 H218 L216,5 Q206,5 204,11 Q202,18 199,11 Q197,5 170,5 H120 Q112,5 111,12 Q109,22 106,12 Q105,5 96,5 H62 Q56,5 55,10 Q53,16 50,10 Q49,5 24,5 Z"
      />
    ),
  },
  bunTop: {
    h: 66,
    draw: () => (
      <>
        <path
          className="b-bun"
          d="M20,60 C20,12 62,0 120,0 C178,0 220,12 220,60 Q220,66 214,66 H26 Q20,66 20,60 Z"
        />
        <path className="b-shine" d="M52,30 Q66,12 98,8" />
        {seeds.map(([x, y, r]) => (
          <ellipse key={`${x}-${y}`} className="b-seed" cx={x} cy={y} rx="3.4" ry="1.6" transform={`rotate(${r} ${x} ${y})`} />
        ))}
      </>
    ),
  },
}

type LayerCustom = { i: number; top: boolean }

const layerVariants: Variants = {
  hidden: ({ i }: LayerCustom) => ({ y: -160 - i * 12, opacity: 0 }),
  show: ({ i }: LayerCustom) => ({
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 520, damping: 19, delay: 0.1 + i * 0.07 },
  }),
  hover: ({ i, top }: LayerCustom) => ({
    y: top ? -22 - i * 3 : -i * 3,
    transition: { type: 'spring', stiffness: 600, damping: 14 },
  }),
}

/** A burger built from its ingredient list, layer by layer. Drops in on view, opens up on hover. */
export function BurgerArt({ layers, className = '' }: { layers: BurgerLayer[]; className?: string }) {
  let offset = 0
  const placed = layers.map((layer, i) => {
    const { h } = LAYERS[layer]
    const bottom = offset
    offset += h - OVERLAP
    return { layer, i, bottom, h }
  })
  const stackHeight = offset + OVERLAP
  const PAD_TOP = 54
  const H = stackHeight + PAD_TOP + 12

  return (
    <svg className={`burger-art ${className}`} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
      <ellipse className="b-shadow" cx={W / 2} cy={H - 9} rx="100" ry="7" />
      {placed.map(({ layer, i, bottom, h }) => {
        const top = layer === 'bunTop'
        return (
          <motion.g
            key={`${layer}-${i}`}
            custom={{ i, top } satisfies LayerCustom}
            variants={layerVariants}
          >
            <g transform={`translate(0 ${H - 12 - bottom - h})`}>{LAYERS[layer].draw()}</g>
          </motion.g>
        )
      })}
    </svg>
  )
}
