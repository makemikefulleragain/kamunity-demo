/**
 * Demo Session Management API Route
 * Handles demo user session validation and data retrieval
 */

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const { sessionToken } = await request.json()
    
    if (!sessionToken) {
      return NextResponse.json({
        success: false,
        message: 'Session token required'
      }, { status: 400 })
    }
    
    // Decode session token
    const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString())
    
    // Validate session and get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', sessionData.userId)
      .eq('email_subscribed', true) // Demo user flag
      .single()
    
    if (userError || !user) {
      return NextResponse.json({
        success: false,
        message: 'Invalid session'
      }, { status: 401 })
    }
    
    // Check if this is a demo user by username prefix
    if (!user.username.startsWith('DEMO_USER_')) {
      return NextResponse.json({
        success: false,
        message: 'Not a demo user session'
      }, { status: 401 })
    }
    
    // Parse demo data from name field (stored as JSON)
    let demoData
    try {
      demoData = JSON.parse(user.name)
    } catch (error) {
      // Fallback for users created with actual names
      demoData = {
        passionArea: 'Community Building',
        passionDescription: '',
        communityInvolvementScale: 'Some Level',
        communityInvolvementTypes: [],
        additionalInterests: '',
        interestsExplanation: '',
        isDemoUser: true,
        demoSessionId: sessionData.sessionId || 'legacy',
        onboardingCompleted: true,
        signupTimestamp: user.created_at
      }
    }
    
    // Update last seen
    await supabase
      .from('users')
      .update({ last_seen: new Date().toISOString() })
      .eq('id', user.id)
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: demoData.passionArea || 'Demo User', // Use passion area as display name
        email: user.email,
        emoji_avatar: user.emoji_avatar,
        demoData,
        lastSeen: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('❌ Session validation failed:', error)
    return NextResponse.json({
      success: false,
      message: 'Session validation failed'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { sessionToken } = await request.json()
    
    if (!sessionToken) {
      return NextResponse.json({
        success: false,
        message: 'Session token required'
      }, { status: 400 })
    }
    
    // For demo purposes, we'll just return success
    // In production, you might want to invalidate the session
    
    return NextResponse.json({
      success: true,
      message: 'Session ended'
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to end session'
    }, { status: 500 })
  }
}
