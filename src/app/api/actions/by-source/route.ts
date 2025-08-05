// API endpoint for fetching actions by source context
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase/types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/actions/by-source - Fetch actions by source context
export async function GET(request: NextRequest) {
  try {
    // Use searchParams directly from NextRequest to avoid dynamic server usage
    const { searchParams } = request.nextUrl
    
    const sourceType = searchParams.get('sourceType')
    const sourceId = searchParams.get('sourceId')
    const userId = searchParams.get('userId')
    const includePrivate = searchParams.get('includePrivate') === 'true'
    
    // Handle "my actions" request
    if (searchParams.get('my') === 'true' && userId) {
      const includeAssigned = searchParams.get('includeAssigned') !== 'false'
      const includeCreated = searchParams.get('includeCreated') !== 'false'
      
      // Mock implementation - replace with actual Supabase query later
      const actions: any[] = []
      
      return NextResponse.json({
        success: true,
        data: actions
      })
    }
    
    // Handle source-specific request
    if (!sourceType || !sourceId) {
      return NextResponse.json(
        { success: false, error: 'sourceType and sourceId are required' },
        { status: 400 }
      )
    }
    
    // Validate source type
    const validSourceTypes = ['chat', 'focus_room', 'club', 'community']
    if (!validSourceTypes.includes(sourceType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid sourceType' },
        { status: 400 }
      )
    }
    
    // Mock implementation - replace with actual Supabase query later
    const actions: any[] = []
    
    return NextResponse.json({
      success: true,
      data: actions
    })
    
  } catch (error) {
    console.error('Error in GET /api/actions/by-source:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch actions by source' 
      },
      { status: 500 }
    )
  }
}
