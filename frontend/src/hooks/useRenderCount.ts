import { useRef, useEffect } from 'react'

/**
 * Logs render count for a component (dev only). Use to verify re-render isolation
 * (e.g. Cart should not re-render when user types in Search). See ARCHITECTURE.md.
 */
export const useRenderCount = (label: string) => {
  const count = useRef(0)
  count.current += 1

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log(`[useRenderCount] ${label} render #${count.current}`)
    }
  })
}
