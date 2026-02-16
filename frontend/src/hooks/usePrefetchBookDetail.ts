import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import { fetchBookDetail } from '../api/books'

const PREFETCH_HOVER_MS = 500

export const usePrefetchBookDetail = () => {
  const queryClient = useQueryClient()

  const prefetch = (bookId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.books.detail(bookId),
      queryFn: ({ signal }) => fetchBookDetail(bookId, signal),
    })
  }

  return { prefetch, hoverMs: PREFETCH_HOVER_MS }
}
