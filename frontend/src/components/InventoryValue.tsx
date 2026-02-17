import { useInfiniteBooks } from '../hooks/useInfiniteBooks'
import { formatPrice } from '../lib/formatPrice'
import { flattenPages } from '../lib/flattenPages'

/**
 * Total inventory value for "currently visible" books: all items from all loaded
 * pages in the infinite list (same query/cache as the list). No extra API call.
 * See ARCHITECTURE.md for the definition of "currently visible".
 */
export const InventoryValue = ({ query }: { query?: string }) => {
  const { data, status } = useInfiniteBooks({ q: query })

  const books = flattenPages(data)

  if (status !== 'success' || !books.length) return null
  const total = books.reduce((sum, b) => sum + b.price * b.stock, 0)

  return (
    <p className="inventory-value">
      Inventory value (loaded): {formatPrice(total)} ({books.length} books)
    </p>
  )
}
