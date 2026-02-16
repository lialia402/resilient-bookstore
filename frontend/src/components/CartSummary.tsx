import type { CartItem, DiscountResult } from '../api/types'

function applyDiscount(totalPrice: number, discount: DiscountResult | undefined): number {
  if (!discount?.valid) return totalPrice
  if (discount.type === 'percent') return totalPrice * (1 - discount.value / 100)
  return Math.max(0, totalPrice - discount.value)
}

interface CartSummaryProps {
  totalItems: number
  totalPrice: number
  items: CartItem[]
  discount: DiscountResult | undefined
  onClearCart: () => void
  isClearPending: boolean
}

export const CartSummary = ({
  totalItems,
  totalPrice,
  items,
  discount,
  onClearCart,
  isClearPending,
}: CartSummaryProps) => {
  const discountedTotal = applyDiscount(totalPrice, discount)

  return (
    <>
      <p className="cart__summary">
        {totalItems} items · ${totalPrice.toFixed(2)}
      </p>
      {items.length > 0 ? (
        <>
          <ul className="cart__list">
            {items.map((item) => (
              <li key={item.bookId}>
                {item.title} × {item.quantity}
              </li>
            ))}
          </ul>
          <p className="cart__total">
            Total: ${discountedTotal.toFixed(2)}
            {discount?.valid && discountedTotal !== totalPrice && (
              <span className="cart__total-note"> ({discount.message})</span>
            )}
          </p>
          <button
            type="button"
            className="cart__clear"
            onClick={onClearCart}
            disabled={isClearPending}
          >
            Clear cart
          </button>
        </>
      ) : (
        <p className="cart__empty">Cart is empty.</p>
      )}
    </>
  )
}
