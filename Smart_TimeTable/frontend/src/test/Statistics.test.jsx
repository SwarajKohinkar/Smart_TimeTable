import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import Statistics from '../pages/Statistics'

// Mock API calls
vi.mock('../services/api', () => ({
  divisionsAPI: { getAll: vi.fn().mockResolvedValue({ data: [] }) },
  teachersAPI: { getAll: vi.fn().mockResolvedValue({ data: [] }) },
  subjectsAPI: { getAll: vi.fn().mockResolvedValue({ data: [] }) },
  timetableAPI: { 
    getTeacherWorkload: vi.fn().mockResolvedValue({ data: [] }),
    getVersions: vi.fn().mockResolvedValue({ data: [] })
  },
  exportAPI: {
    allExcel: vi.fn().mockResolvedValue({ data: new Blob() })
  }
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Statistics Page', () => {
  it('renders statistics heading', () => {
    renderWithRouter(<Statistics />)
    expect(screen.getByText('Statistics Dashboard')).toBeInTheDocument()
  })

  it('renders overview tab', () => {
    renderWithRouter(<Statistics />)
    expect(screen.getByText('Overview')).toBeInTheDocument()
  })

  it('renders workload tab', () => {
    renderWithRouter(<Statistics />)
    expect(screen.getByText('Workload')).toBeInTheDocument()
  })

  it('renders subjects tab', () => {
    renderWithRouter(<Statistics />)
    expect(screen.getByText('Subjects')).toBeInTheDocument()
  })

  it('renders export tab', () => {
    renderWithRouter(<Statistics />)
    expect(screen.getByText('Export')).toBeInTheDocument()
  })
})
