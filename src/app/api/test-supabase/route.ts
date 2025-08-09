import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    console.log('=== SUPABASE DIAGNOSTIC TEST ===')
    
    // Test environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log('Environment check:')
    console.log('- URL:', supabaseUrl ? 'Set' : 'Missing')
    console.log('- Anon Key:', supabaseAnonKey ? 'Set' : 'Missing')
    console.log('- Service Key:', supabaseServiceKey ? 'Set' : 'Missing')
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        error: 'Missing environment variables',
        details: { url: !!supabaseUrl, anonKey: !!supabaseAnonKey }
      }, { status: 500 })
    }
    
    // Test with anon key (for realtime)
    console.log('Testing with anon key...')
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey)
    
    // Test basic query
    const { data: rooms, error: roomsError } = await supabaseAnon
      .from('rooms')
      .select('id, name, room_type')
      .limit(3)
    
    console.log('Basic query result:', { rooms, error: roomsError })
    
    // Test messages table access
    const { data: messages, error: messagesError } = await supabaseAnon
      .from('messages')
      .select('id, content, created_at')
      .limit(5)
    
    console.log('Messages query result:', { messages, error: messagesError })
    
    // Test with service role key
    if (supabaseServiceKey) {
      console.log('Testing with service role key...')
      const supabaseService = createClient(supabaseUrl, supabaseServiceKey)
      
      const { data: serviceRooms, error: serviceError } = await supabaseService
        .from('rooms')
        .select('id, name')
        .limit(2)
      
      console.log('Service role query result:', { serviceRooms, error: serviceError })
    }
    
    return NextResponse.json({
      success: true,
      diagnostics: {
        environment: {
          url: !!supabaseUrl,
          anonKey: !!supabaseAnonKey,
          serviceKey: !!supabaseServiceKey
        },
        anonKeyTest: {
          rooms: rooms?.length || 0,
          roomsError: roomsError?.message || null,
          messages: messages?.length || 0,
          messagesError: messagesError?.message || null
        }
      }
    })
    
  } catch (error) {
    console.error('Diagnostic test error:', error)
    return NextResponse.json({
      error: 'Diagnostic test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
