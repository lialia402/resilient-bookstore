import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useBookDetail } from '../hooks/useBookDetail'
import { queryKeys } from '../queryKeys'
import { fetchCart } from '../api/cart'
import { DetailModalContent } from './DetailModalContent'

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

  const handleBackdropKeyDown = useCallback(
    (e: React.KeyboardEvent) => e.key === 'Escape' && onClose(),
    [onClose]
  )
  const handleContentClick = useCallback((e: React.MouseEvent) => e.stopPropagation(), [])

  if (!bookId) return null

  const quantityInCart = cartData?.items.find((i) => i.bookId === bookId)?.quantity ?? 0

  return (
    <div
      className="detail-modal__backdrop"
      onClick={onClose}
      onKeyDown={handleBackdropKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
    >
      <div className="detail-modal" onClick={handleContentClick}>
        <button type="button" className="detail-modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        {status === 'pending' && <p>Loading…</p>}
        {status === 'error' && <p>Error: {String(error)}</p>}
        {status === 'success' && book && (
          <DetailModalContent
            book={book}
            quantityInCart={quantityInCart}
            isFavorite={book.favorite}
            onToggleFavorite={onToggleFavorite}
            onAddToCart={onAddToCart}
            bookId={book.id}
          />
        )}
      </div>
    </div>
  )
}
