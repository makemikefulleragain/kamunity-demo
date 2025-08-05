import { Community, Club, FocusRoom, User, Conversation, Message } from '@/types/communities';

// Extending with relations for easy mocking
export type MockUser = User;

export type MockCommunity = Community & {
  clubs: MockClub[];
  members: MockUser[];
};

export type MockClub = Club & {
  rooms: MockFocusRoom[];
  members: MockUser[];
  community: MockCommunity;
};

export type MockFocusRoom = FocusRoom & {
  members: MockUser[];
  club: MockClub;
  conversations: MockConversation[];
};

export type MockConversation = Conversation & {
    messages: MockMessage[];
    FocusRoom: MockFocusRoom;
}

export type MockMessage = Message & {
    author: MockUser;
}

export const mockUsers: MockUser[] = [
  { id: 'user-1', name: 'Alice', email: 'alice@kamunity.dev', avatarUrl: 'https://i.pravatar.cc/150?u=user-1', createdAt: new Date(), updatedAt: new Date() },
  { id: 'user-2', name: 'Bob', email: 'bob@kamunity.dev', avatarUrl: 'https://i.pravatar.cc/150?u=user-2', createdAt: new Date(), updatedAt: new Date() },
  { id: 'user-3', name: 'Charlie', email: 'charlie@kamunity.dev', avatarUrl: 'https://i.pravatar.cc/150?u=user-3', createdAt: new Date(), updatedAt: new Date() },
  { id: 'user-4', name: 'Diana', email: 'diana@kamunity.dev', avatarUrl: 'https://i.pravatar.cc/150?u=user-4', createdAt: new Date(), updatedAt: new Date() },
];

export const mockCommunities: MockCommunity[] = [
  {
    id: 'comm-1',
    name: 'Sustainable Urban Development',
    description: 'A collective dedicated to creating greener, more sustainable cities through technology and community action.',
    imageUrl: '/images/community-1.jpg',
    federationType: 'cooperative',
    minimumClubs: 3,
    isActive: true,
    governanceRules: { rule: 'majority_vote' },
    featuredContent: 'Our 2025 Green City Blueprint is now available for review.',
    tags: ['sustainability', 'smart-cities', 'urban-planning', 'community'],
    visibility: 'public',
    createdAt: new Date(),
    updatedAt: new Date(),
    clubs: [],
    members: mockUsers.slice(0, 2),
  },
];

export const mockClubs: MockClub[] = [
  {
    id: 'club-1',
    name: 'Renewable Energy Initiatives',
    description: 'Focusing on the implementation of solar, wind, and other renewable energy sources in urban settings.',
    imageUrl: 'https://placehold.co/600x400/0E101D/FFF?text=Club+1',
    status: 'active',
    minimumRooms: 2,
    isEligibleForCommunity: true,
    purpose: 'To accelerate the adoption of clean energy in our city.',
    achievements: { projects_completed: 5 },
    tags: ['renewable-energy', 'solar', 'wind', 'policy'],
    communityId: 'comm-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    rooms: [],
    members: mockUsers.slice(0, 2),
    community: mockCommunities[0],
  },
  {
    id: 'club-2',
    name: 'Community Gardens & Local Food',
    description: 'Promoting local food production through community gardens, urban farming, and local markets.',
    imageUrl: 'https://placehold.co/600x400/0E101D/FFF?text=Club+2',
    status: 'active',
    minimumRooms: 2,
    isEligibleForCommunity: true,
    purpose: 'To build a resilient and equitable local food system.',
    achievements: { gardens_created: 12 },
    tags: ['urban-farming', 'food-security', 'local-food'],
    communityId: 'comm-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    rooms: [],
    members: mockUsers.slice(2, 4),
    community: mockCommunities[0],
  },
];

mockCommunities[0].clubs = mockClubs;

export const mockFocusRooms: MockFocusRoom[] = [
  {
    id: 'room-1',
    name: 'Solar Panel Policy Drafting',
    purpose: 'To draft a policy proposal for subsidizing residential solar panel installations.',
    status: 'active',
    isPrivate: false,
    maxMembers: 20,
    description: 'Weekly meetings to review and amend the policy draft. Open to all members of the Renewable Energy club.',
    tags: ['policy', 'solar', 'subsidies'],
    pinnedContent: 'Latest draft version: v2.3',
    lastActivity: new Date(),
    messageCount: 128,
    memberCount: 15,
    clubId: 'club-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    members: mockUsers.slice(0, 1),
    club: mockClubs[0],
    conversations: [],
  },
  {
    id: 'room-2',
    name: 'Rooftop Garden Planning',
    purpose: 'Coordinate the logistics for the new rooftop garden at the community center.',
    status: 'active',
    isPrivate: false,
    maxMembers: 50,
    description: 'Planning sessions, volunteer coordination, and resource management for the new garden.',
    tags: ['gardening', 'logistics', 'volunteering'],
    pinnedContent: 'Volunteer sign-up sheet is now open!',
    lastActivity: new Date(),
    messageCount: 345,
    memberCount: 32,
    clubId: 'club-2',
    createdAt: new Date(),
    updatedAt: new Date(),
    members: mockUsers.slice(2, 3),
    club: mockClubs[1],
    conversations: [],
  },
];

mockClubs[0].rooms = [mockFocusRooms[0]];
mockClubs[1].rooms = [mockFocusRooms[1]];

export const mockConversations: MockConversation[] = [
    {
        id: 'convo-1',
        sourceType: 'FocusRoom',
        sourceId: 'room-1',
        topic: 'Discussion on Policy Draft v2.3',
        createdAt: new Date(),
        updatedAt: new Date(),
        focusRoomId: 'room-1',
        FocusRoom: mockFocusRooms[0],
        messages: [],
    },
    {
        id: 'convo-2',
        sourceType: 'FocusRoom',
        sourceId: 'room-2',
        topic: 'Volunteer coordination for Saturday',
        createdAt: new Date(),
        updatedAt: new Date(),
        focusRoomId: 'room-2',
        FocusRoom: mockFocusRooms[1],
        messages: [],
    }
];

mockFocusRooms[0].conversations = [mockConversations[0]];
mockFocusRooms[1].conversations = [mockConversations[1]];

export const mockMessages: MockMessage[] = [
    { id: 'msg-1', content: 'I think we should increase the subsidy percentage in section 2.', createdAt: new Date(), authorId: 'user-1', conversationId: 'convo-1', author: mockUsers[0] },
    { id: 'msg-2', content: 'Good point, Alice. I will update the draft.', createdAt: new Date(), authorId: 'user-2', conversationId: 'convo-1', author: mockUsers[1] },
    { id: 'msg-3', content: 'We need more volunteers for the morning shift on Saturday.', createdAt: new Date(), authorId: 'user-3', conversationId: 'convo-2', author: mockUsers[2] },
    { id: 'msg-4', content: 'I can join the morning shift. What time does it start?', createdAt: new Date(), authorId: 'user-4', conversationId: 'convo-2', author: mockUsers[3] },
];

mockConversations[0].messages = mockMessages.slice(0, 2);
mockConversations[1].messages = mockMessages.slice(2, 4);
