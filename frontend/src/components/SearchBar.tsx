import { useState, useEffect } from 'react'
import { useSearchParams } from '../context/SearchParamsContext'

const SEARCH_DEBOUNCE_MS = 1000

export const SearchBar = () => {
  const { setQuery } = useSearchParams()
  const [raw, setRaw] = useState('')

  useEffect(() => {
    const id = setTimeout(() => setQuery(raw), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(id)
  }, [raw, setQuery])

  return (
    <div className="search-bar">
      <input
        type="search"
        placeholder="Search by title or author…"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        aria-label="Search books by title or author"
        className="search-bar__input"
      />
    </div>
  )
}
