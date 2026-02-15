/**
 * Cart: get, add, clear. Discount code validation (conditional).
 * Clear is POST /cart/clear returning cart shape for easy optimistic rollback.
 */
import { apiGet, apiPost } from './client'
import type { CartResponse, ClearCartResponse, DiscountResult } from './types'

export function fetchCart(): Promise<CartResponse> {
  return apiGet<CartResponse>('/cart')
}

export function addToCart(bookId: string, quantity?: number): Promise<CartResponse> {
  return apiPost<CartResponse>('/cart/items', { bookId, quantity: quantity ?? 1 })
}

export function clearCart(): Promise<ClearCartResponse> {
  return apiPost<ClearCartResponse>('/cart/clear')
}

export function validateDiscount(code: string): Promise<DiscountResult> {
  return apiPost<DiscountResult>('/cart/discount', { code })
}
