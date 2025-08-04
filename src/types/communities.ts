// TypeScript interfaces for Communities and Clubs with federation logic
// Generated from Prisma schema - keep in sync with database

export interface Community {
  id: string
  name: string
  description?: string | null
  imageUrl?: string | null
  createdAt: Date
  updatedAt: Date
  
  // Federation & Governance
  federationType: 'cooperative' | 'democratic' | 'consensus'
  minimumClubs: number
  isActive: boolean
  governanceRules?: Record<string, unknown> | null
  
  // Content & Engagement
  featuredContent?: string | null
  tags: string[]
  visibility: 'public' | 'private' | 'invite-only'
  
  // Relations (when populated)
  clubs?: Club[]
  members?: Membership[]
  customReactions?: CommunityReaction[]
}

export interface Club {
  id: string
  name: string
  description?: string | null
  imageUrl?: string | null
  createdAt: Date
  updatedAt: Date
  communityId: string
  
  // Club Status & Federation
  status: 'forming' | 'active' | 'dormant' | 'archived'
  minimumRooms: number
  isEligibleForCommunity: boolean
  memberCount: number
  roomCount: number

  // Content & Engagement
  purpose?: string | null
  achievements?: Record<string, unknown> | null
  tags: string[]
  
  // Relations (when populated)
  community?: Community
  rooms?: FocusRoom[]
  members?: Membership[]
}

export interface FocusRoom {
  id: string
  name: string
  purpose?: string | null
  createdAt: Date
  updatedAt: Date
  clubId: string
  
  // Room Status & Activity
  status: 'active' | 'dormant' | 'archived' | 'completed'
  isPrivate: boolean
  maxMembers?: number | null
  
  // Content & Engagement
  description?: string | null
  tags: string[]
  pinnedContent?: string | null
  
  // Activity Metrics
  lastActivity: Date
  messageCount: number
  memberCount: number
  
  // Relations (when populated)
  club?: Club
  members?: Membership[]
  conversations?: Conversation[]
  uploads?: ContentUpload[]
}

export interface Membership {
  id: string
  role: string
  userId: string
  communityId?: string | null
  clubId?: string | null
  
  // Relations (when populated)
  user?: User
  community?: Community
  club?: Club
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

// Re-export common types
export interface User {
  id: string
  email: string
  name?: string | null
  avatarUrl?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Conversation {
  id: string
  title?: string | null
  sourceType: string
  sourceId: string
  createdAt: Date
  updatedAt: Date
  
  // Relations (when populated)
  messages?: Message[]
}

export interface Message {
  id: string
  content: string
  createdAt: Date
  authorId: string
  conversationId: string
  
  // Relations (when populated)
  author?: User
  conversation?: Conversation
  reactions?: Reaction[]
}

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
  
  // Context & Metadata
  description?: string | null
  tags: string[]
  isPublic: boolean
  
  // Optional Focus Room relationship
  focusRoomId?: string | null
  
  // Relations (when populated)
  uploader?: User
  focusRoom?: FocusRoom
  reactions?: Reaction[]
}

export interface Reaction {
  id: string
  reactionType: 'fun' | 'spot_on' | 'spicy' | 'nice' | 'weird' | 'intriguing'
  createdAt: Date
  userId: string
  contentType: string
  contentId: string
  
  // Relations (when populated)
  user?: User
}

// Metrics Interfaces
export interface FederationMetrics {
  healthScore: number;
  totalMembers: number;
  totalClubs: number;
  totalRooms: number;
  diversityIndex: number;
  collaborationScore: number;
  monthlyGrowth: number;
}

export interface ClubMetrics {
  memberCount: number;
  roomCount: number;
  engagementScore: number;
  collaborationIndex: number;
  monthlyActivity: number;
  eligibilityProgress: number;
}

export interface RoomMetrics {
  memberCount: number;
  messageCount: number;
  lastActivity: Date;
  engagementScore: number;
}

// Utility types for API operations
export interface CreateCommunityData {
  name: string
  description?: string
  imageUrl?: string
  federationType?: Community['federationType']
  minimumClubs?: number
  featuredContent?: string
  tags?: string[]
  visibility?: Community['visibility']
  governanceRules?: Record<string, unknown>
}

export interface CreateClubData {
  name: string
  description?: string
  imageUrl?: string
  communityId: string
  purpose?: string
  tags?: string[]
  minimumRooms?: number
}

export interface UpdateCommunityData extends Partial<CreateCommunityData> {
  isActive?: boolean
}

export interface UpdateClubData extends Partial<CreateClubData> {
  status?: Club['status']
  isEligibleForCommunity?: boolean
  achievements?: Record<string, any>
}

// Federation logic types
export interface FederationMetrics {
  communityId: string
  totalClubs: number
  activeClubs: number
  totalMembers: number
  averageRoomsPerClub: number
  federationHealth: 'healthy' | 'growing' | 'struggling' | 'critical'
  eligibleForExpansion: boolean
}

export interface ClubMetrics {
  clubId: string
  totalRooms: number
  activeRooms: number
  totalMembers: number
  recentActivity: number
  impactScore: number
  eligibilityStatus: 'eligible' | 'developing' | 'inactive'
}

export interface RoomMetrics {
  roomId: string
  memberCount: number
  messageCount: number
  recentActivity: number // e.g., a score from 0-100
  impactScore: number    // e.g., a score from 0-100
}

// Governance types
export interface GovernanceProposal {
  id: string
  title: string
  description: string
  proposedBy: string
  type: 'policy' | 'resource' | 'structure' | 'federation'
  status: 'draft' | 'voting' | 'approved' | 'rejected'
  votingDeadline?: Date
  requiredConsensus: number // percentage
}

export interface GovernanceVote {
  id: string
  proposalId: string
  userId: string
  vote: 'approve' | 'reject' | 'abstain'
  reasoning?: string
  weight: number // based on user's engagement/tenure
  createdAt: Date
}

// Content management types for communities/clubs
export interface CommunityContent {
  id: string
  type: 'announcement' | 'resource' | 'achievement' | 'event'
  title: string
  content: string
  authorId: string
  communityId?: string
  clubId?: string
  isPinned: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

// Federation constants
export const FEDERATION_TYPES = {
  cooperative: {
    label: 'Cooperative',
    description: 'Shared ownership and democratic decision-making',
    minClubs: 5,
    consensusThreshold: 0.6
  },
  democratic: {
    label: 'Democratic',
    description: 'Majority rule with representative governance',
    minClubs: 3,
    consensusThreshold: 0.5
  },
  consensus: {
    label: 'Consensus',
    description: 'Full agreement required for major decisions',
    minClubs: 7,
    consensusThreshold: 0.9
  }
} as const

export const CLUB_STATUS = {
  forming: { label: 'Forming', color: 'bg-yellow-100 text-yellow-700' },
  active: { label: 'Active', color: 'bg-green-100 text-green-700' },
  dormant: { label: 'Dormant', color: 'bg-gray-100 text-gray-700' },
  archived: { label: 'Archived', color: 'bg-red-100 text-red-700' }
} as const

export const ROOM_STATUS = {
  active: { label: 'Active', color: 'bg-green-100 text-green-700' },
  dormant: { label: 'Dormant', color: 'bg-gray-100 text-gray-700' },
  archived: { label: 'Archived', color: 'bg-red-100 text-red-700' },
  completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700' }
} as const

export const VISIBILITY_TYPES = {
  public: { label: 'Public', description: 'Open to all users' },
  private: { label: 'Private', description: 'Members only' },
  'invite-only': { label: 'Invite Only', description: 'Invitation required' }
} as const
