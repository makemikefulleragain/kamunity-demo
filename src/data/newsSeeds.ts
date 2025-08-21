// News seed data with golden threads connecting to other hubs
export interface NewsItem {
  id: string;
  title: string;
  description: string;
  category: string;
  engagement: number;
  commentCount: number;
  tags: string[];
  createdAt: string;
  goldenThread?: string;
}

export const GOLDEN_THREADS = {
  PARKS_GARDENS: 'parks-gardens',
  STREET_EVENTS: 'street-events', 
  CIVICS: 'civics',
  SOCIAL_SUPPORT: 'social-support',
  SKILLS: 'skills',
  MUSIC_ART: 'music-art',
  HISTORY_ORG: 'history-org',
  GLOBAL_ISSUES: 'global-issues'
};

export const newsSeeds: NewsItem[] = [
  // Parks & Gardens Golden Thread
  {
    id: 'news-1',
    title: 'City Council Approves $2M for Community Gardens Initiative',
    description: 'Major funding secured for 15 new community garden spaces across underserved neighborhoods. Public input sessions start next week.',
    category: 'Local Government',
    engagement: 89,
    commentCount: 23,
    tags: ['gardens', 'funding', 'council', 'community'],
    createdAt: new Date().toISOString(),
    goldenThread: GOLDEN_THREADS.PARKS_GARDENS
  },
  {
    id: 'news-2', 
    title: 'Riverside Park Cleanup Draws 200+ Volunteers',
    description: 'Weekend cleanup event exceeded expectations with families, students, and local businesses joining forces to restore the waterfront.',
    category: 'Community Action',
    engagement: 67,
    commentCount: 18,
    tags: ['parks', 'cleanup', 'volunteers', 'environment'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    goldenThread: GOLDEN_THREADS.PARKS_GARDENS
  },
  {
    id: 'news-3',
    title: 'Urban Farming Workshop Series Launches This Month',
    description: 'Free workshops on container gardening, composting, and seed starting. Expert-led sessions every Saturday at the Community Center.',
    category: 'Education',
    engagement: 45,
    commentCount: 12,
    tags: ['urban-farming', 'workshops', 'education', 'sustainability'],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    goldenThread: GOLDEN_THREADS.PARKS_GARDENS
  },
  {
    id: 'news-4',
    title: 'Community Composting Program Diverts 2 Tons Monthly',
    description: 'Neighborhood composting sites turn food scraps into garden gold. Educational workshops teach home composting techniques.',
    category: 'Environmental Action',
    engagement: 51,
    commentCount: 16,
    tags: ['composting', 'environment', 'education', 'gardens'],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    goldenThread: GOLDEN_THREADS.PARKS_GARDENS
  },
  {
    id: 'news-5',
    title: 'Seed Library Preserves Local Plant Varieties',
    description: 'Community-maintained collection of heirloom seeds adapted to local conditions. Free for gardeners who save and share.',
    category: 'Food Security',
    engagement: 41,
    commentCount: 13,
    tags: ['seeds', 'library', 'heirloom', 'gardening'],
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    goldenThread: GOLDEN_THREADS.PARKS_GARDENS
  },

  // Street Events Golden Thread
  {
    id: 'news-6',
    title: 'Block Party Permits Now Available Online',
    description: 'Streamlined process makes it easier for neighbors to organize street festivals, yard sales, and community gatherings.',
    category: 'Local Government',
    engagement: 34,
    commentCount: 8,
    tags: ['permits', 'block-party', 'events', 'community'],
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    goldenThread: GOLDEN_THREADS.STREET_EVENTS
  },
  {
    id: 'news-7',
    title: 'Maple Street Hosts First "Open Yard" Saturday',
    description: 'Neighbors open their yards for shared activities - from book swaps to skill sharing. Movement spreading to other streets.',
    category: 'Community Innovation',
    engagement: 56,
    commentCount: 15,
    tags: ['open-yard', 'sharing', 'neighbors', 'innovation'],
    createdAt: new Date(Date.now() - 518400000).toISOString(),
    goldenThread: GOLDEN_THREADS.STREET_EVENTS
  },
  {
    id: 'news-8',
    title: 'Pop-Up Markets Support Local Entrepreneurs',
    description: 'Weekly markets in different neighborhoods showcase local businesses, artists, and food vendors. Building economic resilience.',
    category: 'Economic Development',
    engagement: 59,
    commentCount: 18,
    tags: ['markets', 'entrepreneurs', 'local-business', 'economic'],
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    goldenThread: GOLDEN_THREADS.STREET_EVENTS
  },
  {
    id: 'news-9',
    title: 'Community Celebration Showcases Year of Collaboration',
    description: 'Annual festival highlights all the community projects, connections, and achievements from the past year. Planning begins for next year.',
    category: 'Community Celebration',
    engagement: 89,
    commentCount: 31,
    tags: ['celebration', 'festival', 'collaboration', 'community'],
    createdAt: new Date(Date.now() - 691200000).toISOString(),
    goldenThread: GOLDEN_THREADS.STREET_EVENTS
  },
  {
    id: 'news-10',
    title: 'Neighborhood Night Market Brings Cultures Together',
    description: 'Monthly evening market features food from local immigrant communities. Building cross-cultural connections through cuisine.',
    category: 'Cultural Exchange',
    engagement: 72,
    commentCount: 24,
    tags: ['night-market', 'culture', 'food', 'diversity'],
    createdAt: new Date(Date.now() - 777600000).toISOString(),
    goldenThread: GOLDEN_THREADS.STREET_EVENTS
  },

  // Civics Golden Thread
  {
    id: 'news-11',
    title: 'New Participatory Budgeting Process Begins',
    description: 'Citizens can now directly vote on how $500K in city funds are spent. Online platform launches with neighborhood info sessions.',
    category: 'Civic Engagement',
    engagement: 78,
    commentCount: 31,
    tags: ['participatory-budgeting', 'democracy', 'voting', 'civic'],
    createdAt: new Date(Date.now() - 864000000).toISOString(),
    goldenThread: GOLDEN_THREADS.CIVICS
  },
  {
    id: 'news-12',
    title: 'Local Policy Review Group Seeks New Members',
    description: 'Volunteer group that analyzes proposed city ordinances looking for residents interested in civic engagement and policy research.',
    category: 'Civic Engagement',
    engagement: 23,
    commentCount: 7,
    tags: ['policy', 'civic-engagement', 'volunteers', 'research'],
    createdAt: new Date(Date.now() - 950400000).toISOString(),
    goldenThread: GOLDEN_THREADS.CIVICS
  },
  {
    id: 'news-13',
    title: 'Community Land Trust Acquires Affordable Housing',
    description: 'Resident-controlled organization secures 24 units for permanent affordability. Model prevents displacement and builds community wealth.',
    category: 'Housing',
    engagement: 68,
    commentCount: 21,
    tags: ['housing', 'affordability', 'land-trust', 'community'],
    createdAt: new Date(Date.now() - 1036800000).toISOString(),
    goldenThread: GOLDEN_THREADS.CIVICS
  },
  {
    id: 'news-14',
    title: 'Youth Council Proposes New Recreation Programs',
    description: 'Student-led initiative presents comprehensive plan for after-school activities, mentorship, and leadership development.',
    category: 'Youth Programs',
    engagement: 39,
    commentCount: 12,
    tags: ['youth', 'recreation', 'leadership', 'programs'],
    createdAt: new Date(Date.now() - 1123200000).toISOString(),
    goldenThread: GOLDEN_THREADS.CIVICS
  },
  {
    id: 'news-15',
    title: 'Community Broadband Initiative Gains Momentum',
    description: 'Residents organizing for municipal internet service. Public meetings draw hundreds concerned about digital access and privacy.',
    category: 'Digital Rights',
    engagement: 73,
    commentCount: 25,
    tags: ['broadband', 'municipal', 'digital-rights', 'privacy'],
    createdAt: new Date(Date.now() - 1209600000).toISOString(),
    goldenThread: GOLDEN_THREADS.CIVICS
  },

  // Social Support Golden Thread
  {
    id: 'news-16',
    title: 'Mutual Aid Network Launches Emergency Response System',
    description: 'Text-based system connects neighbors during crises. Already helped 50+ families with groceries, childcare, and transportation.',
    category: 'Social Support',
    engagement: 92,
    commentCount: 28,
    tags: ['mutual-aid', 'emergency', 'support', 'community'],
    createdAt: new Date(Date.now() - 1296000000).toISOString(),
    goldenThread: GOLDEN_THREADS.SOCIAL_SUPPORT
  },
  {
    id: 'news-17',
    title: 'Senior-Youth Mentorship Program Expands',
    description: 'Intergenerational program pairs seniors with young adults for skill sharing, technology help, and friendship. Now in 5 neighborhoods.',
    category: 'Social Programs',
    engagement: 41,
    commentCount: 14,
    tags: ['mentorship', 'seniors', 'youth', 'intergenerational'],
    createdAt: new Date(Date.now() - 1382400000).toISOString(),
    goldenThread: GOLDEN_THREADS.SOCIAL_SUPPORT
  },
  {
    id: 'news-18',
    title: 'Community Kitchen Collective Feeds 200 Weekly',
    description: 'Volunteer-run kitchen provides free meals while building connections. Sourcing from local gardens and food rescue programs.',
    category: 'Food Security',
    engagement: 73,
    commentCount: 24,
    tags: ['food', 'kitchen', 'volunteers', 'community'],
    createdAt: new Date(Date.now() - 1468800000).toISOString(),
    goldenThread: GOLDEN_THREADS.SOCIAL_SUPPORT
  },
  {
    id: 'news-19',
    title: 'Community Health Workers Address Local Needs',
    description: 'Trained residents provide health education and connect neighbors to resources. Culturally responsive approach to wellness.',
    category: 'Community Health',
    engagement: 49,
    commentCount: 15,
    tags: ['health', 'community-workers', 'wellness', 'education'],
    createdAt: new Date(Date.now() - 1555200000).toISOString(),
    goldenThread: GOLDEN_THREADS.SOCIAL_SUPPORT
  },
  {
    id: 'news-20',
    title: 'Community Emergency Response Team Trains 100 Volunteers',
    description: 'Neighborhood preparedness program teaches first aid, disaster response, and community resilience planning.',
    category: 'Emergency Preparedness',
    engagement: 66,
    commentCount: 22,
    tags: ['emergency', 'preparedness', 'training', 'resilience'],
    createdAt: new Date(Date.now() - 1641600000).toISOString(),
    goldenThread: GOLDEN_THREADS.SOCIAL_SUPPORT
  },

  // Skills Golden Thread
  {
    id: 'news-21',
    title: 'Community Skill Share Fair This Weekend',
    description: 'Residents teaching everything from bike repair to bread baking. Free event showcases the wealth of knowledge in our neighborhoods.',
    category: 'Education',
    engagement: 63,
    commentCount: 19,
    tags: ['skills', 'teaching', 'community', 'learning'],
    createdAt: new Date(Date.now() - 1728000000).toISOString(),
    goldenThread: GOLDEN_THREADS.SKILLS
  },
  {
    id: 'news-22',
    title: 'Tool Library Opens Second Location',
    description: 'Community tool sharing program expands to serve east side. Members can borrow everything from power tools to party supplies.',
    category: 'Resource Sharing',
    engagement: 45,
    commentCount: 13,
    tags: ['tools', 'sharing', 'community', 'resources'],
    createdAt: new Date(Date.now() - 1814400000).toISOString(),
    goldenThread: GOLDEN_THREADS.SKILLS
  },
  {
    id: 'news-23',
    title: 'Repair Café Fixes 500+ Items in First Year',
    description: 'Monthly events where volunteers help neighbors fix electronics, clothing, and household items. Reducing waste while building skills.',
    category: 'Sustainability',
    engagement: 42,
    commentCount: 15,
    tags: ['repair', 'sustainability', 'skills', 'waste-reduction'],
    createdAt: new Date(Date.now() - 1900800000).toISOString(),
    goldenThread: GOLDEN_THREADS.SKILLS
  },
  {
    id: 'news-24',
    title: 'Community WiFi Network Bridges Digital Divide',
    description: 'Mesh network provides free internet access in underserved areas. Tech volunteers maintain and expand coverage.',
    category: 'Digital Equity',
    engagement: 47,
    commentCount: 14,
    tags: ['wifi', 'digital-equity', 'technology', 'access'],
    createdAt: new Date(Date.now() - 1987200000).toISOString(),
    goldenThread: GOLDEN_THREADS.SKILLS
  },
  {
    id: 'news-25',
    title: 'Time Bank Lets Neighbors Trade Services',
    description: 'Hour-for-hour exchange system where community members trade skills and services without money.',
    category: 'Alternative Economy',
    engagement: 52,
    commentCount: 17,
    tags: ['time-bank', 'services', 'exchange', 'community'],
    createdAt: new Date(Date.now() - 2073600000).toISOString(),
    goldenThread: GOLDEN_THREADS.SKILLS
  },

  // Music & Arts Golden Thread
  {
    id: 'news-26',
    title: 'Pop-Up Concert Series Brings Music to Parks',
    description: 'Local musicians performing in different parks each week. Community-organized events creating new connections through music.',
    category: 'Arts & Culture',
    engagement: 71,
    commentCount: 22,
    tags: ['music', 'concerts', 'parks', 'community'],
    createdAt: new Date(Date.now() - 2160000000).toISOString(),
    goldenThread: GOLDEN_THREADS.MUSIC_ART
  },
  {
    id: 'news-27',
    title: 'Community Art Wall Project Seeks Artists',
    description: 'Rotating mural space downtown looking for local artists. Monthly themes chosen by neighborhood vote.',
    category: 'Arts & Culture',
    engagement: 38,
    commentCount: 11,
    tags: ['art', 'murals', 'artists', 'community'],
    createdAt: new Date(Date.now() - 2246400000).toISOString(),
    goldenThread: GOLDEN_THREADS.MUSIC_ART
  },
  {
    id: 'news-28',
    title: 'Community Orchestra Welcomes All Skill Levels',
    description: 'Inclusive music group meets weekly in community center. From beginners to professionals, all instruments welcome.',
    category: 'Arts & Music',
    engagement: 44,
    commentCount: 16,
    tags: ['orchestra', 'music', 'inclusive', 'community'],
    createdAt: new Date(Date.now() - 2332800000).toISOString(),
    goldenThread: GOLDEN_THREADS.MUSIC_ART
  },
  {
    id: 'news-29',
    title: 'Community Art Therapy Program Supports Mental Health',
    description: 'Free creative workshops help residents process trauma and build connections. Art therapist volunteers lead weekly sessions.',
    category: 'Mental Health',
    engagement: 43,
    commentCount: 14,
    tags: ['art-therapy', 'mental-health', 'creative', 'support'],
    createdAt: new Date(Date.now() - 2419200000).toISOString(),
    goldenThread: GOLDEN_THREADS.MUSIC_ART
  },
  {
    id: 'news-30',
    title: 'Community Radio Station Launches Hyperlocal Programming',
    description: 'Low-power FM station features neighborhood news, local music, and community discussions. Training workshops for volunteer DJs.',
    category: 'Media & Communication',
    engagement: 55,
    commentCount: 18,
    tags: ['radio', 'hyperlocal', 'media', 'community'],
    createdAt: new Date(Date.now() - 2505600000).toISOString(),
    goldenThread: GOLDEN_THREADS.MUSIC_ART
  },

  // History & Organization Golden Thread
  {
    id: 'news-31',
    title: 'Digital Archive Project Preserves Neighborhood Stories',
    description: 'Volunteers collecting oral histories, photos, and documents to create comprehensive community memory bank.',
    category: 'History & Culture',
    engagement: 29,
    commentCount: 9,
    tags: ['history', 'archive', 'stories', 'preservation'],
    createdAt: new Date(Date.now() - 2592000000).toISOString(),
    goldenThread: GOLDEN_THREADS.HISTORY_ORG
  },
  {
    id: 'news-32',
    title: 'Storytelling Circle Preserves Elder Wisdom',
    description: 'Monthly gatherings where community elders share life experiences and traditional knowledge with younger generations.',
    category: 'Cultural Heritage',
    engagement: 33,
    commentCount: 10,
    tags: ['storytelling', 'elders', 'wisdom', 'heritage'],
    createdAt: new Date(Date.now() - 2678400000).toISOString(),
    goldenThread: GOLDEN_THREADS.HISTORY_ORG
  },
  {
    id: 'news-33',
    title: 'Community Journalism Collective Launches Hyperlocal News',
    description: 'Resident reporters cover neighborhood issues ignored by mainstream media. Training workshops teach citizen journalism skills.',
    category: 'Media & Communication',
    engagement: 37,
    commentCount: 12,
    tags: ['journalism', 'hyperlocal', 'media', 'community'],
    createdAt: new Date(Date.now() - 2764800000).toISOString(),
    goldenThread: GOLDEN_THREADS.HISTORY_ORG
  },
  {
    id: 'news-34',
    title: 'Community Memory Project Documents Neighborhood Changes',
    description: 'Residents document how their neighborhood has changed over decades. Oral histories and photo archives preserve community memory.',
    category: 'Community History',
    engagement: 32,
    commentCount: 10,
    tags: ['memory', 'history', 'documentation', 'change'],
    createdAt: new Date(Date.now() - 2851200000).toISOString(),
    goldenThread: GOLDEN_THREADS.HISTORY_ORG
  },
  {
    id: 'news-35',
    title: 'Walking History Tours Connect Past and Present',
    description: 'Volunteer historians lead monthly walks exploring neighborhood evolution. Stories of immigration, industry, and community resilience.',
    category: 'Historical Education',
    engagement: 41,
    commentCount: 13,
    tags: ['history', 'tours', 'education', 'community'],
    createdAt: new Date(Date.now() - 2937600000).toISOString(),
    goldenThread: GOLDEN_THREADS.HISTORY_ORG
  },

  // Global Issues Golden Thread
  {
    id: 'news-36',
    title: 'Climate Action Group Organizes City-Wide Initiative',
    description: 'Local group coordinating with national movement for climate policy. Planning major demonstration and policy proposals.',
    category: 'Environmental Action',
    engagement: 84,
    commentCount: 26,
    tags: ['climate', 'action', 'policy', 'environment'],
    createdAt: new Date(Date.now() - 3024000000).toISOString(),
    goldenThread: GOLDEN_THREADS.GLOBAL_ISSUES
  },
  {
    id: 'news-37',
    title: 'Community Solar Project Reaches Funding Goal',
    description: 'Neighborhood-owned solar installation will power 150 homes. Cooperative model being studied by other communities.',
    category: 'Energy & Environment',
    engagement: 81,
    commentCount: 29,
    tags: ['solar', 'energy', 'cooperative', 'environment'],
    createdAt: new Date(Date.now() - 3110400000).toISOString(),
    goldenThread: GOLDEN_THREADS.GLOBAL_ISSUES
  },
  {
    id: 'news-38',
    title: 'Community Resilience Hub Prepares for Climate Impacts',
    description: 'Multi-purpose facility serves as cooling center, emergency shelter, and community meeting space. Solar powered with battery backup.',
    category: 'Climate Adaptation',
    engagement: 76,
    commentCount: 27,
    tags: ['resilience', 'climate', 'adaptation', 'community'],
    createdAt: new Date(Date.now() - 3196800000).toISOString(),
    goldenThread: GOLDEN_THREADS.GLOBAL_ISSUES
  },
  {
    id: 'news-39',
    title: 'Local Divestment Campaign Targets Fossil Fuel Investments',
    description: 'Coalition pressures city pension fund to divest from oil companies. Part of global movement for climate-responsible investing.',
    category: 'Climate Finance',
    engagement: 67,
    commentCount: 21,
    tags: ['divestment', 'fossil-fuels', 'climate', 'finance'],
    createdAt: new Date(Date.now() - 3283200000).toISOString(),
    goldenThread: GOLDEN_THREADS.GLOBAL_ISSUES
  },
  {
    id: 'news-40',
    title: 'Community Forest Project Plants 1000 Trees',
    description: 'Multi-year reforestation effort transforms vacant lots into community green spaces. Residents learn urban forestry skills.',
    category: 'Environmental Restoration',
    engagement: 58,
    commentCount: 19,
    tags: ['trees', 'forest', 'green-space', 'restoration'],
    createdAt: new Date(Date.now() - 3369600000).toISOString(),
    goldenThread: GOLDEN_THREADS.GLOBAL_ISSUES
  }
];
