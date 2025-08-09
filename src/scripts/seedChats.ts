import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables:')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'Set' : 'Missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Sample users for seeding
const sampleUsers = [
  { id: 'user-1', name: 'Sarah Chen', username: 'sarahc', email: 'sarah@example.com', emoji_avatar: '🌱' },
  { id: 'user-2', name: 'Marcus Johnson', username: 'marcusj', email: 'marcus@example.com', emoji_avatar: '🔬' },
  { id: 'user-3', name: 'Elena Rodriguez', username: 'elenar', email: 'elena@example.com', emoji_avatar: '🎨' },
  { id: 'user-4', name: 'David Kim', username: 'davidk', email: 'david@example.com', emoji_avatar: '💡' },
  { id: 'user-5', name: 'Priya Patel', username: 'priyap', email: 'priya@example.com', emoji_avatar: '🚀' },
  { id: 'user-6', name: 'Alex Thompson', username: 'alext', email: 'alex@example.com', emoji_avatar: '🌍' },
]

// Sample chat rooms for different conversation types
const sampleRooms = [
  {
    id: 'chat-urban-farming',
    name: 'Urban Farming Discussion',
    description: 'Casual chat about sustainable urban agriculture',
    emoji_theme: '🌱',
    room_type: 'chat',
    max_participants: 20,
    current_participants: 4,
    is_active: true,
    created_by: 'user-1'
  },
  {
    id: 'chat-ai-education',
    name: 'AI in Education Chat',
    description: 'Exploring how AI can transform learning',
    emoji_theme: '🤖',
    room_type: 'chat',
    max_participants: 20,
    current_participants: 3,
    is_active: true,
    created_by: 'user-2'
  },
  {
    id: 'chat-climate-action',
    name: 'Climate Action Ideas',
    description: 'Brainstorming local climate initiatives',
    emoji_theme: '🌍',
    room_type: 'chat',
    max_participants: 20,
    current_participants: 5,
    is_active: true,
    created_by: 'user-6'
  }
]

// Conversation data for Urban Farming (ready for promotion)
const urbanFarmingMessages = [
  {
    user_id: 'user-1',
    content: 'Hey everyone! I\'ve been thinking about starting a community garden in our neighbourhood. Anyone interested?',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() // 3 days ago
  },
  {
    user_id: 'user-2',
    content: 'That sounds amazing! I\'ve been researching vertical farming techniques. Could be perfect for small urban spaces.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 15).toISOString()
  },
  {
    user_id: 'user-3',
    content: 'Count me in! I have experience with permaculture design. We could create something really sustainable.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 30).toISOString()
  },
  {
    user_id: 'user-4',
    content: 'I work in soil science - happy to help with soil testing and preparation. This could be a great pilot project.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() // 2 days ago
  },
  {
    user_id: 'user-1',
    content: 'Wow, we have such great expertise here! Should we start mapping out potential locations?',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 45).toISOString()
  },
  {
    user_id: 'user-2',
    content: 'I found three potential sites near the community centre. All get good sunlight and have water access.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString() // 1 day ago
  },
  {
    user_id: 'user-3',
    content: 'Perfect! We should also think about what crops would work best for our climate and growing season.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1 + 1000 * 60 * 20).toISOString()
  },
  {
    user_id: 'user-4',
    content: 'I can bring soil samples from all three sites for testing. We need to check pH, nutrients, and contamination.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() // 12 hours ago
  },
  {
    user_id: 'user-1',
    content: 'This is getting exciting! Should we organize a site visit this weekend?',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() // 8 hours ago
  },
  {
    user_id: 'user-2',
    content: 'Yes! And maybe we should start thinking about forming a proper working group for this project.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() // 6 hours ago
  },
  {
    user_id: 'user-3',
    content: 'Agreed. We have enough momentum and expertise to make this a real community initiative.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() // 4 hours ago
  },
  {
    user_id: 'user-4',
    content: 'I think we\'re ready to take this to the next level. This conversation has been so productive!',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
  }
]

// AI Education conversation (medium activity)
const aiEducationMessages = [
  {
    user_id: 'user-2',
    content: 'Has anyone tried using AI tools in their teaching? I\'m curious about the practical applications.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    user_id: 'user-5',
    content: 'I\'ve been experimenting with AI-assisted lesson planning. It\'s surprisingly helpful for generating diverse examples.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 30).toISOString()
  },
  {
    user_id: 'user-4',
    content: 'That\'s interesting! What about student assessment? I worry about academic integrity issues.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
  },
  {
    user_id: 'user-2',
    content: 'Good point. We need to teach students how to use AI ethically rather than just banning it.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString()
  },
  {
    user_id: 'user-5',
    content: 'Exactly! AI literacy should be part of the curriculum, not something we ignore.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    user_id: 'user-4',
    content: 'Maybe we should develop some guidelines for AI use in educational settings?',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
  },
  {
    user_id: 'user-2',
    content: 'That would be valuable. A collaborative approach could work well here.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
  }
]

