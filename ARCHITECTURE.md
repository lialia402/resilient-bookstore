# Architecture & decisions

This document covers cache strategy, optimistic flows, re-render prevention, conditional fetching, query key design, cart stock enforcement, and the definition of "currently visible" for the inventory value widget.

---

## Cache strategy (staleTime / gcTime)

- **staleTime:** 5 minutes (default for all queries). Data is considered fresh for 5 minutes; no background refetch during that window when the query is used.
- **gcTime:** 10 minutes. Unused cache entries are kept in memory for 10 minutes before being garbage-collected.
- Rationale: Reduces redundant refetches during normal browsing while keeping memory bounded. List and detail views benefit from the same cache; prefetch on hover fills the detail cache so opening the modal often shows data without a loading state.
- **What if staleTime were 0?** Every time a component mounts or a window refocuses, TanStack Query would refetch. During infinite scroll, switching tabs and back would trigger refetches on every loaded page. Search results would refetch on every debounce cycle even if the user typed the same term. The app would still work, but it would create unnecessary network traffic and cause brief loading flickers.
- **What if staleTime were Infinity?** Data would never be considered stale, so no automatic background refetches would occur. After a favorite toggle or cart action, `invalidateQueries` still forces a refetch (we call it explicitly in `onSettled`). But if the data changed on the server for other reasons (e.g. stock updated by another user), the client would never pick it up until a hard refresh. For a single-user demo this is fine, but in production it would lead to stale data.
- **What if gcTime were 0?** Inactive cache entries would be garbage-collected immediately. Navigating away from the book list (or closing the modal) and coming back would always trigger a fresh fetch with a loading spinner, defeating prefetch on hover. The user would see loading states constantly.
- **What if gcTime were Infinity?** Cache entries would never be garbage-collected. In a long-running session with many searches and page loads, memory usage would grow without bound. Acceptable for a short demo, problematic for production.

---

## Query key design

All keys are defined in **`frontend/src/queryKeys.ts`**. No ad-hoc keys elsewhere.

- **Books**
  - `books.all` -- prefix for all book-related data.
  - `books.lists()` -- matches every list query (any `q`/`limit`). Used to invalidate all lists without touching detail caches (e.g. after optimistic favorite rollback).
  - `books.list({ q, limit })` -- one cache entry per search + pagination state. Deep equality on params.
  - `books.detail(id)` -- one entry per book; `id` can be `null` when no book is selected (query disabled).
- **Cart**
  - `cart.all` -- single key; cart is one resource. Mutations (add, clear) set or invalidate this key.
- **Discount**
  - `discount({ code })` -- code is normalized (trim + lower) so "SAVE10" and " save10 " share the same key. Validation runs only when `enabled` is true (cart has items and code is non-empty); the key does not include cart state.

---

## Optimistic favorite flow

**Success path:** User clicks heart -> `onMutate` runs -> we cancel in-flight list/detail queries, snapshot previous cache, then optimistically flip `favorite` in all list pages and in the detail cache for that book. We return `{ previousLists, previousDetail }`. The mutation request runs; on success we do nothing extra (UI already correct). `onSettled` invalidates list and detail so cache stays in sync with the server.

**Failure path (e.g. 20% simulated backend failure):** `onError` runs with the same `context`. We restore every list entry from `previousLists` and the detail entry from `previousDetail`. The UI reverts to the previous state. A brief error message is shown with a Dismiss button that calls `reset()`.

**Rollback data:** We use `queryClient.getQueriesData` / `getQueryData` in `onMutate` and `queryClient.setQueryData` / set per-key in `onError`. No single "global" snapshot; we only snapshot the keys we mutated (lists + one detail).

---

## Re-render prevention (Search vs Cart)

**Requirement:** Typing in the search bar must not re-render the Cart. The book list must not re-render when the user interacts with the Cart.

**Approach:**

- **Search state** lives in `SearchParamsProvider`, which wraps only **SearchBar** and **BookList** (and the detail modal). The **Cart** is a **sibling** of that provider in the tree, not a child.
- Typing updates local state in SearchBar first (debounced before updating context). So only SearchBar re-renders on keystroke. When the debounced value is written to context, BookListSection and BookList re-render with the new query; Cart still does not subscribe to that context.
- Cart actions update the cart query; only Cart (and any component that uses that query) re-renders. The list does not depend on cart state.

**Verification:**

