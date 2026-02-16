/**
 * Query key design 
 * -----------------
 * All TanStack Query keys are defined here so cache behavior is explicit and
 * invalidation is traceable. No ad-hoc keys elsewhere.
 *
 * Books: hierarchical keys allow targeted invalidation — e.g. invalidate every
 * list (all search/pagination caches) without touching detail caches, or
 * invalidate a single book detail after a mutation. The list key includes the
 * full params object so each search + pagination state has its own cache entry;
 * React Query compares keys by deep equality.
 *
 * Cart: single key; cart is one resource. Mutations (add, clear) invalidate or
 * update this key.
 *
 * Discount: key is code-only (normalized trim + lower case to avoid duplicate
 * requests for "SAVE10" vs " save10 "). The backend returns metadata only; the
 * UI derives discounted total from cart. The query runs only when the cart has
 * at least one item and the user has entered a code — that condition is enforced
 * via the query's `enabled` option, not by putting cart state in the key. See
 * ARCHITECTURE.md for conditional fetch rationale.
 */

export const queryKeys = {
  books: {
    all: ['books'] as const,
    /** Match all list queries (any q/author/limit). Use to invalidate lists without touching detail caches. */
    lists: () => ['books', 'list'] as const,
    list: (params: { q?: string; author?: string; limit?: number }) =>
      ['books', 'list', params] as const,
    detail: (id: string | null) => ['books', 'detail', id] as const,
  },
  cart: {
    all: ['cart'] as const,
  },
  discount: (params: { code: string }) =>
    ['discount', params.code.trim().toLowerCase()] as const,
}
