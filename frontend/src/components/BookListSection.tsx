import { useState } from 'react'
import { useSearchParams } from '../context/SearchParamsContext'
import { SearchBar } from './SearchBar'
import { BookList } from './BookList'
import { InventoryValue } from './InventoryValue'
import { DetailModal } from './DetailModal'
import { useToggleFavorite } from '../hooks/useToggleFavorite'
import { useAddToCart } from '../hooks/useAddToCart'
import { usePrefetchBookDetail } from '../hooks/usePrefetchBookDetail'
import type { Book } from '../api/types'

function parseApiError(error: unknown): string {
  const msg = error instanceof Error ? error.message : 'Could not add to cart.'
  try {
    const j = JSON.parse(msg) as { error?: string }
    if (typeof j?.error === 'string') return j.error
  } catch { /* use msg as-is */ }
  return msg
}

export const BookListSection = () => {
  const { query } = useSearchParams()
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null)
  const toggleFavorite = useToggleFavorite()
  const addToCart = useAddToCart()
  const { prefetch, hoverMs } = usePrefetchBookDetail()

  return (
    <section className="app__main">
      <SearchBar />
      <InventoryValue query={query} />
      <BookList
        query={query}
        onBookSelect={(book: Book) => setSelectedBookId(book.id)}
        onToggleFavorite={(bookId) => toggleFavorite.mutate(bookId)}
        onAddToCart={(bookId) => addToCart.mutate({ bookId })}
        onHoverBook={prefetch}
        hoverDelayMs={hoverMs}
      />
      <DetailModal
        bookId={selectedBookId}
        onClose={() => setSelectedBookId(null)}
        onToggleFavorite={(bookId) => toggleFavorite.mutate(bookId)}
        onAddToCart={(bookId) => addToCart.mutate({ bookId })}
      />
      {toggleFavorite.isError && (
        <div className="app__error" role="alert">
          Favorite update failed. Reverted.
          <button type="button" onClick={() => toggleFavorite.reset()}>
            Dismiss
          </button>
        </div>
      )}
      {addToCart.isError && (
        <div className="app__error" role="alert">
          {parseApiError(addToCart.error)}
          <button type="button" onClick={() => addToCart.reset()}>
            Dismiss
          </button>
        </div>
      )}
    </section>
  )
}
