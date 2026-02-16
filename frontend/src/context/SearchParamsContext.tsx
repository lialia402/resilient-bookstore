import { createContext, useContext, useState, type ReactNode } from 'react'

interface SearchParamsContextValue {
  query: string
  setQuery: (query: string) => void
}

const SearchParamsContext = createContext<SearchParamsContextValue | null>(null)

export const SearchParamsProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQuery] = useState('')
  return (
    <SearchParamsContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchParamsContext.Provider>
  )
}

export const useSearchParams = () => {
  const ctx = useContext(SearchParamsContext)
  if (!ctx) throw new Error('useSearchParams must be used within SearchParamsProvider')
  return ctx
}
