import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBanner } from './ErrorBanner'

describe('ErrorBanner', () => {
  it('renders message and has role="alert"', () => {
    render(<ErrorBanner message="Something failed" onDismiss={() => {}} />)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Something failed')
    expect(alert).toHaveClass('app__error')
  })

  it('uses custom className when provided', () => {
    render(
      <ErrorBanner message="Oops" onDismiss={() => {}} className="cart__error" />
    )
    expect(screen.getByRole('alert')).toHaveClass('cart__error')
  })

  it('calls onDismiss when Dismiss is clicked', async () => {
    const onDismiss = vi.fn()
    render(<ErrorBanner message="Error" onDismiss={onDismiss} />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})
