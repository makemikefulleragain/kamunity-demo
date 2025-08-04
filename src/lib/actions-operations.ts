// Database operations for Actions system
import { PrismaClient } from '@prisma/client'
import { Action, ActionActivity, ActionFilters, ActionSortOptions, ActionDetectionResult } from '@/types/actions'

const prisma = new PrismaClient()

// --- Action CRUD Operations ---

export async function createAction(data: {
  title: string
  description: string
  actionType: string
  impactLevel: string
  sourceType: string
  status: string
  priority?: string
  createdBy: string
  assignedTo?: string[]
  volunteers?: string[]
  ownershipType: string
  isPublic?: boolean
  promotedFromPrivate?: boolean
  sourceId?: string
  sourceMessageId?: string
  detectionMethod: string
  isConfirmed?: boolean
  dueDate?: Date
  estimatedEffort?: string
  requiredSkills?: string[]
  tags?: string[]
  focusRoomId?: string
  statusConfig?: any
}): Promise<Action> {
  try {
    const action = await prisma.action.create({
      data: {
        title: data.title,
        description: data.description,
        actionType: data.actionType,
        impactLevel: data.impactLevel,
        sourceType: data.sourceType,
        status: data.status,
        priority: data.priority || 'medium',
        createdBy: data.createdBy,
        assignedTo: data.assignedTo || [],
        volunteers: data.volunteers || [],
        ownershipType: data.ownershipType,
        isPublic: data.isPublic || false,
        promotedFromPrivate: data.promotedFromPrivate || false,
        sourceId: data.sourceId,
        sourceMessageId: data.sourceMessageId,
        detectionMethod: data.detectionMethod,
        isConfirmed: data.isConfirmed || false,
        dueDate: data.dueDate,
        estimatedEffort: data.estimatedEffort,
        requiredSkills: data.requiredSkills || [],
        tags: data.tags || [],
        focusRoomId: data.focusRoomId,
        statusConfig: data.statusConfig
      },
      include: {
        creator: true,
        activities: {
          include: {
            user: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        focusRoom: true
      }
    })

    // Create initial activity log
    await createActionActivity({
      actionId: action.id,
      userId: data.createdBy,
      activityType: 'created',
      description: `Action "${data.title}" was created`,
      metadata: {
        initialStatus: data.status,
        detectionMethod: data.detectionMethod
      }
    })

    return action as Action
  } catch (error) {
    console.error('Error creating action:', error)
    throw new Error('Failed to create action')
  }
}

export async function getActionById(id: string): Promise<Action | null> {
  try {
    const action = await prisma.action.findUnique({
      where: { id },
      include: {
        creator: true,
        activities: {
          include: {
            user: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        focusRoom: true
      }
    })

    return action as Action | null
  } catch (error) {
    console.error('Error fetching action:', error)
    throw new Error('Failed to fetch action')
  }
}

export async function getActions(
  filters: ActionFilters = {},
  sort: ActionSortOptions = { field: 'createdAt', direction: 'desc' },
  limit: number = 50,
  offset: number = 0
): Promise<{ actions: Action[], total: number }> {
  try {
    const where: any = {}

    // Apply filters
    if (filters.actionType?.length) {
      where.actionType = { in: filters.actionType }
    }
    if (filters.impactLevel?.length) {
      where.impactLevel = { in: filters.impactLevel }
    }
    if (filters.sourceType?.length) {
      where.sourceType = { in: filters.sourceType }
    }
    if (filters.status?.length) {
      where.status = { in: filters.status }
    }
    if (filters.priority?.length) {
      where.priority = { in: filters.priority }
    }
    if (filters.isPublic !== undefined) {
      where.isPublic = filters.isPublic
    }
    if (filters.assignedToMe) {
      where.assignedTo = { has: filters.assignedToMe }
    }
    if (filters.createdByMe) {
      where.createdBy = filters.createdByMe
    }
    if (filters.dueDate?.from || filters.dueDate?.to) {
      where.dueDate = {}
      if (filters.dueDate.from) {
        where.dueDate.gte = filters.dueDate.from
      }
      if (filters.dueDate.to) {
        where.dueDate.lte = filters.dueDate.to
      }
    }
    if (filters.tags?.length) {
      where.tags = { hasSome: filters.tags }
    }
    if (filters.searchQuery) {
      where.OR = [
        { title: { contains: filters.searchQuery, mode: 'insensitive' } },
        { description: { contains: filters.searchQuery, mode: 'insensitive' } }
      ]
    }

    // Build sort order
    const orderBy: any = {}
    orderBy[sort.field] = sort.direction

    const [actions, total] = await Promise.all([
      prisma.action.findMany({
        where,
        include: {
          creator: true,
          activities: {
            include: {
              user: true
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 3 // Latest 3 activities for list view
          },
          focusRoom: true
        },
        orderBy,
        take: limit,
        skip: offset
      }),
      prisma.action.count({ where })
    ])

    return { actions: actions as Action[], total }
  } catch (error) {
    console.error('Error fetching actions:', error)
    throw new Error('Failed to fetch actions')
  }
}

export async function updateAction(
  id: string,
  data: Partial<Action>,
  updatedBy: string
): Promise<Action> {
  try {
    const currentAction = await prisma.action.findUnique({
      where: { id }
    })

    if (!currentAction) {
      throw new Error('Action not found')
    }

    const action = await prisma.action.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        creator: true,
        activities: {
          include: {
            user: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        focusRoom: true
      }
    })

    // Log status changes
    if (data.status && data.status !== currentAction.status) {
      await createActionActivity({
        actionId: id,
        userId: updatedBy,
        activityType: 'status_changed',
        description: `Status changed from "${currentAction.status}" to "${data.status}"`,
        metadata: {
          previousStatus: currentAction.status,
          newStatus: data.status
        }
      })
    }

    // Log assignment changes
    if (data.assignedTo && JSON.stringify(data.assignedTo) !== JSON.stringify(currentAction.assignedTo)) {
      await createActionActivity({
        actionId: id,
        userId: updatedBy,
        activityType: 'assigned',
        description: `Assignment updated`,
        metadata: {
          previousAssignees: currentAction.assignedTo,
          newAssignees: data.assignedTo
        }
      })
    }

    return action as Action
  } catch (error) {
    console.error('Error updating action:', error)
    throw new Error('Failed to update action')
  }
}

export async function deleteAction(id: string): Promise<void> {
  try {
    await prisma.action.delete({
      where: { id }
    })
  } catch (error) {
    console.error('Error deleting action:', error)
    throw new Error('Failed to delete action')
  }
}

// --- Action Activity Operations ---

export async function createActionActivity(data: {
  actionId: string
  userId: string
  activityType: string
  description: string
  metadata?: any
}): Promise<ActionActivity> {
  try {
    const activity = await prisma.actionActivity.create({
      data: {
        actionId: data.actionId,
        userId: data.userId,
        activityType: data.activityType,
        description: data.description,
        metadata: data.metadata
      },
      include: {
        user: true,
        action: true
      }
    })

    return activity as ActionActivity
  } catch (error) {
    console.error('Error creating action activity:', error)
    throw new Error('Failed to create action activity')
  }
}

export async function getActionActivities(
  actionId: string,
  limit: number = 20
): Promise<ActionActivity[]> {
  try {
    const activities = await prisma.actionActivity.findMany({
      where: { actionId },
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    return activities as ActionActivity[]
  } catch (error) {
    console.error('Error fetching action activities:', error)
    throw new Error('Failed to fetch action activities')
  }
}

// --- Action Detection & Promotion ---

export async function detectActionsFromText(
  text: string,
  sourceType: string,
  sourceId: string,
  userId: string
): Promise<ActionDetectionResult[]> {
  // This is a simplified detection algorithm
  // In production, this would use AI/ML for better detection
  
  const detectionResults: ActionDetectionResult[] = []
  
  // Simple keyword-based detection patterns
  const actionPatterns = [
    {
      pattern: /(?:need to|should|must|let's|we should)\s+([^.!?]+)/gi,
      type: 'task',
      confidence: 0.7
    },
    {
      pattern: /(?:meeting|event|gathering|workshop)\s+([^.!?]+)/gi,
      type: 'event',
      confidence: 0.8
    },
    {
      pattern: /(?:propose|suggest|idea)\s+([^.!?]+)/gi,
      type: 'proposal',
      confidence: 0.6
    },
    {
      pattern: /(?:need help|looking for|seeking)\s+([^.!?]+)/gi,
      type: 'resource_needed',
      confidence: 0.8
    }
  ]

  // Date extraction patterns
  const datePatterns = [
    /(?:by|due|deadline)\s+([a-zA-Z]+ \d{1,2})/gi,
    /(?:next|this)\s+(week|month|friday|monday|tuesday|wednesday|thursday|saturday|sunday)/gi
  ]

  // Effort estimation patterns
  const effortPatterns = [
    /(\d+)\s+(hour|hours|day|days|week|weeks)/gi,
    /(quick|fast|simple|complex|difficult)/gi
  ]

  for (const { pattern, type, confidence } of actionPatterns) {
    let match
    while ((match = pattern.exec(text)) !== null) {
      const actionText = match[1].trim()
      
      if (actionText.length > 10) { // Minimum meaningful length
        // Extract due date if mentioned
        let dueDate: Date | undefined
        for (const datePattern of datePatterns) {
          const dateMatch = datePattern.exec(text)
          if (dateMatch) {
            // Simple date parsing - in production would use a proper date parser
            const dateStr = dateMatch[1]
            // This is a placeholder - would implement proper date parsing
            break
          }
        }

        // Extract effort estimation
        let estimatedEffort: string | undefined
        for (const effortPattern of effortPatterns) {
          const effortMatch = effortPattern.exec(text)
          if (effortMatch) {
            estimatedEffort = effortMatch[0]
            break
          }
        }

        // Determine impact level based on context and keywords
        let impactLevel = 'individual'
        if (text.includes('community') || text.includes('everyone') || text.includes('all')) {
          impactLevel = 'community'
        } else if (text.includes('neighborhood') || text.includes('local')) {
          impactLevel = 'local'
        } else if (text.includes('system') || text.includes('policy') || text.includes('government')) {
          impactLevel = 'systemic'
        }

        detectionResults.push({
          confidence,
          suggestedTitle: actionText.length > 50 ? actionText.substring(0, 50) + '...' : actionText,
          suggestedDescription: actionText,
          suggestedType: type,
          suggestedImpactLevel: impactLevel,
          extractedMetadata: {
            dueDate,
            estimatedEffort,
            requiredSkills: [], // Would extract from text analysis
            tags: [] // Would extract from text analysis
          }
        })
      }
    }
  }

  return detectionResults
}

export async function promotePrivateAction(
  actionId: string,
  promotedBy: string
): Promise<Action> {
  try {
    const action = await updateAction(
      actionId,
      {
        isPublic: true,
        promotedFromPrivate: true
      },
      promotedBy
    )

    await createActionActivity({
      actionId,
      userId: promotedBy,
      activityType: 'status_changed',
      description: 'Action promoted to public visibility',
      metadata: {
        promotionType: 'private_to_public'
      }
    })

    return action
  } catch (error) {
    console.error('Error promoting action:', error)
    throw new Error('Failed to promote action')
  }
}

// --- Context-specific queries ---

export async function getActionsBySource(
  sourceType: string,
  sourceId: string,
  includePrivate: boolean = false
): Promise<Action[]> {
  try {
    const where: any = {
      sourceType,
      sourceId
    }

    if (!includePrivate) {
      where.isPublic = true
    }

    const actions = await prisma.action.findMany({
      where,
      include: {
        creator: true,
        activities: {
          include: {
            user: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 3
        },
        focusRoom: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return actions as Action[]
  } catch (error) {
    console.error('Error fetching actions by source:', error)
    throw new Error('Failed to fetch actions by source')
  }
}

export async function getMyActions(
  userId: string,
  includeAssigned: boolean = true,
  includeCreated: boolean = true
): Promise<Action[]> {
  try {
    const conditions: any[] = []

    if (includeCreated) {
      conditions.push({ createdBy: userId })
    }

    if (includeAssigned) {
      conditions.push({ assignedTo: { has: userId } })
    }

    const actions = await prisma.action.findMany({
      where: {
        OR: conditions
      },
      include: {
        creator: true,
        activities: {
          include: {
            user: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 3
        },
        focusRoom: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return actions as Action[]
  } catch (error) {
    console.error('Error fetching user actions:', error)
    throw new Error('Failed to fetch user actions')
  }
}

// --- Analytics and Statistics ---

export async function getActionStats(
  filters: ActionFilters = {}
): Promise<{
  total: number
  byType: Record<string, number>
  byStatus: Record<string, number>
  byImpactLevel: Record<string, number>
  byPriority: Record<string, number>
  completionRate: number
}> {
  try {
    const where: any = {}
    
    // Apply same filters as getActions
    if (filters.sourceType?.length) {
      where.sourceType = { in: filters.sourceType }
    }
    if (filters.isPublic !== undefined) {
      where.isPublic = filters.isPublic
    }

    const [
      total,
      byType,
      byStatus,
      byImpactLevel,
      byPriority,
      completedCount
    ] = await Promise.all([
      prisma.action.count({ where }),
      prisma.action.groupBy({
        by: ['actionType'],
        where,
        _count: { actionType: true }
      }),
      prisma.action.groupBy({
        by: ['status'],
        where,
        _count: { status: true }
      }),
      prisma.action.groupBy({
        by: ['impactLevel'],
        where,
        _count: { impactLevel: true }
      }),
      prisma.action.groupBy({
        by: ['priority'],
        where,
        _count: { priority: true }
      }),
      prisma.action.count({
        where: {
          ...where,
          status: { in: ['completed', 'impact_assessed'] }
        }
      })
    ])

    return {
      total,
      byType: Object.fromEntries(byType.map((item: { actionType: string; _count: { actionType: number } }) => [item.actionType, item._count.actionType])),
      byStatus: Object.fromEntries(byStatus.map((item: { status: string; _count: { status: number } }) => [item.status, item._count.status])),
      byImpactLevel: Object.fromEntries(byImpactLevel.map((item: { impactLevel: string; _count: { impactLevel: number } }) => [item.impactLevel, item._count.impactLevel])),
      byPriority: Object.fromEntries(byPriority.map((item: { priority: string; _count: { priority: number } }) => [item.priority, item._count.priority])),
      completionRate: total > 0 ? (completedCount / total) * 100 : 0
    }
  } catch (error) {
    console.error('Error fetching action stats:', error)
    throw new Error('Failed to fetch action stats')
  }
}
