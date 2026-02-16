import { useInfiniteQuery } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import { fetchBooks } from '../api/books'

const DEFAULT_LIMIT = 20

export interface UseInfiniteBooksParams {
  q?: string
  author?: string
  limit?: number
}

export const useInfiniteBooks = (params: UseInfiniteBooksParams = {}) => {
  const { q = '', author = '', limit = DEFAULT_LIMIT } = params

  return useInfiniteQuery({
    queryKey: queryKeys.books.list({ q, author, limit }),
    queryFn: ({ pageParam, signal }) =>
      fetchBooks({ cursor: pageParam, limit, q: q || undefined, author: author || undefined }, signal),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })
}
