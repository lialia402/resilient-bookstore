import { useRef } from 'react'
import { formatPrice } from '../lib/formatPrice'
import { FAVORITE_ICON, getFavoriteLabel } from '../lib/favorites'
import type { Book } from '../api/types'

interface BookCardProps {
  book: Book
  onSelect: (book: Book) => void
  onToggleFavorite: (bookId: string) => void
  onAddToCart: (bookId: string) => void
  onHoverBook?: (bookId: string) => void
  hoverDelayMs?: number
}

export const BookCard = ({
  book,
  onSelect,
  onToggleFavorite,
  onAddToCart,
  onHoverBook,
  hoverDelayMs = 500,
}: BookCardProps) => {
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (!onHoverBook) return
    hoverTimerRef.current = setTimeout(() => onHoverBook(book.id), hoverDelayMs)
  }

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
  }

  return (
  <article
    className="book-card"
    onClick={() => onSelect(book)}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onSelect(book)}
  >
    <div className="book-card__header">
      <h3 className="book-card__title">{book.title}</h3>
      <button
        type="button"
        className="book-card__favorite"
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite(book.id)
        }}
        aria-label={getFavoriteLabel(!!book.favorite)}
        title={book.favorite ? 'Unfavorite' : 'Favorite'}
      >
        {book.favorite ? FAVORITE_ICON.active : FAVORITE_ICON.inactive}
      </button>
    </div>
    <p className="book-card__author">{book.author}</p>
    <p className="book-card__meta">
      {formatPrice(book.price)} · {book.stock} in stock
    </p>
    <button
      type="button"
      className="book-card__add-cart"
      onClick={(e) => {
        e.stopPropagation()
        onAddToCart(book.id)
      }}
    >
      Add to cart
    </button>
  </article>
  )
}
