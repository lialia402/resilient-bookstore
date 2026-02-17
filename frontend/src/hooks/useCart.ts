import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import { fetchCart } from '../api/cart'

export function useCart(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.cart.all,
    queryFn: ({ signal }) => fetchCart(signal),
    enabled: options?.enabled ?? true,
  })
}
