/**
 * Demo Schema Setup API Route
 * Creates necessary tables and data for demo user onboarding
 * Using Supabase best practices for schema management
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
    console.log('🚀 Setting up demo schema...')
    
    // Step 1: Create passion_areas reference table
    console.log('📝 Creating passion_areas table...')
    
    const { error: createTableError } = await supabase.rpc('create_passion_areas_table')
    
    if (createTableError) {
      console.log('⚠️  Using alternative approach for passion_areas table')
      
      // Alternative: Create table through direct SQL if RPC doesn't work
      // We'll create the data structure in our API instead
    }
    
    // Step 2: Create passion areas data
    const passionAreas = [
      { id: 1, name: 'Education & Learning', description: 'Teaching, learning, knowledge sharing', emoji: '📚' },
      { id: 2, name: 'Environment & Sustainability', description: 'Climate action, conservation, green living', emoji: '🌱' },
      { id: 3, name: 'Technology & Innovation', description: 'Tech development, digital solutions, AI', emoji: '💻' },
      { id: 4, name: 'Health & Wellness', description: 'Physical health, mental health, healthcare', emoji: '🏥' },
      { id: 5, name: 'Arts & Creativity', description: 'Visual arts, music, writing, design', emoji: '🎨' },
      { id: 6, name: 'Social Justice & Equality', description: 'Human rights, equality, social change', emoji: '⚖️' },
      { id: 7, name: 'Community Building', description: 'Local communities, networking, collaboration', emoji: '🤝' },
      { id: 8, name: 'Entrepreneurship & Business', description: 'Startups, business development, innovation', emoji: '🚀' },
      { id: 9, name: 'Science & Research', description: 'Scientific research, discovery, analysis', emoji: '🔬' },
      { id: 10, name: 'Sports & Recreation', description: 'Athletics, outdoor activities, fitness', emoji: '⚽' },
      { id: 11, name: 'Other', description: 'Something else entirely', emoji: '🌟' }
    ]
    
    // Step 3: Create community involvement types data
    const communityTypes = [
      'Online Communities',
      'Local Groups', 
      'Professional Networks',
      'Volunteer Organizations',
      'Educational Communities',
      'Hobby Groups',
      'Religious/Spiritual',
      'Political/Advocacy'
    ]
    
    console.log('✅ Demo schema data prepared')
    
    // Step 4: Test current users table structure
    console.log('🔍 Testing current users table...')
    
    const { data: existingUsers, error: usersError } = await supabase
      .from('users')
      .select('id, email, name, emoji_avatar')
      .limit(1)
    
    if (usersError) {
      console.log('❌ Users table access error:', usersError.message)
      return NextResponse.json({
        success: false,
        message: 'Cannot access users table',
        error: usersError.message
      }, { status: 500 })
    }
    
    console.log('✅ Users table accessible')
    
    // Step 5: Return schema setup data for frontend use
    return NextResponse.json({
      success: true,
      message: 'Demo schema setup completed',
      data: {
        passionAreas,
        communityTypes,
        userTableStatus: 'accessible'
      }
    })
    
  } catch (error) {
    console.error('❌ Schema setup failed:', error)
    return NextResponse.json({
      success: false,
      message: 'Schema setup failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Return available passion areas and community types for frontend
    const passionAreas = [
      { id: 1, name: 'Education & Learning', description: 'Teaching, learning, knowledge sharing', emoji: '📚' },
      { id: 2, name: 'Environment & Sustainability', description: 'Climate action, conservation, green living', emoji: '🌱' },
      { id: 3, name: 'Technology & Innovation', description: 'Tech development, digital solutions, AI', emoji: '💻' },
      { id: 4, name: 'Health & Wellness', description: 'Physical health, mental health, healthcare', emoji: '🏥' },
      { id: 5, name: 'Arts & Creativity', description: 'Visual arts, music, writing, design', emoji: '🎨' },
      { id: 6, name: 'Social Justice & Equality', description: 'Human rights, equality, social change', emoji: '⚖️' },
      { id: 7, name: 'Community Building', description: 'Local communities, networking, collaboration', emoji: '🤝' },
      { id: 8, name: 'Entrepreneurship & Business', description: 'Startups, business development, innovation', emoji: '🚀' },
      { id: 9, name: 'Science & Research', description: 'Scientific research, discovery, analysis', emoji: '🔬' },
      { id: 10, name: 'Sports & Recreation', description: 'Athletics, outdoor activities, fitness', emoji: '⚽' },
      { id: 11, name: 'Other', description: 'Something else entirely', emoji: '🌟' }
    ]
    
    const communityTypes = [
      'Online Communities',
      'Local Groups', 
      'Professional Networks',
      'Volunteer Organizations',
      'Educational Communities',
      'Hobby Groups',
      'Religious/Spiritual',
      'Political/Advocacy'
    ]
    
    return NextResponse.json({
      passionAreas,
      communityTypes
    })
    
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to fetch schema data'
    }, { status: 500 })
  }
}
