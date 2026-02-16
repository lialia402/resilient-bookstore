import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import { fetchCart, validateDiscount } from '../api/cart'
import { useRenderCount } from '../hooks/useRenderCount'
import { useClearCart } from '../hooks/useClearCart'
import type { DiscountResult } from '../api/types'

function applyDiscount(totalPrice: number, discount: DiscountResult | undefined): number {
  if (!discount?.valid) return totalPrice
  if (discount.type === 'percent') return totalPrice * (1 - discount.value / 100)
  return Math.max(0, totalPrice - discount.value)
}

export const Cart = () => {
  useRenderCount('Cart') // dev only: logs render count to console

  const [code, setCode] = useState('')
  const normalizedCode = code.trim().toLowerCase()
  const { data, status } = useQuery({
    queryKey: queryKeys.cart.all,
    queryFn: ({ signal }) => fetchCart(signal),
  })

  const { data: discount } = useQuery({
    queryKey: queryKeys.discount({ code: normalizedCode }),
    queryFn: () => validateDiscount(normalizedCode),
    enabled: (data?.totalItems ?? 0) >= 1 && normalizedCode.length > 0,
  })

  const clearCart = useClearCart()
  const totalPrice = data?.totalPrice ?? 0
  const discountedTotal = applyDiscount(totalPrice, discount)

  if (status === 'pending') return <aside className="cart">Loading cart…</aside>
  if (status === 'error') return <aside className="cart">Cart error</aside>

  return (
    <aside className="cart">
      <h2 className="cart__title">Cart</h2>
      <p className="cart__summary">
        {data?.totalItems ?? 0} items · ${totalPrice.toFixed(2)}
      </p>
      {data?.items && data.items.length > 0 ? (
        <>
          <ul className="cart__list">
            {data.items.map((item) => (
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
            onClick={() => clearCart.mutate()}
            disabled={clearCart.isPending}
          >
            Clear cart
          </button>
        </>
      ) : (
        <p className="cart__empty">Cart is empty.</p>
      )}
      <div className="cart__discount">
        <label htmlFor="cart-discount">Discount code</label>
        <input
          id="cart-discount"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. SAVE10"
          className="cart__discount-input"
          aria-label="Discount code"
        />
        {discount && (
          <p className="cart__discount-message" aria-live="polite">
            {discount.valid ? discount.message : 'Invalid code'}
          </p>
        )}
      </div>
      {clearCart.isError && (
        <div className="cart__error" role="alert">
          Clear cart failed. Reverted.
          <button type="button" onClick={() => clearCart.reset()}>
            Dismiss
          </button>
        </div>
      )}
    </aside>
  )
}
