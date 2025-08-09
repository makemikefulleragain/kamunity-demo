import { NextResponse } from 'next/server'

// Mock data that matches our seeded chat rooms for demo purposes
const mockChatRooms = [
  {
    id: 'room-urban-farming',
    name: 'Urban Farming Discussion',
    description: 'Exploring sustainable urban agriculture and community gardens',
    emoji_theme: '🌱',
    room_type: 'chat',
    max_participants: 50,
    current_participants: 6,
    is_active: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    messageCount: 12,
    lastActivity: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: 'room-ai-education',
    name: 'AI in Education Chat',
    description: 'Discussing the integration of AI tools in teaching and learning',
    emoji_theme: '🤖',
    room_type: 'chat',
    max_participants: 30,
    current_participants: 4,
    is_active: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    messageCount: 7,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: 'room-climate-action',
    name: 'Climate Action Ideas',
    description: 'Brainstorming actionable solutions for climate change',
    emoji_theme: '🌍',
    room_type: 'chat',
    max_participants: 100,
    current_participants: 8,
    is_active: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    messageCount: 15,
    lastActivity: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  }
]

export async function GET() {
  try {
    console.log('Mock Chat API - Returning demo data')
    
    // Return mock data that matches our seeded database
    return NextResponse.json(mockChatRooms)
    
  } catch (error) {
    console.error('Mock API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
