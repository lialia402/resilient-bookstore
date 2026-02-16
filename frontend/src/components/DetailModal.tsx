import { useQuery } from '@tanstack/react-query'
import { useBookDetail } from '../hooks/useBookDetail'
import { queryKeys } from '../queryKeys'
import { fetchCart } from '../api/cart'
import type { BookDetail } from '../api/types'

interface DetailModalProps {
  bookId: string | null
  onClose: () => void
  onToggleFavorite: (bookId: string) => void
  onAddToCart: (bookId: string) => void
}

export const DetailModal = ({
  bookId,
  onClose,
  onToggleFavorite,
  onAddToCart,
}: DetailModalProps) => {
  const { data: book, status, error } = useBookDetail(bookId)
  const { data: cartData } = useQuery({
    queryKey: queryKeys.cart.all,
    queryFn: ({ signal }) => fetchCart(signal),
    enabled: !!bookId,
  })

  if (!bookId) return null

  const quantityInCart = cartData?.items.find((i) => i.bookId === bookId)?.quantity ?? 0

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
            quantityInCart={quantityInCart}
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
  quantityInCart,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}: {
  book: BookDetail
  quantityInCart: number
  isFavorite?: boolean
  onToggleFavorite: () => void
  onAddToCart: () => void
}) => {
  const atMaxStock = quantityInCart >= book.stock
  return (
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
        <button
          type="button"
          className="detail-modal__add-cart"
          disabled={atMaxStock}
          onClick={onAddToCart}
          aria-label={atMaxStock ? 'Maximum stock in cart' : 'Add to cart'}
        >
          {atMaxStock ? 'Max in cart' : 'Add to cart'}
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
  )
}
