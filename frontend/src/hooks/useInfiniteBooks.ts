import { useInfiniteQuery } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import { fetchBooks } from '../api/books'

const DEFAULT_LIMIT = 20

export interface UseInfiniteBooksParams {
  q?: string
  limit?: number
}

export const useInfiniteBooks = (params: UseInfiniteBooksParams = {}) => {
  const { q = '', limit = DEFAULT_LIMIT } = params

  return useInfiniteQuery({
    queryKey: queryKeys.books.list({ q, limit }),
    queryFn: ({ pageParam, signal }) =>
      fetchBooks({ cursor: pageParam, limit, q: q || undefined }, signal),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })
}
