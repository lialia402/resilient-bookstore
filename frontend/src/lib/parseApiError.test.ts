import { describe, it, expect } from 'vitest'
import { parseApiError } from './parseApiError'

describe('parseApiError', () => {
  it('returns error message for plain Error', () => {
    expect(parseApiError(new Error('Something went wrong'))).toBe('Something went wrong')
  })

  it('extracts .error from JSON message (API 400 body)', () => {
    const body = JSON.stringify({ error: 'Exceeds available stock' })
    expect(parseApiError(new Error(body))).toBe('Exceeds available stock')
  })

  it('returns message as-is when JSON has no error field', () => {
    const body = JSON.stringify({ code: 'INVALID' })
    expect(parseApiError(new Error(body))).toBe(body)
  })

  it('returns message as-is when message is invalid JSON', () => {
    expect(parseApiError(new Error('not json'))).toBe('not json')
  })

  it('returns default message for non-Error (e.g. thrown string)', () => {
    expect(parseApiError('oops')).toBe('Could not add to cart.')
  })

  it('returns default for null/undefined', () => {
    expect(parseApiError(null)).toBe('Could not add to cart.')
    expect(parseApiError(undefined)).toBe('Could not add to cart.')
  })
})
