// API endpoint for Action promotion from private to public
import { NextRequest, NextResponse } from 'next/server'
import { promotePrivateAction } from '@/lib/actions-operations'

// POST /api/actions/[id]/promote - Promote private action to public visibility
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
    
    if (!body.promotedBy) {
      return NextResponse.json(
        { success: false, error: 'promotedBy field is required' },
        { status: 400 }
      )
    }
    
    const action = await promotePrivateAction(id, body.promotedBy)
    
    return NextResponse.json({
      success: true,
      data: action,
      message: 'Action successfully promoted to public visibility'
    })
    
  } catch (error) {
    console.error('Error in POST /api/actions/[id]/promote:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to promote action' 
      },
      { status: 500 }
    )
  }
}
