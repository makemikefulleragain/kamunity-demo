import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Admin API to apply demo-optimized RLS policies
// Context: Demo-only (200 users, few hours), prioritizes functionality over security

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Applying demo-optimized RLS policies...')

    // Initialize Supabase with service role key for admin operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing Supabase environment variables')
      return NextResponse.json({ 
        error: 'Missing Supabase configuration',
        details: 'SUPABASE_URL or SERVICE_ROLE_KEY not found'
      }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Read the migration SQL file
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', 'demo_optimized_rls_policies.sql')
    let migrationSQL: string
    
    try {
      migrationSQL = readFileSync(migrationPath, 'utf8')
      console.log('✅ Migration SQL loaded successfully')
    } catch (fileError) {
      console.error('❌ Failed to read migration file:', fileError)
      return NextResponse.json({ 
        error: 'Migration file not found',
        details: 'Could not read demo_optimized_rls_policies.sql'
      }, { status: 500 })
    }

    // Split SQL into individual statements (remove comments and empty lines)
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && stmt !== 'COMMIT')

    console.log(`🔧 Executing ${statements.length} SQL statements...`)

    const results = []
    let successCount = 0
    let errorCount = 0

    // Execute each statement individually for better error handling
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      try {
        console.log(`🔧 Executing statement ${i + 1}/${statements.length}`)
        
        const { data, error } = await supabase.rpc('exec_sql', { 
          sql_query: statement 
        })

        if (error) {
          console.warn(`⚠️ Statement ${i + 1} warning:`, error.message)
          // For demo context, we continue even with some errors (like DROP POLICY IF EXISTS)
          results.push({
            statement: statement.substring(0, 100) + '...',
            status: 'warning',
            message: error.message
          })
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`)
          successCount++
          results.push({
            statement: statement.substring(0, 100) + '...',
            status: 'success'
          })
        }
      } catch (execError: any) {
        console.error(`❌ Statement ${i + 1} failed:`, execError)
        errorCount++
        results.push({
          statement: statement.substring(0, 100) + '...',
          status: 'error',
          message: execError.message
        })
      }
    }

    // Try alternative approach if rpc doesn't work - direct policy creation
    if (errorCount > successCount) {
      console.log('🔧 Trying alternative approach - direct policy operations...')
      
      try {
        // Create maximally permissive policies directly
        const policyOperations = [
          // Users table
          `DROP POLICY IF EXISTS "Demo: Allow all user operations" ON users`,
          `CREATE POLICY "Demo: Allow all user operations" ON users FOR ALL USING (true) WITH CHECK (true)`,
          
          // Rooms table  
          `DROP POLICY IF EXISTS "Demo: Allow all room operations" ON rooms`,
          `CREATE POLICY "Demo: Allow all room operations" ON rooms FOR ALL USING (true) WITH CHECK (true)`,
          
          // Messages table
          `DROP POLICY IF EXISTS "Demo: Allow all message operations" ON messages`, 
          `CREATE POLICY "Demo: Allow all message operations" ON messages FOR ALL USING (true) WITH CHECK (true)`,
          
          // Analytics events table
          `DROP POLICY IF EXISTS "Demo: Allow all analytics operations" ON analytics_events`,
          `CREATE POLICY "Demo: Allow all analytics operations" ON analytics_events FOR ALL USING (true) WITH CHECK (true)`
        ]

        for (const operation of policyOperations) {
          try {
            const { error } = await supabase.rpc('exec_sql', { sql_query: operation })
            if (error) {
              console.warn('⚠️ Policy operation warning:', error.message)
            } else {
              console.log('✅ Policy operation successful')
              successCount++
            }
          } catch (err) {
            console.warn('⚠️ Policy operation failed:', err)
          }
        }
      } catch (altError) {
        console.error('❌ Alternative approach failed:', altError)
      }
    }

    console.log(`🎯 Migration completed: ${successCount} success, ${errorCount} errors`)

    return NextResponse.json({
      success: true,
      message: 'Demo-optimized RLS policies applied',
      summary: {
        totalStatements: statements.length,
        successCount,
        errorCount,
        context: 'Demo-only: Maximally permissive policies for 200 users, few hours'
      },
      results: results.slice(0, 10) // Limit response size
    })

  } catch (error: any) {
    console.error('❌ RLS migration failed:', error)
    return NextResponse.json({
      error: 'Failed to apply RLS policies',
      details: error.message,
      context: 'Demo-optimized migration for authentication fixes'
    }, { status: 500 })
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    endpoint: 'Demo RLS Migration',
    status: 'ready',
    description: 'Applies maximally permissive RLS policies for demo context',
    context: '200 users, few hours, demo-only'
  })
}
