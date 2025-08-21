/**
 * Golden Thread Data - Complete progression from News → Chat → Room → Club
 * These represent successful community initiatives that evolved through the platform
 */

export interface GoldenThread {
  id: string;
  title: string;
  category: 'environmental' | 'tech' | 'social' | 'education' | 'health';
  news: {
    id: string;
    title: string;
    content: string;
    summary: string;
    publishedAt: Date;
    engagement: number;
    comments: number;
  };
  chat: {
    id: string;
    title: string;
    participants: number;
    messages: ChatMessage[];
    createdAt: Date;
  };
  room: {
    id: string;
    name: string;
    description: string;
    objectives: string[];
    members: number;
    impactScore: number;
    quickActions: QuickAction[];
    createdAt: Date;
  };
  club?: {
    id: string;
    name: string;
    description: string;
    memberRooms: string[];
    totalMembers: number;
    impactScore: number;
  };
}

export interface ChatMessage {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: Date;
  isKai?: boolean;
  reactions?: { emoji: string; count: number }[];
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: string;
  count?: number;
}

export const goldenThreads: GoldenThread[] = [
  {
    id: 'gt-1',
    title: 'Community Garden Initiative',
    category: 'environmental',
    news: {
      id: 'news-env-1',
      title: 'Local Neighborhoods Transform Vacant Lots into Thriving Gardens',
      content: 'Across the city, communities are reclaiming unused spaces and turning them into productive gardens. The movement started with just three neighbors and has grown to over 500 participants...',
      summary: 'Communities create urban gardens, improving food security and neighborhood bonds',
      publishedAt: new Date('2025-08-15'),
      engagement: 892,
      comments: 67
    },
    chat: {
      id: 'chat-env-1',
      title: '🌱 Starting a Garden in Our Neighborhood',
      participants: 34,
      messages: [
        {
          id: 'm1',
          author: 'Sarah Chen',
          content: 'Just read the article about community gardens. We have that empty lot on 5th Street that would be perfect!',
          timestamp: new Date('2025-08-15T10:30:00'),
          reactions: [{ emoji: '❤️', count: 12 }, { emoji: '🌱', count: 8 }]
        },
        {
          id: 'm2',
          author: 'Marcus Johnson',
          content: 'I\'ve been thinking the same thing! My kids would love to help. Plus we could donate produce to the food bank.',
          timestamp: new Date('2025-08-15T10:45:00'),
          reactions: [{ emoji: '👍', count: 15 }]
        },
        {
          id: 'm3',
          author: 'Kai',
          content: 'Great initiative! 🌟 Based on similar projects, you\'ll need: 1) Permission from the city, 2) Soil testing, 3) Water access plan. I can help create an action plan. Would you like me to generate a project roadmap?',
          timestamp: new Date('2025-08-15T11:00:00'),
          isKai: true,
          reactions: [{ emoji: '🎯', count: 20 }]
        },
        {
          id: 'm4',
          author: 'Elena Rodriguez',
          content: 'Yes please Kai! I work at city hall and can help with permits. This is exactly what our neighborhood needs.',
          timestamp: new Date('2025-08-15T11:15:00')
        },
        {
          id: 'm5',
          author: 'David Park',
          content: 'Count me in! I have experience with composting systems. We could make this completely sustainable.',
          timestamp: new Date('2025-08-15T11:30:00'),
          reactions: [{ emoji: '♻️', count: 10 }]
        }
      ],
      createdAt: new Date('2025-08-15T10:00:00')
    },
    room: {
      id: 'room-env-1',
      name: '5th Street Community Garden Project',
      description: 'Transforming the vacant lot on 5th Street into a thriving community garden that provides fresh produce, educational opportunities, and strengthens neighborhood bonds.',
      objectives: [
        'Secure permits and land use agreement by September',
        'Complete soil testing and preparation',
        'Build 20 raised garden beds',
        'Establish composting system',
        'Create educational program for local schools'
      ],
      members: 47,
      impactScore: 850,
      quickActions: [
        { id: 'qa1', label: 'Log Impact', icon: '📊', action: 'impact-log', count: 23 },
        { id: 'qa2', label: 'Schedule Work Day', icon: '📅', action: 'schedule-meeting' },
        { id: 'qa3', label: 'Share Resource', icon: '📎', action: 'share-resource', count: 15 },
        { id: 'qa4', label: 'Create Task', icon: '✅', action: 'create-task', count: 42 },
        { id: 'qa5', label: 'Garden Map', icon: '🗺️', action: 'view-map' }
      ],
      createdAt: new Date('2025-08-16')
    },
    club: {
      id: 'club-env-1',
      name: 'Urban Gardeners Collective',
      description: 'A network of community garden projects sharing resources, knowledge, and advocating for urban agriculture',
      memberRooms: ['room-env-1', 'room-env-2', 'room-env-3'],
      totalMembers: 234,
      impactScore: 4250
    }
  },
  {
    id: 'gt-2',
    title: 'Tech Mentorship Program',
    category: 'tech',
    news: {
      id: 'news-tech-1',
      title: 'Local Tech Workers Launch Free Coding Bootcamp for Underserved Youth',
      content: 'A group of software engineers and designers have started a weekend coding program aimed at teaching programming skills to teenagers from low-income families...',
      summary: 'Tech professionals volunteer to teach coding, opening career paths for underserved youth',
      publishedAt: new Date('2025-08-10'),
      engagement: 1243,
      comments: 89
    },
    chat: {
      id: 'chat-tech-1',
      title: '💻 Expanding Tech Mentorship to Our Area',
      participants: 56,
      messages: [
        {
          id: 't1',
          author: 'Alex Kumar',
          content: 'This bootcamp idea is brilliant! I\'m a senior developer and would love to start something similar here.',
          timestamp: new Date('2025-08-10T14:00:00'),
          reactions: [{ emoji: '🚀', count: 25 }]
        },
        {
          id: 't2',
          author: 'Jessica Wu',
          content: 'Yes! I teach CS at the community college. We could use our computer lab on weekends.',
          timestamp: new Date('2025-08-10T14:30:00'),
          reactions: [{ emoji: '🎓', count: 18 }]
        },
        {
          id: 't3',
          author: 'Kai',
          content: 'Wonderful initiative! 💡 Key success factors for tech mentorship programs: 1) Structured curriculum, 2) Project-based learning, 3) Industry connections for internships. I can help you design a 12-week program. Interested?',
          timestamp: new Date('2025-08-10T15:00:00'),
          isKai: true,
          reactions: [{ emoji: '💯', count: 30 }]
        }
      ],
      createdAt: new Date('2025-08-10T13:30:00')
    },
    room: {
      id: 'room-tech-1',
      name: 'Code Forward Youth Bootcamp',
      description: 'Free 12-week coding bootcamp for underserved youth, teaching web development, problem-solving, and connecting students with tech career opportunities.',
      objectives: [
        'Recruit 30 students for first cohort',
        'Develop comprehensive curriculum',
        'Secure 10 industry mentors',
        'Arrange 5 company site visits',
        'Place 80% of graduates in internships'
      ],
      members: 72,
      impactScore: 920,
      quickActions: [
        { id: 'qa1', label: 'Log Impact', icon: '📊', action: 'impact-log', count: 31 },
        { id: 'qa2', label: 'Schedule Class', icon: '📚', action: 'schedule-class' },
        { id: 'qa3', label: 'Share Lesson', icon: '📝', action: 'share-resource', count: 48 },
        { id: 'qa4', label: 'Student Progress', icon: '📈', action: 'view-progress' },
        { id: 'qa5', label: 'Mentor Match', icon: '🤝', action: 'match-mentor' }
      ],
      createdAt: new Date('2025-08-11')
    }
  },
  {
    id: 'gt-3',
    title: 'Mental Wellness Circle',
    category: 'health',
    news: {
      id: 'news-health-1',
      title: 'Community-Led Mental Health Support Groups Show Remarkable Success',
      content: 'Peer support groups organized by community members are providing crucial mental health resources in areas with limited access to professional services...',
      summary: 'Peer-led support groups fill critical gaps in mental health services',
      publishedAt: new Date('2025-08-08'),
      engagement: 1567,
      comments: 112
    },
    chat: {
      id: 'chat-health-1',
      title: '💚 Creating Safe Spaces for Mental Wellness',
      participants: 42,
      messages: [
        {
          id: 'h1',
          author: 'Dr. Lisa Thompson',
          content: 'As a therapist, I see the need for more peer support. I\'d love to help train facilitators for a community group.',
          timestamp: new Date('2025-08-08T16:00:00'),
          reactions: [{ emoji: '💚', count: 28 }]
        },
        {
          id: 'h2',
          author: 'James Wilson',
          content: 'Thank you for stepping up. I\'ve been in recovery for 3 years and peer support saved my life. Ready to give back.',
          timestamp: new Date('2025-08-08T16:30:00'),
          reactions: [{ emoji: '🙏', count: 35 }]
        },
        {
          id: 'h3',
          author: 'Kai',
          content: 'This is powerful work! 🌟 Successful peer support groups typically include: 1) Trained facilitators, 2) Clear guidelines, 3) Regular meeting schedule, 4) Connection to professional resources. I can help develop a framework. Shall we proceed?',
          timestamp: new Date('2025-08-08T17:00:00'),
          isKai: true
        }
      ],
      createdAt: new Date('2025-08-08T15:30:00')
    },
    room: {
      id: 'room-health-1',
      name: 'Mindful Connections Support Circle',
      description: 'A peer-led mental wellness support group providing safe spaces for sharing, healing, and building resilience together.',
      objectives: [
        'Train 8 peer facilitators',
        'Establish weekly support meetings',
        'Create resource library',
        'Partner with 3 mental health organizations',
        'Support 100+ community members'
      ],
      members: 68,
      impactScore: 1100,
      quickActions: [
        { id: 'qa1', label: 'Log Impact', icon: '📊', action: 'impact-log', count: 45 },
        { id: 'qa2', label: 'Schedule Session', icon: '📅', action: 'schedule-session' },
        { id: 'qa3', label: 'Share Resource', icon: '📚', action: 'share-resource', count: 67 },
        { id: 'qa4', label: 'Check-In Form', icon: '💭', action: 'daily-checkin' },
        { id: 'qa5', label: 'Crisis Resources', icon: '🆘', action: 'crisis-help' }
      ],
      createdAt: new Date('2025-08-09')
    }
  },
  {
    id: 'gt-4',
    title: 'Youth Coding Club',
    category: 'education',
    news: {
      id: 'news-edu-1',
      title: 'After-School Coding Clubs Bridge Digital Divide for Students',
      content: 'Student-led coding clubs are teaching programming skills to peers, creating a supportive environment for learning technology...',
      summary: 'Student-led coding clubs democratize tech education',
      publishedAt: new Date('2025-08-06'),
      engagement: 987,
      comments: 73
    },
    chat: {
      id: 'chat-edu-1',
      title: '🖥️ Starting a Coding Club at Lincoln High',
      participants: 38,
      messages: [
        {
          id: 'e1',
          author: 'Maya Patel (Student)',
          content: 'We need a coding club at our school! I know Python and could teach beginners. Who\'s interested?',
          timestamp: new Date('2025-08-06T15:00:00'),
          reactions: [{ emoji: '🔥', count: 22 }]
        },
        {
          id: 'e2',
          author: 'Mr. Rodriguez (Teacher)',
          content: 'Great initiative Maya! I can sponsor the club and we can use the computer lab after school.',
          timestamp: new Date('2025-08-06T15:30:00')
        },
        {
          id: 'e3',
          author: 'Kai',
          content: 'Excellent student leadership! 🚀 For a successful coding club: 1) Start with block coding for beginners, 2) Project showcases each month, 3) Pair programming sessions, 4) Connect with local tech companies for speakers. Want help creating a semester plan?',
          timestamp: new Date('2025-08-06T16:00:00'),
          isKai: true
        }
      ],
      createdAt: new Date('2025-08-06T14:30:00')
    },
    room: {
      id: 'room-edu-1',
      name: 'Lincoln High Coders Club',
      description: 'Student-led coding club teaching programming, problem-solving, and creativity through technology.',
      objectives: [
        'Recruit 25 student members',
        'Complete 5 group projects',
        'Host monthly demo days',
        'Participate in 2 hackathons',
        'Create peer tutoring system'
      ],
      members: 43,
      impactScore: 780,
      quickActions: [
        { id: 'qa1', label: 'Log Impact', icon: '📊', action: 'impact-log', count: 19 },
        { id: 'qa2', label: 'Schedule Meeting', icon: '📅', action: 'schedule-meeting' },
        { id: 'qa3', label: 'Share Code', icon: '💻', action: 'share-code', count: 34 },
        { id: 'qa4', label: 'Start Project', icon: '🚀', action: 'new-project' },
        { id: 'qa5', label: 'Get Help', icon: '❓', action: 'ask-help' }
      ],
      createdAt: new Date('2025-08-07')
    }
  },
  {
    id: 'gt-5',
    title: 'Neighborhood Support Network',
    category: 'social',
    news: {
      id: 'news-social-1',
      title: 'Communities Build Mutual Aid Networks to Support Vulnerable Neighbors',
      content: 'In response to increasing isolation among elderly residents, neighborhoods are creating support networks for grocery delivery, medical appointments, and social connection...',
      summary: 'Neighbors organize to provide essential support for elderly and vulnerable community members',
      publishedAt: new Date('2025-08-12'),
      engagement: 756,
      comments: 45
    },
    chat: {
      id: 'chat-social-1',
      title: '🤝 Creating a Support Network for Our Seniors',
      participants: 28,
      messages: [
        {
          id: 's1',
          author: 'Maria Santos',
          content: 'My elderly neighbor mentioned she hasn\'t been able to get groceries. We need to organize something systematic.',
          timestamp: new Date('2025-08-12T09:00:00'),
          reactions: [{ emoji: '❤️', count: 18 }]
        },
        {
          id: 's2',
          author: 'Robert Kim',
          content: 'I drive for a rideshare company. I can dedicate Tuesdays and Thursdays for medical appointments.',
          timestamp: new Date('2025-08-12T09:30:00')
        },
        {
          id: 's3',
          author: 'Kai',
          content: 'Wonderful community care! 💙 Effective support networks need: 1) Volunteer scheduling system, 2) Need assessment process, 3) Emergency contact protocols, 4) Regular check-ins. I can help you build a sustainable system. Ready to organize?',
          timestamp: new Date('2025-08-12T10:00:00'),
          isKai: true
        }
      ],
      createdAt: new Date('2025-08-12T08:30:00')
    },
    room: {
      id: 'room-social-1',
      name: 'Oakwood Neighbors Helping Neighbors',
      description: 'Mutual aid network providing grocery delivery, transportation, and companionship for elderly and vulnerable neighbors.',
      objectives: [
        'Register 50 volunteers',
        'Support 30 elderly neighbors',
        'Establish weekly check-in calls',
        'Create emergency response system',
        'Partner with local services'
      ],
      members: 52,
      impactScore: 890,
      quickActions: [
        { id: 'qa1', label: 'Log Impact', icon: '📊', action: 'impact-log', count: 28 },
        { id: 'qa2', label: 'Schedule Visit', icon: '📅', action: 'schedule-visit' },
        { id: 'qa3', label: 'Request Help', icon: '🆘', action: 'request-help' },
        { id: 'qa4', label: 'Volunteer', icon: '🤲', action: 'volunteer-signup' },
        { id: 'qa5', label: 'Resources', icon: '📋', action: 'view-resources' }
      ],
      createdAt: new Date('2025-08-13')
    }
  }
];

// Helper function to get golden threads by category
export const getGoldenThreadsByCategory = (category: string) => {
  return goldenThreads.filter(thread => thread.category === category);
};

// Helper function to get related content
export const getRelatedContent = (id: string, type: 'news' | 'chat' | 'room' | 'club') => {
  const thread = goldenThreads.find(t => 
    t.news.id === id || 
    t.chat.id === id || 
    t.room.id === id || 
    t.club?.id === id
  );
  
  if (!thread) return null;
  
  return {
    news: thread.news,
    chat: thread.chat,
    room: thread.room,
    club: thread.club,
    progression: {
      newsToChat: true,
      chatToRoom: true,
      roomToClub: !!thread.club
    }
  };
};
