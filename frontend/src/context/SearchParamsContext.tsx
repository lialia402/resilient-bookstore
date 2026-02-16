import { createContext, useContext, useState, type ReactNode } from 'react'

interface SearchParamsContextValue {
  q: string
  setQ: (q: string) => void
  author: string
  setAuthor: (author: string) => void
}

const SearchParamsContext = createContext<SearchParamsContextValue | null>(null)

export const SearchParamsProvider = ({ children }: { children: ReactNode }) => {
  const [q, setQ] = useState('')
  const [author, setAuthor] = useState('')
  return (
    <SearchParamsContext.Provider value={{ q, setQ, author, setAuthor }}>
      {children}
    </SearchParamsContext.Provider>
  )
}

export const useSearchParams = () => {
  const ctx = useContext(SearchParamsContext)
  if (!ctx) throw new Error('useSearchParams must be used within SearchParamsProvider')
  return ctx
}
