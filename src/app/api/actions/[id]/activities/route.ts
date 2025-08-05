// API endpoints for Action activities
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase/types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/actions/[id]/activities - Fetch action activities
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Action ID is required' },
        { status: 400 }
      )
    }
    
    const limit = parseInt(searchParams.get('limit') || '20')
    const activities = await getActionActivities(id, limit)
    
    return NextResponse.json({
      success: true,
      data: activities
    })
    
  } catch (error) {
    console.error('Error in GET /api/actions/[id]/activities:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch action activities' 
      },
      { status: 500 }
    )
  }
}

// POST /api/actions/[id]/activities - Create new action activity
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Action ID is required' },
        { status: 400 }
      )
    }
    
    // Validate required fields
    const requiredFields = ['userId', 'activityType', 'description']
    
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
    
    // Validate activity type
    const validActivityTypes = ['created', 'assigned', 'status_changed', 'commented', 'completed']
    if (!validActivityTypes.includes(body.activityType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid activityType' },
        { status: 400 }
      )
    }
    
    const activity = await createActionActivity({
      actionId: id,
      userId: body.userId,
      activityType: body.activityType,
      description: body.description,
      metadata: body.metadata
    })
    
    return NextResponse.json({
      success: true,
      data: activity
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error in POST /api/actions/[id]/activities:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create action activity' 
      },
      { status: 500 }
    )
  }
}
