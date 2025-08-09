import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client with service role key for demo
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(`Missing Supabase environment variables: URL=${!!supabaseUrl}, KEY=${!!supabaseKey}`)
  }
  
  return createClient(supabaseUrl, supabaseKey)
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Chat room API - Fetching room ${params.id}...`)
    
    const supabase = createSupabaseClient()
    
    // Fetch the specific chat room
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', params.id)
      .eq('room_type', 'chat')
      .eq('is_active', true)
      .single()

    let chatRoom = room;

    // If room not found, try to create it as a promoted chat room
    if (roomError || !room) {
      console.log(`Creating promoted chat room: ${params.id}`)
      
      const roomData = {
        id: params.id,
        name: `News Discussion Room`,
        description: 'Discussion promoted from news comments',
        emoji_theme: '💬',
        room_type: 'chat',
        max_participants: 100,
        current_participants: 0,
        is_active: true,
        created_by: null
      };
      
      console.log('Attempting to insert room with data:', roomData);
      
      // Create a new chat room for promoted news discussion
      const { data: newRoom, error: createError } = await supabase
        .from('rooms')
        .insert(roomData)
        .select()
        .single()

      if (createError) {
        console.error('Error creating promoted chat room - Full error details:', createError)
        console.error('Error code:', createError.code)
        console.error('Error message:', createError.message)
        console.error('Error details:', createError.details)
        console.error('Error hint:', createError.hint)
        return NextResponse.json({ 
          error: 'Failed to create chat room',
          details: createError.message,
          code: createError.code
        }, { status: 500 })
      }

      chatRoom = newRoom;
      console.log(`Successfully created promoted chat room: ${params.id}`)

      // Add a welcome message to the new chat room
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          room_id: params.id,
          user_id: null, // System messages use null user_id
          content: `🎉 Welcome to this discussion! This chat was created from a popular news discussion. Feel free to continue the conversation here!`,
          message_type: 'system'
        })

      if (messageError) {
        console.error('Failed to add welcome message - Full error:', messageError)
        console.error('Message error code:', messageError.code)
        console.error('Message error details:', messageError.message)
        // Don't fail the request if welcome message fails
      } else {
        console.log('Welcome message added successfully')
      }
    } else if (roomError || !room) {
      console.error('Room not found or error:', roomError)
      return NextResponse.json({ error: 'Chat room not found' }, { status: 404 })
    }

    // Fetch messages for this room
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', params.id)
      .order('created_at', { ascending: true })

    if (messagesError) {
      console.error('Error fetching messages:', messagesError)
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }

    console.log(`Found room "${chatRoom.name}" with ${messages?.length || 0} messages`)

    return NextResponse.json({
      room: chatRoom,
      messages: messages || []
    })

  } catch (error) {
    console.error('Error in chat room API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
