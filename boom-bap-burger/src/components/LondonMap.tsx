import { motion } from 'framer-motion'
import { locationIds, locations, type LocationId } from '../data/venue'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useLocationSite } from '../lib/location'
import { spring, springPop } from '../lib/motion'
import './LondonMap.css'

// Plate carrée with a cos(latitude) squash, which is plenty at city scale.
const BOUNDS = { west: -0.235, east: 0, north: 51.53, south: 51.415 }
const SQUASH = Math.cos((51.47 * Math.PI) / 180)
const SCALE = 800 / ((BOUNDS.east - BOUNDS.west) * SQUASH)
const W = 800
const H = Math.round((BOUNDS.north - BOUNDS.south) * SCALE)

const project = (lat: number, lng: number): [number, number] => [
  (lng - BOUNDS.west) * SQUASH * SCALE,
  (BOUNDS.north - lat) * SCALE,
]

// The Thames, west to east, bridge by bridge.
const THAMES: [number, number][] = [
  [51.4712, -0.2365],
  [51.4669, -0.2132],
  [51.4647, -0.2005],
  [51.4651, -0.1882],
  [51.472, -0.1795],
  [51.4815, -0.1735],
  [51.4826, -0.1667],
  [51.4846, -0.1496],
  [51.4855, -0.144],
  [51.4875, -0.1268],
  [51.4946, -0.123],
  [51.5008, -0.1219],
  [51.5065, -0.12],
  [51.5086, -0.1167],
  [51.5097, -0.1043],
  [51.5084, -0.0943],
  [51.5079, -0.0877],
  [51.5055, -0.0754],
  [51.504, -0.06],
  [51.5075, -0.0335],
  [51.5, -0.0285],
  [51.492, -0.0255],
  [51.4855, -0.0175],
  [51.4842, -0.009],
  [51.4875, 0.0035],
]

/** Smooth path through the points (Catmull-Rom to cubic Bézier). */
function smoothPath(points: [number, number][]): string {
  const p = points.map(([lat, lng]) => project(lat, lng))
  let d = `M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[i + 2] ?? p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`
  }
  return d
}

const river = smoothPath(THAMES)

/** Straight-line distance in miles between the two sites. */
function milesBetween(a: LocationId, b: LocationId): number {
  const R = 3958.8
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const { lat: lat1, lng: lng1 } = locations[a].geo
  const { lat: lat2, lng: lng2 } = locations[b].geo
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

const [A, B] = locationIds.map((id) => project(locations[id].geo.lat, locations[id].geo.lng))
const MID: [number, number] = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]
const ANGLE = (Math.atan2(B[1] - A[1], B[0] - A[0]) * 180) / Math.PI
const MILES = milesBetween('leadenhall', 'tooting').toFixed(1)

interface LondonMapProps {
  onPick?: (id: LocationId) => void
}

/** Both sites on a hand-drawn London: the river, a dotted line between them, tap a pin to pick. */
export function LondonMap({ onPick }: LondonMapProps) {
  const { location, setLocation } = useLocationSite()
  // Phones get a tighter, portrait crop around the two pins so the labels stay readable.
  const narrow = useMediaQuery('(max-width: 600px)')
  const [vx, vy, vw, vh] = narrow ? [150, 20, 520, 600] : [0, 0, W, H]

  return (
    <figure className="london-map">
      <svg viewBox={`${vx} ${vy} ${vw} ${vh}`} role="group" aria-label="Map of London showing both Boom Bap Burger sites">
        <defs>
          <pattern id="map-dots" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.3" fill="rgba(255,255,255,0.12)" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#map-dots)" />

        <path d={river} className="london-map__river-edge" />
        <motion.path
          d={river}
          id="thames"
          className="london-map__river"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1] }}
        />
        <text className="london-map__river-label">
          <textPath href="#thames" startOffset="22%">
            RIVER THAMES
          </textPath>
        </text>

        <motion.line
          x1={A[0]}
          y1={A[1]}
          x2={B[0]}
          y2={B[1]}
          className="london-map__route"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
        />
        <g transform={`translate(${MID[0]} ${MID[1]}) rotate(${ANGLE > 90 ? ANGLE - 180 : ANGLE})`}>
          <text className="london-map__distance" y="-12">
            {MILES} miles as the crow flies
          </text>
        </g>

        <g className="london-map__compass" transform={`translate(${vx + vw - 56} ${vy + vh - 60})`}>
          <circle r="24" />
          <path d="M0,-16 L6,4 L0,0 L-6,4 Z" />
          <text y="-30">N</text>
        </g>

        {locationIds.map((id, i) => {
          const site = locations[id]
          const [x, y] = i === 0 ? A : B
          const active = id === location.id
          const labelLeft = x > W * 0.55
          return (
            <motion.g
              key={id}
              className={`london-map__pin${active ? ' is-active' : ''}`}
              role="button"
              tabIndex={0}
              aria-label={`${site.name}, ${site.code}${active ? ' (selected)' : ''}`}
              aria-pressed={active}
              onClick={() => {
                setLocation(id)
                onPick?.(id)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setLocation(id)
                  onPick?.(id)
                }
              }}
              initial={{ opacity: 0, y: -40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springPop, delay: 0.5 + i * 0.25 }}
              whileHover={{ scale: 1.08 }}
              style={{ originX: `${x}px`, originY: `${y}px`, transformBox: 'view-box' }}
            >
              {active && (
                <motion.circle
                  cx={x}
                  cy={y}
                  r="34"
                  className="london-map__ring"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={spring}
                />
              )}
              <circle cx={x} cy={y} r="22" className="london-map__hit" />
              <path
                d={`M${x},${y} c-6,-10 -16,-18 -16,-30 a16,16 0 1,1 32,0 c0,12 -10,20 -16,30 z`}
                className="london-map__marker"
              />
              <circle cx={x} cy={y - 30} r="6" className="london-map__marker-dot" />
              <text
                x={labelLeft ? x - 30 : x + 30}
                y={y - 34}
                className="london-map__label"
                textAnchor={labelLeft ? 'end' : 'start'}
              >
                {site.short}
              </text>
              <text
                x={labelLeft ? x - 30 : x + 30}
                y={y - 12}
                className="london-map__code"
                textAnchor={labelLeft ? 'end' : 'start'}
              >
                {site.code} · {site.area}
              </text>
            </motion.g>
          )
        })}
      </svg>
      <figcaption className="visually-hidden">
        Leadenhall Market is in the City, north of London Bridge. Tooting Market is in south London, {MILES} miles
        away.
      </figcaption>
    </figure>
  )
}
