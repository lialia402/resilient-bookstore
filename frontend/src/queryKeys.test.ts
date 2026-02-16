import { describe, it, expect } from 'vitest'
import { queryKeys } from './queryKeys'

describe('queryKeys', () => {
  it('books.all is prefix', () => {
    expect(queryKeys.books.all).toEqual(['books'])
  })

  it('books.lists() matches all list queries', () => {
    expect(queryKeys.books.lists()).toEqual(['books', 'list'])
  })

  it('books.list includes params for cache separation', () => {
    expect(queryKeys.books.list({ q: 'foo', limit: 20 })).toEqual([
      'books',
      'list',
      { q: 'foo', limit: 20 },
    ])
    expect(queryKeys.books.list({})).toEqual(['books', 'list', {}])
  })

  it('books.detail(id) includes id', () => {
    expect(queryKeys.books.detail('abc')).toEqual(['books', 'detail', 'abc'])
    expect(queryKeys.books.detail(null)).toEqual(['books', 'detail', null])
  })

  it('cart.all is single key', () => {
    expect(queryKeys.cart.all).toEqual(['cart'])
  })

  it('discount normalizes code (trim + lower)', () => {
    expect(queryKeys.discount({ code: 'SAVE10' })).toEqual(['discount', 'save10'])
    expect(queryKeys.discount({ code: '  save10  ' })).toEqual(['discount', 'save10'])
  })
})
