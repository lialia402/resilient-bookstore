import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import { fetchBookDetail } from '../api/books'

const PREFETCH_HOVER_MS = 500

export const usePrefetchBookDetail = () => {
  const queryClient = useQueryClient()

  const prefetch = useCallback((bookId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.books.detail(bookId),
      queryFn: ({ signal }) => fetchBookDetail(bookId, signal),
    })
  }, [queryClient])

  return { prefetch, hoverMs: PREFETCH_HOVER_MS }
}
