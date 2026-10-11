import { useEffect } from 'react'
import { brand } from '../data/venue'

export function useDocumentTitle(page?: string) {
  useEffect(() => {
    document.title = page ? `${page} · ${brand.name}` : `${brand.name} · ${brand.tagline}`
  }, [page])
}
