// TypeScript interfaces for content management models
// Generated from Prisma schema - keep in sync with database

export interface ContentUpload {
  id: string
  filename: string
  originalName: string
  fileType: 'image' | 'document' | 'video' | 'audio'
  fileSize: number
  mimeType: string
  storageLocation: string
  moderationStatus: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  updatedAt: Date
  uploaderId: string
  
  // Relations (when populated)
  uploader?: User
  reactions?: Reaction[]
}

export interface Reaction {
  id: string
  reactionType: 'fun' | 'spot_on' | 'spicy' | 'nice' | 'weird' | 'intriguing'
  createdAt: Date
  contentType: string
  contentId: string
  userId: string
  messageId?: string | null
  uploadId?: string | null
  
  // Relations (when populated)
  user?: User
  message?: Message
  upload?: ContentUpload
}

export interface AnalyticsEvent {
  id: string
  eventType: 'page_view' | 'content_upload' | 'reaction' | 'comment'
  sessionId: string
  metadata?: Record<string, any> | null
  createdAt: Date
  userId?: string | null
  
  // Relations (when populated)
  user?: User
}

export interface CommunityReaction {
  id: string
  emoji: string
  label: string
  description?: string | null
  isActive: boolean
  createdAt: Date
  communityId: string
  
  // Relations (when populated)
  community?: Community
}

// Re-export common types for convenience
export interface User {
  id: string
  email: string
  name?: string | null
  avatarUrl?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  content: string
  createdAt: Date
  authorId: string
  conversationId: string
}

export interface Community {
  id: string
  name: string
  description?: string | null
  imageUrl?: string | null
  createdAt: Date
  updatedAt: Date
}

// Utility types for API operations
export interface CreateContentUploadData {
  filename: string
  originalName: string
  fileType: ContentUpload['fileType']
  fileSize: number
  mimeType: string
  storageLocation: string
}

export interface CreateReactionData {
  reactionType: Reaction['reactionType']
  contentType: string
  contentId: string
  messageId?: string
  uploadId?: string
}

export interface CreateAnalyticsEventData {
  eventType: AnalyticsEvent['eventType']
  sessionId: string
  metadata?: Record<string, any>
  userId?: string
}

// Vibe check reaction constants
export const REACTION_TYPES = {
  fun: { emoji: '😄', label: 'Fun', description: 'Light-hearted, entertaining content' },
  spot_on: { emoji: '🎯', label: 'Spot On', description: 'Accurate, well-reasoned points' },
  spicy: { emoji: '🌶️', label: 'Spicy', description: 'Controversial or provocative content' },
  nice: { emoji: '👍', label: 'Nice', description: 'Positive, supportive reactions' },
  weird: { emoji: '🤔', label: 'Weird', description: 'Unusual or unexpected content' },
  intriguing: { emoji: '🔍', label: 'Intriguing', description: 'Thought-provoking, interesting content' }
} as const

export type ReactionType = keyof typeof REACTION_TYPES
