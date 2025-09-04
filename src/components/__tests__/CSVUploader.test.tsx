import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import CSVUploader from '../CSVUploader'

describe('CSVUploader', () => {
  const mockOnLoad = vi.fn()

  beforeEach(() => {
    mockOnLoad.mockClear()
  })

  it('renders upload interface correctly', () => {
    render(<CSVUploader onLoad={mockOnLoad} />)

    expect(screen.getByText('Upload CSV File')).toBeInTheDocument()
    expect(screen.getByText('Import your games list to start processing covers')).toBeInTheDocument()
    expect(screen.getByText('Click to upload')).toBeInTheDocument()
  })

  it('shows error for invalid file type', async () => {
    render(<CSVUploader onLoad={mockOnLoad} />)

    const fileInput = screen.getByTestId('file-upload') as HTMLInputElement
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' })

    fireEvent.change(fileInput, { target: { files: [invalidFile] } })

    await waitFor(() => {
      expect(screen.getByText('Please select a CSV file')).toBeInTheDocument()
    })
  })

  it('processes valid CSV file correctly', async () => {
    render(<CSVUploader onLoad={mockOnLoad} />)

    const csvContent = 'Nombre,Portada,Año\nGame1,http://example.com/image1.jpg,2023\nGame2,http://example.com/image2.jpg,2024'
    const csvFile = new File([csvContent], 'games.csv', { type: 'text/csv' })

    const fileInput = screen.getByDisplayValue('') as HTMLInputElement
    await userEvent.upload(fileInput, csvFile)

    await waitFor(() => {
      expect(mockOnLoad).toHaveBeenCalledWith([
        expect.objectContaining({
          name: 'Game1',
          portada: 'http://example.com/image1.jpg',
          año: '2023'
        }),
        expect.objectContaining({
          name: 'Game2',
          portada: 'http://example.com/image2.jpg',
          año: '2024'
        })
      ])
    })
  })

  it('shows CSV requirements information', () => {
    render(<CSVUploader onLoad={mockOnLoad} />)

    expect(screen.getByText('CSV Requirements:')).toBeInTheDocument()
    expect(screen.getByText(/Must contain a "Nombre" column/)).toBeInTheDocument()
    expect(screen.getByText('Nombre,Nuevo Nombre,Portada,Año,Descripción')).toBeInTheDocument()
  })
})
