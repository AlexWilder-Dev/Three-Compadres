import { useEffect, useState } from 'react'
import { getOpenStatus, type OpenStatus } from '../lib/hours'

/** Live open/closed status in London time, refreshed every 30 seconds. */
export function useOpenStatus(): OpenStatus {
  const [status, setStatus] = useState(() => getOpenStatus())
  useEffect(() => {
    const tick = () => setStatus(getOpenStatus())
    const id = window.setInterval(tick, 30_000)
    document.addEventListener('visibilitychange', tick)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [])
  return status
}
