import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ErrorBoundary from '../components/ErrorBoundary'

// Component that throws an error
const ThrowError = () => {
  throw new Error('Test error')
}

describe('ErrorBoundary', () => {
  // Suppress console.error for cleaner test output
  vi.spyOn(console, 'error').mockImplementation(() => {})

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>
    )
    expect(screen.getByText('Normal content')).toBeInTheDocument()
  })

  it('renders error UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('renders reload button on error', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    expect(screen.getByText('Reload Page')).toBeInTheDocument()
  })

  it('renders go home button on error', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    expect(screen.getByText('Go Home')).toBeInTheDocument()
  })
})
