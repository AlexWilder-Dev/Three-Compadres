import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_LOCATION, locationIds, locations, type Location, type LocationId } from '../data/venue'

const STORAGE_KEY = 'boombap:location'

function readStored(): LocationId {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    if (value && (locationIds as string[]).includes(value)) return value as LocationId
  } catch {
    // Storage blocked (private mode, previews). Fall back to the default site.
  }
  return DEFAULT_LOCATION
}

interface LocationContextValue {
  location: Location
  other: Location
  setLocation: (id: LocationId) => void
}

const LocationContext = createContext<LocationContextValue | null>(null)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<LocationId>(readStored)

  const setLocation = useCallback((next: LocationId) => {
    setId(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Still switches for this visit.
    }
  }, [])

  const value = useMemo(
    () => ({
      location: locations[id],
      other: locations[id === 'leadenhall' ? 'tooting' : 'leadenhall'],
      setLocation,
    }),
    [id, setLocation],
  )

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
}

export function useLocationSite(): LocationContextValue {
  const ctx = useContext(LocationContext)
  if (!ctx) throw new Error('useLocationSite must be used inside LocationProvider')
  return ctx
}
