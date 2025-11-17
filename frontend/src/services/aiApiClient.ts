/**
 * AI API Client for Forecast Data
 * 
 * This client fetches forecast data from our mock API endpoints.
 * In production, this would connect to the real AI/ML service.
 */

import { ForecastData } from '@/types'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ''

/**
 * Fetch forecast for a specific factory
 * 
 * TODO: Replace with real AI API endpoint when integrating with ML service
 */
export async function getForecast(factoryId: string): Promise<ForecastData> {
  try {
    const response = await fetch(`${API_BASE}/forecast/${factoryId}`, {
      cache: 'no-store', // Always fetch fresh data
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch forecast: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching forecast:', error)
    throw error
  }
}

/**
 * Fetch forecasts for all factories
 */
export async function getAllForecasts(): Promise<ForecastData[]> {
  try {
    const response = await fetch(`${API_BASE}/forecast/all`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch forecasts: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching all forecasts:', error)
    throw error
  }
}

/**
 * Toggle breach status for testing (dev only)
 */
export async function toggleBreachStatus(factoryId: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/forecast/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ factoryId }),
    })
  } catch (error) {
    console.error('Error toggling breach status:', error)
    throw error
  }
}
