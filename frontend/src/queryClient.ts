import { QueryClient } from '@tanstack/react-query'


const STALE_TIME = 5 * 60 * 1000; // 5 min
const GC_TIME = 10 * 60 * 1000; // 10 min
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
    },
  },
})
