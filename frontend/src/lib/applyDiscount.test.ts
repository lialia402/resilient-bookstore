import { describe, it, expect } from 'vitest'
import { applyDiscount } from './applyDiscount'
import type { DiscountResult } from '../api/types'

describe('applyDiscount', () => {
  it('returns totalPrice when discount is undefined', () => {
    expect(applyDiscount(100, undefined)).toBe(100)
  })

  it('returns totalPrice when discount.valid is false', () => {
    const discount: DiscountResult = {
      valid: false,
      type: 'percent',
      value: 10,
      message: 'Invalid',
    }
    expect(applyDiscount(100, discount)).toBe(100)
  })

  it('applies percent discount correctly', () => {
    const discount: DiscountResult = {
      valid: true,
      type: 'percent',
      value: 20,
      message: '20% off',
    }
    expect(applyDiscount(100, discount)).toBe(80)
  })

  it('applies fixed discount correctly', () => {
    const discount: DiscountResult = {
      valid: true,
      type: 'fixed',
      value: 15,
      message: '$15 off',
    }
    expect(applyDiscount(100, discount)).toBe(85)
  })

  it('does not return negative for fixed discount exceeding total', () => {
    const discount: DiscountResult = {
      valid: true,
      type: 'fixed',
      value: 50,
      message: '$50 off',
    }
    expect(applyDiscount(30, discount)).toBe(0)
  })
})
