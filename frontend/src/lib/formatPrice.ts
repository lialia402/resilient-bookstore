/**
 * Format a number as USD with 2 decimal places (e.g. "$12.99").
 */
export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`
}
