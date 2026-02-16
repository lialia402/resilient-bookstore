import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import { toggleFavorite } from '../api/books'
import type { Book } from '../api/types'
import type { InfiniteData } from '@tanstack/react-query'
import type { BooksResponse } from '../api/types'

export const useToggleFavorite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleFavorite,
    onMutate: async (bookId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.books.lists() })
      await queryClient.cancelQueries({ queryKey: queryKeys.books.detail(bookId) })

      const previousLists = queryClient.getQueriesData<InfiniteData<BooksResponse>>({
        queryKey: queryKeys.books.lists(),
      })
      const previousDetail = queryClient.getQueryData<Book>(queryKeys.books.detail(bookId))

      queryClient.setQueriesData<InfiniteData<BooksResponse>>(
        { queryKey: queryKeys.books.lists() },
        (old) => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((b) =>
                b.id === bookId ? { ...b, favorite: !b.favorite } : b
              ),
            })),
          }
        }
      )
      queryClient.setQueryData<Book>(queryKeys.books.detail(bookId), (old) =>
        old ? { ...old, favorite: !old.favorite } : old
      )

      return { previousLists, previousDetail }
    },
    onError: (_err, bookId, context) => {
      if (!context) return
      context.previousLists?.forEach(([key, data]) => {
        if (data !== undefined) queryClient.setQueryData(key, data)
      })
      if (context.previousDetail) {
        queryClient.setQueryData(queryKeys.books.detail(bookId), context.previousDetail)
      }
    },
    onSettled: (_data, _err, bookId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(bookId) })
    },
  })
}
