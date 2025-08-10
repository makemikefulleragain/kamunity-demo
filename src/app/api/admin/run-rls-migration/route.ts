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
    console.log('🔧 Running RLS migration for demo deployment...')

    // Execute RLS policy fixes
    const rlsFixes = [
      // Users table policies
      `DROP POLICY IF EXISTS "Users can only view own profile" ON users`,
      `DROP POLICY IF EXISTS "Users can only update own profile" ON users`, 
      `DROP POLICY IF EXISTS "Only authenticated users can insert" ON users`,
      `CREATE POLICY "Allow demo user creation" ON users FOR INSERT WITH CHECK (true)`,
      `CREATE POLICY "Allow demo user updates" ON users FOR UPDATE USING (true)`,
      `CREATE POLICY "Allow demo user reads" ON users FOR SELECT USING (true)`,
      
      // Rooms table policies
      `DROP POLICY IF EXISTS "Rooms are viewable by everyone" ON rooms`,
      `DROP POLICY IF EXISTS "Only authenticated users can create rooms" ON rooms`,
      `CREATE POLICY "Allow demo room creation" ON rooms FOR INSERT WITH CHECK (true)`,
      `CREATE POLICY "Allow demo room reads" ON rooms FOR SELECT USING (true)`,
      `CREATE POLICY "Allow demo room updates" ON rooms FOR UPDATE USING (true)`,
      
      // Messages table policies
      `DROP POLICY IF EXISTS "Messages are viewable by everyone" ON messages`,
      `DROP POLICY IF EXISTS "Only authenticated users can create messages" ON messages`,
      `CREATE POLICY "Allow demo message creation" ON messages FOR INSERT WITH CHECK (true)`,
      `CREATE POLICY "Allow demo message reads" ON messages FOR SELECT USING (true)`
    ]

    const results = []
    
    for (const sql of rlsFixes) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql })
        if (error) {
          console.error(`SQL Error for "${sql}":`, error)
          results.push({ sql, success: false, error: error.message })
        } else {
          console.log(`✅ Executed: ${sql}`)
          results.push({ sql, success: true })
        }
      } catch (err) {
        console.error(`Exception for "${sql}":`, err)
        results.push({ sql, success: false, error: 'Exception occurred' })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'RLS migration completed',
      timestamp: new Date().toISOString(),
      results
    })

  } catch (error) {
    console.error('RLS Migration Error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to run RLS migration',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'RLS Migration API is ready',
    timestamp: new Date().toISOString(),
    description: 'POST to run RLS policy fixes for demo deployment'
  })
}
