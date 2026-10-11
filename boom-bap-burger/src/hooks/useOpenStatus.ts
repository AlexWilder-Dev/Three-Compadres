import { useEffect, useState } from 'react'
import type { Location } from '../data/venue'
import { getOpenStatus, type OpenStatus } from '../lib/hours'

/** Live open/closed status in London time, refreshed every 30 seconds. */
export function useOpenStatus(location: Location): OpenStatus {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const tick = () => setNow(new Date())
    const id = window.setInterval(tick, 30_000)
    document.addEventListener('visibilitychange', tick)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [])
  return getOpenStatus(location, now)
}
