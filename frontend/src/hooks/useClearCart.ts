import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import { clearCart } from '../api/cart'
import type { CartResponse } from '../api/types'

const emptyCart: CartResponse = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
}

export const useClearCart = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: clearCart,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.all })
      const previous = queryClient.getQueryData<CartResponse>(queryKeys.cart.all)
      queryClient.setQueryData<CartResponse>(queryKeys.cart.all, emptyCart)
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKeys.cart.all, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all })
    },
  })
}
