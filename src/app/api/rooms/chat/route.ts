import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client with error handling
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(`Missing Supabase environment variables: URL=${!!supabaseUrl}, KEY=${!!supabaseKey}`)
  }
  
  return createClient(supabaseUrl, supabaseKey)
}

export async function GET() {
  try {
    console.log('Chat API - Starting request...')
    
    const supabase = createSupabaseClient()
    console.log('Supabase client created successfully')
    
    // Fetch chat rooms with message counts
    console.log('Fetching chat rooms...')
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .eq('room_type', 'chat')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    console.log('Rooms fetched:', rooms?.length || 0, 'rooms')
    console.log('Raw rooms data:', rooms)
    
    if (roomsError) {
      console.error('Error fetching rooms:', roomsError)
      return NextResponse.json({ error: 'Failed to fetch chat rooms' }, { status: 500 })
    }

    // Get message counts for each room
    const roomsWithCounts = await Promise.all(
      (rooms || []).map(async (room: unknown) => {
        const { count: messageCount, error: countError } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('room_id', room.id)

        if (countError) {
          console.error(`Error counting messages for room ${room.id}:`, countError)
        }

        // Get last activity
        const { data: lastMessage } = await supabase
          .from('messages')
          .select('created_at')
          .eq('room_id', room.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        return {
          ...room,
          messageCount: messageCount || 0,
          lastActivity: lastMessage?.created_at || room.created_at
        }
      })
    )

    return NextResponse.json(roomsWithCounts)
  } catch (error) {
    console.error('Error in chat rooms API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
