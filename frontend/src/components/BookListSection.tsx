import { useState, useCallback } from 'react'
import { useSearchParams } from '../context/SearchParamsContext'
import { SearchBar } from './SearchBar'
import { BookList } from './BookList'
import { InventoryValue } from './InventoryValue'
import { DetailModal } from './DetailModal'
import { ErrorBanner } from './ErrorBanner'
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

  const onBookSelect = useCallback((book: Book) => setSelectedBookId(book.id), [])
  const onCloseModal = useCallback(() => setSelectedBookId(null), [])
  const onToggleFavorite = useCallback(
    (bookId: string) => toggleFavorite.mutate(bookId),
    [toggleFavorite]
  )
  const onAddToCart = useCallback(
    (bookId: string) => addToCart.mutate({ bookId }),
    [addToCart]
  )

  return (
    <section className="app__main">
      <SearchBar />
      <InventoryValue query={query} />
      <BookList
        query={query}
        onBookSelect={onBookSelect}
        onToggleFavorite={onToggleFavorite}
        onAddToCart={onAddToCart}
        onHoverBook={prefetch}
        hoverDelayMs={hoverMs}
      />
      <DetailModal
        bookId={selectedBookId}
        onClose={onCloseModal}
        onToggleFavorite={onToggleFavorite}
        onAddToCart={onAddToCart}
      />
      {toggleFavorite.isError && (
        <ErrorBanner
          message="Favorite update failed. Reverted."
          onDismiss={() => toggleFavorite.reset()}
        />
      )}
      {addToCart.isError && (
        <ErrorBanner
          message={parseApiError(addToCart.error)}
          onDismiss={() => addToCart.reset()}
        />
      )}
    </section>
  )
}
