import { useState } from 'react'
import { useSearchParams } from '../context/SearchParamsContext'
import { SearchBar } from './SearchBar'
import { BookList } from './BookList'
import { DetailModal } from './DetailModal'
import { useToggleFavorite } from '../hooks/useToggleFavorite'
import type { Book } from '../api/types'

export const BookListSection = () => {
  const { q, author } = useSearchParams()
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null)
  const toggleFavorite = useToggleFavorite()

  return (
    <section className="app__main">
      <SearchBar />
      <BookList
        q={q}
        author={author}
        onBookSelect={(book: Book) => setSelectedBookId(book.id)}
        onToggleFavorite={(bookId) => toggleFavorite.mutate(bookId)}
      />
      <DetailModal
        bookId={selectedBookId}
        onClose={() => setSelectedBookId(null)}
        onToggleFavorite={(bookId) => toggleFavorite.mutate(bookId)}
      />
      {toggleFavorite.isError && (
        <div className="app__error" role="alert">
          Favorite update failed. Reverted.
          <button type="button" onClick={() => toggleFavorite.reset()}>
            Dismiss
          </button>
        </div>
      )}
    </section>
  )
}
