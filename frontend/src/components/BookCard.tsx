import type { Book } from '../api/types'

interface BookCardProps {
  book: Book
  onSelect: (book: Book) => void
  onToggleFavorite: (bookId: string) => void
}

export const BookCard = ({ book, onSelect, onToggleFavorite }: BookCardProps) => (
  <article
    className="book-card"
    onClick={() => onSelect(book)}
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
        aria-label={book.favorite ? 'Remove from favorites' : 'Add to favorites'}
        title={book.favorite ? 'Unfavorite' : 'Favorite'}
      >
        {book.favorite ? '♥' : '♡'}
      </button>
    </div>
    <p className="book-card__author">{book.author}</p>
    <p className="book-card__meta">
      ${book.price.toFixed(2)} · {book.stock} in stock
    </p>
  </article>
);
