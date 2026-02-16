interface ErrorBannerProps {
  message: string
  onDismiss: () => void
  className?: string
}

export const ErrorBanner = ({ message, onDismiss, className = 'app__error' }: ErrorBannerProps) => (
  <div className={className} role="alert">
    {message}
    <button type="button" onClick={onDismiss}>
      Dismiss
    </button>
  </div>
)
