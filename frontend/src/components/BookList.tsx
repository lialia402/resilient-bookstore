import { useRef } from 'react'
import { useInfiniteBooks } from '../hooks/useInfiniteBooks'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { BookCard } from './BookCard'
import type { Book } from '../api/types'

interface BookListProps {
  q?: string
  author?: string
  onBookSelect: (book: Book) => void
  onToggleFavorite: (bookId: string) => void
}

export const BookList = ({ q, author, onBookSelect, onToggleFavorite }: BookListProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } = useInfiniteBooks({
    q,
    author,
  })
  const sentinelRef = useRef<HTMLDivElement>(null)
  useInfiniteScroll(sentinelRef, { fetchNextPage, hasNextPage, isFetchingNextPage })

  if (status === 'pending') return <p className="book-list__loading">Loading books…</p>
  if (status === 'error') return <p className="book-list__error">Error: {String(error)}</p>

  const books = data?.pages.flatMap((p) => p.items) ?? []

  return (
    <div className="book-list">
      <ul className="book-list__grid">
        {books.map((book) => (
          <li key={book.id}>
            <BookCard
              book={book}
              onSelect={onBookSelect}
              onToggleFavorite={onToggleFavorite}
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
