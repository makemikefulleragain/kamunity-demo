const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔄 Enabling demo access for chat functionality...')

async function enableDemoAccess() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    // First, let's check if we have any chat rooms
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .eq('room_type', 'chat')
    
    console.log('📊 Current chat rooms:', rooms?.length || 0)
    if (roomsError) console.log('❌ Rooms error:', roomsError)
    
    // Check messages
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .limit(5)
    
    console.log('📊 Current messages:', messages?.length || 0)
    if (messagesError) console.log('❌ Messages error:', messagesError)
    
    // If no data, let's create some basic test data
    if (!rooms || rooms.length === 0) {
      console.log('🌱 Creating test chat room...')
      
      const { data: newRoom, error: createError } = await supabase
        .from('rooms')
        .insert({
          name: 'AI in Education Chat',
          description: 'Discussing the integration of AI tools in teaching and learning',
          emoji_theme: '🤖',
          room_type: 'chat',
          max_participants: 50,
          current_participants: 4,
          is_active: true
        })
        .select()
        .single()
      
      if (createError) {
        console.log('❌ Error creating room:', createError)
      } else {
        console.log('✅ Created test room:', newRoom?.name)
        
        // Add some test messages
        const testMessages = [
          { content: 'Welcome to the AI in Education chat! 🎓', message_type: 'system' },
          { content: 'Has anyone tried using ChatGPT for lesson planning?', message_type: 'text' },
          { content: 'Yes! It\'s been a game-changer for creating engaging activities', message_type: 'text' },
          { content: 'What about AI for student assessment? Any thoughts?', message_type: 'text' }
        ]
        
        for (const msg of testMessages) {
          await supabase
            .from('messages')
            .insert({
              room_id: newRoom.id,
              content: msg.content,
              message_type: msg.message_type,
              user_id: null // For demo purposes
            })
        }
        
        console.log('✅ Added test messages')
      }
    }
    
    console.log('🎉 Demo access setup complete!')
    
  } catch (error) {
    console.error('❌ Setup error:', error)
  }
}

enableDemoAccess()
