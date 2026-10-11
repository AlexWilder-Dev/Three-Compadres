import { useEffect, useRef, type ReactNode } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { MOUSTACHE_PATH } from './Moustache'
import { springPop } from '../lib/motion'
import './Faces.css'

// Cropped to the drawing: x, y, width, height.
const VB = { x: 60, y: 92, w: 600, h: 296 }
const INK = '#000'
const SKIN = '#FED289'
const HAIR = '#C3942C'
const EYE_WHITE = '#FFF8EC'
const PUPIL_TRAVEL = 7

interface FaceShape {
  cx: number
  cy: number
  rx: number
  ry: number
  hair: 'quiff' | 'slick' | 'curls'
  brow: 'arch' | 'flat' | 'tilt'
  ear: -1 | 0 | 1
}

// Left, right, then middle so the middle face sits in front.
const FACES: FaceShape[] = [
  { cx: 190, cy: 262, rx: 94, ry: 110, hair: 'quiff', brow: 'arch', ear: -1 },
  { cx: 530, cy: 262, rx: 92, ry: 112, hair: 'curls', brow: 'tilt', ear: 1 },
  { cx: 360, cy: 246, rx: 100, ry: 118, hair: 'slick', brow: 'flat', ear: 0 },
]

const MOUSTACHE_SCALE = 0.85

function headPath({ rx, ry }: FaceShape) {
  // Slightly squared jaw: wider at the cheeks than an ellipse.
  const top = -ry
  const bottom = ry
  return `M0 ${top}
    C${rx * 0.62} ${top} ${rx} ${-ry * 0.58} ${rx} ${-ry * 0.08}
    C${rx} ${ry * 0.48} ${rx * 0.66} ${bottom} 0 ${bottom}
    C${-rx * 0.66} ${bottom} ${-rx} ${ry * 0.48} ${-rx} ${-ry * 0.08}
    C${-rx} ${-ry * 0.58} ${-rx * 0.62} ${top} 0 ${top}Z`
}

