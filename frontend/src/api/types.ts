/**
 * All shared types — books, cart, discount, API responses.
 */

// —— Books ——
export interface Book {
  id: string
  title: string
  author: string
  price: number
  stock: number
  description?: string
  favorite?: boolean
}

export interface BookDetail extends Book {
  description: string
  reviews?: Review[]
}

export interface Review {
  id: string
  author: string
  rating: number
  text: string
}

export interface BooksResponse {
  items: Book[]
  nextCursor?: string | null
}

// —— Cart ——
export interface CartItem {
  bookId: string
  title: string
  author: string
  price: number
  quantity: number
}

export interface CartResponse {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

export interface ClearCartResponse {
  cart: CartResponse
}

// —— Discount (metadata only; UI derives discounted total) ——
export interface DiscountResult {
  valid: boolean
  type: 'percent' | 'fixed'
  value: number
  message: string
}
