// Room seed data - Evolved from successful chats with golden thread connections
import { GOLDEN_THREADS } from './newsSeeds';

export interface RoomItem {
  id: string;
  title: string;
  description: string;
  category: string;
  engagement: number;
  commentCount: number;
  tags: string[];
  createdAt: string;
  promotionStatus?: 'none' | 'eligible' | 'promoted';
  promotionTarget?: string;
  goldenThread?: string;
  memberRequested?: boolean;
  demoType?: string;
}

export const roomSeeds: RoomItem[] = [
  // Member Requested Demo Room - Display First
  {
    id: 'room-lore-campaign',
    title: 'Serious / Lore-Themed Campaign Room',
    description: 'An immersive digital war journal where every skirmish, painting triumph, and strategic decision is etched into campaign history.',
    category: 'Member Requested - DEMO',
    engagement: 0,
    commentCount: 0,
    tags: ['campaign', 'lore', 'gaming', 'chronicle', 'member-requested', 'demo'],
    createdAt: new Date().toISOString(),
    memberRequested: true,
    demoType: 'one-page-app'
  },

  // Selected 12 Representative Rooms Across All Golden Threads
  // Parks & Gardens Thread
  {
    id: 'room-env-1',
    title: 'Community Garden Initiative',
    description: 'Promoted from chat thread! Now a dedicated space for coordinating community gardens, sharing resources, and planning seasonal activities.',
    category: 'Active Room',
    engagement: 156,
    commentCount: 89,
    tags: ['gardening', 'urban', 'sustainability', 'collective'],
    createdAt: new Date().toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.PARKS_GARDENS
  },

  // Street Events Thread
  {
    id: 'room-events-1',
    title: 'Neighborhood Events Coordination',
    description: 'Central hub for organizing block parties, yard sales, and street festivals. Sharing resources, permits, and best practices.',
    category: 'Event Room',
    engagement: 203,
    commentCount: 124,
    tags: ['events', 'block-party', 'coordination', 'community'],
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    promotionStatus: 'promoted',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.STREET_EVENTS
  },

  // Civics Thread
  {
    id: 'room-civics-1',
    title: 'Participatory Democracy Hub',
    description: 'Coordinating citizen engagement in local government. Budget analysis, policy research, and community advocacy strategies.',
    category: 'Civic Room',
    engagement: 189,
    commentCount: 112,
    tags: ['democracy', 'participatory-budgeting', 'policy', 'advocacy'],
    createdAt: new Date(Date.now() - 864000000).toISOString(),
    promotionStatus: 'promoted',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.CIVICS
  },

  {
    id: 'room-civics-2',
    title: 'Housing Justice Collective',
    description: 'Advocating for affordable housing and tenant rights. Community land trust development and anti-displacement organizing.',
    category: 'Justice Room',
    engagement: 156,
    commentCount: 87,
    tags: ['housing', 'justice', 'affordability', 'land-trust'],
    createdAt: new Date(Date.now() - 950400000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.CIVICS
  },

  // Social Support Thread
  {
    id: 'room-support-1',
    title: 'Mutual Aid Coordination Center',
    description: 'Central hub for community support networks. Emergency response, resource sharing, and neighbor-to-neighbor assistance.',
    category: 'Support Room',
    engagement: 267,
    commentCount: 156,
    tags: ['mutual-aid', 'emergency', 'support', 'community-care'],
    createdAt: new Date(Date.now() - 1296000000).toISOString(),
    promotionStatus: 'promoted',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.SOCIAL_SUPPORT
  },

  {
    id: 'room-support-2',
    title: 'Community Kitchen Collective',
    description: 'Coordinating community meals and food security programs. Volunteer scheduling, menu planning, and nutrition education.',
    category: 'Food Room',
    engagement: 189,
    commentCount: 98,
    tags: ['community-kitchen', 'food-security', 'volunteers', 'nutrition'],
    createdAt: new Date(Date.now() - 1468800000).toISOString(),
    promotionStatus: 'promoted',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.SOCIAL_SUPPORT
  },

  // Skills Thread
  {
    id: 'room-skills-1',
    title: 'Community Learning Exchange',
    description: 'Peer-to-peer education and skill sharing. Workshop coordination, teacher matching, and resource library management.',
    category: 'Education Room',
    engagement: 178,
    commentCount: 95,
    tags: ['education', 'skill-sharing', 'workshops', 'peer-learning'],
    createdAt: new Date(Date.now() - 1728000000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.SKILLS
  },

  {
    id: 'room-skills-2',
    title: 'Tool Library & Maker Space',
    description: 'Community workshop and tool sharing facility. Equipment maintenance, project coordination, and maker education.',
    category: 'Maker Room',
    engagement: 134,
    commentCount: 76,
    tags: ['tools', 'maker-space', 'workshop', 'sharing'],
    createdAt: new Date(Date.now() - 1814400000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.SKILLS
  },

  // Music & Arts Thread
  {
    id: 'room-arts-1',
    title: 'Community Music Collective',
    description: 'Coordinating musical events and education. Concert series, jam sessions, and music lessons for all ages and skill levels.',
    category: 'Music Room',
    engagement: 167,
    commentCount: 89,
    tags: ['music', 'concerts', 'education', 'community'],
    createdAt: new Date(Date.now() - 2160000000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.MUSIC_ART
  },

  {
    id: 'room-arts-2',
    title: 'Inclusive Arts & Healing',
    description: 'Art therapy, creative wellness programs, and accessible arts programming. Supporting mental health through creative expression.',
    category: 'Healing Room',
    engagement: 134,
    commentCount: 76,
    tags: ['art-therapy', 'healing', 'mental-health', 'accessible'],
    createdAt: new Date(Date.now() - 2332800000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.MUSIC_ART
  },

  // History & Organization Thread
  {
    id: 'room-history-1',
    title: 'Organizational Development & Strategy',
    description: 'Supporting community groups with planning, facilitation, and organizational skills. Building capacity for effective collective action.',
    category: 'Development Room',
    engagement: 112,
    commentCount: 64,
    tags: ['organization', 'strategy', 'facilitation', 'capacity-building'],
    createdAt: new Date(Date.now() - 2937600000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.HISTORY_ORG
  },

  // Global Issues Thread
  {
    id: 'room-global-1',
    title: 'Climate Action & Environmental Justice',
    description: 'Local climate organizing connected to global movements. Policy advocacy, direct action, and community resilience building.',
    category: 'Climate Room',
    engagement: 234,
    commentCount: 134,
    tags: ['climate', 'environmental-justice', 'policy', 'direct-action'],
    createdAt: new Date(Date.now() - 3024000000).toISOString(),
    promotionStatus: 'promoted',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.GLOBAL_ISSUES
  }
];
