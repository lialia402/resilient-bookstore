import { useBookDetail } from '../hooks/useBookDetail'
import type { BookDetail } from '../api/types'

interface DetailModalProps {
  bookId: string | null
  onClose: () => void
  onToggleFavorite: (bookId: string) => void
  onAddToCart: (bookId: string) => void
}

export const DetailModal = ({ bookId, onClose, onToggleFavorite, onAddToCart }: DetailModalProps) => {
  const { data: book, status, error } = useBookDetail(bookId)

  if (!bookId) return null

  return (
    <div
      className="detail-modal__backdrop"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
    >
      <div
        className="detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="detail-modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        {status === 'pending' && <p>Loading…</p>}
        {status === 'error' && <p>Error: {String(error)}</p>}
        {status === 'success' && book && (
          <DetailContent
            book={book}
            isFavorite={book.favorite}
            onToggleFavorite={() => onToggleFavorite(book.id)}
            onAddToCart={() => onAddToCart(book.id)}
          />
        )}
      </div>
    </div>
  )
}

const DetailContent = ({
  book,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}: {
  book: BookDetail
  isFavorite?: boolean
  onToggleFavorite: () => void
  onAddToCart: () => void
}) => (
    <>
      <h2 id="detail-modal-title" className="detail-modal__title">{book.title}</h2>
      <p className="detail-modal__author">{book.author}</p>
      <p className="detail-modal__meta">
        ${book.price.toFixed(2)} · {book.stock} in stock
      </p>
      <div className="detail-modal__actions">
        <button
          type="button"
          className="detail-modal__favorite"
          onClick={onToggleFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '♥ Favorite' : '♡ Add to favorites'}
        </button>
        <button type="button" className="detail-modal__add-cart" onClick={onAddToCart}>
          Add to cart
        </button>
      </div>
      <p className="detail-modal__description">{book.description}</p>
      {book.reviews && book.reviews.length > 0 && (
        <section className="detail-modal__reviews">
          <h3>Reviews</h3>
          <ul>
            {book.reviews.map((r) => (
              <li key={r.id}>
                <strong>{r.author}</strong> ({r.rating}/5): {r.text}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