function Hair({ face }: { face: FaceShape }) {
  const { rx, ry } = face
  if (face.hair === 'quiff') {
    return (
      <g>
        <path
          d={`M${-rx + 4} ${-ry * 0.28}
            C${-rx - 10} ${-ry * 1.02} ${-rx * 0.2} ${-ry * 1.36} ${rx * 0.38} ${-ry * 1.18}
            C${rx * 0.86} ${-ry * 1.04} ${rx * 1.06} ${-ry * 0.74} ${rx * 0.96} ${-ry * 0.36}
            C${rx * 0.7} ${-ry * 0.62} ${rx * 0.2} ${-ry * 0.74} ${-rx * 0.2} ${-ry * 0.64}
            C${-rx * 0.5} ${-ry * 0.56} ${-rx * 0.8} ${-ry * 0.44} ${-rx + 4} ${-ry * 0.28}Z`}
          fill={HAIR}
          stroke={INK}
          strokeWidth={7}
          strokeLinejoin="round"
        />
        <path
          d={`M${-rx * 0.5} ${-ry * 0.86} C${-rx * 0.1} ${-ry * 1.08} ${rx * 0.4} ${-ry * 1.04} ${rx * 0.66} ${-ry * 0.82}`}
          fill="none"
          stroke={INK}
          strokeWidth={5}
          strokeLinecap="round"
        />
      </g>
    )
  }
  if (face.hair === 'slick') {
    return (
      <g>
        <path
          d={`M${-rx - 2} ${-ry * 0.16}
            C${-rx - 6} ${-ry * 1.12} ${rx + 6} ${-ry * 1.12} ${rx + 2} ${-ry * 0.16}
            C${rx * 0.84} ${-ry * 0.5} ${rx * 0.5} ${-ry * 0.6} ${-rx * 0.1} ${-ry * 0.6}
            C${-rx * 0.5} ${-ry * 0.6} ${-rx * 0.84} ${-ry * 0.44} ${-rx - 2} ${-ry * 0.16}Z`}
          fill={HAIR}
          stroke={INK}
          strokeWidth={7}
          strokeLinejoin="round"
        />
        <path
          d={`M${-rx * 0.34} ${-ry * 0.62} C${-rx * 0.3} ${-ry * 0.8} ${-rx * 0.22} ${-ry * 0.92} ${-rx * 0.1} ${-ry * 0.98}`}
          fill="none"
          stroke={INK}
          strokeWidth={5}
          strokeLinecap="round"
        />
        <path
          d={`M${rx * 0.1} ${-ry * 0.9} C${rx * 0.4} ${-ry * 0.9} ${rx * 0.66} ${-ry * 0.74} ${rx * 0.78} ${-ry * 0.5}`}
          fill="none"
          stroke={INK}
          strokeWidth={4}
          strokeLinecap="round"
        />
      </g>
    )
  }
  // Curls: draw every outline first, then every fill, so they merge into one cloud.
  const curls = Array.from({ length: 9 }, (_, i) => {
    const t = Math.PI * (1.08 + (i / 8) * 0.84)
    return { x: Math.cos(t) * rx * 0.86, y: Math.sin(t) * ry * 0.86 - 6, r: i % 2 ? 24 : 27 }
  })
  return (
    <g>
      {curls.map((c, i) => (
        <circle key={`o${i}`} cx={c.x} cy={c.y} r={c.r} fill={INK} stroke={INK} strokeWidth={14} />
      ))}
      {curls.map((c, i) => (
        <circle key={`f${i}`} cx={c.x} cy={c.y} r={c.r} fill={HAIR} />
      ))}
      {curls.map((c, i) =>
        i % 2 ? null : (
          <path
            key={`l${i}`}
            d={`M${c.x - 9} ${c.y + 2} q9 -12 18 0`}
            fill="none"
            stroke={INK}
            strokeWidth={4}
            strokeLinecap="round"
          />
        ),
      )}
    </g>
  )
}

function browPath(kind: FaceShape['brow'], side: -1 | 1) {
  if (kind === 'arch') return 'M-20 6 Q0 -12 20 6'
  if (kind === 'flat') return 'M-22 2 Q0 -6 22 2'
  return side === -1 ? 'M-20 -2 Q0 -6 20 8' : 'M-20 8 Q0 -6 20 -2'
}

interface EyeProps {
  x: number
  y: number
  look: { x: MotionValue<number>; y: MotionValue<number> }
  blink: MotionValue<number>
}

function Eye({ x, y, look, blink }: EyeProps) {
  // Each pupil leans towards the shared target, limited to the eye's travel.
  const dx = useTransform(() => look.x.get() - x)
  const dy = useTransform(() => look.y.get() - y)
  const ox = useSpring(
    useTransform(() => {
      const d = Math.hypot(dx.get(), dy.get()) || 1
      return (dx.get() / d) * Math.min(PUPIL_TRAVEL, d / 18)
    }),
    { stiffness: 420, damping: 26 },
  )
  const oy = useSpring(
    useTransform(() => {
      const d = Math.hypot(dx.get(), dy.get()) || 1
      return (dy.get() / d) * Math.min(PUPIL_TRAVEL, d / 18)
    }),
    { stiffness: 420, damping: 26 },
  )
  return (
    <g transform={`translate(${x} ${y})`}>
      <motion.g style={{ scaleY: blink, transformBox: 'fill-box', transformOrigin: 'center' }}>
        <ellipse rx={17} ry={19} fill={EYE_WHITE} stroke={INK} strokeWidth={5.5} />
        <motion.g style={{ x: ox, y: oy }}>
          <circle r={8.5} fill={INK} />
          <circle cx={-2.6} cy={-2.8} r={2.6} fill={EYE_WHITE} />
        </motion.g>
      </motion.g>
    </g>
  )
}

