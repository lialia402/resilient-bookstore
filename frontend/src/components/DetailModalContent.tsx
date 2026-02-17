import { formatPrice } from '../lib/formatPrice'
import { FAVORITE_ICON, getFavoriteLabel } from '../lib/favorites'
import type { BookDetail } from '../api/types'

export interface DetailModalContentProps {
  book: BookDetail
  quantityInCart: number
  isFavorite?: boolean
  onToggleFavorite: (bookId: string) => void
  onAddToCart: (bookId: string) => void
  bookId: string
}

export const DetailModalContent = ({
  book,
  quantityInCart,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  bookId,
}: DetailModalContentProps) => {
  const atMaxStock = quantityInCart >= book.stock
  return (
    <>
      <h2 id="detail-modal-title" className="detail-modal__title">{book.title}</h2>
      <p className="detail-modal__author">{book.author}</p>
      <p className="detail-modal__meta">
        {formatPrice(book.price)} · {book.stock} in stock
      </p>
      <div className="detail-modal__actions">
        <button
          type="button"
          className="detail-modal__favorite"
          onClick={() => onToggleFavorite(bookId)}
          aria-label={getFavoriteLabel(!!isFavorite)}
        >
          {isFavorite ? `${FAVORITE_ICON.active} Favorite` : `${FAVORITE_ICON.inactive} Add to favorites`}
        </button>
        <button
          type="button"
          className="detail-modal__add-cart"
          disabled={atMaxStock}
          onClick={() => onAddToCart(bookId)}
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
