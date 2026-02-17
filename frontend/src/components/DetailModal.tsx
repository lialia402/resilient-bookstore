import { useCallback } from 'react'
import { useBookDetail } from '../hooks/useBookDetail'
import { useCart } from '../hooks/useCart'
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
  const { data: cartData } = useCart({ enabled: !!bookId })

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
