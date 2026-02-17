import type { InfiniteData } from '@tanstack/react-query'
import type { BooksResponse, Book } from '../api/types'

/**
 * Flatten all pages from an infinite query into a single book array.
 * Returns [] when data is undefined.
 */
export function flattenPages(data: InfiniteData<BooksResponse> | undefined): Book[] {
  return data?.pages.flatMap((p) => p.items) ?? []
}
