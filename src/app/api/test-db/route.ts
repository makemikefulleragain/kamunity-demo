import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    console.log('Testing database connection...')
    console.log('Environment variables:')
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing')
    console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing')
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ 
        error: 'Missing environment variables',
        details: {
          url: !!supabaseUrl,
          key: !!supabaseKey
        }
      }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test simple query
    const { data, error } = await supabase
      .from('rooms')
      .select('id, name, room_type')
      .limit(5)
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ 
        error: 'Database query failed',
        details: error
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Database connection working',
      rooms: data
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
