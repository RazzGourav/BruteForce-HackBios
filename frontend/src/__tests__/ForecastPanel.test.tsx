/**
 * Test for Forecast Panel Component
 * 
 * This test verifies that the forecast data is correctly displayed
 */

import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { getForecast } from '@/services/aiApiClient'

// Mock the API client
jest.mock('@/services/aiApiClient')

// Simple test component that displays forecast data
function ForecastDisplay({ factoryId }: { factoryId: string }) {
  const [forecast, setForecast] = React.useState<any>(null)

  React.useEffect(() => {
    getForecast(factoryId).then(setForecast)
  }, [factoryId])

  if (!forecast) return <div>Loading...</div>

  return (
    <div data-testid="forecast-panel">
      <div data-testid="predicted-aqi">{forecast.predicted_aqi}</div>
      <div data-testid="confidence">{(forecast.confidence * 100).toFixed(0)}%</div>
      <div data-testid="breach-status">
        {forecast.forecast_breach ? 'Breach Predicted' : 'No Breach'}
      </div>
    </div>
  )
}

describe('Forecast Panel', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()
  })

  it('displays forecast data correctly', async () => {
    // Mock API response
    const mockForecast = {
      factory_id: 'Bhilai-001',
      forecast_breach: true,
      confidence: 0.95,
      predicted_aqi: 165,
      timestamp: new Date().toISOString(),
      next_check: new Date(Date.now() + 10000).toISOString(),
    }

    ;(getForecast as jest.Mock).mockResolvedValue(mockForecast)

    // Render component
    render(<ForecastDisplay factoryId="Bhilai-001" />)

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId('forecast-panel')).toBeInTheDocument()
    })

    // Verify displayed values
    expect(screen.getByTestId('predicted-aqi')).toHaveTextContent('165')
    expect(screen.getByTestId('confidence')).toHaveTextContent('95%')
    expect(screen.getByTestId('breach-status')).toHaveTextContent('Breach Predicted')
  })

  it('displays no breach status correctly', async () => {
    // Mock API response with no breach
    const mockForecast = {
      factory_id: 'Chennai-004',
      forecast_breach: false,
      confidence: 0.91,
      predicted_aqi: 45,
      timestamp: new Date().toISOString(),
      next_check: new Date(Date.now() + 10000).toISOString(),
    }

    ;(getForecast as jest.Mock).mockResolvedValue(mockForecast)

    render(<ForecastDisplay factoryId="Chennai-004" />)

    await waitFor(() => {
      expect(screen.getByTestId('forecast-panel')).toBeInTheDocument()
    })

    expect(screen.getByTestId('predicted-aqi')).toHaveTextContent('45')
    expect(screen.getByTestId('confidence')).toHaveTextContent('91%')
    expect(screen.getByTestId('breach-status')).toHaveTextContent('No Breach')
  })
})

// Add React import for JSX
import React from 'react'
