import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import { addToCart } from '../api/cart'
import type { CartResponse } from '../api/types'

export const useAddToCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ bookId, quantity }: { bookId: string; quantity?: number }) =>
      addToCart(bookId, quantity),
    onSuccess: (data) => {
      queryClient.setQueryData<CartResponse>(queryKeys.cart.all, data)
    },
  })
}
