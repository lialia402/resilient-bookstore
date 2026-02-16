/**
 * Parse a user-facing message from an API error (e.g. 400 body `{"error": "..."}`).
 * Used when the API client throws `new Error(responseText)`.
 */
export function parseApiError(error: unknown): string {
  const msg = error instanceof Error ? error.message : 'Could not add to cart.'
  try {
    const j = JSON.parse(msg) as { error?: string }
    if (typeof j?.error === 'string') return j.error
  } catch {
    /* use msg as-is */
  }
  return msg
}
