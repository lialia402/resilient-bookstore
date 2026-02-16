import { useSearchParams } from '../context/SearchParamsContext'

export const SearchBar = () => {
  const { q, setQ, author, setAuthor } = useSearchParams()
  return (
    <div className="search-bar">
      <input
        type="search"
        placeholder="Search by title or author…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search books by title or author"
        className="search-bar__input"
      />
      <input
        type="text"
        placeholder="Filter by author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        aria-label="Filter by author"
        className="search-bar__input"
      />
    </div>
  )
}
