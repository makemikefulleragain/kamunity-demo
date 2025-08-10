import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Fixing RLS policies for demo deployment...')

    // Fix users table RLS policy to allow demo signups
    const usersPolicySQL = `
      -- Drop existing restrictive policies
      DROP POLICY IF EXISTS "Users can only view own profile" ON users;
      DROP POLICY IF EXISTS "Users can only update own profile" ON users;
      DROP POLICY IF EXISTS "Only authenticated users can insert" ON users;
      
      -- Create permissive policies for demo
      CREATE POLICY "Allow demo user creation" ON users
        FOR INSERT WITH CHECK (true);
        
      CREATE POLICY "Allow demo user updates" ON users
        FOR UPDATE USING (true);
        
      CREATE POLICY "Allow demo user reads" ON users
        FOR SELECT USING (true);
    `

    const { error: usersError } = await supabase.rpc('exec_sql', { 
      sql: usersPolicySQL 
    })

    if (usersError) {
      console.error('Users RLS policy error:', usersError)
    } else {
      console.log('✅ Users RLS policies updated')
    }

    // Fix rooms table RLS policies
    const roomsPolicySQL = `
      -- Drop existing restrictive policies
      DROP POLICY IF EXISTS "Rooms are viewable by everyone" ON rooms;
      DROP POLICY IF EXISTS "Only authenticated users can create rooms" ON rooms;
      
      -- Create permissive policies for demo
      CREATE POLICY "Allow demo room creation" ON rooms
        FOR INSERT WITH CHECK (true);
        
      CREATE POLICY "Allow demo room reads" ON rooms
        FOR SELECT USING (true);
        
      CREATE POLICY "Allow demo room updates" ON rooms
        FOR UPDATE USING (true);
    `

    const { error: roomsError } = await supabase.rpc('exec_sql', { 
      sql: roomsPolicySQL 
    })

    if (roomsError) {
      console.error('Rooms RLS policy error:', roomsError)
    } else {
      console.log('✅ Rooms RLS policies updated')
    }

    // Fix messages table RLS policies
    const messagesPolicySQL = `
      -- Drop existing restrictive policies
      DROP POLICY IF EXISTS "Messages are viewable by everyone" ON messages;
      DROP POLICY IF EXISTS "Only authenticated users can create messages" ON messages;
      
      -- Create permissive policies for demo
      CREATE POLICY "Allow demo message creation" ON messages
        FOR INSERT WITH CHECK (true);
        
      CREATE POLICY "Allow demo message reads" ON messages
        FOR SELECT USING (true);
    `

    const { error: messagesError } = await supabase.rpc('exec_sql', { 
      sql: messagesPolicySQL 
    })

    if (messagesError) {
      console.error('Messages RLS policy error:', messagesError)
    } else {
      console.log('✅ Messages RLS policies updated')
    }

    return NextResponse.json({
      success: true,
      message: 'RLS policies updated for demo deployment',
      timestamp: new Date().toISOString(),
      policies_updated: ['users', 'rooms', 'messages']
    })

  } catch (error) {
    console.error('RLS Policy Fix Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update RLS policies',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}
