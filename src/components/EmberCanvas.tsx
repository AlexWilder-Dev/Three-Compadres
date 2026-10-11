import { useEffect, useRef, type RefObject } from 'react'
import { useReducedMotion, type MotionValue } from 'framer-motion'

interface Props {
  className?: string
  /** 0–1, scales spawn rate and smoke density. */
  intensity?: MotionValue<number>
  /** Element whose centre is the fire. Defaults to the bottom centre of the canvas. */
  originRef?: RefObject<Element | null>
}

interface Ember {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  size: number
  phase: number
}

interface Puff {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  size: number
}

function sprite(size: number, stops: [number, string][]) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  for (const [at, color] of stops) grad.addColorStop(at, color)
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  return c
}

/** Drifting embers and smoke for the barrel section. Renders nothing with reduced motion. */
export function EmberCanvas({ className, intensity, originRef }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || reduced) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const ember = sprite(64, [
      [0, 'rgba(255,236,190,1)'],
      [0.18, 'rgba(255,150,60,0.95)'],
      [0.45, 'rgba(255,90,31,0.35)'],
      [1, 'rgba(216,49,15,0)'],
    ])
    const smoke = sprite(128, [
      [0, 'rgba(150,140,128,0.55)'],
      [0.45, 'rgba(90,84,78,0.25)'],
      [1, 'rgba(40,40,40,0)'],
    ])

    const small = window.matchMedia('(max-width: 720px)').matches
    const MAX_EMBERS = small ? 70 : 150
    const MAX_PUFFS = small ? 14 : 26

    let w = 0
    let h = 0
    let origin = { x: 0.5, y: 0.9 }
    const embers: Ember[] = []
    const puffs: Puff[] = []
    let emberDebt = 0
    let puffDebt = 0
    let raf = 0
    let last = 0
    let frame = 0
    let visible = false

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const measureOrigin = () => {
      const el = originRef?.current
      if (!el) return
      const c = canvas.getBoundingClientRect()
      const o = el.getBoundingClientRect()
      origin = {
        x: (o.left + o.width / 2 - c.left) / (c.width || 1),
        y: (o.top + o.height / 2 - c.top) / (c.height || 1),
      }
    }

    const spawnEmber = (fromFire: boolean) => {
      const ox = fromFire ? origin.x * w + (Math.random() - 0.5) * Math.min(160, w * 0.3) : Math.random() * w
      const oy = fromFire ? origin.y * h + Math.random() * 10 : h + 10
      const max = 90 + Math.random() * 160
      embers.push({
        x: ox,
        y: oy,
        vx: (Math.random() - 0.5) * 0.9,
        vy: -(1.1 + Math.random() * 2.4),
        life: max,
        max,
        size: 1 + Math.random() * 2.6,
        phase: Math.random() * Math.PI * 2,
      })
    }

    const spawnPuff = () => {
      const max = 220 + Math.random() * 200
      puffs.push({
        x: origin.x * w + (Math.random() - 0.5) * 80,
        y: origin.y * h - 10,
        vx: (Math.random() - 0.3) * 0.35,
        vy: -(0.35 + Math.random() * 0.5),
        life: max,
        max,
        size: 50 + Math.random() * 60,
      })
    }

    const loop = (t: number) => {
      const dt = last ? Math.min(3, (t - last) / 16.67) : 1
      last = t
      if (frame++ % 15 === 0) measureOrigin()
      const k = intensity ? intensity.get() : 1

      emberDebt += (0.5 + 1.6 * k) * dt
      while (emberDebt > 1 && embers.length < MAX_EMBERS) {
        spawnEmber(Math.random() < 0.82)
        emberDebt -= 1
      }
      emberDebt = Math.min(emberDebt, 2)
      puffDebt += 0.05 * k * dt
      while (puffDebt > 1 && puffs.length < MAX_PUFFS) {
        spawnPuff()
        puffDebt -= 1
      }
      puffDebt = Math.min(puffDebt, 2)

      ctx.clearRect(0, 0, w, h)

      ctx.globalCompositeOperation = 'source-over'
      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i]
        p.life -= dt
        if (p.life <= 0) {
          puffs.splice(i, 1)
          continue
        }
        p.x += (p.vx + Math.sin((t / 1800) + p.max) * 0.15) * dt
        p.y += p.vy * dt
        p.size += 0.45 * dt
        const age = 1 - p.life / p.max
        ctx.globalAlpha = Math.sin(age * Math.PI) * 0.22 * (0.4 + 0.6 * k)
        ctx.drawImage(smoke, p.x - p.size, p.y - p.size, p.size * 2, p.size * 2)
      }

      ctx.globalCompositeOperation = 'lighter'
      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i]
        e.life -= dt
        if (e.life <= 0 || e.y < -20) {
          embers.splice(i, 1)
          continue
        }
        e.vx += Math.sin(t / 420 + e.phase) * 0.035 * dt
        e.vx *= 0.985
        e.vy *= 0.997
        e.x += e.vx * dt
        e.y += e.vy * dt
        const fade = e.life / e.max
        const flicker = 0.65 + 0.35 * Math.sin(t / 60 + e.phase * 7)
        ctx.globalAlpha = Math.min(1, fade * 1.4) * flicker
        const s = e.size * 7
        ctx.drawImage(ember, e.x - s / 2, e.y - s / 2, s, s)
      }
      ctx.globalAlpha = 1

      raf = visible ? requestAnimationFrame(loop) : 0
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf) {
        last = 0
        measureOrigin()
        raf = requestAnimationFrame(loop)
      }
    })
    const ro = new ResizeObserver(() => {
      resize()
      measureOrigin()
    })
    resize()
    io.observe(canvas)
    ro.observe(canvas)

    return () => {
      io.disconnect()
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [reduced, intensity, originRef])

  if (reduced) return null
  return <canvas ref={ref} className={className} aria-hidden="true" />
}
