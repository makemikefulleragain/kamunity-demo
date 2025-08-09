import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Simple API test - checking environment variables:')
    console.log('NEXT_PUBLIC_SUPABASE_URL length:', process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0)
    console.log('SUPABASE_SERVICE_ROLE_KEY length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0)
    console.log('URL starts with https:', process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('https://'))
    console.log('Key starts with eyJ:', process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith('eyJ'))
    
    return NextResponse.json({ 
      success: true,
      message: 'Simple test working',
      env_check: {
        url_length: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
        key_length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
        url_valid: process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('https://'),
        key_valid: process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith('eyJ')
      }
    })
    
  } catch (error) {
    console.error('Simple test error:', error)
    return NextResponse.json({ 
      error: 'Simple test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
