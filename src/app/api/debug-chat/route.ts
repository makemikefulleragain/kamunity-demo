import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Missing env vars' }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test 1: Check if we can query rooms table
    console.log('Test 1: Querying existing rooms...')
    const { data: existingRooms, error: queryError } = await supabase
      .from('rooms')
      .select('*')
      .limit(3)
    
    if (queryError) {
      console.error('Query error:', queryError)
      return NextResponse.json({ 
        error: 'Query failed', 
        details: queryError.message,
        step: 'querying_rooms'
      }, { status: 500 })
    }
    
    // Test 2: Try to insert a simple room
    console.log('Test 2: Attempting to insert test room...')
    const testRoomId = `test_${Date.now()}`
    const { data: newRoom, error: insertError } = await supabase
      .from('rooms')
      .insert({
        id: testRoomId,
        name: 'Debug Test Room',
        description: 'Test room for debugging',
        emoji_theme: '🔧',
        room_type: 'chat',
        max_participants: 50,
        current_participants: 0,
        is_active: true,
        created_by: null
      })
      .select()
      .single()
    
    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ 
        error: 'Insert failed', 
        details: insertError.message,
        code: insertError.code,
        hint: insertError.hint,
        step: 'inserting_room'
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'All tests passed',
      existingRooms: existingRooms?.length || 0,
      newRoom: newRoom?.id
    })
    
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Unexpected error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
