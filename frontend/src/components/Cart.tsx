import { useState, useEffect } from 'react'
import { useRenderCount } from '../hooks/useRenderCount'
import { useCart } from '../hooks/useCart'
import { useDiscount } from '../hooks/useDiscount'
import { useClearCart } from '../hooks/useClearCart'
import { CartSummary } from './CartSummary'
import { ErrorBanner } from './ErrorBanner'

const DISCOUNT_DEBOUNCE_MS = 500

export const Cart = () => {
  useRenderCount('Cart') // dev only: logs render count to console

  const [code, setCode] = useState('')
  const [debouncedCode, setDebouncedCode] = useState('')
  useEffect(() => {
    const id = setTimeout(
      () => setDebouncedCode(code.trim().toLowerCase()),
      DISCOUNT_DEBOUNCE_MS
    )
    return () => clearTimeout(id)
  }, [code])

  const { data, status } = useCart()
  const { data: discount } = useDiscount(
    debouncedCode,
    (data?.totalItems ?? 0) >= 1
  )

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
