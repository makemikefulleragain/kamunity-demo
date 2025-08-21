// Chat seed data - Active conversations with golden thread connections
import { GOLDEN_THREADS } from './newsSeeds';

export interface ChatItem {
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

export const chatSeeds: ChatItem[] = [
  // Parks & Gardens Thread - Conversations evolving from news
  {
    id: 'chat-1',
    title: 'Community Garden Planning - Spring 2025',
    description: 'Organizing our neighborhood garden for the growing season. Discussing plot assignments, shared tools, and group activities.',
    category: 'Active Discussion',
    engagement: 78,
    commentCount: 156,
    tags: ['gardening', 'planning', 'community', 'spring'],
    createdAt: new Date().toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Room',
    goldenThread: GOLDEN_THREADS.PARKS_GARDENS
  },
  {
    id: 'chat-2',
    title: 'Native Plant Identification Walk',
    description: 'Planning a guided walk through Riverside Park to learn about local native plants. Botanist neighbor volunteering to lead.',
    category: 'Learning Event',
    engagement: 45,
    commentCount: 89,
    tags: ['native-plants', 'education', 'parks', 'nature'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    goldenThread: GOLDEN_THREADS.PARKS_GARDENS
  },
  {
    id: 'chat-3',
    title: 'Guerrilla Gardening Coordination',
    description: 'Organizing beautification of neglected public spaces with flowers and vegetables. Discussing legal considerations and plant choices.',
    category: 'Community Action',
    engagement: 67,
    commentCount: 134,
    tags: ['guerrilla-gardening', 'beautification', 'activism', 'plants'],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Room',
    goldenThread: GOLDEN_THREADS.PARKS_GARDENS
  },
  {
    id: 'chat-4',
    title: 'Composting Workshop Follow-up',
    description: 'Continuing discussion from the composting workshop. Sharing tips, troubleshooting problems, and planning advanced sessions.',
    category: 'Skill Development',
    engagement: 52,
    commentCount: 98,
    tags: ['composting', 'workshop', 'skills', 'sustainability'],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    goldenThread: GOLDEN_THREADS.PARKS_GARDENS
  },
  {
    id: 'chat-5',
    title: 'Seed Swap Organization',
    description: 'Coordinating our annual seed swap event. Creating inventory system and planning educational component about heirloom varieties.',
    category: 'Community Event',
    engagement: 39,
    commentCount: 76,
    tags: ['seeds', 'swap', 'heirloom', 'education'],
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    goldenThread: GOLDEN_THREADS.PARKS_GARDENS
  },

  // Street Events Thread
  {
    id: 'chat-6',
    title: 'Block Party Planning Committee',
    description: 'Organizing our annual summer block party. Need volunteers for setup, food coordination, and entertainment booking.',
    category: 'Event Planning',
    engagement: 92,
    commentCount: 203,
    tags: ['block-party', 'summer', 'volunteers', 'entertainment'],
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    promotionStatus: 'promoted',
    promotionTarget: 'Room',
    goldenThread: GOLDEN_THREADS.STREET_EVENTS
  },
  {
    id: 'chat-7',
    title: 'Neighborhood Yard Sale Coordination',
    description: 'Coordinating multi-family yard sale for next weekend. Sharing advertising costs and creating neighborhood map.',
    category: 'Community Event',
    engagement: 34,
    commentCount: 67,
    tags: ['yard-sale', 'coordination', 'neighborhood', 'sharing'],
    createdAt: new Date(Date.now() - 518400000).toISOString(),
    goldenThread: GOLDEN_THREADS.STREET_EVENTS
  },
  {
    id: 'chat-8',
    title: 'Pop-Up Market Vendor Recruitment',
    description: 'Looking for local artisans, food vendors, and small businesses for monthly pop-up market in the park.',
    category: 'Economic Development',
    engagement: 56,
    commentCount: 112,
    tags: ['pop-up-market', 'vendors', 'local-business', 'artisans'],
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Room',
    goldenThread: GOLDEN_THREADS.STREET_EVENTS
  },
  {
    id: 'chat-9',
    title: 'Open Yard Saturday Expansion',
    description: 'Maple Street success inspiring other streets to try open yard concept. Sharing lessons learned and best practices.',
    category: 'Community Innovation',
    engagement: 48,
    commentCount: 94,
    tags: ['open-yard', 'expansion', 'innovation', 'sharing'],
    createdAt: new Date(Date.now() - 691200000).toISOString(),
    goldenThread: GOLDEN_THREADS.STREET_EVENTS
  },
  {
    id: 'chat-10',
    title: 'Night Market Cultural Exchange',
    description: 'Planning themed nights for the monthly market. Each featuring different cultural communities and their traditions.',
    category: 'Cultural Event',
    engagement: 61,
    commentCount: 118,
    tags: ['night-market', 'culture', 'exchange', 'diversity'],
    createdAt: new Date(Date.now() - 777600000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Room',
    goldenThread: GOLDEN_THREADS.STREET_EVENTS
  },

  // Civics Thread
  {
    id: 'chat-11',
    title: 'City Budget Review Discussion',
    description: 'Breaking down the proposed city budget and identifying priorities for our neighborhood. Preparing for public comment period.',
    category: 'Civic Engagement',
    engagement: 73,
    commentCount: 145,
    tags: ['budget', 'civic', 'government', 'advocacy'],
    createdAt: new Date(Date.now() - 864000000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Room',
    goldenThread: GOLDEN_THREADS.CIVICS
  },
  {
    id: 'chat-12',
    title: 'Participatory Budgeting Strategy',
    description: 'Coordinating neighborhood input for the new participatory budgeting process. Researching successful projects from other cities.',
    category: 'Democratic Participation',
    engagement: 65,
    commentCount: 127,
    tags: ['participatory-budgeting', 'strategy', 'democracy', 'research'],
    createdAt: new Date(Date.now() - 950400000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Room',
    goldenThread: GOLDEN_THREADS.CIVICS
  },
  {
    id: 'chat-13',
    title: 'Zoning Change Impact Analysis',
    description: 'Proposed zoning changes could affect our neighborhood character. Researching implications and organizing community response.',
    category: 'Urban Planning',
    engagement: 61,
    commentCount: 98,
    tags: ['zoning', 'planning', 'community', 'advocacy'],
    createdAt: new Date(Date.now() - 1036800000).toISOString(),
    goldenThread: GOLDEN_THREADS.CIVICS
  },
  {
    id: 'chat-14',
    title: 'Voter Registration Drive Planning',
    description: 'Organizing voter registration events before upcoming elections. Need volunteers and locations for registration tables.',
    category: 'Democratic Participation',
    engagement: 48,
    commentCount: 87,
    tags: ['voting', 'registration', 'democracy', 'volunteers'],
    createdAt: new Date(Date.now() - 1123200000).toISOString(),
    goldenThread: GOLDEN_THREADS.CIVICS
  },
  {
    id: 'chat-15',
    title: 'Community Land Trust Discussion',
    description: 'Learning about community land trusts as affordable housing strategy. Exploring feasibility for our neighborhood.',
    category: 'Housing Advocacy',
    engagement: 57,
    commentCount: 103,
    tags: ['land-trust', 'housing', 'affordability', 'community'],
    createdAt: new Date(Date.now() - 1209600000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Room',
    goldenThread: GOLDEN_THREADS.CIVICS
  },

  // Social Support Thread
  {
    id: 'chat-16',
    title: 'Mutual Aid Network Coordination',
    description: 'Coordinating support for neighbors in need. Sharing resources, rides, childcare, and emotional support.',
    category: 'Community Support',
    engagement: 89,
    commentCount: 234,
    tags: ['mutual-aid', 'support', 'community', 'resources'],
    createdAt: new Date(Date.now() - 1296000000).toISOString(),
    promotionStatus: 'promoted',
    promotionTarget: 'Room',
    goldenThread: GOLDEN_THREADS.SOCIAL_SUPPORT
  },
  {
    id: 'chat-17',
    title: 'Senior Support Check-ins',
    description: 'Regular wellness checks for elderly neighbors. Coordinating visits, grocery runs, and technology help.',
    category: 'Elder Care',
    engagement: 52,
    commentCount: 103,
    tags: ['seniors', 'wellness', 'support', 'community'],
    createdAt: new Date(Date.now() - 1382400000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Room',
    goldenThread: GOLDEN_THREADS.SOCIAL_SUPPORT
  },
  {
    id: 'chat-18',
    title: 'New Parent Support Circle',
    description: 'Support group for new parents in the neighborhood. Sharing experiences, resources, and arranging playdates.',
    category: 'Parenting Support',
    engagement: 67,
    commentCount: 156,
    tags: ['parenting', 'support', 'new-parents', 'community'],
    createdAt: new Date(Date.now() - 1468800000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Room',
    goldenThread: GOLDEN_THREADS.SOCIAL_SUPPORT
  },
  {
    id: 'chat-19',
    title: 'Community Kitchen Volunteer Coordination',
    description: 'Organizing volunteers for the community kitchen. Scheduling cooks, servers, and cleanup crews for weekly meals.',
    category: 'Food Security',
    engagement: 74,
    commentCount: 167,
    tags: ['community-kitchen', 'volunteers', 'food', 'coordination'],
    createdAt: new Date(Date.now() - 1555200000).toISOString(),
    promotionStatus: 'promoted',
    promotionTarget: 'Room',
    goldenThread: GOLDEN_THREADS.SOCIAL_SUPPORT
  },
  {
    id: 'chat-20',
    title: 'Emergency Response Team Training',
    description: 'Coordinating first aid and emergency response training for neighborhood volunteers. Building community resilience.',
    category: 'Emergency Preparedness',
    engagement: 58,
    commentCount: 119,
    tags: ['emergency', 'training', 'first-aid', 'resilience'],
    createdAt: new Date(Date.now() - 1641600000).toISOString(),
    goldenThread: GOLDEN_THREADS.SOCIAL_SUPPORT
  },

  // Skills Thread
  {
    id: 'chat-21',
    title: 'Skill Share Fair Organization',
    description: 'Planning our quarterly skill share event. Creating teacher signup, scheduling workshops, and arranging materials.',
    category: 'Education',
    engagement: 63,
    commentCount: 129,
    tags: ['skills', 'teaching', 'workshops', 'learning'],
    createdAt: new Date(Date.now() - 1728000000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Room',
    goldenThread: GOLDEN_THREADS.SKILLS
  },
  {
    id: 'chat-22',
    title: 'Tool Library Management',
    description: 'Coordinating the community tool library. Managing inventory, maintenance schedules, and member requests.',
    category: 'Resource Sharing',
    engagement: 41,
    commentCount: 87,
    tags: ['tools', 'library', 'sharing', 'maintenance'],
    createdAt: new Date(Date.now() - 1814400000).toISOString(),
    goldenThread: GOLDEN_THREADS.SKILLS
  },
  {
    id: 'chat-23',
    title: 'Repair Café Volunteer Training',
    description: 'Training new volunteers for monthly repair café. Teaching basic electronics, sewing, and small appliance repair.',
    category: 'Skill Development',
    engagement: 49,
    commentCount: 94,
    tags: ['repair-cafe', 'training', 'sustainability', 'skills'],
    createdAt: new Date(Date.now() - 1900800000).toISOString(),
    goldenThread: GOLDEN_THREADS.SKILLS
  },
  {
    id: 'chat-24',
    title: 'Community WiFi Network Expansion',
    description: 'Tech volunteers coordinating expansion of mesh network. Teaching neighbors about digital privacy and security.',
    category: 'Digital Equity',
    engagement: 55,
    commentCount: 108,
    tags: ['wifi', 'mesh-network', 'digital-equity', 'privacy'],
    createdAt: new Date(Date.now() - 1987200000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Room',
    goldenThread: GOLDEN_THREADS.SKILLS
  },
  {
    id: 'chat-25',
    title: 'Time Bank Service Exchange',
    description: 'Coordinating the neighborhood time bank. Matching service providers with those in need, tracking hours and exchanges.',
    category: 'Alternative Economy',
    engagement: 46,
    commentCount: 91,
    tags: ['time-bank', 'services', 'exchange', 'community'],
    createdAt: new Date(Date.now() - 2073600000).toISOString(),
    goldenThread: GOLDEN_THREADS.SKILLS
  },

  // Music & Arts Thread
  {
    id: 'chat-26',
    title: 'Pop-Up Concert Series Planning',
    description: 'Organizing weekly concerts in different parks. Coordinating with musicians, handling permits, and promoting events.',
    category: 'Arts & Culture',
    engagement: 68,
    commentCount: 142,
    tags: ['concerts', 'music', 'parks', 'events'],
    createdAt: new Date(Date.now() - 2160000000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Room',
    goldenThread: GOLDEN_THREADS.MUSIC_ART
  },
  {
    id: 'chat-27',
    title: 'Community Art Wall Curation',
    description: 'Selecting artists and themes for the rotating mural space. Community voting on monthly themes and artist applications.',
    category: 'Public Art',
    engagement: 43,
    commentCount: 86,
    tags: ['art', 'murals', 'curation', 'community'],
    createdAt: new Date(Date.now() - 2246400000).toISOString(),
    goldenThread: GOLDEN_THREADS.MUSIC_ART
  },
  {
    id: 'chat-28',
    title: 'Community Orchestra Rehearsal Coordination',
    description: 'Scheduling rehearsals and performances for our inclusive community orchestra. All skill levels welcome.',
    category: 'Music Collaboration',
    engagement: 37,
    commentCount: 74,
    tags: ['orchestra', 'music', 'rehearsal', 'inclusive'],
    createdAt: new Date(Date.now() - 2332800000).toISOString(),
    goldenThread: GOLDEN_THREADS.MUSIC_ART
  },
  {
    id: 'chat-29',
    title: 'Art Therapy Session Planning',
    description: 'Coordinating weekly art therapy sessions. Discussing materials, themes, and creating safe space for healing through creativity.',
    category: 'Mental Health',
    engagement: 51,
    commentCount: 97,
    tags: ['art-therapy', 'mental-health', 'healing', 'creativity'],
    createdAt: new Date(Date.now() - 2419200000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Room',
    goldenThread: GOLDEN_THREADS.MUSIC_ART
  },
  {
    id: 'chat-30',
    title: 'Community Radio Programming',
    description: 'Planning content for our low-power FM station. Training volunteer DJs and coordinating neighborhood news segments.',
    category: 'Media & Communication',
    engagement: 44,
    commentCount: 89,
    tags: ['radio', 'programming', 'media', 'volunteers'],
    createdAt: new Date(Date.now() - 2505600000).toISOString(),
    goldenThread: GOLDEN_THREADS.MUSIC_ART
  },

  // History & Organization Thread
  {
    id: 'chat-31',
    title: 'Digital Archive Project Coordination',
    description: 'Organizing volunteers to collect and digitize neighborhood stories, photos, and documents for community memory bank.',
    category: 'Historical Preservation',
    engagement: 32,
    commentCount: 64,
    tags: ['archive', 'history', 'digitization', 'preservation'],
    createdAt: new Date(Date.now() - 2592000000).toISOString(),
    goldenThread: GOLDEN_THREADS.HISTORY_ORG
  },
  {
    id: 'chat-32',
    title: 'Storytelling Circle Organization',
    description: 'Coordinating monthly elder storytelling sessions. Creating comfortable space for sharing wisdom and life experiences.',
    category: 'Cultural Heritage',
    engagement: 28,
    commentCount: 56,
    tags: ['storytelling', 'elders', 'wisdom', 'heritage'],
    createdAt: new Date(Date.now() - 2678400000).toISOString(),
    goldenThread: GOLDEN_THREADS.HISTORY_ORG
  },
  {
    id: 'chat-33',
    title: 'Community Journalism Training',
    description: 'Teaching citizen journalism skills to resident reporters. Covering neighborhood issues ignored by mainstream media.',
    category: 'Media & Communication',
    engagement: 39,
    commentCount: 78,
    tags: ['journalism', 'training', 'hyperlocal', 'media'],
    createdAt: new Date(Date.now() - 2764800000).toISOString(),
    goldenThread: GOLDEN_THREADS.HISTORY_ORG
  },
  {
    id: 'chat-34',
    title: 'Walking History Tour Development',
    description: 'Creating routes and narratives for monthly neighborhood history walks. Researching stories of immigration and change.',
    category: 'Historical Education',
    engagement: 35,
    commentCount: 71,
    tags: ['history', 'tours', 'education', 'walking'],
    createdAt: new Date(Date.now() - 2851200000).toISOString(),
    goldenThread: GOLDEN_THREADS.HISTORY_ORG
  },
  {
    id: 'chat-35',
    title: 'Community Memory Documentation',
    description: 'Documenting how our neighborhood has changed over decades. Collecting oral histories and photo archives.',
    category: 'Community Documentation',
    engagement: 31,
    commentCount: 62,
    tags: ['memory', 'documentation', 'oral-history', 'change'],
    createdAt: new Date(Date.now() - 2937600000).toISOString(),
    goldenThread: GOLDEN_THREADS.HISTORY_ORG
  },

  // Global Issues Thread
  {
    id: 'chat-36',
    title: 'Climate Action Campaign Strategy',
    description: 'Coordinating with national climate movement. Planning local demonstration and developing policy proposals for city council.',
    category: 'Environmental Activism',
    engagement: 81,
    commentCount: 167,
    tags: ['climate', 'activism', 'policy', 'demonstration'],
    createdAt: new Date(Date.now() - 3024000000).toISOString(),
    promotionStatus: 'promoted',
    promotionTarget: 'Room',
    goldenThread: GOLDEN_THREADS.GLOBAL_ISSUES
  },
  {
    id: 'chat-37',
    title: 'Community Solar Cooperative Planning',
    description: 'Organizing neighborhood solar installation. Researching financing options and coordinating with installation companies.',
    category: 'Renewable Energy',
    engagement: 72,
    commentCount: 148,
    tags: ['solar', 'cooperative', 'renewable-energy', 'financing'],
    createdAt: new Date(Date.now() - 3110400000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Room',
    goldenThread: GOLDEN_THREADS.GLOBAL_ISSUES
  },
  {
    id: 'chat-38',
    title: 'Resilience Hub Development',
    description: 'Planning multi-purpose facility for climate emergencies. Discussing solar power, battery backup, and community services.',
    category: 'Climate Adaptation',
    engagement: 64,
    commentCount: 132,
    tags: ['resilience', 'climate', 'emergency', 'adaptation'],
    createdAt: new Date(Date.now() - 3196800000).toISOString(),
    promotionStatus: 'eligible',
    promotionTarget: 'Room',
    goldenThread: GOLDEN_THREADS.GLOBAL_ISSUES
  },
  {
    id: 'chat-39',
    title: 'Divestment Campaign Organization',
    description: 'Pressuring city pension fund to divest from fossil fuels. Researching investment alternatives and organizing public pressure.',
    category: 'Climate Finance',
    engagement: 58,
    commentCount: 119,
    tags: ['divestment', 'fossil-fuels', 'pension', 'finance'],
    createdAt: new Date(Date.now() - 3283200000).toISOString(),
    goldenThread: GOLDEN_THREADS.GLOBAL_ISSUES
  },
  {
    id: 'chat-40',
    title: 'Community Forest Expansion',
    description: 'Planning next phase of urban reforestation project. Identifying sites, selecting tree species, and training volunteers.',
    category: 'Environmental Restoration',
    engagement: 47,
    commentCount: 95,
    tags: ['trees', 'forest', 'reforestation', 'volunteers'],
    createdAt: new Date(Date.now() - 3369600000).toISOString(),
    goldenThread: GOLDEN_THREADS.GLOBAL_ISSUES
  }
];
