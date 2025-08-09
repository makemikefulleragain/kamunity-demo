/**
 * Demo User Signup API Route
 * Creates demo user accounts with enhanced profile data
 * Uses existing users table schema creatively
 */

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface DemoSignupData {
  name: string
  email: string
  passionArea: string
  passionDescription?: string
  communityInvolvementScale: 'none' | 'some' | 'active' | 'leader'
  communityInvolvementTypes: string[]
  additionalInterests: string
  interestsExplanation?: string
  demoSessionId?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: DemoSignupData = await request.json()
    
    console.log('🚀 Creating demo user account...')
    console.log('User data:', { name: body.name, email: body.email, passionArea: body.passionArea })
    
    // Validate required fields with detailed error messages
    if (!body.name || !body.email) {
      console.error('❌ Missing basic required fields:', { name: !!body.name, email: !!body.email })
      return NextResponse.json({
        success: false,
        message: 'Name and email are required'
      }, { status: 400 })
    }
    
    if (!body.passionArea) {
      console.error('❌ Missing passion area')
      return NextResponse.json({
        success: false,
        message: 'Please select at least one area of interest'
      }, { status: 400 })
    }
    
    if (!body.communityInvolvementScale) {
      console.error('❌ Missing community involvement scale')
      return NextResponse.json({
        success: false,
        message: 'Please indicate your community involvement level'
      }, { status: 400 })
    }
    
    // Generate session ID for demo user
    const demoSessionId = body.demoSessionId || randomUUID()
    
    // Create timestamp for demo user identification
    const timestamp = Date.now().toString(36)
    const demoFlag = 'DEMO_USER'
    
    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', body.email)
      .single()
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error checking existing user:', checkError.message)
      return NextResponse.json({
        success: false,
        message: 'Database error during signup'
      }, { status: 500 })
    }
    
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'Email already registered'
      }, { status: 409 })
    }
    
    // Create demo user account
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        email: body.email,
        username: `${demoFlag}_${timestamp}`, // Demo flag + timestamp (under 50 chars)
        name: body.name ? body.name.substring(0, 95) : 'Demo User', // Actual name, truncated to fit 100 char limit
        emoji_avatar: getRandomEmojiAvatar(),
        email_subscribed: true, // Flag for demo users
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_seen: new Date().toISOString()
      })
      .select()
      .single()
    
    if (createError) {
      console.error('❌ Failed to create demo user:', createError.message)
      return NextResponse.json({
        success: false,
        message: 'Failed to create user account',
        error: createError.message
      }, { status: 500 })
    }
    
    console.log('✅ Demo user created successfully:', newUser.id)
    
    // Create demo data object for response
    const storedDemoData = {
      passionArea: body.passionArea,
      passionDescription: body.passionDescription || '',
      communityInvolvementScale: body.communityInvolvementScale,
      communityInvolvementTypes: body.communityInvolvementTypes || [],
      additionalInterests: body.additionalInterests || '',
      interestsExplanation: body.interestsExplanation || '',
      isDemoUser: true,
      demoSessionId: demoSessionId,
      signupTimestamp: new Date().toISOString()
    }
    
    // Create session token (simple approach for demo)
    const sessionToken = Buffer.from(JSON.stringify({
      userId: newUser.id,
      email: newUser.email,
      name: body.name, // Use original name, not JSON data
      isDemoUser: true,
      sessionId: demoSessionId,
      createdAt: new Date().toISOString()
    })).toString('base64')
    
    return NextResponse.json({
      success: true,
      message: 'Demo account created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: body.name, // Use original name
        isDemoUser: true,
        demoData: storedDemoData
      },
      sessionToken
    })
    
  } catch (error) {
    console.error('❌ Demo signup failed:', error)
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json({
      success: false,
      message: 'Signup failed',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}

export async function GET() {
  // Return available options for signup form
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
  
  const communityScales = [
    { value: 'none', label: 'Not involved in communities', description: 'I prefer to work independently' },
    { value: 'some', label: 'Some community involvement', description: 'I participate occasionally' },
    { value: 'active', label: 'Actively involved', description: 'I regularly participate and contribute' },
    { value: 'leader', label: 'Community leader', description: 'I organize and lead community initiatives' }
  ]
  
  return NextResponse.json({
    passionAreas,
    communityTypes,
    communityScales
  })
}

function getRandomEmojiAvatar(): string {
  const avatars = ['😊', '🌟', '🚀', '🎨', '🌱', '💻', '🏥', '📚', '⚖️', '🤝', '🔬', '⚽']
  return avatars[Math.floor(Math.random() * avatars.length)]
}
