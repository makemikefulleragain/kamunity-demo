// TypeScript interfaces for Actions system

export interface Action {
  id: string
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
  
  // Categorization (multi-layered)
  actionType: 'task' | 'event' | 'initiative' | 'proposal' | 'resource_needed'
  impactLevel: 'individual' | 'local' | 'community' | 'systemic'
  sourceType: 'chat' | 'focus_room' | 'club' | 'community'
  
  // Status & Workflow (custom per context)
  status: string
  statusConfig?: StatusConfig
  priority: 'low' | 'medium' | 'high' | 'urgent'
  
  // Ownership & Assignment (hybrid)
  createdBy: string
  assignedTo: string[]
  volunteers: string[]
  ownershipType: 'self_assigned' | 'leader_assigned' | 'community_driven'
  
  // Privacy & Visibility
  isPublic: boolean
  promotedFromPrivate: boolean
  
  // Source Context
  sourceId?: string
  sourceMessageId?: string
  
  // Detection & Confirmation (hybrid)
  detectionMethod: 'auto' | 'manual' | 'hybrid'
  isConfirmed: boolean
  
  // Metadata
  dueDate?: Date
  estimatedEffort?: string
  requiredSkills: string[]
  tags: string[]
  
  // Relationships
  creator?: User
  activities?: ActionActivity[]
  focusRoom?: FocusRoom
  focusRoomId?: string
}

export interface ActionActivity {
  id: string
  actionId: string
  userId: string
  activityType: 'created' | 'assigned' | 'status_changed' | 'commented' | 'completed'
  description: string
  metadata?: Record<string, any>
  createdAt: Date
  
  // Relationships
  action?: Action
  user?: User
}

export interface StatusConfig {
  workflow: StatusWorkflow[]
  allowedTransitions: Record<string, string[]>
  defaultStatus: string
  finalStatuses: string[]
}

export interface StatusWorkflow {
  status: string
  label: string
  description?: string
  color: string
  icon?: string
}

// Pre-defined status workflows by context
export const STATUS_WORKFLOWS = {
  chat: {
    workflow: [
      { status: 'proposed', label: 'Proposed', color: 'blue', icon: '💡' },
      { status: 'active', label: 'Active', color: 'green', icon: '🎯' },
      { status: 'completed', label: 'Completed', color: 'gray', icon: '✅' }
    ],
    allowedTransitions: {
      'proposed': ['active', 'completed'],
      'active': ['completed'],
      'completed': []
    },
    defaultStatus: 'proposed',
    finalStatuses: ['completed']
  },
  focus_room: {
    workflow: [
      { status: 'proposed', label: 'Proposed', color: 'blue', icon: '💡' },
      { status: 'planning', label: 'Planning', color: 'yellow', icon: '📋' },
      { status: 'active', label: 'Active', color: 'green', icon: '🎯' },
      { status: 'in_progress', label: 'In Progress', color: 'orange', icon: '⚡' },
      { status: 'completed', label: 'Completed', color: 'gray', icon: '✅' }
    ],
    allowedTransitions: {
      'proposed': ['planning', 'active'],
      'planning': ['active', 'proposed'],
      'active': ['in_progress', 'completed'],
      'in_progress': ['completed', 'active'],
      'completed': []
    },
    defaultStatus: 'proposed',
    finalStatuses: ['completed']
  },
  club: {
    workflow: [
      { status: 'proposed', label: 'Proposed', color: 'blue', icon: '💡' },
      { status: 'review', label: 'Under Review', color: 'purple', icon: '👀' },
      { status: 'approved', label: 'Approved', color: 'green', icon: '👍' },
      { status: 'active', label: 'Active', color: 'orange', icon: '🎯' },
      { status: 'completed', label: 'Completed', color: 'gray', icon: '✅' },
      { status: 'archived', label: 'Archived', color: 'gray', icon: '📦' }
    ],
    allowedTransitions: {
      'proposed': ['review', 'approved'],
      'review': ['approved', 'proposed'],
      'approved': ['active'],
      'active': ['completed'],
      'completed': ['archived'],
      'archived': []
    },
    defaultStatus: 'proposed',
    finalStatuses: ['completed', 'archived']
  },
  community: {
    workflow: [
      { status: 'proposed', label: 'Proposed', color: 'blue', icon: '💡' },
      { status: 'discussion', label: 'Discussion', color: 'yellow', icon: '💬' },
      { status: 'voting', label: 'Voting', color: 'purple', icon: '🗳️' },
      { status: 'approved', label: 'Approved', color: 'green', icon: '👍' },
      { status: 'active', label: 'Active', color: 'orange', icon: '🎯' },
      { status: 'completed', label: 'Completed', color: 'gray', icon: '✅' },
      { status: 'impact_assessed', label: 'Impact Assessed', color: 'teal', icon: '📊' }
    ],
    allowedTransitions: {
      'proposed': ['discussion'],
      'discussion': ['voting', 'proposed'],
      'voting': ['approved', 'discussion'],
      'approved': ['active'],
      'active': ['completed'],
      'completed': ['impact_assessed'],
      'impact_assessed': []
    },
    defaultStatus: 'proposed',
    finalStatuses: ['impact_assessed']
  }
} as const

// Action type definitions
export const ACTION_TYPES = {
  task: { label: 'Task', icon: '✅', description: 'Specific actionable item with clear deliverable' },
  event: { label: 'Event', icon: '📅', description: 'Scheduled gathering or meeting' },
  initiative: { label: 'Initiative', icon: '🚀', description: 'Larger project or campaign' },
  proposal: { label: 'Proposal', icon: '📝', description: 'Idea requiring discussion and approval' },
  resource_needed: { label: 'Resource Needed', icon: '🔍', description: 'Request for help, skills, or materials' }
} as const

// Impact level definitions
export const IMPACT_LEVELS = {
  individual: { label: 'Individual', icon: '👤', description: 'Affects one person' },
  local: { label: 'Local', icon: '🏠', description: 'Affects immediate community/neighborhood' },
  community: { label: 'Community', icon: '🏘️', description: 'Affects broader community/organization' },
  systemic: { label: 'Systemic', icon: '🌍', description: 'Affects systems, policies, or society' }
} as const

// Filter and search interfaces
export interface ActionFilters {
  actionType?: string[]
  impactLevel?: string[]
  sourceType?: string[]
  status?: string[]
  priority?: string[]
  isPublic?: boolean
  assignedToMe?: boolean
  createdByMe?: boolean
  dueDate?: {
    from?: Date
    to?: Date
  }
  tags?: string[]
  searchQuery?: string
}

export interface ActionSortOptions {
  field: 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'title'
  direction: 'asc' | 'desc'
}

// Widget and integration interfaces
export interface ActionWidget {
  id: string
  type: 'embedded' | 'popup' | 'sidebar'
  context: {
    sourceType: string
    sourceId: string
    roomId?: string
    chatId?: string
  }
  filters?: ActionFilters
  maxItems?: number
  showCreateButton?: boolean
}

export interface ActionDetectionResult {
  confidence: number
  suggestedTitle: string
  suggestedDescription: string
  suggestedType: string
  suggestedImpactLevel: string
  extractedMetadata: {
    dueDate?: Date
    estimatedEffort?: string
    requiredSkills?: string[]
    tags?: string[]
  }
}

// Import common types
import { User, FocusRoom } from './communities'
