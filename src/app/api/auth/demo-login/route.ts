/**
 * Demo Email Recognition Login API Route
 * Handles returning user login by email recognition
 */

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email || !email.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 })
    }
    
    // Look up existing demo user by email
    const { data: existingUser, error: lookupError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .eq('email_subscribed', true) // Demo user flag
      .single()
    
    if (lookupError && lookupError.code !== 'PGRST116') {
      console.error('❌ Error looking up user:', lookupError.message)
      return NextResponse.json({
        success: false,
        message: 'Database error during lookup'
      }, { status: 500 })
    }
    
    if (!existingUser) {
      return NextResponse.json({
        success: false,
        message: 'No demo account found with this email',
        isNewUser: true
      }, { status: 404 })
    }
    
    // Verify this is a demo user
    if (!existingUser.username.startsWith('DEMO_USER_')) {
      return NextResponse.json({
        success: false,
        message: 'Account found but not a demo account',
        isNewUser: true
      }, { status: 403 })
    }
    
    // Parse demo data from name field (stored as JSON)
    let demoData
    try {
      demoData = JSON.parse(existingUser.name)
    } catch (parseError) {
      // Fallback for users created with actual names (legacy format)
      console.log('⚠️ Using fallback demo data for user:', existingUser.id, 'Parse error:', parseError)
      demoData = {
        passionArea: 'Community Building',
        passionDescription: '',
        communityInvolvementScale: 'Some Level',
        communityInvolvementTypes: [],
        additionalInterests: '',
        interestsExplanation: '',
        isDemoUser: true,
        demoSessionId: randomUUID(),
        onboardingCompleted: true,
        signupTimestamp: existingUser.created_at
      }
    }
    
    // Update last seen
    await supabase
      .from('users')
      .update({ 
        last_seen: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', existingUser.id)
    
    // Create new session token
    const sessionToken = Buffer.from(JSON.stringify({
      userId: existingUser.id,
      email: existingUser.email,
      name: demoData.passionArea || 'Demo User',
      isDemoUser: true,
      sessionId: demoData.demoSessionId,
      createdAt: new Date().toISOString(),
      isReturningUser: true
    })).toString('base64')
    
    console.log('✅ Demo user re-login successful:', existingUser.id)
    
    return NextResponse.json({
      success: true,
      message: 'Welcome back! Your demo account has been restored.',
      user: {
        id: existingUser.id,
        name: demoData.passionArea || 'Demo User',
        email: existingUser.email,
        emoji_avatar: existingUser.emoji_avatar,
        isDemoUser: true,
        demoData: {
          ...demoData,
          onboardingCompleted: true, // Mark as completed for returning users
          isReturningUser: true
        }
      },
      sessionToken,
      isReturningUser: true
    })
    
  } catch (error) {
    console.error('❌ Demo login failed:', error)
    return NextResponse.json({
      success: false,
      message: 'Login failed due to server error'
    }, { status: 500 })
  }
}
