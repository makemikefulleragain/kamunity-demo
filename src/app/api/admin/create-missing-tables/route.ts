import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Admin API endpoint to create missing database tables
// Context: Demo-optimized table creation for news system and user sessions

export async function GET() {
  return NextResponse.json({
    endpoint: 'Create Missing Tables Migration',
    status: 'ready',
    description: 'Creates missing database tables (news_items, news_comments, user_sessions, analytics_events)',
    context: 'Demo-optimized tables for 200 users, few hours'
  })
}

export async function POST() {
  try {
    console.log('🔧 Starting missing tables migration...')

    // Initialize Supabase admin client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing Supabase environment variables')
      return NextResponse.json({
        success: false,
        error: 'Missing Supabase configuration'
      }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Read the migration SQL file
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', 'create_missing_tables.sql')
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath)
      return NextResponse.json({
        success: false,
        error: 'Migration file not found'
      }, { status: 500 })
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    console.log('✅ Migration SQL loaded, length:', migrationSQL.length)

    // Split SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`🔧 Executing ${statements.length} SQL statements...`)

    let successCount = 0
    let errorCount = 0
    const errors: string[] = []

    // Execute each statement individually for better error handling
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      if (statement === 'COMMIT') {
        continue // Skip COMMIT statements in individual execution
      }

      try {
        console.log(`🔧 Executing statement ${i + 1}/${statements.length}`)
        
        const { error } = await supabase.rpc('exec_sql', {
          sql_query: statement
        })

        if (error) {
          console.warn(`⚠️ Statement ${i + 1} warning:`, error.message)
          // Don't count certain warnings as errors (like table already exists)
          if (!error.message.includes('already exists') && 
              !error.message.includes('does not exist')) {
            errorCount++
            errors.push(`Statement ${i + 1}: ${error.message}`)
          }
        } else {
          successCount++
        }
      } catch (err: any) {
        console.error(`❌ Statement ${i + 1} error:`, err.message)
        errorCount++
        errors.push(`Statement ${i + 1}: ${err.message}`)
      }
    }

    console.log(`✅ Migration completed: ${successCount} success, ${errorCount} errors`)

    return NextResponse.json({
      success: true,
      message: 'Missing tables migration completed',
      summary: {
        totalStatements: statements.length,
        successCount,
        errorCount,
        errors: errors.slice(0, 5), // Limit error details
        context: 'Demo-optimized tables created for news system and analytics'
      }
    })

  } catch (error: any) {
    console.error('❌ Migration failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Migration failed',
      details: error.message
    }, { status: 500 })
  }
}
