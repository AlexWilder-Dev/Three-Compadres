import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { kickSnare, press } from '../lib/motion'
import './BoomButton.css'

const MotionLink = motion.create(Link)

type Target =
  | { to: string; href?: never; onClick?: never }
  | { href: string; to?: never; onClick?: never }
  | { onClick: () => void; to?: never; href?: never }

type BoomButtonProps = Target & {
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'dark'
  size?: 'md' | 'sm' | 'lg'
  icon?: ReactNode
  className?: string
  ariaLabel?: string
}

/** Primary actions. On hover they hit twice: boom (kick), bap (snare). */
export function BoomButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  ariaLabel,
  ...target
}: BoomButtonProps) {
  const cls = `btn btn--${variant} btn--${size} ${className}`
  const content = (
    <>
      <span className="btn__label">{children}</span>
      {icon && <span className="btn__icon">{icon}</span>}
    </>
  )
  const motionProps = { whileHover: kickSnare, whileTap: press }

  if (target.to !== undefined) {
    return (
      <MotionLink to={target.to} className={cls} aria-label={ariaLabel} {...motionProps}>
        {content}
      </MotionLink>
    )
  }

  if (target.onClick) {
    return (
      <motion.button type="button" className={cls} aria-label={ariaLabel} onClick={target.onClick} {...motionProps}>
        {content}
      </motion.button>
    )
  }

  const external = /^https?:/.test(target.href)
  return (
    <motion.a
      href={target.href}
      className={cls}
      aria-label={ariaLabel}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...motionProps}
    >
      {content}
    </motion.a>
  )
}
