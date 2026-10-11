import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { springPop } from '../lib/motion'
import './Sticker.css'

interface StickerProps {
  src: string
  rotate?: number
  className?: string
  delay?: number
}

/** One of their sticker graphics, slapped on at an angle. Grab it with a mouse and it springs back. */
export function Sticker({ src, rotate = -8, className = '', delay = 0 }: StickerProps) {
  const finePointer = useMediaQuery('(pointer: fine)')
  const [broken, setBroken] = useState(false)
  if (broken) return null

  return (
    <motion.img
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      loading="lazy"
      decoding="async"
      className={`sticker ${className}`}
      initial={{ opacity: 0, scale: 1.35, rotate: rotate - 18 }}
      whileInView={{ opacity: 1, scale: 1, rotate }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ ...springPop, delay }}
      whileHover={{ scale: 1.07, rotate: rotate * 0.4 }}
      drag={finePointer}
      dragSnapToOrigin
      dragElastic={0.4}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 18 }}
      whileDrag={{ scale: 1.14, rotate: rotate + 8, cursor: 'grabbing' }}
      onError={() => setBroken(true)}
    />
  )
}
