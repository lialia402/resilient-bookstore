/**
 * Book list (paginated/infinite), detail, search, favorite.
 */
import { apiGet, apiPost } from './client'
import type { BookDetail, BooksResponse } from './types'

export function fetchBooks(
  params: { cursor?: string; limit?: number; q?: string },
  signal?: AbortSignal
): Promise<BooksResponse> {
  const search = new URLSearchParams()
  if (params.cursor) search.set('cursor', params.cursor)
  if (params.limit) search.set('limit', String(params.limit))
  if (params.q) search.set('q', params.q)
  const query = search.toString()
  return apiGet<BooksResponse>(query ? `/books?${query}` : '/books', undefined, signal)
}

export function fetchBookDetail(id: string, signal?: AbortSignal): Promise<BookDetail> {
  return apiGet<BookDetail>(`/books/${id}`, undefined, signal)
}

export function toggleFavorite(bookId: string): Promise<{ favorite: boolean }> {
  return apiPost<{ favorite: boolean }>(`/books/${bookId}/favorite`)
}