interface FaceControls {
  blink: MotionValue<number>
  brow: MotionValue<number>
  tash: MotionValue<number>
  tashY: MotionValue<number>
  enterY: MotionValue<number>
  enterOpacity: MotionValue<number>
}

function useFaceControls(still: boolean): FaceControls {
  return {
    blink: useMotionValue(1),
    brow: useMotionValue(0),
    tash: useMotionValue(0),
    tashY: useMotionValue(0),
    enterY: useMotionValue(still ? 0 : 90),
    enterOpacity: useMotionValue(still ? 1 : 0),
  }
}

interface LayerProps {
  face: FaceShape
  controls: FaceControls
}

function FaceBase({ face, controls, look }: LayerProps & { look: EyeProps['look'] }) {
  const { cx, cy, rx } = face
  const eyeY = cy - 14
  const mouthY = cy + 82
  return (
    <>
      {face.ear !== 0 && (
        <ellipse
          cx={cx + face.ear * (rx - 2)}
          cy={cy + 8}
          rx={17}
          ry={26}
          fill={SKIN}
          stroke={INK}
          strokeWidth={7}
        />
      )}
      {face.hair === 'curls' && (
        <g transform={`translate(${cx} ${cy})`}>
          <Hair face={face} />
        </g>
      )}
      <path
        d={headPath(face)}
        transform={`translate(${cx} ${cy})`}
        fill={SKIN}
        stroke={INK}
        strokeWidth={7}
      />
      {face.hair !== 'curls' && (
        <g transform={`translate(${cx} ${cy})`}>
          <Hair face={face} />
        </g>
      )}

      <circle cx={cx - rx * 0.56} cy={cy + 26} r={14} fill={HAIR} opacity={0.38} />
      <circle cx={cx + rx * 0.56} cy={cy + 26} r={14} fill={HAIR} opacity={0.38} />

      <motion.g style={{ y: controls.brow }}>
        {([-1, 1] as const).map((side) => (
          <path
            key={side}
            d={browPath(face.brow, side)}
            transform={`translate(${cx + side * 34} ${cy - 50})`}
            fill="none"
            stroke={INK}
            strokeWidth={face.brow === 'flat' ? 11 : 9}
            strokeLinecap="round"
          />
        ))}
      </motion.g>

      <Eye x={cx - 34} y={eyeY} look={look} blink={controls.blink} />
      <Eye x={cx + 34} y={eyeY} look={look} blink={controls.blink} />

      <path
        d={`M${cx - 18} ${mouthY - 6} Q${cx} ${mouthY + 16} ${cx + 18} ${mouthY - 6}Z`}
        fill={INK}
        stroke={INK}
        strokeWidth={5}
        strokeLinejoin="round"
      />
    </>
  )
}

function FaceTash({ face, controls }: LayerProps) {
  return (
    <motion.g
      style={{
        rotate: controls.tash,
        y: controls.tashY,
        transformBox: 'fill-box',
        transformOrigin: '50% 30%',
      }}
    >
      <path
        d={MOUSTACHE_PATH}
        transform={`translate(${face.cx} ${face.cy + 54}) scale(${MOUSTACHE_SCALE})`}
        fill={INK}
      />
    </motion.g>
  )
}

