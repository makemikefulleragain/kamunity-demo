// API endpoint for Action detection from text
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase/types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
    
    // Mock action detection for now - replace with actual AI implementation later
    const detectionResults: Array<{
      id: string;
      text: string;
      actionType: string;
      confidence: number;
      priority: string;
      impactLevel: string;
    }> = [
      {
        id: 'mock-action-1',
        text: 'Sample detected action',
        actionType: 'task',
        confidence: 0.8,
        priority: 'medium',
        impactLevel: 'moderate'
      }
    ]
    
    return NextResponse.json({
      success: true,
      data: {
        detectedActions: detectionResults,
        totalDetected: detectionResults.length,
        highConfidenceActions: detectionResults.filter((result: any) => result.confidence >= 0.7)
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
