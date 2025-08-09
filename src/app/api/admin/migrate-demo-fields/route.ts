/**
 * Demo User Fields Migration API Route
 * Adds enhanced user profile fields for demo data collection
 * Following Next.js API route best practices
 */

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting demo user fields migration...')
    
    // Step 1: Add columns to users table using individual ALTER statements
    const alterStatements = [
      {
        name: 'passion_area',
        sql: `ALTER TABLE public.users ADD COLUMN IF NOT EXISTS passion_area VARCHAR(100)`
      },
      {
        name: 'passion_description', 
        sql: `ALTER TABLE public.users ADD COLUMN IF NOT EXISTS passion_description TEXT`
      },
      {
        name: 'community_involvement_scale',
        sql: `ALTER TABLE public.users ADD COLUMN IF NOT EXISTS community_involvement_scale VARCHAR(20)`
      },
      {
        name: 'community_involvement_types',
        sql: `ALTER TABLE public.users ADD COLUMN IF NOT EXISTS community_involvement_types TEXT[]`
      },
      {
        name: 'additional_interests',
        sql: `ALTER TABLE public.users ADD COLUMN IF NOT EXISTS additional_interests TEXT`
      },
      {
        name: 'is_demo_user',
        sql: `ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_demo_user BOOLEAN DEFAULT false`
      },
      {
        name: 'onboarding_completed',
        sql: `ALTER TABLE public.users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false`
      },
      {
        name: 'demo_session_id',
        sql: `ALTER TABLE public.users ADD COLUMN IF NOT EXISTS demo_session_id VARCHAR(50)`
      }
    ]
    
    const results = []
    
    // Execute ALTER statements through raw SQL
    for (const statement of alterStatements) {
      try {
        console.log(`⚡ Adding column: ${statement.name}`)
        
        // Use Supabase's raw SQL execution
        const { data, error } = await supabase.rpc('exec_sql', {
          sql: statement.sql
        })
        
        if (error) {
          console.log(`⚠️  Column ${statement.name} may already exist or failed to add:`, error.message)
          results.push({ column: statement.name, status: 'warning', message: error.message })
        } else {
          console.log(`✅ Column ${statement.name} added successfully`)
          results.push({ column: statement.name, status: 'success' })
        }
      } catch (err) {
        console.log(`❌ Error adding column ${statement.name}:`, err)
        results.push({ 
          column: statement.name, 
          status: 'error', 
          message: err instanceof Error ? err.message : 'Unknown error'
        })
      }
    }
    
    // Step 2: Create passion_areas reference table
    console.log('📝 Creating passion_areas reference table...')
    
    const createPassionAreasTable = `
      CREATE TABLE IF NOT EXISTS public.passion_areas (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        emoji VARCHAR(10),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: createPassionAreasTable
    })
    
    if (tableError) {
      console.log('⚠️  Passion areas table creation warning:', tableError.message)
    } else {
      console.log('✅ Passion areas table created')
    }
    
    // Step 3: Insert predefined passion areas
    const passionAreas = [
      { name: 'Education & Learning', description: 'Teaching, learning, knowledge sharing', emoji: '📚' },
      { name: 'Environment & Sustainability', description: 'Climate action, conservation, green living', emoji: '🌱' },
      { name: 'Technology & Innovation', description: 'Tech development, digital solutions, AI', emoji: '💻' },
      { name: 'Health & Wellness', description: 'Physical health, mental health, healthcare', emoji: '🏥' },
      { name: 'Arts & Creativity', description: 'Visual arts, music, writing, design', emoji: '🎨' },
      { name: 'Social Justice & Equality', description: 'Human rights, equality, social change', emoji: '⚖️' },
      { name: 'Community Building', description: 'Local communities, networking, collaboration', emoji: '🤝' },
      { name: 'Entrepreneurship & Business', description: 'Startups, business development, innovation', emoji: '🚀' },
      { name: 'Science & Research', description: 'Scientific research, discovery, analysis', emoji: '🔬' },
      { name: 'Sports & Recreation', description: 'Athletics, outdoor activities, fitness', emoji: '⚽' },
      { name: 'Other', description: 'Something else entirely', emoji: '🌟' }
    ]
    
    // Insert passion areas using individual INSERT statements
    for (const area of passionAreas) {
      const { error: insertError } = await supabase
        .from('passion_areas')
        .upsert(area, { onConflict: 'name' })
        
      if (insertError) {
        console.log(`⚠️  Could not insert passion area ${area.name}:`, insertError.message)
      }
    }
    
    console.log('✅ Passion areas data inserted')
    
    // Step 4: Verify migration by testing new columns
    console.log('🔍 Verifying migration...')
    
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('id, passion_area, is_demo_user')
      .limit(1)
    
    if (testError) {
      console.log('❌ Migration verification failed:', testError.message)
      return NextResponse.json({
        success: false,
        message: 'Migration may have failed',
        error: testError.message,
        results
      }, { status: 500 })
    }
    
    console.log('🎉 Demo user fields migration completed successfully!')
    
    return NextResponse.json({
      success: true,
      message: 'Demo user fields migration completed',
      results,
      verification: 'New columns accessible'
    })
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    return NextResponse.json({
      success: false,
      message: 'Migration failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Demo user fields migration endpoint',
    usage: 'POST to run migration'
  })
}