// Climate Action conversation (high activity, ready for promotion)
const climateActionMessages = [
  {
    user_id: 'user-6',
    content: 'Our city just announced new climate targets. We should organize some local action!',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString()
  },
  {
    user_id: 'user-1',
    content: 'Yes! I saw that announcement. The 2030 carbon neutrality goal is ambitious but achievable.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4 + 1000 * 60 * 20).toISOString()
  },
  {
    user_id: 'user-3',
    content: 'What if we focus on transportation first? That\'s the biggest source of emissions here.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
  },
  {
    user_id: 'user-5',
    content: 'Great idea! We could advocate for more bike lanes and electric bus routes.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 45).toISOString()
  },
  {
    user_id: 'user-2',
    content: 'Don\'t forget about building efficiency. Retrofitting old buildings could have huge impact.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    user_id: 'user-4',
    content: 'We need data to make compelling arguments. I can help with impact calculations.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 30).toISOString()
  },
  {
    user_id: 'user-6',
    content: 'This is exactly what we need - a coordinated, evidence-based approach.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
  },
  {
    user_id: 'user-1',
    content: 'Should we reach out to other environmental groups in the area?',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString()
  },
  {
    user_id: 'user-3',
    content: 'Definitely! Coalition building will be key to making real change.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString()
  },
  {
    user_id: 'user-5',
    content: 'I know contacts at three local environmental orgs. Happy to make introductions.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    user_id: 'user-2',
    content: 'Perfect! We should also think about engaging city council directly.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString()
  },
  {
    user_id: 'user-4',
    content: 'I can prepare a presentation with our impact projections and recommendations.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString()
  },
  {
    user_id: 'user-6',
    content: 'This conversation has been so productive. We\'re building something real here!',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
  },
  {
    user_id: 'user-1',
    content: 'Agreed! Maybe it\'s time to formalize this into a proper action group?',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
  },
  {
    user_id: 'user-3',
    content: 'Yes! We have the expertise, passion, and momentum to make a real difference.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  }
]

export async function seedChatData() {
  try {
    console.log('🌱 Starting chat data seeding...')

    // Insert sample users
    console.log('👥 Creating sample users...')
    for (const user of sampleUsers) {
      const { error } = await supabase
        .from('users')
        .upsert(user, { onConflict: 'id' })
      
      if (error && error.code !== '23505') { // Ignore unique constraint violations
        console.error(`Error creating user ${user.name}:`, error)
      }
    }

    // Insert sample rooms
    console.log('🏠 Creating sample chat rooms...')
    for (const room of sampleRooms) {
      const { error } = await supabase
        .from('rooms')
        .upsert(room, { onConflict: 'id' })
      
      if (error && error.code !== '23505') {
        console.error(`Error creating room ${room.name}:`, error)
      }
    }

    // Insert room participants
    console.log('👋 Adding room participants...')
    const participantData = [
      // Urban Farming participants
      { user_id: 'user-1', room_id: 'chat-urban-farming' },
      { user_id: 'user-2', room_id: 'chat-urban-farming' },
      { user_id: 'user-3', room_id: 'chat-urban-farming' },
      { user_id: 'user-4', room_id: 'chat-urban-farming' },
      
      // AI Education participants
      { user_id: 'user-2', room_id: 'chat-ai-education' },
      { user_id: 'user-4', room_id: 'chat-ai-education' },
      { user_id: 'user-5', room_id: 'chat-ai-education' },
      
      // Climate Action participants
      { user_id: 'user-1', room_id: 'chat-climate-action' },
      { user_id: 'user-2', room_id: 'chat-climate-action' },
      { user_id: 'user-3', room_id: 'chat-climate-action' },
      { user_id: 'user-4', room_id: 'chat-climate-action' },
      { user_id: 'user-5', room_id: 'chat-climate-action' },
      { user_id: 'user-6', room_id: 'chat-climate-action' },
    ]

    for (const participant of participantData) {
      const { error } = await supabase
        .from('room_participants')
        .upsert({
          ...participant,
          joined_at: new Date().toISOString(),
          last_active: new Date().toISOString()
        }, { onConflict: 'user_id,room_id' })
      
      if (error && error.code !== '23505') {
        console.error('Error adding participant:', error)
      }
    }

    // Insert messages
    console.log('💬 Creating chat messages...')
    
    // Urban Farming messages
    for (const message of urbanFarmingMessages) {
      const { error } = await supabase
        .from('messages')
        .insert({
          ...message,
          room_id: 'chat-urban-farming',
          message_type: 'text'
        })
      
      if (error) {
        console.error('Error creating urban farming message:', error)
      }
    }

    // AI Education messages
    for (const message of aiEducationMessages) {
      const { error } = await supabase
        .from('messages')
        .insert({
          ...message,
          room_id: 'chat-ai-education',
          message_type: 'text'
        })
      
      if (error) {
        console.error('Error creating AI education message:', error)
      }
    }

    // Climate Action messages
    for (const message of climateActionMessages) {
      const { error } = await supabase
        .from('messages')
        .insert({
          ...message,
          room_id: 'chat-climate-action',
          message_type: 'text'
        })
      
      if (error) {
        console.error('Error creating climate action message:', error)
      }
    }

    console.log('✅ Chat data seeding completed successfully!')
    console.log('📊 Summary:')
    console.log(`   • ${sampleUsers.length} users created`)
    console.log(`   • ${sampleRooms.length} chat rooms created`)
    console.log(`   • ${urbanFarmingMessages.length + aiEducationMessages.length + climateActionMessages.length} messages created`)
    console.log('🚀 Ready to test chat-to-room promotion!')

  } catch (error) {
    console.error('❌ Error seeding chat data:', error)
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedChatData()
}
