import { useOpenStatus } from '../hooks/useOpenStatus'
import './HoursBadge.css'

export function HoursBadge({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const status = useOpenStatus()
  return (
    <span className={`badge badge--${status.state} badge--${size}`}>
      <span className="badge__dot" aria-hidden="true" />
      <span>{status.label}</span>
    </span>
  )
}
