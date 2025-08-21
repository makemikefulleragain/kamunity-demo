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
}

export const roomSeeds: RoomItem[] = [
  // Parks & Gardens Thread - Rooms formed from successful chats
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
  {
    id: 'room-tech-1',
    title: 'Tech Mentorship Program',
    description: 'Dedicated room for preserving and propagating local native species. Organizing seed collection, plant swaps, and habitat restoration.',
    category: 'Conservation Room',
    engagement: 78,
    commentCount: 45,
    tags: ['native-plants', 'conservation', 'restoration', 'biodiversity'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    goldenThread: GOLDEN_THREADS.PARKS_GARDENS
  },
  {
    id: 'room-health-1',
    title: 'Mental Health Support Network',
    description: 'Coordinated beautification efforts across neglected public spaces. Planning installations, sharing legal resources, and celebrating successes.',
    category: 'Activism Room',
    engagement: 134,
    commentCount: 67,
    tags: ['guerrilla-gardening', 'beautification', 'public-space', 'activism'],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.PARKS_GARDENS
  },
  {
    id: 'room-4',
    title: 'Composting & Soil Health Hub',
    description: 'Advanced composting techniques, soil testing, and sustainable growing practices. From backyard bins to community-scale systems.',
    category: 'Education Room',
    engagement: 92,
    commentCount: 56,
    tags: ['composting', 'soil-health', 'sustainability', 'education'],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    goldenThread: GOLDEN_THREADS.PARKS_GARDENS
  },
  {
    id: 'room-5',
    title: 'Seed Library & Heritage Preservation',
    description: 'Maintaining genetic diversity through heirloom seed collection. Documenting local varieties and teaching seed saving techniques.',
    category: 'Preservation Room',
    engagement: 67,
    commentCount: 34,
    tags: ['seeds', 'heirloom', 'preservation', 'genetic-diversity'],
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    goldenThread: GOLDEN_THREADS.PARKS_GARDENS
  },

  // Street Events Thread
  {
    id: 'room-6',
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
  {
    id: 'room-7',
    title: 'Pop-Up Market Collective',
    description: 'Supporting local entrepreneurs through rotating markets. Vendor coordination, site management, and community economic development.',
    category: 'Economic Room',
    engagement: 145,
    commentCount: 78,
    tags: ['pop-up-market', 'entrepreneurs', 'local-economy', 'vendors'],
    createdAt: new Date(Date.now() - 518400000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.STREET_EVENTS
  },
  {
    id: 'room-8',
    title: 'Open Yard Movement',
    description: 'Expanding the open yard concept across neighborhoods. Facilitating resource sharing, skill exchanges, and community building.',
    category: 'Innovation Room',
    engagement: 118,
    commentCount: 65,
    tags: ['open-yard', 'sharing', 'innovation', 'community-building'],
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.STREET_EVENTS
  },
  {
    id: 'room-9',
    title: 'Cultural Exchange Festival Planning',
    description: 'Organizing events that celebrate neighborhood diversity. Food festivals, cultural nights, and cross-community connections.',
    category: 'Cultural Room',
    engagement: 167,
    commentCount: 89,
    tags: ['cultural-exchange', 'diversity', 'festivals', 'connection'],
    createdAt: new Date(Date.now() - 691200000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.STREET_EVENTS
  },
  {
    id: 'room-10',
    title: 'Street Art & Public Space Activation',
    description: 'Transforming public spaces through community art projects. Mural coordination, performance spaces, and creative placemaking.',
    category: 'Arts Room',
    engagement: 98,
    commentCount: 52,
    tags: ['street-art', 'public-space', 'murals', 'placemaking'],
    createdAt: new Date(Date.now() - 777600000).toISOString(),
    goldenThread: GOLDEN_THREADS.STREET_EVENTS
  },

  // Civics Thread
  {
    id: 'room-11',
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
    id: 'room-12',
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
  {
    id: 'room-13',
    title: 'Urban Planning & Community Voice',
    description: 'Ensuring community input in development decisions. Zoning analysis, design charrettes, and inclusive planning processes.',
    category: 'Planning Room',
    engagement: 134,
    commentCount: 76,
    tags: ['urban-planning', 'zoning', 'community-voice', 'development'],
    createdAt: new Date(Date.now() - 1036800000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.CIVICS
  },
  {
    id: 'room-14',
    title: 'Electoral Engagement Network',
    description: 'Voter education, candidate forums, and election organizing. Building informed democratic participation at all levels.',
    category: 'Electoral Room',
    engagement: 112,
    commentCount: 63,
    tags: ['elections', 'voting', 'candidates', 'civic-education'],
    createdAt: new Date(Date.now() - 1123200000).toISOString(),
    goldenThread: GOLDEN_THREADS.CIVICS
  },
  {
    id: 'room-15',
    title: 'Digital Rights & Community Broadband',
    description: 'Advocating for digital equity and community-controlled internet. Municipal broadband campaigns and digital literacy programs.',
    category: 'Digital Rights Room',
    engagement: 145,
    commentCount: 82,
    tags: ['digital-rights', 'broadband', 'municipal', 'digital-equity'],
    createdAt: new Date(Date.now() - 1209600000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.CIVICS
  },

  // Social Support Thread
  {
    id: 'room-16',
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
    id: 'room-17',
    title: 'Intergenerational Connection Hub',
    description: 'Bridging age gaps through mentorship and skill sharing. Senior support, youth programs, and wisdom exchange.',
    category: 'Connection Room',
    engagement: 134,
    commentCount: 78,
    tags: ['intergenerational', 'mentorship', 'seniors', 'youth'],
    createdAt: new Date(Date.now() - 1382400000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.SOCIAL_SUPPORT
  },
  {
    id: 'room-18',
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
  {
    id: 'room-19',
    title: 'Mental Health & Wellness Circle',
    description: 'Peer support for mental health and community wellness. Support groups, resource sharing, and healing-centered practices.',
    category: 'Wellness Room',
    engagement: 112,
    commentCount: 67,
    tags: ['mental-health', 'wellness', 'peer-support', 'healing'],
    createdAt: new Date(Date.now() - 1555200000).toISOString(),
    goldenThread: GOLDEN_THREADS.SOCIAL_SUPPORT
  },
  {
    id: 'room-20',
    title: 'Community Resilience Network',
    description: 'Building neighborhood preparedness and response capacity. Emergency planning, first aid training, and disaster recovery.',
    category: 'Resilience Room',
    engagement: 156,
    commentCount: 89,
    tags: ['resilience', 'emergency', 'preparedness', 'disaster-recovery'],
    createdAt: new Date(Date.now() - 1641600000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.SOCIAL_SUPPORT
  },

  // Skills Thread
  {
    id: 'room-21',
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
    id: 'room-22',
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
  {
    id: 'room-23',
    title: 'Repair Café & Sustainability Hub',
    description: 'Community repair events and waste reduction initiatives. Skill building, environmental education, and circular economy practices.',
    category: 'Sustainability Room',
    engagement: 123,
    commentCount: 68,
    tags: ['repair', 'sustainability', 'waste-reduction', 'circular-economy'],
    createdAt: new Date(Date.now() - 1900800000).toISOString(),
    goldenThread: GOLDEN_THREADS.SKILLS
  },
  {
    id: 'room-24',
    title: 'Digital Equity & Tech Skills',
    description: 'Bridging the digital divide through education and infrastructure. Computer classes, network maintenance, and digital rights advocacy.',
    category: 'Tech Room',
    engagement: 145,
    commentCount: 82,
    tags: ['digital-equity', 'tech-skills', 'computer-classes', 'infrastructure'],
    createdAt: new Date(Date.now() - 1987200000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.SKILLS
  },
  {
    id: 'room-25',
    title: 'Alternative Economy Experiments',
    description: 'Exploring new economic models like time banks and gift economies. Coordinating exchanges and measuring community impact.',
    category: 'Economy Room',
    engagement: 98,
    commentCount: 54,
    tags: ['alternative-economy', 'time-bank', 'gift-economy', 'exchanges'],
    createdAt: new Date(Date.now() - 2073600000).toISOString(),
    goldenThread: GOLDEN_THREADS.SKILLS
  },

  // Music & Arts Thread
  {
    id: 'room-26',
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
    id: 'room-27',
    title: 'Public Art & Creative Placemaking',
    description: 'Transforming neighborhoods through community art projects. Mural programs, sculpture gardens, and creative space activation.',
    category: 'Arts Room',
    engagement: 123,
    commentCount: 67,
    tags: ['public-art', 'murals', 'placemaking', 'creative'],
    createdAt: new Date(Date.now() - 2246400000).toISOString(),
    goldenThread: GOLDEN_THREADS.MUSIC_ART
  },
  {
    id: 'room-28',
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
  {
    id: 'room-29',
    title: 'Community Media & Storytelling',
    description: 'Hyperlocal media production and community storytelling. Podcast studio, video production, and citizen journalism training.',
    category: 'Media Room',
    engagement: 112,
    commentCount: 63,
    tags: ['media', 'storytelling', 'podcast', 'journalism'],
    createdAt: new Date(Date.now() - 2419200000).toISOString(),
    goldenThread: GOLDEN_THREADS.MUSIC_ART
  },
  {
    id: 'room-30',
    title: 'Performance & Event Production',
    description: 'Supporting live performance and cultural events. Stage management, sound engineering, and artist development programs.',
    category: 'Performance Room',
    engagement: 145,
    commentCount: 82,
    tags: ['performance', 'events', 'production', 'artist-development'],
    createdAt: new Date(Date.now() - 2505600000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.MUSIC_ART
  },

  // History & Organization Thread
  {
    id: 'room-31',
    title: 'Community Memory & Archives',
    description: 'Preserving neighborhood history through digital archives and oral history projects. Documenting change and celebrating heritage.',
    category: 'Archive Room',
    engagement: 89,
    commentCount: 48,
    tags: ['archives', 'oral-history', 'preservation', 'heritage'],
    createdAt: new Date(Date.now() - 2592000000).toISOString(),
    goldenThread: GOLDEN_THREADS.HISTORY_ORG
  },
  {
    id: 'room-32',
    title: 'Intergenerational Wisdom Exchange',
    description: 'Connecting elders and youth through storytelling and mentorship. Preserving traditional knowledge and life experiences.',
    category: 'Wisdom Room',
    engagement: 76,
    commentCount: 42,
    tags: ['wisdom', 'storytelling', 'elders', 'mentorship'],
    createdAt: new Date(Date.now() - 2678400000).toISOString(),
    goldenThread: GOLDEN_THREADS.HISTORY_ORG
  },
  {
    id: 'room-33',
    title: 'Community Journalism & Documentation',
    description: 'Training citizen journalists and documenting neighborhood issues. Hyperlocal news production and media literacy education.',
    category: 'Journalism Room',
    engagement: 98,
    commentCount: 56,
    tags: ['journalism', 'documentation', 'hyperlocal', 'media-literacy'],
    createdAt: new Date(Date.now() - 2764800000).toISOString(),
    goldenThread: GOLDEN_THREADS.HISTORY_ORG
  },
  {
    id: 'room-34',
    title: 'Historical Education & Tours',
    description: 'Sharing neighborhood history through walking tours and educational programs. Connecting past struggles to present organizing.',
    category: 'Education Room',
    engagement: 87,
    commentCount: 47,
    tags: ['history', 'education', 'tours', 'organizing'],
    createdAt: new Date(Date.now() - 2851200000).toISOString(),
    goldenThread: GOLDEN_THREADS.HISTORY_ORG
  },
  {
    id: 'room-35',
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
    id: 'room-36',
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
  },
  {
    id: 'room-37',
    title: 'Renewable Energy Cooperative',
    description: 'Community-owned renewable energy projects. Solar installations, energy democracy, and cooperative development.',
    category: 'Energy Room',
    engagement: 178,
    commentCount: 98,
    tags: ['renewable-energy', 'solar', 'cooperative', 'energy-democracy'],
    createdAt: new Date(Date.now() - 3110400000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.GLOBAL_ISSUES
  },
  {
    id: 'room-38',
    title: 'Community Resilience & Adaptation',
    description: 'Building neighborhood capacity for climate impacts. Emergency preparedness, infrastructure adaptation, and community support systems.',
    category: 'Resilience Room',
    engagement: 156,
    commentCount: 87,
    tags: ['resilience', 'adaptation', 'emergency', 'infrastructure'],
    createdAt: new Date(Date.now() - 3196800000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.GLOBAL_ISSUES
  },
  {
    id: 'room-39',
    title: 'Economic Justice & Divestment',
    description: 'Challenging extractive economics through divestment campaigns and alternative economic development. Building community wealth.',
    category: 'Justice Room',
    engagement: 145,
    commentCount: 82,
    tags: ['economic-justice', 'divestment', 'community-wealth', 'alternatives'],
    createdAt: new Date(Date.now() - 3283200000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Club',
    goldenThread: GOLDEN_THREADS.GLOBAL_ISSUES
  },
  {
    id: 'room-40',
    title: 'Ecological Restoration Network',
    description: 'Large-scale environmental restoration projects. Urban forestry, watershed protection, and biodiversity conservation.',
    category: 'Restoration Room',
    engagement: 123,
    commentCount: 69,
    tags: ['restoration', 'forestry', 'watershed', 'biodiversity'],
    createdAt: new Date(Date.now() - 3369600000).toISOString(),
    goldenThread: GOLDEN_THREADS.GLOBAL_ISSUES
  }
];
