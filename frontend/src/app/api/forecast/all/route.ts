import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/forecast/all
 * Returns forecasts for all factories
 */
export async function GET() {
  const factories = ['Bhilai-001', 'Mumbai-002', 'Delhi-003', 'Chennai-004', 'Kolkata-005']
  
  const forecasts = factories.map((factoryId) => ({
    factory_id: factoryId,
    forecast_breach: factoryId === 'Bhilai-001' || factoryId === 'Kolkata-005',
    confidence: 0.85 + Math.random() * 0.1,
    predicted_aqi: Math.floor(Math.random() * 200) + 30,
    timestamp: new Date().toISOString(),
    next_check: new Date(Date.now() + 10000).toISOString(),
  }))

  return NextResponse.json(forecasts)
}