- We use a **`useRenderCount('Cart')`** hook that logs each render to the console (e.g. `[useRenderCount] Cart render #N`). It runs only in **development** (`import.meta.env.DEV`). The Cart component calls it.
- **Observed:** With Cart outside `SearchParamsProvider`, typing in the search bar does **not** increase the Cart render count. Adding an item to the cart does (expected). If search state lived in App and Cart were a child of App, every keystroke would re-render App and thus Cart; we verified that the current split keeps Cart stable during search.

---

## Conditional discount fetch

- The discount **input** is always visible and editable (even when the cart is empty).
- The **validation request** runs only when **both** are true: cart has at least one item **and** the user has entered a non-empty code (after trim).
- Implementation: `useQuery` with `enabled: (data?.totalItems ?? 0) >= 1 && normalizedCode.length > 0`. The discount query key is code-only (normalized). When the user types a code with an empty cart, `enabled` is false, so no request fires. When they add the first item, the cart query updates, `enabled` becomes true for the existing code, and the discount query runs automatically (auto-validate).
- **Query state before conditions are met:** When `enabled` is `false`, the query is in the **`pending`** status with `fetchStatus: 'idle'`. This means TanStack Query has created the query observer but has never executed the `queryFn`. There is no data, no error, and no network request. The query sits dormant until `enabled` flips to `true`, at which point it transitions to `fetchStatus: 'fetching'` and fires the request. In the Cart component, we simply check `discount && ...` before rendering the discount message, so the `pending`/`idle` state produces no visual output.
- The UI **derives** the discounted total from `cart.totalPrice` and the discount metadata (percent or fixed); no adjusted price is returned from the backend.

---

## Cart stock enforcement

Users must not add more of a book to the cart than its available **stock**. The backend is the source of truth; the frontend provides targeted UX in the detail modal without breaking re-render isolation.

**Backend (source of truth)**

- `add_to_cart(book_id, quantity)` (in `backend/data_store.py`) returns `None` on success, or an error string on failure.
- Before changing the cart, it computes: `current_qty` = sum of quantities for that `book_id` in the cart; `stock` = the book's `stock` field. If `current_qty + quantity > stock`, it returns `"Exceeds available stock"` and **does not modify the cart**. For invalid `book_id` or `quantity <= 0` it returns `"Book not found or invalid quantity"`.
- The `POST /cart/items` handler returns `400` with `{"error": "<message>"}` when `add_to_cart` returns an error.

**Frontend**

- **Book list (BookCard):** The "Add to cart" button is always enabled. We intentionally do **not** subscribe to the cart query in the list tree (BookListSection, BookList, BookCard), because doing so would cause the entire list to re-render on every cart action -- breaking the re-render isolation requirement. Instead, we rely on the backend to reject over-stock, and the error is surfaced in a toast (the backend message is parsed from the JSON response and displayed with a Dismiss button).
- **Detail modal (DetailModal):** The modal subscribes to the cart query directly (with `enabled: !!bookId` so it only fetches when the modal is open). It computes `quantityInCart` for the selected book and disables the "Add to cart" button when `quantityInCart >= book.stock`, showing "Max in cart". This is safe because the modal is an overlay, not part of the list render tree -- cart updates re-render only the modal, not the list.

**Trade-off:** We chose to keep the list free of cart subscriptions to maintain re-render isolation, accepting that the list "Add to cart" button cannot disable at max stock. The backend enforces the limit, and the detail modal (where users see full book info) does disable the button. This is a deliberate trade-off between UX polish and the performance constraint.

---

## Prefetch on hover

- Hovering on a book card for **500 ms** triggers a prefetch of that book's detail via `queryClient.prefetchQuery` with the same key and `queryFn` as `useBookDetail`.
- When the user opens the modal, the detail is often already in cache, so no loading spinner. Implemented in `usePrefetchBookDetail`; BookCard uses a timer ref and clears it on mouse leave.

---

## "Currently visible" (inventory value)

- The **inventory value** widget shows the sum of `price * stock` for **currently visible books**.
- **Definition:** "Currently visible" = **all items from all loaded pages** of the infinite list for the current search. It is **not** viewport-only (we do not measure which cards are in the viewport). As the user scrolls and more pages load, the set of "visible" books grows; the sum is recomputed from the same list query cache (`useInfiniteBooks` with the same `q` as the list). No extra API call; we use `data.pages.flatMap(p => p.items)` and reduce to `sum(price * stock)`.
- The **InventoryValue** component uses the same `useInfiniteBooks({ q: query })` as the BookList, so it reads the same cache and stays in sync with what's loaded.
