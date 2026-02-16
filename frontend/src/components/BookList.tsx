import { useRef, useMemo } from 'react'
import { useInfiniteBooks } from '../hooks/useInfiniteBooks'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { BookCard } from './BookCard'
import type { Book } from '../api/types'

interface BookListProps {
  query?: string
  onBookSelect: (book: Book) => void
  onToggleFavorite: (bookId: string) => void
  onAddToCart: (bookId: string) => void
  onHoverBook?: (bookId: string) => void
  hoverDelayMs?: number
}

export const BookList = ({
  query,
  onBookSelect,
  onToggleFavorite,
  onAddToCart,
  onHoverBook,
  hoverDelayMs,
}: BookListProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } = useInfiniteBooks({
    q: query,
  })
  const sentinelRef = useRef<HTMLDivElement>(null)
  useInfiniteScroll(sentinelRef, { fetchNextPage, hasNextPage, isFetchingNextPage })
  const books = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  )

  if (status === 'pending') return <p className="book-list__loading">Loading books…</p>
  if (status === 'error') return <p className="book-list__error">Error: {String(error)}</p>

  return (
    <div className="book-list">
      <ul className="book-list__grid">
        {books.map((book) => (
          <li key={book.id}>
            <BookCard
              book={book}
              onSelect={onBookSelect}
              onToggleFavorite={onToggleFavorite}
              onAddToCart={onAddToCart}
              onHoverBook={onHoverBook}
              hoverDelayMs={hoverDelayMs}
            />
          </li>
        ))}
      </ul>
      <div ref={sentinelRef} className="book-list__sentinel" aria-hidden />
      {isFetchingNextPage && <p className="book-list__loading">Loading more…</p>}
      {!hasNextPage && books.length > 0 && (
        <p className="book-list__end">You&apos;ve reached the end.</p>
      )}
    </div>
  )
}
