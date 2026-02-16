import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import { fetchCart, validateDiscount } from '../api/cart'
import { useRenderCount } from '../hooks/useRenderCount'
import { useClearCart } from '../hooks/useClearCart'
import { CartSummary } from './CartSummary'
import { ErrorBanner } from './ErrorBanner'

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

  if (status === 'pending') return <aside className="cart">Loading cart…</aside>
  if (status === 'error') return <aside className="cart">Cart error</aside>

  return (
    <aside className="cart">
      <h2 className="cart__title">Cart</h2>
      <CartSummary
        totalItems={data?.totalItems ?? 0}
        totalPrice={data?.totalPrice ?? 0}
        items={data?.items ?? []}
        discount={discount}
        onClearCart={() => clearCart.mutate()}
        isClearPending={clearCart.isPending}
      />
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
        <ErrorBanner
          message="Clear cart failed. Reverted."
          onDismiss={() => clearCart.reset()}
          className="cart__error"
        />
      )}
    </aside>
  )
}
