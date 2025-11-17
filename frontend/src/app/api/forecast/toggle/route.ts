import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory toggle state
const toggleState: Record<string, boolean> = {}

/**
 * POST /api/forecast/toggle
 * Toggle breach status for testing (dev only)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { factoryId } = body

    if (!factoryId) {
      return NextResponse.json(
        { error: 'factoryId required' },
        { status: 400 }
      )
    }

    // Toggle the breach status
    toggleState[factoryId] = !toggleState[factoryId]

    return NextResponse.json({
      success: true,
      factoryId,
      breachEnabled: toggleState[factoryId],
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
