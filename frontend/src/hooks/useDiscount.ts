import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'
import { validateDiscount } from '../api/cart'

/**
 * Validates a discount code. Only runs when enabled (e.g. cart has items and code is non-empty).
 */
export function useDiscount(normalizedCode: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.discount({ code: normalizedCode }),
    queryFn: () => validateDiscount(normalizedCode),
    enabled: enabled && normalizedCode.length > 0,
  })
}
