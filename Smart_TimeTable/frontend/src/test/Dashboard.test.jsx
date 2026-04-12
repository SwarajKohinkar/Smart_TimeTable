import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Dashboard', () => {
  it('renders dashboard heading', () => {
    renderWithRouter(<Dashboard />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders input data card', () => {
    renderWithRouter(<Dashboard />)
    expect(screen.getByText('Input Data')).toBeInTheDocument()
  })

  it('renders generate timetable card', () => {
    renderWithRouter(<Dashboard />)
    expect(screen.getByText('Generate Timetable')).toBeInTheDocument()
  })

  it('renders statistics card', () => {
    renderWithRouter(<Dashboard />)
    expect(screen.getByText('Statistics')).toBeInTheDocument()
  })

  it('renders getting started section', () => {
    renderWithRouter(<Dashboard />)
    expect(screen.getByText('Getting Started')).toBeInTheDocument()
  })

  it('renders quick tip section', () => {
    renderWithRouter(<Dashboard />)
    expect(screen.getByText('Quick Tip')).toBeInTheDocument()
  })
})
