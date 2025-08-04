// API endpoints for Actions CRUD operations
import { NextRequest, NextResponse } from 'next/server'
import { 
  createAction, 
  getActions, 
  getActionStats,
  detectActionsFromText 
} from '@/lib/actions-operations'
import { ActionFilters, ActionSortOptions } from '@/types/actions'

// GET /api/actions - Fetch actions with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse filters
    const filters: ActionFilters = {}
    
    if (searchParams.get('actionType')) {
      filters.actionType = searchParams.get('actionType')!.split(',')
    }
    if (searchParams.get('impactLevel')) {
      filters.impactLevel = searchParams.get('impactLevel')!.split(',')
    }
    if (searchParams.get('sourceType')) {
      filters.sourceType = searchParams.get('sourceType')!.split(',')
    }
    if (searchParams.get('status')) {
      filters.status = searchParams.get('status')!.split(',')
    }
    if (searchParams.get('priority')) {
      filters.priority = searchParams.get('priority')!.split(',')
    }
    if (searchParams.get('isPublic')) {
      filters.isPublic = searchParams.get('isPublic') === 'true'
    }
    if (searchParams.get('assignedToMe')) {
      filters.assignedToMe = searchParams.get('assignedToMe')
    }
    if (searchParams.get('createdByMe')) {
      filters.createdByMe = searchParams.get('createdByMe')
    }
    if (searchParams.get('tags')) {
      filters.tags = searchParams.get('tags')!.split(',')
    }
    if (searchParams.get('searchQuery')) {
      filters.searchQuery = searchParams.get('searchQuery')!
    }
    
    // Parse date filters
    if (searchParams.get('dueDateFrom')) {
      filters.dueDate = { ...filters.dueDate, from: new Date(searchParams.get('dueDateFrom')!) }
    }
    if (searchParams.get('dueDateTo')) {
      filters.dueDate = { ...filters.dueDate, to: new Date(searchParams.get('dueDateTo')!) }
    }
    
    // Parse sort options
    const sort: ActionSortOptions = {
      field: (searchParams.get('sortField') as any) || 'createdAt',
      direction: (searchParams.get('sortDirection') as any) || 'desc'
    }
    
    // Parse pagination
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // Check if requesting stats
    if (searchParams.get('includeStats') === 'true') {
      const [actionsResult, stats] = await Promise.all([
        getActions(filters, sort, limit, offset),
        getActionStats(filters)
      ])
      
      return NextResponse.json({
        success: true,
        data: {
          ...actionsResult,
          stats
        }
      })
    }
    
    const result = await getActions(filters, sort, limit, offset)
    
    return NextResponse.json({
      success: true,
      data: result
    })
    
  } catch (error) {
    console.error('Error in GET /api/actions:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch actions' 
      },
      { status: 500 }
    )
  }
}

// POST /api/actions - Create new action
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = [
      'title', 'description', 'actionType', 'impactLevel', 
      'sourceType', 'status', 'createdBy', 'ownershipType', 'detectionMethod'
    ]
    
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
    
    // Validate enum values
    const validActionTypes = ['task', 'event', 'initiative', 'proposal', 'resource_needed']
    const validImpactLevels = ['individual', 'local', 'community', 'systemic']
    const validSourceTypes = ['chat', 'focus_room', 'club', 'community']
    const validPriorities = ['low', 'medium', 'high', 'urgent']
    const validOwnershipTypes = ['self_assigned', 'leader_assigned', 'community_driven']
    const validDetectionMethods = ['auto', 'manual', 'hybrid']
    
    if (!validActionTypes.includes(body.actionType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid actionType' },
        { status: 400 }
      )
    }
    
    if (!validImpactLevels.includes(body.impactLevel)) {
      return NextResponse.json(
        { success: false, error: 'Invalid impactLevel' },
        { status: 400 }
      )
    }
    
    if (!validSourceTypes.includes(body.sourceType)) {
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
    
    if (!validOwnershipTypes.includes(body.ownershipType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ownershipType' },
        { status: 400 }
      )
    }
    
    if (!validDetectionMethods.includes(body.detectionMethod)) {
      return NextResponse.json(
        { success: false, error: 'Invalid detectionMethod' },
        { status: 400 }
      )
    }
    
    // Parse date fields
    if (body.dueDate) {
      body.dueDate = new Date(body.dueDate)
    }
    
    const action = await createAction(body)
    
    return NextResponse.json({
      success: true,
      data: action
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error in POST /api/actions:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create action' 
      },
      { status: 500 }
    )
  }
}
