import type { DiscountResult } from '../api/types'

export function applyDiscount(
  totalPrice: number,
  discount: DiscountResult | undefined
): number {
  if (!discount?.valid) return totalPrice
  if (discount.type === 'percent') return totalPrice * (1 - discount.value / 100)
  return Math.max(0, totalPrice - discount.value)
}
