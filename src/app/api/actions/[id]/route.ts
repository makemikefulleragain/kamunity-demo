// API endpoints for individual Action operations
import { NextRequest, NextResponse } from 'next/server'
import { 
  getActionById, 
  updateAction, 
  deleteAction,
  getActionActivities 
} from '@/lib/actions-operations'

// GET /api/actions/[id] - Fetch specific action
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Action ID is required' },
        { status: 400 }
      )
    }
    
    const action = await getActionById(id)
    
    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Action not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: action
    })
    
  } catch (error) {
    console.error('Error in GET /api/actions/[id]:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch action' 
      },
      { status: 500 }
    )
  }
}

// PUT /api/actions/[id] - Update specific action
export async function PUT(
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
    
    if (!body.updatedBy) {
      return NextResponse.json(
        { success: false, error: 'updatedBy field is required' },
        { status: 400 }
      )
    }
    
    // Validate enum values if provided
    const validActionTypes = ['task', 'event', 'initiative', 'proposal', 'resource_needed']
    const validImpactLevels = ['individual', 'local', 'community', 'systemic']
    const validSourceTypes = ['chat', 'focus_room', 'club', 'community']
    const validPriorities = ['low', 'medium', 'high', 'urgent']
    const validOwnershipTypes = ['self_assigned', 'leader_assigned', 'community_driven']
    const validDetectionMethods = ['auto', 'manual', 'hybrid']
    
    if (body.actionType && !validActionTypes.includes(body.actionType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid actionType' },
        { status: 400 }
      )
    }
    
    if (body.impactLevel && !validImpactLevels.includes(body.impactLevel)) {
      return NextResponse.json(
        { success: false, error: 'Invalid impactLevel' },
        { status: 400 }
      )
    }
    
    if (body.sourceType && !validSourceTypes.includes(body.sourceType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid sourceType' },
        { status: 400 }
      )
    }
    
    if (body.priority && !validPriorities.includes(body.priority)) {
      return NextResponse.json(
        { success: false, error: 'Invalid priority' },
        { status: 400 }
      )
    }
    
    if (body.ownershipType && !validOwnershipTypes.includes(body.ownershipType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ownershipType' },
        { status: 400 }
      )
    }
    
    if (body.detectionMethod && !validDetectionMethods.includes(body.detectionMethod)) {
      return NextResponse.json(
        { success: false, error: 'Invalid detectionMethod' },
        { status: 400 }
      )
    }
    
    // Parse date fields
    if (body.dueDate) {
      body.dueDate = new Date(body.dueDate)
    }
    
    const updatedBy = body.updatedBy
    delete body.updatedBy // Remove from data to update
    
    const action = await updateAction(id, body, updatedBy)
    
    return NextResponse.json({
      success: true,
      data: action
    })
    
  } catch (error) {
    console.error('Error in PUT /api/actions/[id]:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update action' 
      },
      { status: 500 }
    )
  }
}

// DELETE /api/actions/[id] - Delete specific action
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Action ID is required' },
        { status: 400 }
      )
    }
    
    await deleteAction(id)
    
    return NextResponse.json({
      success: true,
      message: 'Action deleted successfully'
    })
    
  } catch (error) {
    console.error('Error in DELETE /api/actions/[id]:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete action' 
      },
      { status: 500 }
    )
  }
}
