import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import { fetchCart } from '../api/cart'
import { useRenderCount } from '../hooks/useRenderCount'

export const Cart = () => {
  useRenderCount('Cart') // dev only: logs render count to console

  const { data, status } = useQuery({
    queryKey: queryKeys.cart.all,
    queryFn: ({ signal }) => fetchCart(signal),
  })

  if (status === 'pending') return <aside className="cart">Loading cart…</aside>
  if (status === 'error') return <aside className="cart">Cart error</aside>

  return (
    <aside className="cart">
      <h2 className="cart__title">Cart</h2>
      <p className="cart__summary">
        {data?.totalItems ?? 0} items · ${(data?.totalPrice ?? 0).toFixed(2)}
      </p>
      {data?.items && data.items.length > 0 ? (
        <ul className="cart__list">
          {data.items.map((item) => (
            <li key={`${item.bookId}-${item.quantity}`}>
              {item.title} × {item.quantity}
            </li>
          ))}
        </ul>
      ) : (
        <p className="cart__empty">Cart is empty.</p>
      )}
    </aside>
  )
}