function FaceNose({ face: { cx, cy } }: LayerProps) {
  return (
    <path
      d={`M${cx - 7} ${cy + 6}
        C${cx - 10} ${cy + 16} ${cx - 26} ${cy + 20} ${cx - 20} ${cy + 33}
        C${cx - 14} ${cy + 45} ${cx + 14} ${cy + 45} ${cx + 20} ${cy + 33}
        C${cx + 26} ${cy + 20} ${cx + 10} ${cy + 16} ${cx + 7} ${cy + 6}`}
      fill={SKIN}
      stroke={INK}
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
}

interface FacesProps {
  ready: boolean
}

/** The three faces from the logo. Eyes follow the pointer (or taps), blink, and moustaches twitch on hover. */
export function Faces({ ready }: FacesProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const reduced = useReducedMotion()
  const still = !!reduced

  // Look target in viewBox units. Default: down towards the buttons.
  const lookX = useMotionValue(VB.x + VB.w / 2)
  const lookY = useMotionValue(VB.y + VB.h * 2)

  useEffect(() => {
    if (still) return
    let last: { x: number; y: number } | null = null
    let frame = 0
    const update = () => {
      frame = 0
      const svg = svgRef.current
      if (!svg || !last) return
      const r = svg.getBoundingClientRect()
      if (!r.width) return
      lookX.set(VB.x + ((last.x - r.left) / r.width) * VB.w)
      lookY.set(VB.y + ((last.y - r.top) / r.height) * VB.h)
    }
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const onPointer = (e: PointerEvent) => {
      // Mouse and pen follow on move; touch follows taps.
      if (e.type === 'pointermove' && e.pointerType === 'touch') return
      last = { x: e.clientX, y: e.clientY }
      queue()
    }
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('pointerdown', onPointer, { passive: true })
    window.addEventListener('scroll', queue, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('scroll', queue)
      cancelAnimationFrame(frame)
    }
  }, [still, lookX, lookY])

  const look = { x: lookX, y: lookY }
  const controls = [useFaceControls(still), useFaceControls(still), useFaceControls(still)]

  // Out-of-sync blinking: each face keeps its own random timer.
  useEffect(() => {
    if (still) return
    const timers: number[] = []
    controls.forEach(({ blink }, i) => {
      const schedule = () => {
        timers[i] = window.setTimeout(
          () => {
            const twice = Math.random() < 0.2
            animate(blink, twice ? [1, 0.08, 1, 0.08, 1] : [1, 0.08, 1], {
              duration: twice ? 0.34 : 0.16,
              ease: 'easeInOut',
            })
            schedule()
          },
          1800 + Math.random() * 4600 + i * 300,
        )
      }
      schedule()
    })
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [still])

  // Pop in once the loader has gone.
  useEffect(() => {
    if (still || !ready) return
    controls.forEach(({ enterY, enterOpacity }, i) => {
      const delay = [0.05, 0.25, 0.15][i]
      animate(enterY, 0, { ...springPop, delay })
      animate(enterOpacity, 1, { duration: 0.2, delay })
    })
  }, [still, ready])

  const twitch = (i: number) => {
    if (still) return
    const c = controls[i]
    animate(c.tash, [0, -7, 6, -4, 2, 0], { duration: 0.55, ease: 'easeOut' })
    animate(c.tashY, [0, -4, 0], { duration: 0.3 })
    animate(c.brow, [0, -7, 0], { duration: 0.5, ease: 'easeOut' })
  }

  // Each layer is drawn for all three faces before the next, so the moustaches join across faces.
  // Only the base layer takes the pointer; the layers above let it pass through.
  const layer = (render: (face: FaceShape, i: number) => ReactNode, interactive = false) =>
    FACES.map((face, i) => (
      <motion.g
        key={face.hair}
        className={interactive ? 'face' : 'face-overlay'}
        style={{ y: controls[i].enterY, opacity: controls[i].enterOpacity }}
        onPointerEnter={interactive ? () => twitch(i) : undefined}
        onPointerDown={interactive ? () => twitch(i) : undefined}
      >
        {render(face, i)}
      </motion.g>
    ))

  return (
    <svg
      ref={svgRef}
      className="faces"
      viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
      role="img"
      aria-label="The three compadres: three moustached faces from the Three Compadres logo"
    >
      {layer((face, i) => <FaceBase face={face} controls={controls[i]} look={look} />, true)}
      {layer((face, i) => <FaceTash face={face} controls={controls[i]} />)}
      {layer((face, i) => <FaceNose face={face} controls={controls[i]} />)}
    </svg>
  )
}
