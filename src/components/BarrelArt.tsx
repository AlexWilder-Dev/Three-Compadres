import { motion, type MotionValue } from 'framer-motion'
import type { RefObject } from 'react'

interface Props {
  lid: MotionValue<number>
  glow: MotionValue<number>
  originRef: RefObject<SVGCircleElement | null>
}

/** The barrel grill in the logo's ink style. The lid lifts as you scroll. */
export function BarrelArt({ lid, glow, originRef }: Props) {
  return (
    <svg className="barrel-art" viewBox="0 0 260 330" role="img" aria-label="A charcoal barrel grill with the lid lifting">
      <defs>
        <radialGradient id="barrel-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffd38a" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#ff5a1f" stopOpacity="0.7" />
          <stop offset="1" stopColor="#d8310f" stopOpacity="0" />
        </radialGradient>
      </defs>

      <motion.ellipse cx="130" cy="92" rx="140" ry="70" fill="url(#barrel-glow)" style={{ opacity: glow }} />

      <g stroke="#000" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        {/* Legs */}
        <path d="M78 284 66 318M182 284l12 34" fill="none" />
        {/* Side handles */}
        <path d="M44 176H26v34h20M216 176h18v34h-20" fill="none" />
        {/* Body */}
        <path d="M46 104c-13 54-13 118 6 182h156c19-64 19-128 6-182z" fill="#C3942C" />
        {/* Hoops */}
        <path d="M40 148q90 16 180 0M40 244q90 16 180 0" fill="none" strokeWidth="9" />
        {/* Opening */}
        <ellipse cx="130" cy="104" rx="86" ry="16" fill="#0B0B0B" />
      </g>
      <path d="M70 122c-7 44-7 92 4 140" fill="none" stroke="#FED289" strokeOpacity="0.55" strokeWidth="9" strokeLinecap="round" />
      <motion.ellipse cx="130" cy="106" rx="70" ry="9" fill="#ff5a1f" style={{ opacity: glow }} />
      <motion.ellipse cx="130" cy="107" rx="40" ry="5" fill="#ffd38a" style={{ opacity: glow }} />
      <circle ref={originRef} cx="130" cy="100" r="1" fill="none" />

      {/* Lid, hinged on the left */}
      <motion.g style={{ rotate: lid, transformBox: 'fill-box', transformOrigin: '0% 100%' }}>
        <g stroke="#000" strokeWidth="8" strokeLinejoin="round">
          <path d="M40 104c0-58 180-58 180 0z" fill="#9A7220" />
          <rect x="110" y="48" width="40" height="16" rx="8" fill="#FED289" strokeWidth="6" />
        </g>
        <path d="M66 86c14-20 44-28 70-28" fill="none" stroke="#FED289" strokeOpacity="0.5" strokeWidth="7" strokeLinecap="round" />
      </motion.g>
    </svg>
  )
}
