import type { SVGProps } from 'react'

type Pt = [number, number]
type Seg = [Pt, Pt, Pt]

// Right half of a handlebar moustache, centred on (0, 0) and 200 units wide.
const START: Pt = [0, -10]
const RIGHT: Seg[] = [
  [[10, -24], [34, -27], [52, -17]],
  [[66, -9], [76, -4], [86, -11]],
  [[94, -17], [96, -27], [90, -34]],
  [[103, -30], [106, -12], [94, -1]],
  [[76, 15], [44, 21], [22, 13]],
  [[12, 9], [5, 5], [0, 3]],
]

const fmt = ([x, y]: Pt) => `${+x.toFixed(2)} ${+y.toFixed(2)}`
const flip = ([x, y]: Pt): Pt => [-x, y]

function buildPath(): string {
  let d = `M${fmt(START)}`
  for (const [c1, c2, p] of RIGHT) d += `C${fmt(c1)} ${fmt(c2)} ${fmt(p)}`
  for (let i = RIGHT.length - 1; i >= 0; i--) {
    const [c1, c2] = RIGHT[i]
    const from = i === 0 ? START : RIGHT[i - 1][2]
    d += `C${fmt(flip(c2))} ${fmt(flip(c1))} ${fmt(flip(from))}`
  }
  return `${d}Z`
}

/** One handlebar moustache, 200 × ~56 units, centred on the origin. */
export const MOUSTACHE_PATH = buildPath()

/** The logo's three joined moustaches as a single drawing (viewBox 600 × 80). */
export function MoustacheTrio(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="-300 -40 600 80" aria-hidden="true" focusable="false" {...props}>
      {[-196, 0, 196].map((x) => (
        <path key={x} d={MOUSTACHE_PATH} transform={`translate(${x} 0)`} />
      ))}
    </svg>
  )
}
