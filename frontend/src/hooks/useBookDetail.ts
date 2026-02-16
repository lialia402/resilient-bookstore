import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import { fetchBookDetail } from '../api/books'

export const useBookDetail = (bookId: string | null, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: queryKeys.books.detail(bookId),
    queryFn: ({ signal }) => fetchBookDetail(bookId!, signal),
    enabled: !!bookId && (options?.enabled ?? true),
  })
