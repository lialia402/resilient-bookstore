import { useRef, useEffect } from 'react'

/**
 * Logs render count for a component (dev only).
 * Useful for verifying render isolation and tracking unexpected re-renders.
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
