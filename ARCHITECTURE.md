# Architecture & decisions

*(Expanded in later phases. This section covers re-render isolation as of Phase 4.)*

---

## Re-render isolation (Search vs Cart)

**Requirement:** Typing in the search bar must not trigger a re-render of the Cart component. The book list must not re-render when the user interacts with the Cart.

**Approach:**

- **Search state** lives in a React context (`SearchParamsProvider`) that wraps only the **SearchBar** and **BookList** (and the detail modal). The **Cart** is a **sibling** of that provider, not a child.
- When the user types, only the provider and its children (SearchBar, BookList) re-render. Cart does not subscribe to search state, so it does not re-render.
- When the user interacts with the Cart (e.g. add to cart), the cart query updates and only the Cart component re-renders. The book list does not depend on cart state, so it does not re-render.

**How we verified it:**

- We added a **`useRenderCount(label)`** hook that logs each render to the console (e.g. `[useRenderCount] Cart render #N`). It runs only in **development** (`import.meta.env.DEV`).
- The **Cart** component calls `useRenderCount('Cart')` when `import.meta.env.DEV` is true.
- **What we observed:** With the current layout (Cart outside `SearchParamsProvider`), typing in the search bar does **not** increase the Cart render count. Adding an item to the cart increases the Cart render count (expected). Without this split—e.g. if search state lived in App—every keystroke would re-render App and thus Cart as well; we confirmed that moving Cart outside the provider keeps Cart stable during search input.

**Summary:** Component split (search context wraps only list + search bar; cart is a sibling) plus verification via `useRenderCount('Cart')` in dev.
