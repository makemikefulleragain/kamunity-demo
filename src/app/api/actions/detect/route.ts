// API endpoint for Action detection from text
import { NextRequest, NextResponse } from 'next/server'
import { detectActionsFromText } from '@/lib/actions-operations'

// POST /api/actions/detect - Detect potential actions from text
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['text', 'sourceType', 'sourceId', 'userId']
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Missing required field: ${field}` 
          },
          { status: 400 }
        )
      }
    }
    
    // Validate source type
    const validSourceTypes = ['chat', 'focus_room', 'club', 'community']
    if (!validSourceTypes.includes(body.sourceType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid sourceType' },
        { status: 400 }
      )
    }
    
    // Validate text length
    if (body.text.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Text must be at least 10 characters long' },
        { status: 400 }
      )
    }
    
    if (body.text.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Text must be less than 5000 characters' },
        { status: 400 }
      )
    }
    
    const detectionResults = await detectActionsFromText(
      body.text,
      body.sourceType,
      body.sourceId,
      body.userId
    )
    
    return NextResponse.json({
      success: true,
      data: {
        detectedActions: detectionResults,
        totalDetected: detectionResults.length,
        highConfidenceActions: detectionResults.filter(result => result.confidence >= 0.7)
      }
    })
    
  } catch (error) {
    console.error('Error in POST /api/actions/detect:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to detect actions' 
      },
      { status: 500 }
    )
  }
}
