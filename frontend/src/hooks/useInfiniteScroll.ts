import { useEffect, type RefObject } from 'react'

interface UseInfiniteScrollOptions {
  fetchNextPage: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  rootMargin?: string
}

export const useInfiniteScroll = (
  sentinelRef: RefObject<HTMLDivElement | null>,
  { fetchNextPage, hasNextPage, isFetchingNextPage, rootMargin = '100px' }: UseInfiniteScrollOptions
) => {
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, rootMargin])
}
