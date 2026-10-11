import './Equalizer.css'

/** Bouncing level meter. Purely decorative; stands still for reduced motion. */
export function Equalizer({ bars = 5, className = '' }: { bars?: number; className?: string }) {
  return (
    <span className={`eq ${className}`} aria-hidden="true">
      {Array.from({ length: bars }, (_, i) => (
        <span key={i} style={{ animationDelay: `${-i * 0.23}s`, animationDuration: `${0.7 + (i % 3) * 0.18}s` }} />
      ))}
    </span>
  )
}
