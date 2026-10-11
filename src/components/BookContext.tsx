import { createContext, useContext } from 'react'

export interface BookApi {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const BookContext = createContext<BookApi>({
  isOpen: false,
  open: () => {},
  close: () => {},
})

export const useBook = () => useContext(BookContext)
