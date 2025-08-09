const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Debugging database contents...')

async function debugDatabase() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    // Check all rooms (not just chat type)
    console.log('\n📊 ALL ROOMS:')
    const { data: allRooms, error: allRoomsError } = await supabase
      .from('rooms')
      .select('*')
    
    console.log('Total rooms:', allRooms?.length || 0)
    if (allRoomsError) console.log('❌ Error:', allRoomsError)
    if (allRooms) {
      allRooms.forEach(room => {
        console.log(`- ${room.name} (type: "${room.room_type}", active: ${room.is_active})`)
      })
    }
    
    // Check specifically for chat rooms
    console.log('\n📊 CHAT ROOMS ONLY:')
    const { data: chatRooms, error: chatError } = await supabase
      .from('rooms')
      .select('*')
      .eq('room_type', 'chat')
    
    console.log('Chat rooms:', chatRooms?.length || 0)
    if (chatError) console.log('❌ Error:', chatError)
    if (chatRooms) {
      chatRooms.forEach(room => {
        console.log(`- ${room.name} (active: ${room.is_active}, created: ${room.created_at})`)
      })
    }
    
    // Check messages
    console.log('\n📊 MESSAGES:')
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .limit(5)
    
    console.log('Total messages:', messages?.length || 0)
    if (msgError) console.log('❌ Error:', msgError)
    if (messages) {
      messages.forEach(msg => {
        console.log(`- "${msg.content}" (room: ${msg.room_id})`)
      })
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error)
  }
}

debugDatabase()
