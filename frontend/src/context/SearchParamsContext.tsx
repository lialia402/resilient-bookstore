import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'

interface SearchParamsContextValue {
  query: string
  setQuery: (query: string) => void
}

const SearchParamsContext = createContext<SearchParamsContextValue | null>(null)

export const SearchParamsProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQuery] = useState('')
  const value = useMemo(() => ({ query, setQuery }), [query])
  return (
    <SearchParamsContext.Provider value={value}>
      {children}
    </SearchParamsContext.Provider>
  )
}

export const useSearchParams = () => {
  const ctx = useContext(SearchParamsContext)
  if (!ctx) throw new Error('useSearchParams must be used within SearchParamsProvider')
  return ctx
}
